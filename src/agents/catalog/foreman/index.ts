import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { BaseCheckpointSaver, END, START, StateGraph } from '@langchain/langgraph';
import { chatModel } from '../../../config';
import {
  addTraceEvent,
  buildTraceAttributes,
  formatTraceText,
  runAgentSpan,
  runChainSpan,
  runLlmSpan,
  summarizeToolCallNames,
} from '../../../observability/traceContext';
import { PROMPTS } from '../../../prompts';
import { getPlanningRuntime } from '../../../runtime/planning';
import { getLastAIMessageText } from '../../shared/messageUtils';
import { renderPlaybookIndexForPrompt } from '../playbooks';
import { type WorkerRun } from '../contracts/workerRun';
import { finalizeCatalogExecutionPlan, getCatalogAgentRuntimeRunId } from './planning';
import { type CatalogForemanRoute, type CatalogRequestContext, CatalogGraphStateAnnotation } from './state';
import { type CatalogToolCompletion, executeCatalogToolCall } from './toolDispatcher';
import { getLastFailedWorker } from './workerRunState';
import { getCatalogForemanAgentTools } from './workerRegistry';

const MAX_PLANNER_ITERATIONS = 20;
const PLANNER_LIMIT_MESSAGE =
  'Прекрати вызывать воркеров. Верни максимально полезный частичный результат и явно перечисли все недостающие данные.';

function buildCatalogSystemMessage() {
  return new SystemMessage(PROMPTS.CATALOG_AGENT.SYSTEM(renderPlaybookIndexForPrompt()));
}

function buildCatalogRunnableModel() {
  const runId = getCatalogAgentRuntimeRunId();
  const activePlan = runId ? getPlanningRuntime().getActivePlan(runId) : null;
  return chatModel.bindTools(getCatalogForemanAgentTools(activePlan));
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка catalog foreman.';
}

function buildFailureState(error: unknown) {
  return {
    pendingToolCalls: [],
    nextRoute: 'finalize' as CatalogForemanRoute,
    finalizeOutcome: 'failed' as const,
    fatalErrorMessage: toErrorMessage(error),
  };
}

function formatActivePlanTaskSummary(runId: string): string | null {
  const activePlan = getPlanningRuntime().getActivePlan(runId);
  if (!activePlan) {
    return null;
  }

  const taskLines = activePlan.tasks.map(
    (task) => `- ${task.taskId}: ${task.title} [owner=${task.owner}, status=${task.status}]${task.notes ? ` (${task.notes})` : ''}`
  );

  return taskLines.join('\n');
}

type PlannerState = typeof CatalogGraphStateAnnotation.State;

function deriveRequestContext(state: PlannerState): CatalogRequestContext | null {
  if (state.requestContext != null) return state.requestContext;
  const first = state.messages[0];
  const content = first?.content;
  if (typeof content !== 'string') return null;
  return { initialPrompt: content };
}

