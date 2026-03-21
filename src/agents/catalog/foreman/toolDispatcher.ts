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
  getPlanningRunContext,
  type RuntimePlanTask,
  manageExecutionPlanInputSchema,
  manageExecutionPlanTool,
} from '../../../runtime/planning';
import {
  buildWorkerInputFromEnvelope,
  parseHandoffArgsToEnvelope,
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
  foremanCheckpointInputSchema,
  runExecutionPlanInputSchema,
  runExecutionPlanTool,
  foremanCheckpointTool,
} from './executionTools';
import {
  buildNoToolCallFailure,
  formatWorkerFailure,
  getLastNonReportFailure,
  resolveWorkerRunStatus,
} from './workerRunState';
import { catalogForemanRegistry } from './workerRegistry';

/** Id OpenAI tool call for this planner turn (the model sets `id`; `name` is a last-resort fallback). */
function openAiToolCallId(toolCall: { id?: string; name?: string }): string {
  if (typeof toolCall.id === 'string' && toolCall.id.length > 0) return toolCall.id;
  if (typeof toolCall.name === 'string') return toolCall.name;
  return '';
}

function getToolMessageText(toolMessage: ToolMessage) {
  return typeof toolMessage.content === 'string' ? toolMessage.content : JSON.stringify(toolMessage.content);
}

function buildExecutionToolResultAttributes(result: { toolMessage: ToolMessage; run?: WorkerRun }) {
  const toolText = getToolMessageText(result.toolMessage);
  return buildTraceAttributes({
    'output.value': formatTraceText(toolText, 1000),
    ...(result.run
      ? {
          'catalog.worker_status': result.run.status,
          'catalog.worker_name': result.run.agent,
          'catalog.worker_task_preview': formatTraceValue(result.run.task, 500),
        }
      : {}),
  });
}

function buildMissingWorkerResultNotice(workerName: string) {
  return `Протокол воркера нарушен: "${workerName}" завершил работу без финального report_worker_result. Используй этот текст только как промежуточный сигнал и при необходимости перепоручи следующий шаг явно.`;
}

function formatEnvelopeFacts(envelope: WorkerTaskEnvelope): string | undefined {
  if (envelope.facts.length === 0) return undefined;
  return envelope.facts.join('\n');
}

const workerToolByPlanOwner: Record<string, string> = {
  'category-worker': 'run_category_worker',
  'attribute-worker': 'run_attribute_worker',
  'product-worker': 'run_product_worker',
  'variation-worker': 'run_variation_worker',
};

function mapWorkerRunStatusToPlanStatus(status: WorkerRun['status']): 'completed' | 'blocked' | 'failed' {
  if (status === 'invalid') return 'failed';
  return status;
}

export type CatalogToolCompletion = {
  summary: string;
  finalizeOutcome: 'completed' | 'failed';
};

type ExecuteWorkerHandoffOptions = {
  /**
   * Planner tool this ToolMessage must answer (`run_execution_plan` / `foreman_checkpoint`), when
   * `toolCall` is a synthetic object built only to run the worker graph (same id as the planner call).
   */
  catalogToolReply?: { tool_call_id: string; name: string };
};

