import { AIMessage } from '@langchain/core/messages';
import {
  buildTraceAttributes,
  runAgentSpan,
  summarizeToolCallNames,
} from '../../../../observability/traceContext';
import { getPlanningRuntime } from '../../../../runtime/planning';
import { getCatalogAgentRuntimeRunId } from '../runtimePlan/runtimePlanService';
import { sequencedCatalogForemanToolNames } from '../tools/availability';
import { type CatalogToolCompletion, executeCatalogToolCall } from '../tools/dispatcher';
import { ignoredToolCallReply } from '../tools/protocol';
import { assertExecutionSnapshotInvariant, buildFailureState } from './nodeShared';
import { type CatalogGraphState } from './state';

export const dispatchToolsNode = async (
  state: CatalogGraphState
): Promise<Partial<CatalogGraphState>> => {
  return runAgentSpan(
    'catalog_agent.dispatch_tools',
    async () => {
      const workerRuns = [...state.workerRuns];
      const messages = [];
      let completion: CatalogToolCompletion | null = null;
      const runId = getCatalogAgentRuntimeRunId();
      const activePlan = runId ? getPlanningRuntime().getActivePlan(runId) : null;
      let activeExecutionSnapshot = state.activeExecutionSnapshot;
      const hasSequencedToolCall = state.pendingToolCalls.some((t) => sequencedCatalogForemanToolNames.has(t.name ?? ''));
      const gateProtocolMode = Boolean(activePlan) || hasSequencedToolCall;

      try {
        assertExecutionSnapshotInvariant(activePlan, activeExecutionSnapshot);

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
            messages.push(ignoredToolCallReply({ id: toolCallId, name: toolCall.name }));
            continue;
          }

          const {
            run,
            toolMessage,
            completion: toolCompletion,
            executionSnapshot,
            clearExecutionSnapshot,
          } = await executeCatalogToolCall(toolCall, workerRuns, {
            activeExecutionSnapshot,
          });
          if (run) {
            workerRuns.push(run);
          }
          messages.push(toolMessage);
          if (clearExecutionSnapshot) {
            activeExecutionSnapshot = null;
          } else if (executionSnapshot) {
            activeExecutionSnapshot = executionSnapshot;
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
          activeExecutionSnapshot,
          pendingToolCalls: [],
          nextRoute: completion ? 'finalize' : 'planner',
          finalizeOutcome: completion?.finalizeOutcome ?? null,
          fatalErrorMessage: null,
        };
      } catch (error) {
        return {
          messages,
          workerRuns,
          activeExecutionSnapshot,
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
