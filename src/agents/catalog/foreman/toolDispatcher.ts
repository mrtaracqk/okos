import { HumanMessage, ToolMessage } from '@langchain/core/messages';
import { getConfig } from '@langchain/langgraph';
import {
  addTraceEvent,
  buildTraceAttributes,
  formatTraceText,
  formatTraceValue,
  runAgentSpan,
  runToolSpan,
} from '../../../observability/traceContext';
import {
  EXECUTION_PLAN_REQUIRED_MESSAGE,
  getPlanningRuntime,
  manageExecutionPlanInputSchema,
  manageExecutionPlanTool,
} from '../../../runtime-plugins/planning';
import {
  buildWorkerInputFromEnvelope,
  parseHandoffArgsToEnvelope,
  requiresWorkerToolCall,
  type WorkerTaskEnvelope,
} from '../contracts/workerRequest';
import {
  countDomainToolRuns,
  extractWorkerResult,
  renderWorkerResult,
  renderWorkerResultEnvelopeSummary,
  workerResultToEnvelope,
} from '../contracts/workerResult';
import { type WorkerRun } from '../contracts/workerRun';
import { getCatalogAgentRuntimeRunId } from './planning';
import { inspectCatalogPlaybookTool } from './playbookInspection';
import {
  buildNoToolCallFailure,
  formatWorkerFailure,
  getLastNonReportFailure,
  resolveWorkerRunStatus,
} from './workerRunState';
import { catalogForemanRegistry } from './workerRegistry';

function getToolMessageText(toolMessage: ToolMessage) {
  return typeof toolMessage.content === 'string' ? toolMessage.content : JSON.stringify(toolMessage.content);
}

function buildMissingWorkerResultNotice(workerName: string) {
  return `Протокол воркера нарушен: "${workerName}" завершил работу без финального report_worker_result. Используй этот текст только как промежуточный сигнал и при необходимости перепоручи следующий шаг явно.`;
}

function formatEnvelopeFacts(envelope: WorkerTaskEnvelope): string | undefined {
  if (envelope.facts.length === 0) return undefined;
  return envelope.facts.join('\n');
}

async function executeWorkerHandoff(
  toolCall: any,
  workerRuns: WorkerRun[],
  worker: NonNullable<ReturnType<typeof catalogForemanRegistry.resolveWorker>>
): Promise<{ run: WorkerRun; toolMessage: ToolMessage }> {
  const workerName = worker.name;
  const requestEnvelope = parseHandoffArgsToEnvelope(toolCall.args ?? {});
  const { mode, objective, expectedOutput } = requestEnvelope;
  const toolCallId = toolCall.id ?? toolCall.name;

  return runAgentSpan(
    'catalog_agent.worker_handoff',
    async () => {
      addTraceEvent('agent.handoff', {
        from_agent: 'catalog_agent.planner',
        to_agent: `worker.${workerName}`,
        'tool.name': toolCall.name,
        'catalog.worker_mode': mode,
        status: 'requested',
      });
      const missingFields = [
        objective ? null : '"objective"',
        expectedOutput ? null : '"expectedOutput"',
      ].filter(Boolean);

      if (missingFields.length > 0) {
        const run: WorkerRun = {
          agent: workerName,
          status: 'invalid',
          task: '',
          details: `Отсутствуют обязательные аргументы handoff: ${missingFields.join(', ')}.`,
          request: requestEnvelope,
        };
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerName}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerName,
          status: run.status,
        });

        return {
          run,
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: `Не удалось передать задачу воркеру: отсутствуют обязательные аргументы handoff: ${missingFields.join(', ')}.`,
          }),
        };
      }

      try {
        const result = await runAgentSpan(
          `worker.${workerName}`,
          async () =>
            worker.graph.invoke(
              {
                messages: [new HumanMessage(buildWorkerInputFromEnvelope(requestEnvelope))],
                handoff: requestEnvelope,
              },
              getConfig()
            ),
          {
            attributes: buildTraceAttributes({
              'catalog.worker_name': workerName,
              'catalog.worker_mode': mode,
              'catalog.task': formatTraceValue(objective, 800),
              'catalog.execution_data': formatEnvelopeFacts(requestEnvelope)
                ? formatTraceText(formatEnvelopeFacts(requestEnvelope)!, 1000)
                : undefined,
              'catalog.why_now': requestEnvelope.contextNotes ? formatTraceText(requestEnvelope.contextNotes, 500) : undefined,
              'catalog.return_contract': formatTraceText(expectedOutput, 800),
            }),
          }
        );

        const rawWorkerToolRuns = Array.isArray(result.toolRuns) ? result.toolRuns : [];
        const workerResult = extractWorkerResult(rawWorkerToolRuns);
        const runResult =
          result.finalResult != null ? result.finalResult : (workerResult ? workerResultToEnvelope(workerResult) : undefined);
        const domainToolRunCount = countDomainToolRuns(rawWorkerToolRuns);
        const synthesizedFailure =
          requiresWorkerToolCall(mode) &&
          domainToolRunCount === 0 &&
          runResult?.status !== 'blocked'
            ? buildNoToolCallFailure(workerName, objective, mode)
            : undefined;
        const workerToolRuns = synthesizedFailure ? [...rawWorkerToolRuns, synthesizedFailure] : rawWorkerToolRuns;
        const workerFailure = getLastNonReportFailure(workerToolRuns);
        const runStatus = resolveWorkerRunStatus(
          workerToolRuns,
          Boolean(synthesizedFailure),
          runResult?.status ?? workerResult?.status
        );
        const runStatusFinal =
          runResult === undefined && runStatus === 'completed' ? 'failed' : runStatus;
        const detailsForTrace =
          workerResult != null
            ? renderWorkerResult(workerResult)
            : runResult != null
              ? renderWorkerResultEnvelopeSummary(runResult)
              : buildMissingWorkerResultNotice(workerName);
        const details =
          runStatusFinal === 'failed' && workerFailure
            ? `${detailsForTrace}\n\n${formatWorkerFailure(workerFailure)}`
            : detailsForTrace;
        const run: WorkerRun = {
          agent: workerName,
          status: runStatusFinal,
          task: objective,
          details,
          toolRuns: workerToolRuns,
          request: requestEnvelope,
          result: runResult,
        };
        const toolMessageContent =
          run.result !== undefined
            ? renderWorkerResultEnvelopeSummary(run.result)
            : buildMissingWorkerResultNotice(workerName);
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerName}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerName,
          'catalog.tool_runs': workerToolRuns.length,
          status: run.status,
        });

        return {
          run,
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: toolMessageContent,
          }),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка выполнения воркера.';
        const run: WorkerRun = {
          agent: workerName,
          status: 'failed',
          task: objective,
          details: message,
          request: requestEnvelope,
        };
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerName}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerName,
          status: run.status,
        });

        return {
          run,
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: `Воркер "${toolCall.name}" завершился с ошибкой: ${message}`,
          }),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.worker_name': workerName,
        'catalog.worker_mode': mode,
        'catalog.previous_worker_runs': workerRuns.length,
        'catalog.task': formatTraceValue(objective || '(empty)', 800),
        'catalog.execution_data': formatEnvelopeFacts(requestEnvelope)
          ? formatTraceText(formatEnvelopeFacts(requestEnvelope)!, 1000)
          : undefined,
        'catalog.why_now': requestEnvelope.contextNotes ? formatTraceText(requestEnvelope.contextNotes, 500) : undefined,
        'catalog.return_contract': expectedOutput ? formatTraceText(expectedOutput, 800) : undefined,
      }),
      mapResultAttributes: ({ run }) =>
        buildTraceAttributes({
          'catalog.status': run.status,
          'catalog.worker_name': run.agent,
          'catalog.tool_runs': run.toolRuns?.length,
          'output.value': run.details ? formatTraceText(run.details, 1200) : undefined,
        }),
      statusMessage: ({ run }) =>
        run.status === 'failed' || run.status === 'invalid' ? run.details || `worker handoff ${run.status}` : undefined,
    }
  );
}

