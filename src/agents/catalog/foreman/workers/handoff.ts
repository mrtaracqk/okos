import { ToolMessage } from '@langchain/core/messages';
import { getConfig } from '@langchain/langgraph';
import {
  addTraceEvent,
  buildTraceAttributes,
  formatTraceText,
  formatTraceValue,
  runAgentSpan,
} from '../../../../observability/traceContext';
import { type CatalogWorkerDefinition } from '../../specialists/shared/workerDefinition';
import { type WorkerTaskEnvelope } from '../../contracts/workerRequest';
import { type WorkerRun } from '../../contracts/workerRun';
import {
  formatWorkerFailure,
  getLastNonReportFailure,
  resolveWorkerRunStatus,
} from './runState';
import { toolReply } from '../tools/protocol';
import { type CatalogToolCall } from '../tools/types';
import {
  extractWorkerResult,
  normalizeWorkerResult,
  renderWorkerResult,
  renderWorkerResultEnvelopeSummary,
  WORKER_RESULT_TOOL_NAME,
} from '../../contracts/workerResult';

function formatEnvelopeLines(lines: string[]): string | undefined {
  if (lines.length === 0) return undefined;
  return lines.join('\n');
}

export function buildMissingWorkerResultNotice(workerName: string) {
  return `Протокол воркера нарушен: "${workerName}" завершил работу без финального report_worker_result. Используй этот текст только как промежуточный сигнал и при необходимости перепоручи следующий шаг явно.`;
}

function buildInvalidWorkerResultNotice(workerName: string) {
  return `Протокол воркера нарушен: "${workerName}" прислал невалидный report_worker_result. Runtime не будет восстанавливать результат по summary или косвенным признакам.`;
}

