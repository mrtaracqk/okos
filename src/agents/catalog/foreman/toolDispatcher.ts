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
  getPlanningRuntime,
  getPlanningRunContext,
  type RuntimePlan,
  type RuntimePlanTask,
} from '../../../runtime/planning';
import { buildWorkerInputFromEnvelope, type WorkerTaskEnvelope } from '../contracts/workerRequest';
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
  approveStepInputSchema,
  approveStepTool,
  finishExecutionPlanInputSchema,
  finishExecutionPlanTool,
  newExecutionPlanInputSchema,
  newExecutionPlanTool,
} from './executionTools';
import {
  buildNoToolCallFailure,
  formatWorkerFailure,
  getLastNonReportFailure,
  resolveWorkerRunStatus,
} from './workerRunState';
import { resolveCatalogWorkerId } from '../contracts/catalogWorkerId';
import { catalogForemanRegistry } from './workerRegistry';
import { buildPlannerSubtaskNarrative } from './plannerNarrative';

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

function planExecutionToWorkerEnvelope(execution: NonNullable<RuntimePlanTask['execution']>): WorkerTaskEnvelope {
  return {
    objective: execution.objective,
    facts: execution.facts,
    constraints: execution.constraints,
    expectedOutput: execution.expectedOutput,
    contextNotes: execution.contextNotes,
  };
}

function mapWorkerRunStatusToPlanStatus(status: WorkerRun['status']): 'completed' | 'failed' {
  if (status === 'completed') return 'completed';
  return 'failed';
}

export type CatalogToolCompletion = {
  summary: string;
  finalizeOutcome: 'completed' | 'failed';
};

/** LangGraph tool_result pairing: which AIMessage tool_call this worker outcome answers. */
type WorkerHandoffToolReply = {
  tool_call_id: string;
  name: string;
};

