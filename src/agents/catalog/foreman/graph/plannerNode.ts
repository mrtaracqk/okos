import { SystemMessage, ToolMessage, type AIMessage, type BaseMessage } from '@langchain/core/messages';
import { chatModel } from '../../../../config';
import {
  addTraceEvent,
  buildTraceAttributes,
  formatTraceText,
  runAgentSpan,
  runChainSpan,
  runLlmSpan,
  summarizeToolCallNames,
} from '../../../../observability/traceContext';
import { PROMPTS } from '../../../../prompts';
import { getPlanningRuntime, type RuntimePlan } from '../../../../runtime/planning';
import { getLastAIMessageText } from '../../../shared/messageUtils';
import { renderPlaybookIndexForPrompt } from '../../playbooks';
import { buildExecutionSnapshotRuntimeContextMessage } from '../executionSnapshot';
import { applyActivePlanGuard } from '../planner/activePlanGuard';
import { getCatalogForemanAgentTools } from '../tools/availability';
import { getLastFailedWorker, getLastWorkerResult } from '../workers/runState';
import { getCatalogAgentRuntimeRunId } from '../runtimePlan/runtimePlanService';
import { assertExecutionSnapshotInvariant, buildFailureState } from './nodeShared';
import { type CatalogGraphState, type CatalogPlannerRoute } from './state';

const MAX_PLANNER_ITERATIONS = 20;
const PLANNER_LIMIT_MESSAGE =
  'Прекрати вызывать воркеров. Верни максимально полезный частичный результат и явно перечисли все недостающие данные.';

function buildCatalogSystemMessage() {
  return new SystemMessage(PROMPTS.CATALOG_AGENT.SYSTEM(renderPlaybookIndexForPrompt()));
}

function buildCatalogRunnableModel(activePlan: RuntimePlan | null) {
  return chatModel.bindTools(getCatalogForemanAgentTools(activePlan));
}

export const plannerNode = async (state: CatalogGraphState): Promise<Partial<CatalogGraphState>> => {
  return runAgentSpan(
    'catalog_agent.planner',
    async () => {
      const iteration = state.plannerIteration + 1;
      const plannerMessages: BaseMessage[] = [];
      const runId = getCatalogAgentRuntimeRunId();
      const activePlan = runId ? getPlanningRuntime().getActivePlan(runId) : null;
      const activeExecutionSnapshot = state.activeExecutionSnapshot;

      try {
        assertExecutionSnapshotInvariant(activePlan, activeExecutionSnapshot);

        const systemMessage = buildCatalogSystemMessage();
        const runnableModel = buildCatalogRunnableModel(activePlan);
        const runtimeContextMessages = activeExecutionSnapshot
          ? [buildExecutionSnapshotRuntimeContextMessage(activeExecutionSnapshot)]
          : [];
        const promptPrefixMessages: BaseMessage[] = [systemMessage, ...runtimeContextMessages];
        let { response, toolCalls }: { response: AIMessage; toolCalls: AIMessage['tool_calls'] } = await runChainSpan(
          'catalog_agent.planner_iteration',
          async () => {
            const llmMessages = [...promptPrefixMessages, ...state.messages];
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
                  'catalog.planner.latest_worker_status': getLastWorkerResult(state.workerRuns)?.status ?? '(none)',
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
        const guardedPlannerResult = await applyActivePlanGuard({
          iteration,
          workerRunsCount: state.workerRuns.length,
          promptPrefixMessages,
          stateMessages: state.messages,
          response,
          runnableModel,
        });

        response = guardedPlannerResult.response;
        toolCalls = guardedPlannerResult.toolCalls ?? [];
        plannerMessages.splice(0, plannerMessages.length, ...guardedPlannerResult.messages);

        if (toolCalls.length === 0 && guardedPlannerResult.activePlanSummaryStillOpen) {
          return {
            messages: plannerMessages,
            plannerIteration: iteration,
            ...buildFailureState(
              `Бригадир попытался завершить работу без tool call, хотя execution plan всё ещё активен:\n${guardedPlannerResult.activePlanSummaryStillOpen}`
            ),
          };
        }

        const nextRoute: CatalogPlannerRoute =
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
          activeExecutionSnapshot,
          plannerIteration: iteration,
          pendingToolCalls: nextRoute === 'dispatchTools' ? toolCalls : [],
          nextRoute,
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          activeExecutionSnapshot,
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

export const plannerLimitFallbackNode = async (
  state: CatalogGraphState
): Promise<Partial<CatalogGraphState>> => {
  return runChainSpan(
    'catalog_agent.planner_limit_fallback',
    async () => {
      const runId = getCatalogAgentRuntimeRunId();
      const activePlan = runId ? getPlanningRuntime().getActivePlan(runId) : null;
      const activeExecutionSnapshot = state.activeExecutionSnapshot;

      try {
        assertExecutionSnapshotInvariant(activePlan, activeExecutionSnapshot);

        const systemMessage = buildCatalogSystemMessage();
        const runnableModel = buildCatalogRunnableModel(activePlan);
        const runtimeContextMessages = activeExecutionSnapshot
          ? [buildExecutionSnapshotRuntimeContextMessage(activeExecutionSnapshot)]
          : [];
        const stopMessage = new SystemMessage(PLANNER_LIMIT_MESSAGE);
        const llmMessages = [systemMessage, ...runtimeContextMessages, ...state.messages, stopMessage];
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
          messages: [response],
          activeExecutionSnapshot,
          pendingToolCalls: [],
          nextRoute: 'finalize' as CatalogPlannerRoute,
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          activeExecutionSnapshot,
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