export async function executeWorkerHandoff(params: {
  requestEnvelope: WorkerTaskEnvelope;
  previousWorkerRunsCount: number;
  worker: CatalogWorkerDefinition;
  replyToToolCall: Pick<CatalogToolCall, 'id' | 'name'>;
}): Promise<{ run: WorkerRun; toolMessage: ToolMessage }> {
  const { requestEnvelope, previousWorkerRunsCount, worker, replyToToolCall } = params;
  const workerId = worker.id;
  const { planContext, taskInput, upstreamArtifacts } = requestEnvelope;
  const { objective, expectedOutput } = taskInput;
  const planFacts = formatEnvelopeLines(planContext.facts);
  const taskFacts = formatEnvelopeLines(taskInput.facts);

  return runAgentSpan(
    'catalog_agent.worker_handoff',
    async () => {
      addTraceEvent('agent.handoff', {
        from_agent: 'catalog_agent.planner',
        to_agent: `worker.${workerId}`,
        'catalog.worker_id': workerId,
        status: 'requested',
      });

      const missingFields = [
        objective ? null : '"objective"',
        expectedOutput ? null : '"expectedOutput"',
      ].filter(Boolean);

      if (missingFields.length > 0) {
        const errorSummary = `Отсутствуют обязательные аргументы handoff: ${missingFields.join(', ')}.`;
        const run: WorkerRun = {
          agent: workerId,
          errorSummary,
          status: 'invalid',
          task: objective,
        };
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerId}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerId,
          status: run.status,
        });

        return {
          run,
          toolMessage: toolReply(
            replyToToolCall,
            `Не удалось передать задачу воркеру: отсутствуют обязательные аргументы handoff: ${missingFields.join(', ')}.`
          ),
        };
      }

      try {
        const result = await runAgentSpan(
          `worker.${workerId}`,
          async () =>
            worker.graph.invoke(
              {
                messages: [],
                handoff: requestEnvelope,
              },
              getConfig()
            ),
          {
            attributes: buildTraceAttributes({
              'catalog.worker_name': workerId,
              'catalog.plan_goal': formatTraceValue(planContext.goal, 800),
              'catalog.task': formatTraceValue(objective, 800),
              'catalog.plan_facts': planFacts ? formatTraceText(planFacts, 1000) : undefined,
              'catalog.task_facts': taskFacts ? formatTraceText(taskFacts, 1000) : undefined,
              'catalog.why_now': taskInput.contextNotes ? formatTraceText(taskInput.contextNotes, 500) : undefined,
              'catalog.upstream_artifacts_count': Array.isArray(upstreamArtifacts) ? upstreamArtifacts.length : undefined,
              'catalog.return_contract': formatTraceText(expectedOutput, 800),
            }),
          }
        );

        const rawWorkerToolRuns = Array.isArray(result.toolRuns) ? result.toolRuns : [];
        const toolRunCount = rawWorkerToolRuns.length;
        const workerResult = extractWorkerResult(rawWorkerToolRuns) ?? normalizeWorkerResult(result.finalResult);
        const hasReportWorkerResultToolRun = rawWorkerToolRuns.some((toolRun) => toolRun.toolName === WORKER_RESULT_TOOL_NAME);
        const workerFailure = getLastNonReportFailure(rawWorkerToolRuns);
        const protocolError =
          workerResult == null
            ? {
                code: hasReportWorkerResultToolRun
                  ? ('invalid_report_worker_result' as const)
                  : ('missing_report_worker_result' as const),
                message: hasReportWorkerResultToolRun
                  ? buildInvalidWorkerResultNotice(workerId)
                  : buildMissingWorkerResultNotice(workerId),
              }
            : undefined;
        const runStatus = resolveWorkerRunStatus(rawWorkerToolRuns, workerResult?.status);
        const runStatusFinal = workerResult == null && runStatus === 'completed' ? 'failed' : runStatus;
        const summaryForTrace =
          workerResult != null ? renderWorkerResult(workerResult) : (protocolError?.message ?? buildMissingWorkerResultNotice(workerId));
        const errorSummary =
          runStatusFinal === 'failed' && workerFailure
            ? `${summaryForTrace}\n\n${formatWorkerFailure(workerFailure)}`
            : runStatusFinal === 'failed'
              ? summaryForTrace
              : undefined;
        const run: WorkerRun = {
          agent: workerId,
          ...(errorSummary ? { errorSummary } : {}),
          ...(protocolError ? { protocolError } : {}),
          ...(workerResult ? { result: workerResult } : {}),
          status: runStatusFinal,
          task: objective,
          toolRunCount,
        };
        const toolMessageContent =
          workerResult != null
            ? renderWorkerResultEnvelopeSummary({
                status: workerResult.status,
                facts: workerResult.data,
                missingInputs: workerResult.missingData,
                blocker: workerResult.blocker ?? null,
                artifacts: workerResult.artifacts,
                summary: workerResult.summary ?? workerResult.note,
              })
            : (protocolError?.message ?? buildMissingWorkerResultNotice(workerId));
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerId}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerId,
          'catalog.tool_runs': toolRunCount,
          status: run.status,
        });

        return {
          run,
          toolMessage: toolReply(replyToToolCall, toolMessageContent),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка выполнения воркера.';
        const run: WorkerRun = {
          agent: workerId,
          errorSummary: message,
          status: 'failed',
          task: objective,
        };
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerId}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerId,
          status: run.status,
        });

        return {
          run,
          toolMessage: toolReply(replyToToolCall, `Воркер "${workerId}" завершился с ошибкой: ${message}`),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.worker_name': workerId,
        'catalog.previous_worker_runs': previousWorkerRunsCount,
        'catalog.plan_goal': formatTraceValue(planContext.goal || '(empty)', 800),
        'catalog.task': formatTraceValue(objective || '(empty)', 800),
        'catalog.plan_facts': planFacts ? formatTraceText(planFacts, 1000) : undefined,
        'catalog.task_facts': taskFacts ? formatTraceText(taskFacts, 1000) : undefined,
        'catalog.why_now': taskInput.contextNotes ? formatTraceText(taskInput.contextNotes, 500) : undefined,
        'catalog.upstream_artifacts_count': Array.isArray(upstreamArtifacts) ? upstreamArtifacts.length : undefined,
        'catalog.return_contract': expectedOutput ? formatTraceText(expectedOutput, 800) : undefined,
      }),
      mapResultAttributes: ({ run }) => {
        const traceOutput = run.result
          ? renderWorkerResultEnvelopeSummary({
              status: run.result.status,
              facts: run.result.data,
              missingInputs: run.result.missingData,
              blocker: run.result.blocker ?? null,
              artifacts: run.result.artifacts,
              summary: run.result.summary ?? run.result.note,
            })
          : run.errorSummary;
        return buildTraceAttributes({
          'catalog.status': run.status,
          'catalog.worker_name': run.agent,
          'catalog.tool_runs': run.toolRunCount,
          'output.value': traceOutput ? formatTraceText(traceOutput, 1200) : undefined,
        });
      },
      statusMessage: ({ run }) =>
        run.status === 'failed' || run.status === 'invalid'
          ? run.errorSummary || `worker handoff ${run.status}`
          : undefined,
    }
  );
}