async function executeWorkerHandoff(
  toolCall: any,
  workerRuns: WorkerRun[],
  worker: NonNullable<ReturnType<typeof catalogForemanRegistry.resolveWorker>>,
  options: ExecuteWorkerHandoffOptions = {}
): Promise<{ run: WorkerRun; toolMessage: ToolMessage }> {
  const workerName = worker.name;
  const requestEnvelope = parseHandoffArgsToEnvelope(toolCall.args ?? {});
  const { objective, expectedOutput } = requestEnvelope;
  const replyToolCallId = options.catalogToolReply?.tool_call_id ?? openAiToolCallId(toolCall);
  const replyToolName = options.catalogToolReply?.name ?? toolCall.name;

  return runAgentSpan(
    'catalog_agent.worker_handoff',
    async () => {
      addTraceEvent('agent.handoff', {
        from_agent: 'catalog_agent.planner',
        to_agent: `worker.${workerName}`,
        'tool.name': toolCall.name,
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
            tool_call_id: replyToolCallId,
            name: replyToolName,
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
          domainToolRunCount === 0 && runResult?.status !== 'blocked'
            ? buildNoToolCallFailure(workerName, objective)
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
            tool_call_id: replyToolCallId,
            name: replyToolName,
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
            tool_call_id: replyToolCallId,
            name: replyToolName,
            content: `Воркер "${toolCall.name}" завершился с ошибкой: ${message}`,
          }),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.worker_name': workerName,
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
): Promise<{ run?: WorkerRun; toolMessage: ToolMessage; completion?: CatalogToolCompletion }> {
  const plannerToolCallId = openAiToolCallId(toolCall);

  // Stage 1 contract (replan determinism):
  // after `foreman_checkpoint(action=replan)`, the runtime must wait for the
  // next executable snapshot to be provided via `run_execution_plan`.
  const runId = getCatalogAgentRuntimeRunId();
  const activePlan = runId ? getPlanningRuntime().getActivePlan(runId) : null;
  if (activePlan?.replanAwaitingSnapshot) {
    if (toolCall.name !== runExecutionPlanTool.name) {
      return {
        toolMessage: new ToolMessage({
          tool_call_id: plannerToolCallId,
          name: toolCall.name,
          content:
            'План обнулен после replan. Сначала пересобери executable snapshot вызовом `run_execution_plan(tasks=[...])`, затем повтори checkpoint.',
        }),
      };
    }
  }

  const worker = catalogForemanRegistry.resolveWorker(toolCall.name);
  if (worker) {
    const runId = getCatalogAgentRuntimeRunId();
    if (runId && !getPlanningRuntime().getActivePlan(runId)) {
      return {
        toolMessage: new ToolMessage({
          tool_call_id: plannerToolCallId,
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

    return runToolSpan(
      'catalog_agent.inspect_playbook',
      async () => {
        if (!playbookId) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: 'Не удалось открыть playbook: отсутствует обязательный аргумент "playbookId".',
            }),
          };
        }

        const content = await inspectCatalogPlaybookTool.invoke({ playbookId });

        return {
          toolMessage: new ToolMessage({
            tool_call_id: plannerToolCallId,
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

    return runToolSpan(
      'catalog_agent.manage_execution_plan',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Сбой planning tool: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
            }),
          };
        }

        const content = await manageExecutionPlanTool.invoke(parsedArgs.data);

        return {
          toolMessage: new ToolMessage({
            tool_call_id: plannerToolCallId,
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

  if (toolCall.name === runExecutionPlanTool.name) {
    const parsedArgs = runExecutionPlanInputSchema.safeParse(toolCall.args ?? {});

    return runToolSpan(
      'catalog_agent.run_execution_plan',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Сбой run_execution_plan: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
            }),
          };
        }

        const runContext = getPlanningRunContext();
        const planningRuntime = getPlanningRuntime();
        const runId = getCatalogAgentRuntimeRunId();

        if (!runContext || !runId) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: 'Runtime планирования недоступен для этого запуска.',
            }),
          };
        }

        const runtimeTasks: RuntimePlanTask[] = parsedArgs.data.tasks.map((t, index) => ({
          taskId: t.taskId,
          title: t.task,
          owner: t.responsible,
          status: (index === 0 ? 'in_progress' : 'pending') as RuntimePlanTask['status'],
          notes: t.inputData.contextNotes,
          execution: {
            objective: t.task,
            facts: t.inputData.facts,
            constraints: t.inputData.constraints,
            expectedOutput: t.responseStructure,
            contextNotes: t.inputData.contextNotes,
          },
        }));

        try {
          const existingPlan = planningRuntime.getActivePlan(runId);
          if (existingPlan) {
            await planningRuntime.updatePlan({ runId, tasks: runtimeTasks });
          } else {
            await planningRuntime.createPlan({
              runId,
              chatId: runContext.chatId,
              tasks: runtimeTasks,
              startedAt: runContext.startedAt,
              requestText: runContext.requestText,
            });
          }

          // After we received a fresh executable snapshot (or replaced it),
          // the replan gate must be cleared.
          await planningRuntime.setReplanAwaitingSnapshot(runId, false);

          // Execute the single currently-in_progress task and stop for checkpoint.
          const activePlan = planningRuntime.getActivePlan(runId);
          const activeTask = activePlan?.tasks.find((task) => task.status === 'in_progress');
          if (!activeTask || !activeTask.execution) {
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content: 'Нет task в статусе in_progress для исполнения.',
              }),
            };
          }

          const workerToolName = workerToolByPlanOwner[activeTask.owner];
          if (!workerToolName) {
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content: `Невозможно исполнить taskId="${activeTask.taskId}": неподдерживаемый owner="${activeTask.owner}".`,
              }),
            };
          }

          const workerDef = catalogForemanRegistry.resolveWorker(workerToolName);
          if (!workerDef) {
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content: `Не найден worker для tool="${workerToolName}".`,
              }),
            };
          }

          const fakeToolCall = {
            id: plannerToolCallId,
            name: workerToolName,
            args: {
              objective: activeTask.execution.objective,
              facts: activeTask.execution.facts.length > 0 ? activeTask.execution.facts.join('\n') : undefined,
              constraints:
                activeTask.execution.constraints.length > 0 ? activeTask.execution.constraints.join('\n') : undefined,
              expectedOutput: activeTask.execution.expectedOutput,
              contextNotes: activeTask.execution.contextNotes,
            },
          };

          const { run, toolMessage } = await executeWorkerHandoff(fakeToolCall, workerRuns, workerDef, {
            catalogToolReply: { tool_call_id: plannerToolCallId, name: toolCall.name },
          });

          const nextPlanTasks: RuntimePlanTask[] = (activePlan?.tasks ?? []).map((task) => {
            if (task.taskId !== activeTask.taskId) return task;
            return { ...task, status: mapWorkerRunStatusToPlanStatus(run.status) };
          });

          await planningRuntime.updatePlan({ runId, tasks: nextPlanTasks });

          return { run, toolMessage };
        } catch (error) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: error instanceof Error ? error.message : 'Ошибка run_execution_plan.',
            }),
          };
        }
      },
      {
        attributes: buildTraceAttributes({
          'catalog.plan_task_count': parsedArgs.success ? parsedArgs.data.tasks.length : undefined,
          'catalog.plan_task_ids': parsedArgs.success
            ? formatTraceValue(
                parsedArgs.data.tasks.map((t) => t.taskId).join(', '),
                400
              )
            : '(invalid)',
        }),
        mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
        statusMessage: ({ toolMessage }) => {
          const t = getToolMessageText(toolMessage);
          if (
            t.startsWith('Сбой run_execution_plan:') ||
            t.includes('Ошибка run_execution_plan.') ||
            t.includes('Runtime планирования недоступен')
          ) {
            return t;
          }
          return undefined;
        },
      }
    );
  }

  if (toolCall.name === foremanCheckpointTool.name) {
    const parsedArgs = foremanCheckpointInputSchema.safeParse(toolCall.args ?? {});
    const foremanAction = parsedArgs.success ? parsedArgs.data.action : '(invalid)';

    return runToolSpan(
      'catalog_agent.foreman_checkpoint',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Сбой foreman_checkpoint: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
            }),
          };
        }

        const runContext = getPlanningRunContext();
        const planningRuntime = getPlanningRuntime();
        const runId = getCatalogAgentRuntimeRunId();

        if (!runContext || !runId) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: 'Runtime планирования недоступен для этого запуска.',
            }),
          };
        }

        const action = parsedArgs.data.action;
        const completionSummary = parsedArgs.data.result?.summary?.trim();
        const activePlan = planningRuntime.getActivePlan(runId);

        if (!activePlan) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: 'Активного плана нет для checkpoint.',
            }),
          };
        }

        try {
          if (action === 'replan') {
            await planningRuntime.setReplanAwaitingSnapshot(runId, true);
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content:
                  'План обнулен после replan. Вызови тул планирования `run_execution_plan(tasks=[...])` для пересборки executable snapshot.',
              }),
            };
          }

          if (action === 'complete') {
            const plan = await planningRuntime.completePlan(runId);
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content: `План завершён со статусом "${plan.status}". Финальный ответ зафиксирован.`,
              }),
              completion: {
                summary: completionSummary!,
                finalizeOutcome: 'completed',
              },
            };
          }

          if (action === 'fail') {
            const plan = await planningRuntime.failPlan(runId);
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content: `План переведён в статус "${plan.status}". Финальный ответ зафиксирован.`,
              }),
              completion: {
                summary: completionSummary!,
                finalizeOutcome: 'failed',
              },
            };
          }

          if (action === 'approve') {
            if (activePlan.replanAwaitingSnapshot) {
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content:
                    'Нельзя выполнить approve: после `replan` план обнулен и ожидает новый executable snapshot. ' +
                    'Вызови `run_execution_plan(tasks=[...])`, затем повтори checkpoint.',
                }),
              };
            }

            const nextTask = activePlan.tasks.find((t) => t.status === 'pending');
            if (!nextTask) {
              // Stage 1 contract: plan must be closed explicitly via approve gate
              // only moves execution forward; closure happens via complete/fail.
              const hasFailureLike = activePlan.tasks.some((t) => t.status === 'failed' || t.status === 'blocked');
              const suggestedAction: 'complete' | 'fail' = hasFailureLike ? 'fail' : 'complete';
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content: `Нет pending задач. Для закрытия плана вызови foreman_checkpoint(action=${suggestedAction}).`,
                }),
              };
            }

            // Stage 1 contract: `approve` can only advance after the last executed worker task
            // completed successfully. If it ended as `blocked/failed`, model must use `replan/fail`.
            const nextTaskIndex = activePlan.tasks.findIndex((t) => t.taskId === nextTask.taskId);
            const previousTask = nextTaskIndex > 0 ? activePlan.tasks[nextTaskIndex - 1] : null;
            if (!previousTask) {
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content:
                    'План ещё не стартовал: нельзя исполнять подзадачу через approve до вызова run_execution_plan. ' +
                    'Для старта вызови run_execution_plan(tasks=[...]).',
                }),
              };
            }

            if (previousTask.status !== 'completed') {
              const suggestedAction: 'replan' | 'fail' = previousTask.status === 'blocked' ? 'replan' : 'fail';
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content: `Последняя подзадача "${previousTask.taskId}" завершилась со статусом "${previousTask.status}". ` +
                    `Нельзя продвигать план через approve. Для продолжения вызови foreman_checkpoint(action=${suggestedAction}).`,
                }),
              };
            }

            const tasksWithNextInProgress: RuntimePlanTask[] = activePlan.tasks.map((t) =>
              t.taskId === nextTask.taskId ? { ...t, status: 'in_progress' as const } : t
            );

            await planningRuntime.updatePlan({ runId, tasks: tasksWithNextInProgress });

            const planAfterSwitch = planningRuntime.getActivePlan(runId);
            const activeTaskAfterSwitch = planAfterSwitch?.tasks.find((t) => t.status === 'in_progress');
            if (!activeTaskAfterSwitch?.execution) {
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content: 'Не удалось найти execution-данные для in_progress task.',
                }),
              };
            }

            const workerToolName = workerToolByPlanOwner[activeTaskAfterSwitch.owner];
            if (!workerToolName) {
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content: `Невозможно исполнить taskId="${activeTaskAfterSwitch.taskId}": неподдерживаемый owner="${activeTaskAfterSwitch.owner}".`,
                }),
              };
            }

            const workerDef = catalogForemanRegistry.resolveWorker(workerToolName);
            if (!workerDef) {
              return {
                toolMessage: new ToolMessage({
                  tool_call_id: plannerToolCallId,
                  name: toolCall.name,
                  content: `Не найден worker для tool="${workerToolName}".`,
                }),
              };
            }

            const fakeToolCall = {
              id: plannerToolCallId,
              name: workerToolName,
              args: {
                objective: activeTaskAfterSwitch.execution.objective,
                facts:
                  activeTaskAfterSwitch.execution.facts.length > 0
                    ? activeTaskAfterSwitch.execution.facts.join('\n')
                    : undefined,
                constraints:
                  activeTaskAfterSwitch.execution.constraints.length > 0
                    ? activeTaskAfterSwitch.execution.constraints.join('\n')
                    : undefined,
                expectedOutput: activeTaskAfterSwitch.execution.expectedOutput,
                contextNotes: activeTaskAfterSwitch.execution.contextNotes,
              },
            };

            const { run, toolMessage } = await executeWorkerHandoff(fakeToolCall, workerRuns, workerDef, {
              catalogToolReply: { tool_call_id: plannerToolCallId, name: toolCall.name },
            });

            const finalTasks: RuntimePlanTask[] = (planAfterSwitch?.tasks ?? []).map((t) => {
              if (t.taskId !== activeTaskAfterSwitch.taskId) return t;
              return { ...t, status: mapWorkerRunStatusToPlanStatus(run.status) };
            });

            await planningRuntime.updatePlan({ runId, tasks: finalTasks });

            return { run, toolMessage };
          }

          // should be unreachable due to schema
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Неизвестное действие checkpoint: "${action}".`,
            }),
          };
        } catch (error) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: error instanceof Error ? error.message : 'Ошибка foreman_checkpoint.',
            }),
          };
        }
      },
      {
        attributes: buildTraceAttributes({
          'catalog.foreman_action': foremanAction,
        }),
        mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
        statusMessage: ({ toolMessage }) => {
          const t = getToolMessageText(toolMessage);
          if (
            t.startsWith('Сбой foreman_checkpoint:') ||
            t.includes('Ошибка foreman_checkpoint.') ||
            t.includes('Runtime планирования недоступен')
          ) {
            return t;
          }
          return undefined;
        },
      }
    );
  }

  return {
    toolMessage: new ToolMessage({
      tool_call_id: plannerToolCallId,
      name: toolCall.name,
      content: `Каталожный инструмент "${toolCall.name}" не зарегистрирован.`,
    }),
  };
}
