import {
  buildTraceAttributes,
  formatTraceValue,
  runToolSpan,
} from '../../../../../observability/traceContext';
import {
  getPlanningRuntime,
  getPlanningRunContext,
} from '../../../../../runtime/planning';
import { type WorkerRun } from '../../../contracts/workerRun';
import { createExecutionSessionId } from '../../executionSnapshot';
import { tasksToRuntimePlanTasks } from '../../runtimePlan/runtimePlanMapper';
import { getCatalogAgentRuntimeRunId } from '../../runtimePlan/runtimePlanService';
import { newExecutionPlanInputSchema } from '../definitions/executionPlanTools';
import {
  buildExecutionToolResultAttributes,
  buildExecutionToolStatusMessage,
  getToolMessageText,
  PLANNING_RUNTIME_UNAVAILABLE_MESSAGE,
  toolReply,
} from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionContext, type CatalogToolExecutionResult } from '../types';
import { executePreparedPlanTask } from './executionShared';

export async function handleNewExecutionPlanToolCall(
  toolCall: CatalogToolCall,
  workerRuns: WorkerRun[],
  _executionContext: CatalogToolExecutionContext
): Promise<CatalogToolExecutionResult> {
  const parsedArgs = newExecutionPlanInputSchema.safeParse(toolCall.args ?? {});

  return runToolSpan(
    'catalog_agent.new_execution_plan',
    async () => {
      if (!parsedArgs.success) {
        return {
          toolMessage: toolReply(
            toolCall,
            `Сбой new_execution_plan: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`
          ),
        };
      }

      const runContext = getPlanningRunContext();
      const planningRuntime = getPlanningRuntime();
      const runId = getCatalogAgentRuntimeRunId();

      if (!runContext || !runId) {
        return {
          toolMessage: toolReply(toolCall, PLANNING_RUNTIME_UNAVAILABLE_MESSAGE),
        };
      }

      try {
        const executionSessionId = createExecutionSessionId();
        const runtimeTasks = tasksToRuntimePlanTasks(parsedArgs.data.tasks);
        const existingPlan = planningRuntime.getActivePlan(runId);
        if (existingPlan) {
          await planningRuntime.updatePlan({
            runId,
            planContext: parsedArgs.data.planContext,
            tasks: runtimeTasks,
            nextStepArtifacts: undefined,
          });
        } else {
          await planningRuntime.createPlan({
            runId,
            chatId: runContext.chatId,
            planContext: parsedArgs.data.planContext,
            tasks: runtimeTasks,
            nextStepArtifacts: undefined,
          });
        }

        return executePreparedPlanTask({
          runId,
          workerRuns,
          toolCall,
          phase: 'new_execution_plan',
          executionSessionId,
          revision: 1,
        });
      } catch (error) {
        return {
          toolMessage: toolReply(
            toolCall,
            error instanceof Error ? error.message : 'Ошибка new_execution_plan.'
          ),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.plan_task_count': parsedArgs.success ? parsedArgs.data.tasks.length : undefined,
        'catalog.plan_task_ids': parsedArgs.success
          ? formatTraceValue(parsedArgs.data.tasks.map((task) => task.taskId).join(', '), 400)
          : '(invalid)',
      }),
      mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
      statusMessage: ({ toolMessage }) => buildExecutionToolStatusMessage('new_execution_plan', getToolMessageText(toolMessage)),
    }
  );
}
