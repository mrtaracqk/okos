import { AIMessage } from '@langchain/core/messages';
import {
  buildTraceAttributes,
  runAgentSpan,
  summarizeToolCallNames,
} from '../../../../observability/traceContext';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';
import { getCatalogAgentRuntimeRunId } from '../runtimePlan/runtimePlanService';
import { sequencedCatalogForemanToolNames } from '../tools/availability';
import { type CatalogToolCompletion, executeCatalogToolCall } from '../tools/dispatcher';
import { ignoredToolCallReply } from '../tools/protocol';
import { assertExecutionResultInvariant, buildFailureState } from './nodeShared';
import { type CatalogGraphState } from './state';

export function createDispatchToolsNode(planningDeps: CatalogPlanningDeps) {
  return async (state: CatalogGraphState): Promise<Partial<CatalogGraphState>> => {
    return runAgentSpan(
      'catalog_agent.dispatch_tools',
      async () => {
        const workerRuns = [...state.workerRuns];
        const messages = [];
        let completion: CatalogToolCompletion | null = null;
        const runId = getCatalogAgentRuntimeRunId(planningDeps);
        const activePlan = runId ? planningDeps.planningRuntime.getActivePlan(runId) : null;
        let activeExecutionResult = state.activeExecutionResult;
        const hasSequencedToolCall = state.pendingToolCalls.some((t) => sequencedCatalogForemanToolNames.has(t.name ?? ''));
        const gateProtocolMode = Boolean(activePlan) || hasSequencedToolCall;

        try {
          assertExecutionResultInvariant(activePlan, activeExecutionResult);

          for (let idx = 0; idx < state.pendingToolCalls.length; idx++) {
            const toolCall = state.pendingToolCalls[idx];

            if (idx > 0 && gateProtocolMode) {
              const toolCallId =
                typeof toolCall.id === 'string' && toolCall.id.length > 0
                  ? toolCall.id
                  : typeof toolCall.name === 'string'
                    ? toolCall.name
                    : '';
              messages.push(ignoredToolCallReply({ id: toolCallId, name: toolCall.name }));
              continue;
            }

            const {
              run,
              toolMessage,
              completion: toolCompletion,
              executionResult,
              clearExecutionResult,
            } = await executeCatalogToolCall(planningDeps, toolCall, workerRuns, {
              activeExecutionResult,
            });
            if (run) {
              workerRuns.push(run);
            }
            messages.push(toolMessage);
            if (clearExecutionResult) {
              activeExecutionResult = null;
            } else if (executionResult) {
              activeExecutionResult = executionResult;
            }
            if (toolCompletion) {
              completion = toolCompletion;
            }
          }

          if (completion) {
            messages.push(new AIMessage(completion.summary));
          }

          return {
            messages,
            workerRuns,
            activeExecutionResult,
            pendingToolCalls: [],
            nextRoute: completion ? 'finalize' : 'planner',
            finalizeOutcome: completion?.finalizeOutcome ?? null,
            fatalErrorMessage: null,
          };
        } catch (error) {
          return {
            messages,
            workerRuns,
            activeExecutionResult,
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
}