async function executeWorkerHandoff(
  requestEnvelope: WorkerTaskEnvelope,
  workerRuns: WorkerRun[],
  worker: NonNullable<ReturnType<typeof catalogForemanRegistry.resolveWorker>>,
  replyToToolCall: WorkerHandoffToolReply
): Promise<{ run: WorkerRun; toolMessage: ToolMessage }> {
  const workerId = worker.id;
  const { objective, expectedOutput } = requestEnvelope;
  const replyToolCallId = replyToToolCall.tool_call_id;
  const replyToolName = replyToToolCall.name;

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
        const run: WorkerRun = {
          agent: workerId,
          status: 'invalid',
          task: '',
          details: `Отсутствуют обязательные аргументы handoff: ${missingFields.join(', ')}.`,
          request: requestEnvelope,
        };
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerId}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerId,
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
          `worker.${workerId}`,
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
              'catalog.worker_name': workerId,
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
          domainToolRunCount === 0 &&
          (!runResult || runResult.status === 'completed')
            ? buildNoToolCallFailure(workerId, objective)
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
              : buildMissingWorkerResultNotice(workerId);
        const details =
          runStatusFinal === 'failed' && workerFailure
            ? `${detailsForTrace}\n\n${formatWorkerFailure(workerFailure)}`
            : detailsForTrace;
        const run: WorkerRun = {
          agent: workerId,
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
            : buildMissingWorkerResultNotice(workerId);
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerId}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerId,
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
          agent: workerId,
          status: 'failed',
          task: objective,
          details: message,
          request: requestEnvelope,
        };
        addTraceEvent('worker.result_reported', {
          from_agent: `worker.${workerId}`,
          to_agent: 'catalog_agent.planner',
          'catalog.worker_name': workerId,
          status: run.status,
        });

        return {
          run,
          toolMessage: new ToolMessage({
            tool_call_id: replyToolCallId,
            name: replyToolName,
            content: `Воркер "${workerId}" завершился с ошибкой: ${message}`,
          }),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.worker_name': workerId,
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

type PlannerExecutionToolPhase = 'new_execution_plan' | 'approve_step';

function messagesForInProgressExecutionFailure(phase: PlannerExecutionToolPhase): {
  noExecutableInProgressTask: string;
  planNotReloadedAfterWorker: string;
} {
  if (phase === 'new_execution_plan') {
    return {
      noExecutableInProgressTask: 'Нет task в статусе in_progress для исполнения.',
      planNotReloadedAfterWorker:
        'План зафиксирован, подзадача отработана, но активный план не прочитан из runtime после обновления.',
    };
  }
  return {
    noExecutableInProgressTask: 'Не удалось найти execution-данные для in_progress task.',
    planNotReloadedAfterWorker:
      'approve_step применён, подзадача отработана, но активный план не прочитан из runtime после обновления.',
  };
}

/**
 * Исполняет единственную задачу плана в статусе in_progress (handoff воркеру) и записывает итоговый статус задачи в runtime.
 * Общий путь для new_execution_plan (после create/update) и approve_step (после перевода следующей pending → in_progress).
 */
async function runInProgressPlanTaskAndSyncRuntime(params: {
  runId: string;
  workerRuns: WorkerRun[];
  replyToToolCall: WorkerHandoffToolReply;
  phase: PlannerExecutionToolPhase;
}): Promise<
  | { ok: true; run: WorkerRun; planAfterWorker: RuntimePlan; completedTaskId: string }
  | { ok: false; toolMessage: ToolMessage; run?: WorkerRun }
> {
  const { runId, workerRuns, replyToToolCall, phase } = params;
  const msgs = messagesForInProgressExecutionFailure(phase);
  const planningRuntime = getPlanningRuntime();
  const replyToolCallId = replyToToolCall.tool_call_id;
  const replyToolName = replyToToolCall.name;

  const activePlan = planningRuntime.getActivePlan(runId);
  const activeTask = activePlan?.tasks.find((task) => task.status === 'in_progress');
  if (!activeTask || !activeTask.execution) {
    return {
      ok: false,
      toolMessage: new ToolMessage({
        tool_call_id: replyToolCallId,
        name: replyToolName,
        content: msgs.noExecutableInProgressTask,
      }),
    };
  }

  const workerId = resolveCatalogWorkerId(activeTask.owner);
  if (!workerId) {
    return {
      ok: false,
      toolMessage: new ToolMessage({
        tool_call_id: replyToolCallId,
        name: replyToolName,
        content: `Невозможно исполнить taskId="${activeTask.taskId}": неподдерживаемый owner="${activeTask.owner}".`,
      }),
    };
  }

  const workerDef = catalogForemanRegistry.resolveWorker(workerId);
  if (!workerDef) {
    return {
      ok: false,
      toolMessage: new ToolMessage({
        tool_call_id: replyToolCallId,
        name: replyToolName,
        content: `Не найден worker для id="${workerId}".`,
      }),
    };
  }

  const workerEnvelope = planExecutionToWorkerEnvelope(activeTask.execution);
  const { run } = await executeWorkerHandoff(workerEnvelope, workerRuns, workerDef, {
    tool_call_id: replyToolCallId,
    name: replyToolName,
  });

  const nextPlanTasks: RuntimePlanTask[] = (activePlan?.tasks ?? []).map((task) => {
    if (task.taskId !== activeTask.taskId) return task;
    return { ...task, status: mapWorkerRunStatusToPlanStatus(run.status) };
  });

  await planningRuntime.updatePlan({ runId, tasks: nextPlanTasks });

  const planAfterWorker = planningRuntime.getActivePlan(runId);
  if (!planAfterWorker) {
    return {
      ok: false,
      run,
      toolMessage: new ToolMessage({
        tool_call_id: replyToolCallId,
        name: replyToolName,
        content: msgs.planNotReloadedAfterWorker,
      }),
    };
  }

  return { ok: true, run, planAfterWorker, completedTaskId: activeTask.taskId };
}

export async function executeCatalogToolCall(
  toolCall: any,
  workerRuns: WorkerRun[]
): Promise<{
  run?: WorkerRun;
  toolMessage: ToolMessage;
  completion?: CatalogToolCompletion;
  plannerFollowUpMessages?: HumanMessage[];
}> {
  const plannerToolCallId = openAiToolCallId(toolCall);

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

  if (toolCall.name === newExecutionPlanTool.name) {
    const parsedArgs = newExecutionPlanInputSchema.safeParse(toolCall.args ?? {});

    return runToolSpan(
      'catalog_agent.new_execution_plan',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Сбой new_execution_plan: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
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

          const exec = await runInProgressPlanTaskAndSyncRuntime({
            runId,
            workerRuns,
            replyToToolCall: { tool_call_id: plannerToolCallId, name: toolCall.name },
            phase: 'new_execution_plan',
          });
          if (!exec.ok) {
            return exec.run ? { run: exec.run, toolMessage: exec.toolMessage } : { toolMessage: exec.toolMessage };
          }

          const { run, planAfterWorker, completedTaskId } = exec;
          const narrative = buildPlannerSubtaskNarrative({
            phase: 'new_execution_plan',
            plan: planAfterWorker,
            completedTaskId,
            run,
          });

          return {
            run,
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: 'План создан и запущен в работу.',}),
            plannerFollowUpMessages: [new HumanMessage(narrative)],
          };
        } catch (error) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: error instanceof Error ? error.message : 'Ошибка new_execution_plan.',
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
            t.startsWith('Сбой new_execution_plan:') ||
            t.includes('Ошибка new_execution_plan.') ||
            t.includes('Runtime планирования недоступен')
          ) {
            return t;
          }
          return undefined;
        },
      }
    );
  }

  if (toolCall.name === finishExecutionPlanTool.name) {
    const parsedArgs = finishExecutionPlanInputSchema.safeParse(toolCall.args ?? {});
    const finishOutcome = parsedArgs.success ? parsedArgs.data.outcome : '(invalid)';

    return runToolSpan(
      'catalog_agent.finish_execution_plan',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Сбой finish_execution_plan: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
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

        const summary = parsedArgs.data.summary.trim();

        try {
          if (parsedArgs.data.outcome === 'completed') {
            const plan = await planningRuntime.completePlan(runId);
            return {
              toolMessage: new ToolMessage({
                tool_call_id: plannerToolCallId,
                name: toolCall.name,
                content: `План завершён со статусом "${plan.status}". Финальный ответ зафиксирован.`,
              }),
              completion: {
                summary,
                finalizeOutcome: 'completed',
              },
            };
          }

          const plan = await planningRuntime.failPlan(runId);
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `План переведён в статус "${plan.status}". Финальный ответ зафиксирован.`,
            }),
            completion: {
              summary,
              finalizeOutcome: 'failed',
            },
          };
        } catch (error) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: error instanceof Error ? error.message : 'Ошибка finish_execution_plan.',
            }),
          };
        }
      },
      {
        attributes: buildTraceAttributes({
          'catalog.finish_outcome': finishOutcome,
        }),
        mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
        statusMessage: ({ toolMessage }) => {
          const t = getToolMessageText(toolMessage);
          if (
            t.startsWith('Сбой finish_execution_plan:') ||
            t.includes('Ошибка finish_execution_plan.') ||
            t.includes('Runtime планирования недоступен')
          ) {
            return t;
          }
          return undefined;
        },
      }
    );
  }

  if (toolCall.name === approveStepTool.name) {
    const parsedArgs = approveStepInputSchema.safeParse(toolCall.args ?? {});

    return runToolSpan(
      'catalog_agent.approve_step',
      async () => {
        if (!parsedArgs.success) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: `Сбой approve_step: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`,
            }),
          };
        }

        const planningRuntime = getPlanningRuntime();
        const runId = getCatalogAgentRuntimeRunId();

        if (!runId) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: 'Runtime планирования недоступен для этого запуска.',
            }),
          };
        }

        try {
          const activePlan = planningRuntime.getActivePlan(runId);
          if (!activePlan) {
            throw new Error('approve_step стал недоступен до исполнения: активный план не найден.');
          }

          const nextTask = activePlan.tasks.find((t) => t.status === 'pending');
          if (!nextTask) {
            throw new Error('approve_step стал недоступен до исполнения: в активном плане больше нет pending задач.');
          }

          const nextTaskIndex = activePlan.tasks.findIndex((t) => t.taskId === nextTask.taskId);
          const previousTask = nextTaskIndex > 0 ? activePlan.tasks[nextTaskIndex - 1] : null;
          if (!previousTask || previousTask.status !== 'completed') {
            throw new Error('approve_step стал недоступен до исполнения: planner выбрал tool вне допустимого состояния плана.');
          }

          const tasksWithNextInProgress: RuntimePlanTask[] = activePlan.tasks.map((t) =>
            t.taskId === nextTask.taskId ? { ...t, status: 'in_progress' as const } : t
          );

          await planningRuntime.updatePlan({ runId, tasks: tasksWithNextInProgress });

          const exec = await runInProgressPlanTaskAndSyncRuntime({
            runId,
            workerRuns,
            replyToToolCall: { tool_call_id: plannerToolCallId, name: toolCall.name },
            phase: 'approve_step',
          });
          if (!exec.ok) {
            return exec.run ? { run: exec.run, toolMessage: exec.toolMessage } : { toolMessage: exec.toolMessage };
          }

          const { run, planAfterWorker, completedTaskId } = exec;
          const narrative = buildPlannerSubtaskNarrative({
            phase: 'approve_step',
            plan: planAfterWorker,
            completedTaskId,
            run,
          });

          return {
            run,
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content:
                'approve_step применён; подзадача отработана воркером. Подробности шага — в следующем сообщении.',
            }),
            plannerFollowUpMessages: [new HumanMessage(narrative)],
          };
        } catch (error) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: plannerToolCallId,
              name: toolCall.name,
              content: error instanceof Error ? error.message : 'Ошибка approve_step.',
            }),
          };
        }
      },
      {
        mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
        statusMessage: ({ toolMessage }) => {
          const t = getToolMessageText(toolMessage);
          if (
            t.startsWith('Сбой approve_step:') ||
            t.includes('Ошибка approve_step.') ||
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
