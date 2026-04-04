import {
  buildTraceAttributes,
  runToolSpan,
} from '../../../../../observability/traceContext';
import {
  getPlanningRuntime,
  getPlanningRunContext,
} from '../../../../../runtime/planning';
import { getCatalogAgentRuntimeRunId } from '../../runtimePlan/runtimePlanService';
import { finishExecutionPlanInputSchema } from '../definitions/executionPlanTools';
import {
  buildExecutionToolResultAttributes,
  buildExecutionToolStatusMessage,
  getToolMessageText,
  PLANNING_RUNTIME_UNAVAILABLE_MESSAGE,
  toolReply,
} from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionResult } from '../types';

export async function handleFinishExecutionPlanToolCall(
  toolCall: CatalogToolCall
): Promise<CatalogToolExecutionResult> {
  const parsedArgs = finishExecutionPlanInputSchema.safeParse(toolCall.args ?? {});
  const finishOutcome = parsedArgs.success ? parsedArgs.data.outcome : '(invalid)';

  return runToolSpan(
    'catalog_agent.finish_execution_plan',
    async () => {
      if (!parsedArgs.success) {
        return {
          toolMessage: toolReply(
            toolCall,
            `Сбой finish_execution_plan: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`
          ),
        };
      }

      const planningRuntime = getPlanningRuntime();
      const runId = getCatalogAgentRuntimeRunId();
      if (!getPlanningRunContext() || !runId) {
        return {
          toolMessage: toolReply(toolCall, PLANNING_RUNTIME_UNAVAILABLE_MESSAGE),
        };
      }

      const summary = parsedArgs.data.summary.trim();

      try {
        if (parsedArgs.data.outcome === 'completed') {
          const plan = await planningRuntime.completePlan(runId);
          return {
            toolMessage: toolReply(toolCall, `План завершён со статусом "${plan.status}". Финальный ответ зафиксирован.`),
            completion: {
              summary,
              finalizeOutcome: 'completed',
            },
            clearExecutionSnapshot: true,
          };
        }

        const plan = await planningRuntime.failPlan(runId);
        return {
          toolMessage: toolReply(toolCall, `План переведён в статус "${plan.status}". Финальный ответ зафиксирован.`),
          completion: {
            summary,
            finalizeOutcome: 'failed',
          },
          clearExecutionSnapshot: true,
        };
      } catch (error) {
        return {
          toolMessage: toolReply(
            toolCall,
            error instanceof Error ? error.message : 'Ошибка finish_execution_plan.'
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
        buildExecutionToolStatusMessage('finish_execution_plan', getToolMessageText(toolMessage)),
    }
  );
}