const plannerNode = async (
  state: typeof CatalogGraphStateAnnotation.State
): Promise<Partial<typeof CatalogGraphStateAnnotation.State>> => {
  return runAgentSpan(
    'catalog_agent.planner',
    async () => {
      const systemMessage = buildCatalogSystemMessage();
      const runnableModel = buildCatalogRunnableModel();
      const iteration = state.plannerIteration + 1;
      const plannerMessages = [];
      const requestContextUpdate = deriveRequestContext(state);

      try {
        let { response, toolCalls } = await runChainSpan(
          'catalog_agent.planner_iteration',
          async () => {
            const llmMessages = [systemMessage, ...state.messages];
            const response = await runLlmSpan(
              'catalog_agent.planner_iteration.llm',
              async () => runnableModel.invoke(llmMessages),
              {
                inputMessages: llmMessages,
                model: runnableModel,
                attributes: buildTraceAttributes({
                  'catalog.planner.iteration': iteration,
                  'catalog.planner.branch': 'iteration',
                  'catalog.planner.worker_runs': state.workerRuns.length,
                  'catalog.planner.latest_worker_status': state.latestWorkerResult?.status ?? '(none)',
                }),
              }
            );
            const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];

            return {
              response,
              toolCalls,
            };
          },
          {
            attributes: buildTraceAttributes({
              'catalog.iteration': iteration,
              'catalog.worker_runs': state.workerRuns.length,
            }),
            mapResultAttributes: ({ toolCalls }) =>
              buildTraceAttributes({
                'catalog.iteration': iteration,
                'catalog.tool_call_count': toolCalls.length,
                'catalog.tool_call_names': summarizeToolCallNames(toolCalls),
              }),
          }
        );
        addTraceEvent('planner.tool_calls_generated', {
          'catalog.iteration': iteration,
          'catalog.tool_call_count': toolCalls.length,
          'catalog.tool_call_names': summarizeToolCallNames(toolCalls),
          status: toolCalls.length > 0 ? 'tool_calls' : 'text_response',
        });
        plannerMessages.push(response);

        const runId = getCatalogAgentRuntimeRunId();
        const activePlanSummary = runId ? formatActivePlanTaskSummary(runId) : null;
        if (toolCalls.length === 0 && activePlanSummary) {
          const correctionMessage = new HumanMessage(
            [
              'Execution plan всё ещё активен. Нельзя завершать задачу свободным текстом, пока активный план не закрыт.',
              'Сделай один из следующих шагов:',
              '- вызови `approve_step` (runtime запустит следующую pending подзадачу)',
              '- или пересобери план через `new_execution_plan([...])`, если нужны другие входные данные для хвоста',
              '- или закрой план через `finish_execution_plan(outcome=completed|failed, summary=...)`; runtime сразу завершит граф этим итогом',
              'Текущий активный план:',
              activePlanSummary,
            ].join('\n')
          );
          const correctedLlmMessages = [systemMessage, ...state.messages, response, correctionMessage];
          const correctedResponse = await runLlmSpan(
            'catalog_agent.planner_iteration.correction_llm',
            async () => runnableModel.invoke(correctedLlmMessages),
            {
              inputMessages: correctedLlmMessages,
              model: runnableModel,
              attributes: buildTraceAttributes({
                'catalog.planner.iteration': iteration,
                'catalog.planner.branch': 'correction',
                'catalog.planner.worker_runs': state.workerRuns.length,
              }),
            }
          );
          const correctedToolCalls = Array.isArray(correctedResponse.tool_calls) ? correctedResponse.tool_calls : [];
          plannerMessages.push(correctionMessage, correctedResponse);
          response = correctedResponse;
          toolCalls = correctedToolCalls;
          addTraceEvent('planner.tool_calls_generated', {
            'catalog.iteration': iteration,
            'catalog.tool_call_count': toolCalls.length,
            'catalog.tool_call_names': summarizeToolCallNames(toolCalls),
            status: toolCalls.length > 0 ? 'tool_calls_after_correction' : 'text_response_after_correction',
          });

          const activePlanSummaryStillOpen = runId ? formatActivePlanTaskSummary(runId) : null;
          if (toolCalls.length === 0 && activePlanSummaryStillOpen) {
            return {
              messages: plannerMessages,
              plannerIteration: iteration,
              ...(requestContextUpdate != null ? { requestContext: requestContextUpdate } : {}),
              ...buildFailureState(
                `Бригадир попытался завершить работу без tool call, хотя execution plan всё ещё активен:\n${activePlanSummaryStillOpen}`
              ),
            };
          }
        }

        const nextRoute: CatalogForemanRoute =
          toolCalls.length === 0 ? 'finalize' : iteration >= MAX_PLANNER_ITERATIONS ? 'plannerLimitFallback' : 'dispatchTools';
        addTraceEvent('planner.route_selected', {
          'catalog.iteration': iteration,
          'catalog.next_route': nextRoute,
          'catalog.tool_call_count': toolCalls.length,
        });

        // OpenAI rejects requests where an assistant message has tool_calls but no matching ToolMessage
        // follows. plannerLimitFallback invokes the model again, so we must close those ids here.
        const messagesForState =
          nextRoute === 'plannerLimitFallback' && toolCalls.length > 0
            ? [
                ...plannerMessages,
                ...toolCalls.map(
                  (tc) =>
                    new ToolMessage({
                      tool_call_id:
                        typeof tc.id === 'string' && tc.id.length > 0 ? tc.id : (typeof tc.name === 'string' ? tc.name : ''),
                      name: tc.name,
                      content: `Достигнут лимит итераций планировщика (${MAX_PLANNER_ITERATIONS}). Tool call не выполнялся; дальше отработает fallback.`,
                    })
                ),
              ]
            : plannerMessages;

        return {
          messages: messagesForState,
          plannerIteration: iteration,
          ...(requestContextUpdate != null ? { requestContext: requestContextUpdate } : {}),
          pendingToolCalls: nextRoute === 'dispatchTools' ? toolCalls : [],
          nextRoute,
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          plannerIteration: iteration,
          ...(requestContextUpdate != null ? { requestContext: requestContextUpdate } : {}),
          ...buildFailureState(error),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.iteration': state.plannerIteration + 1,
        'catalog.input': formatTraceText(
          getLastAIMessageText(state.messages) || state.messages[state.messages.length - 1]?.content,
          1500
        ),
        'catalog.worker_runs': state.workerRuns.length,
      }),
      mapResultAttributes: (result) =>
        buildTraceAttributes({
          'catalog.next_route': result.nextRoute,
          'catalog.iteration': result.plannerIteration,
          'catalog.failure_worker': getLastFailedWorker(state.workerRuns)?.agent,
          'catalog.fatal_error': result.fatalErrorMessage,
        }),
      statusMessage: (result) => result.fatalErrorMessage ?? undefined,
    }
  );
};

