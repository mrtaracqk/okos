import {
  buildTraceAttributes,
  runToolSpan,
} from '../../../../../observability/traceContext';
import { type CatalogPlanningDeps } from '../../runtimePlan/planningDeps';
import { getCatalogAgentRuntimeRunId } from '../../runtimePlan/runtimePlanService';
import { finishCatalogTurnInputSchema } from '../definitions/executionPlanTools';
import {
  buildExecutionToolResultAttributes,
  buildExecutionToolStatusMessage,
  getToolMessageText,
  PLANNING_RUNTIME_UNAVAILABLE_MESSAGE,
  toolReply,
} from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionResult } from '../types';

export async function handleFinishCatalogTurnToolCall(
  planningDeps: CatalogPlanningDeps,
  toolCall: CatalogToolCall
): Promise<CatalogToolExecutionResult> {
  const parsedArgs = finishCatalogTurnInputSchema.safeParse(toolCall.args ?? {});
  const finishOutcome = parsedArgs.success ? parsedArgs.data.outcome : '(invalid)';

  return runToolSpan(
    'catalog_agent.finish_catalog_turn',
    async () => {
      if (!parsedArgs.success) {
        return {
          toolMessage: toolReply(
            toolCall,
            `Сбой finish_catalog_turn: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`
          ),
        };
      }

      const planningRuntime = planningDeps.planningRuntime;
      const runId = getCatalogAgentRuntimeRunId(planningDeps);
      if (!planningDeps.resolveRunContext() || !runId) {
        return {
          toolMessage: toolReply(toolCall, PLANNING_RUNTIME_UNAVAILABLE_MESSAGE),
        };
      }

      const summary = parsedArgs.data.summary.trim();
      const activePlan = planningRuntime.getActivePlan(runId);

      try {
        if (!activePlan) {
          const finalizeOutcome = parsedArgs.data.outcome === 'completed' ? 'completed' : 'failed';
          const ack =
            parsedArgs.data.outcome === 'completed'
              ? 'Итог зафиксирован (активного плана не было).'
              : 'Итог зафиксирован как неуспех (активного плана не было).';
          return {
            toolMessage: toolReply(toolCall, ack),
            completion: {
              summary,
              finalizeOutcome,
            },
          };
        }

        if (parsedArgs.data.outcome === 'completed') {
          const plan = await planningRuntime.completePlan(runId);
          return {
            toolMessage: toolReply(toolCall, `План завершён со статусом "${plan.status}". Финальный ответ зафиксирован.`),
            completion: {
              summary,
              finalizeOutcome: 'completed',
            },
            clearExecutionResult: true,
          };
        }

        const plan = await planningRuntime.failPlan(runId);
        return {
          toolMessage: toolReply(toolCall, `План переведён в статус "${plan.status}". Финальный ответ зафиксирован.`),
          completion: {
            summary,
            finalizeOutcome: 'failed',
          },
          clearExecutionResult: true,
        };
      } catch (error) {
        return {
          toolMessage: toolReply(
            toolCall,
            error instanceof Error ? error.message : 'Ошибка finish_catalog_turn.'
          ),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.finish_outcome': finishOutcome,
      }),
      mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
      statusMessage: ({ toolMessage }) =>
        buildExecutionToolStatusMessage('finish_catalog_turn', getToolMessageText(toolMessage)),
    }
  );
}