export async function executeCatalogToolCall(
  toolCall: any,
  workerRuns: WorkerRun[]
): Promise<{ run?: WorkerRun; toolMessage: ToolMessage }> {
  const worker = catalogForemanRegistry.resolveWorker(toolCall.name);
  if (worker) {
    const runId = getCatalogAgentRuntimeRunId();
    if (runId && !getPlanningRuntime().getActivePlan(runId)) {
      return {
        toolMessage: new ToolMessage({
          tool_call_id: toolCall.id ?? toolCall.name,
          name: toolCall.name,
          content: EXECUTION_PLAN_REQUIRED_MESSAGE,
        }),
      };
    }

    const { run, toolMessage } = await executeWorkerHandoff(toolCall, workerRuns, worker);
    return { run, toolMessage };
  }

  if (toolCall.name === inspectCatalogPlaybookTool.name) {
    const playbookId = typeof toolCall.args?.playbookId === 'string' ? toolCall.args.playbookId.trim() : '';
    const toolCallId = toolCall.id ?? toolCall.name;

    return runToolSpan(
      'catalog_agent.inspect_playbook',
      async () => {
        if (!playbookId) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: toolCallId,
              name: toolCall.name,
              content: 'Не удалось открыть playbook: отсутствует обязательный аргумент "playbookId".',
            }),
          };
        }

        const content = await inspectCatalogPlaybookTool.invoke({ playbookId });

        return {
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: typeof content === 'string' ? content : JSON.stringify(content),
          }),
        };
      },
      {
        attributes: buildTraceAttributes({
          'catalog.playbook_id': playbookId || '(empty)',
        }),
        mapResultAttributes: ({ toolMessage }) =>
          buildTraceAttributes({
            'output.value': formatTraceText(toolMessage.content, 1000),
          }),
        statusMessage: () => (!playbookId ? 'missing required "playbookId" argument' : undefined),
      }
    );
  }

  if (toolCall.name === manageExecutionPlanTool.name) {
    const parsedArgs = manageExecutionPlanInputSchema.safeParse(toolCall.args ?? {});
    const toolCallId = toolCall.id ?? toolCall.name;

    return runToolSpan(
      'catalog_agent.manage_execution_plan',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: toolCallId,
              name: toolCall.name,
              content: `Сбой planning tool: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
            }),
          };
        }

        const content = await manageExecutionPlanTool.invoke(parsedArgs.data);

        return {
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: typeof content === 'string' ? content : JSON.stringify(content),
          }),
        };
      },
      {
        attributes: buildTraceAttributes({
          'catalog.planning_action': parsedArgs.success ? parsedArgs.data.action : '(invalid)',
        }),
        mapResultAttributes: ({ toolMessage }) =>
          buildTraceAttributes({
            'output.value': formatTraceText(getToolMessageText(toolMessage), 1000),
          }),
        statusMessage: ({ toolMessage }) =>
          getToolMessageText(toolMessage).includes('Ошибка планирования:') ||
          getToolMessageText(toolMessage).includes('Сбой planning tool:')
            ? getToolMessageText(toolMessage)
            : undefined,
      }
    );
  }

  return {
    toolMessage: new ToolMessage({
      tool_call_id: toolCall.id ?? toolCall.name,
      name: toolCall.name,
      content: `Каталожный инструмент "${toolCall.name}" не зарегистрирован.`,
    }),
  };
}