function deriveStructuredStateFromRuns(workerRuns: WorkerRun[]) {
  const lastWithResult = [...workerRuns].reverse().find((r) => r.result != null);
  const latestWorkerResult = lastWithResult?.result ?? null;
  const workerArtifacts = workerRuns.flatMap((r) => r.result?.artifacts ?? []);
  return { latestWorkerResult, workerArtifacts };
}

const dispatchToolsNode = async (
  state: typeof CatalogGraphStateAnnotation.State
): Promise<Partial<typeof CatalogGraphStateAnnotation.State>> => {
  return runAgentSpan(
    'catalog_agent.dispatch_tools',
    async () => {
      const workerRuns = [...state.workerRuns];
      const messages = [];
      let completion: CatalogToolCompletion | null = null;
      const runId = getCatalogAgentRuntimeRunId();
      const activePlan = runId ? getPlanningRuntime().getActivePlan(runId) : null;
      const sequencedToolNames = new Set([
        'new_execution_plan',
        'approve_step',
        'finish_execution_plan',
      ]);
      const hasSequencedToolCall = state.pendingToolCalls.some((t) => sequencedToolNames.has(t.name));
      const gateProtocolMode = Boolean(activePlan) || hasSequencedToolCall;

      try {
        for (let idx = 0; idx < state.pendingToolCalls.length; idx++) {
          const toolCall = state.pendingToolCalls[idx];

          if (idx > 0 && gateProtocolMode) {
            // Stage 1 contract: `planner -> new_execution_plan | approve_step -> worker -> ...`
            // must not be bypassed by multiple tool calls in a single LLM response.
            // We still return ToolMessages for ignored calls to keep tool-call protocol consistent.
            const toolCallId =
              typeof toolCall.id === 'string' && toolCall.id.length > 0
                ? toolCall.id
                : typeof toolCall.name === 'string'
                  ? toolCall.name
                  : '';
            messages.push(
              new ToolMessage({
                tool_call_id: toolCallId,
                name: toolCall.name,
                content:
                  'Протокол выполнения: в одном ответе выполняй только один tool call. Дополнительный tool call ' +
                  `"${toolCall.name}"` +
                  ' не выполнен; повтори его в следующей итерации после ответа по предыдущему tool call.',
              })
            );
            continue;
          }

          const { run, toolMessage, completion: toolCompletion, plannerFollowUpMessages } =
            await executeCatalogToolCall(toolCall, workerRuns);
          if (run) {
            workerRuns.push(run);
          }
          messages.push(toolMessage);
          if (plannerFollowUpMessages?.length) {
            messages.push(...plannerFollowUpMessages);
          }
          if (toolCompletion) {
            completion = toolCompletion;
          }
        }

        const { latestWorkerResult, workerArtifacts } = deriveStructuredStateFromRuns(workerRuns);
        if (completion) {
          messages.push(new AIMessage(completion.summary));
        }

        return {
          messages,
          workerRuns,
          latestWorkerResult,
          workerArtifacts,
          pendingToolCalls: [],
          nextRoute: completion ? 'finalize' : 'dispatchTools',
          finalizeOutcome: completion?.finalizeOutcome ?? null,
          fatalErrorMessage: null,
        };
      } catch (error) {
        const { latestWorkerResult, workerArtifacts } = deriveStructuredStateFromRuns(workerRuns);
        return {
          messages,
          workerRuns,
          latestWorkerResult,
          workerArtifacts,
          ...buildFailureState(error),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.iteration': state.plannerIteration,
        'catalog.pending_tool_calls': state.pendingToolCalls.length,
        'catalog.tool_call_names': summarizeToolCallNames(state.pendingToolCalls),
      }),
      mapResultAttributes: (result) =>
        buildTraceAttributes({
          'catalog.worker_runs': result.workerRuns?.length,
          'catalog.fatal_error': result.fatalErrorMessage,
        }),
      statusMessage: (result) => result.fatalErrorMessage ?? undefined,
    }
  );
};

