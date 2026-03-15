import { HumanMessage, SystemMessage } from '@langchain/core/messages';
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
import { getPlanningRuntime } from '../../../runtime-plugins/planning';
import { getLastAIMessageText } from '../../shared/messageUtils';
import { renderPlaybookIndexForPrompt } from '../playbooks';
import { finalizeCatalogExecutionPlan, getCatalogAgentRuntimeRunId } from './planning';
import { type CatalogForemanRoute, CatalogGraphStateAnnotation } from './state';
import { executeCatalogToolCall } from './toolDispatcher';
import { getLastFailedWorker } from './workerRunState';
import { catalogForemanRegistry } from './workerRegistry';

const MAX_PLANNER_ITERATIONS = 20;
const PLANNER_LIMIT_MESSAGE =
  'Прекрати вызывать воркеров. Верни максимально полезный частичный результат и явно перечисли все недостающие данные.';

function buildCatalogSystemMessage() {
  return new SystemMessage(PROMPTS.CATALOG_AGENT.SYSTEM(renderPlaybookIndexForPrompt()));
}

function buildCatalogRunnableModel() {
  return chatModel.bindTools(catalogForemanRegistry.agentTools);
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

function formatActivePlanTasks(runId: string) {
  const activePlan = getPlanningRuntime().getActivePlan(runId);
  if (!activePlan) {
    return null;
  }

  const taskLines = activePlan.tasks.map(
    (task) => `- ${task.taskId}: ${task.title} [owner=${task.owner}, status=${task.status}]${task.notes ? ` (${task.notes})` : ''}`
  );

  return {
    plan: activePlan,
    summary: taskLines.join('\n'),
  };
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
        const activePlanSnapshot = runId ? formatActivePlanTasks(runId) : null;
        if (toolCalls.length === 0 && activePlanSnapshot) {
          const correctionMessage = new HumanMessage(
            [
              'Execution plan всё ещё активен. Нельзя завершать задачу свободным текстом, пока активный план не закрыт.',
              'Сделай одно из двух:',
              '- либо вызови следующий worker / manage_execution_plan action=update',
              '- либо закрой активный план через manage_execution_plan action=complete|fail',
              'Если следующий шаг относится к variation-worker, делегируй его сейчас.',
              'Текущий активный план:',
              activePlanSnapshot.summary,
            ].join('\n')
          );
          const correctedLlmMessages = [systemMessage, ...state.messages, response, correctionMessage];
          const correctedResponse = await runLlmSpan(
            'catalog_agent.planner_iteration.correction_llm',
            async () => runnableModel.invoke(correctedLlmMessages),
            {
              inputMessages: correctedLlmMessages,
              model: runnableModel,
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

          const activePlanStillOpen = runId ? formatActivePlanTasks(runId) : null;
          if (toolCalls.length === 0 && activePlanStillOpen) {
            return {
              messages: plannerMessages,
              plannerIteration: iteration,
              ...buildFailureState(
                `Бригадир попытался завершить работу без tool call, хотя execution plan всё ещё активен:\n${activePlanStillOpen.summary}`
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

        return {
          messages: plannerMessages,
          plannerIteration: iteration,
          pendingToolCalls: nextRoute === 'dispatchTools' ? toolCalls : [],
          nextRoute,
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          plannerIteration: iteration,
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

const dispatchToolsNode = async (
  state: typeof CatalogGraphStateAnnotation.State
): Promise<Partial<typeof CatalogGraphStateAnnotation.State>> => {
  return runAgentSpan(
    'catalog_agent.dispatch_tools',
    async () => {
      const workerRuns = [...state.workerRuns];
      const messages = [];

      try {
        for (const toolCall of state.pendingToolCalls) {
          const { run, toolMessage } = await executeCatalogToolCall(toolCall, workerRuns);
          if (run) {
            workerRuns.push(run);
          }
          messages.push(toolMessage);
        }

        return {
          messages,
          workerRuns,
          pendingToolCalls: [],
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          messages,
          workerRuns,
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

      try {
        await finalizeCatalogExecutionPlan({
          runId,
          outcome: state.finalizeOutcome ?? 'abandoned',
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
  return state.fatalErrorMessage ? 'finalize' : 'planner';
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

const catalogAgentRootGraph = buildCatalogAgentGraph(undefined, 'catalog-agent-root');

export async function runCatalogAgent(userRequest: string): Promise<string> {
  const result = await catalogAgentRootGraph.invoke({
    messages: [new HumanMessage(userRequest)],
  });

  return getLastAIMessageText(result.messages);
}