const plannerLimitFallbackNode = async (
  state: typeof CatalogGraphStateAnnotation.State
): Promise<Partial<typeof CatalogGraphStateAnnotation.State>> => {
  return runChainSpan(
    'catalog_agent.planner_limit_fallback',
    async () => {
      const systemMessage = buildCatalogSystemMessage();
      const runnableModel = buildCatalogRunnableModel();
      const stopMessage = new HumanMessage(PLANNER_LIMIT_MESSAGE);

      try {
        const llmMessages = [systemMessage, ...state.messages, stopMessage];
        const response = await runLlmSpan(
          'catalog_agent.planner_limit_fallback.llm',
          async () => runnableModel.invoke(llmMessages),
          {
            inputMessages: llmMessages,
            model: runnableModel,
            attributes: buildTraceAttributes({
              'catalog.planner.iteration': state.plannerIteration,
              'catalog.planner.branch': 'limit_fallback',
              'catalog.planner.worker_runs': state.workerRuns.length,
            }),
          }
        );

        return {
          messages: [stopMessage, response],
          pendingToolCalls: [],
          nextRoute: 'finalize' as CatalogForemanRoute,
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          messages: [stopMessage],
          ...buildFailureState(error),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.iteration': state.plannerIteration,
        'catalog.status': 'planner_limit_reached',
      }),
      mapResultAttributes: (result) =>
        buildTraceAttributes({
          'catalog.fatal_error': result.fatalErrorMessage,
        }),
      statusMessage: (result) => result.fatalErrorMessage ?? 'достигнут лимит итераций планировщика',
    }
  );
};

const finalizeNode = async (
  state: typeof CatalogGraphStateAnnotation.State
): Promise<Partial<typeof CatalogGraphStateAnnotation.State>> => {
  return runChainSpan(
    'catalog_agent.finalize',
    async () => {
      const runId = getCatalogAgentRuntimeRunId();
      if (!runId) {
        return {};
      }

      const outcome = state.finalizeOutcome ?? 'abandoned';
      if (outcome === 'completed') {
        return {};
      }

      try {
        await finalizeCatalogExecutionPlan({
          runId,
          outcome,
        });
      } catch (error) {
        console.warn('Не удалось финализировать план выполнения:', error);
      }

      return {};
    },
    {
      attributes: buildTraceAttributes({
        'catalog.finalize_outcome': state.finalizeOutcome ?? 'abandoned',
        'catalog.worker_runs': state.workerRuns.length,
      }),
      mapResultAttributes: () =>
        buildTraceAttributes({
          'catalog.failure_worker': getLastFailedWorker(state.workerRuns)?.agent,
        }),
      statusMessage: () => {
        const failedWorker = getLastFailedWorker(state.workerRuns);
        return failedWorker ? `сбой каталожного воркера: ${failedWorker.agent}` : undefined;
      },
    }
  );
};

const raiseFatalErrorNode = async (state: typeof CatalogGraphStateAnnotation.State) => {
  throw new Error(state.fatalErrorMessage ?? 'Catalog foreman failed.');
};

function getPlannerRoute(state: typeof CatalogGraphStateAnnotation.State) {
  return state.nextRoute;
}

function getPostDispatchRoute(state: typeof CatalogGraphStateAnnotation.State) {
  return state.fatalErrorMessage || state.finalizeOutcome != null ? 'finalize' : 'planner';
}

function getPostFinalizeRoute(state: typeof CatalogGraphStateAnnotation.State) {
  return state.fatalErrorMessage ? 'raiseFatalError' : 'end';
}

function buildCatalogAgentGraph(checkpointer?: BaseCheckpointSaver | boolean, name = 'catalog-agent') {
  return new StateGraph(CatalogGraphStateAnnotation)
    .addNode('planner', plannerNode)
    .addNode('dispatchTools', dispatchToolsNode)
    .addNode('plannerLimitFallback', plannerLimitFallbackNode)
    .addNode('finalize', finalizeNode)
    .addNode('raiseFatalError', raiseFatalErrorNode)
    .addEdge(START, 'planner')
    .addConditionalEdges('planner', getPlannerRoute, {
      dispatchTools: 'dispatchTools',
      plannerLimitFallback: 'plannerLimitFallback',
      finalize: 'finalize',
    })
    .addConditionalEdges('dispatchTools', getPostDispatchRoute, {
      planner: 'planner',
      finalize: 'finalize',
    })
    .addEdge('plannerLimitFallback', 'finalize')
    .addConditionalEdges('finalize', getPostFinalizeRoute, {
      raiseFatalError: 'raiseFatalError',
      end: END,
    })
    .compile({
      checkpointer,
      name,
      description: 'Агент-бригадир каталога с явным planner-dispatch циклом и отдельной финализацией плана.',
    });
}

export const catalogAgentGraph = buildCatalogAgentGraph(true, 'catalog-agent');
