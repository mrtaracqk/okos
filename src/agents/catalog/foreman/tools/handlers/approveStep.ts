import { runToolSpan } from '../../../../../observability/traceContext';
import { type WorkerRun } from '../../../contracts/workerRun';
import { type CatalogPlanningDeps } from '../../runtimePlan/planningDeps';
import { promoteNextPendingTaskToInProgress } from '../../runtimePlan/runtimePlanMapper';
import { getNextApprovableTask, getNextPendingTask } from '../../runtimePlan/selectors';
import { getCatalogAgentRuntimeRunId } from '../../runtimePlan/runtimePlanService';
import { approveStepInputSchema } from '../definitions/executionPlanTools';
import {
  ACTIVE_PLAN_EXECUTION_RESULT_PROTOCOL_ERROR,
  buildExecutionToolResultAttributes,
  buildExecutionToolStatusMessage,
  getToolMessageText,
  PLANNING_RUNTIME_UNAVAILABLE_MESSAGE,
  toolReply,
} from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionContext, type CatalogToolExecutionResult } from '../types';
import { executePreparedPlanTask } from './executionShared';

export async function handleApproveStepToolCall(
  planningDeps: CatalogPlanningDeps,
  toolCall: CatalogToolCall,
  workerRuns: WorkerRun[],
  executionContext: CatalogToolExecutionContext
): Promise<CatalogToolExecutionResult> {
  const parsedArgs = approveStepInputSchema.safeParse(toolCall.args ?? {});

  return runToolSpan(
    'catalog_agent.approve_step',
    async () => {
      if (!parsedArgs.success) {
        return {
          toolMessage: toolReply(
            toolCall,
            `Сбой approve_step: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`
          ),
        };
      }

      const planningRuntime = planningDeps.planningRuntime;
      const runId = getCatalogAgentRuntimeRunId(planningDeps);
      if (!runId) {
        return {
          toolMessage: toolReply(toolCall, PLANNING_RUNTIME_UNAVAILABLE_MESSAGE),
        };
      }

      try {
        const activePlan = planningRuntime.getActivePlan(runId);
        if (!activePlan) {
          throw new Error('approve_step стал недоступен до исполнения: активный план не найден.');
        }
        if (!executionContext.activeExecutionResult) {
          throw new Error(ACTIVE_PLAN_EXECUTION_RESULT_PROTOCOL_ERROR);
        }

        const nextPendingTask = getNextPendingTask(activePlan);
        if (!nextPendingTask) {
          throw new Error('approve_step стал недоступен до исполнения: в активном плане больше нет pending задач.');
        }

        const nextApprovableTask = getNextApprovableTask(activePlan);
        if (!nextApprovableTask || nextApprovableTask.taskId !== nextPendingTask.taskId) {
          throw new Error('approve_step стал недоступен до исполнения: planner выбрал tool вне допустимого состояния плана.');
        }

        await planningRuntime.updatePlan({
          runId,
          tasks: promoteNextPendingTaskToInProgress(activePlan),
        });

        return executePreparedPlanTask({
          planningDeps,
          runId,
          workerRuns,
          toolCall,
          phase: 'approve_step',
          planEvent: 'advanced',
          executionSessionId: executionContext.activeExecutionResult.executionSessionId,
          revision: executionContext.activeExecutionResult.revision + 1,
        });
      } catch (error) {
        return {
          toolMessage: toolReply(toolCall, error instanceof Error ? error.message : 'Ошибка approve_step.'),
        };
      }
    },
    {
      mapResultAttributes: (result) => buildExecutionToolResultAttributes(result),
      statusMessage: ({ toolMessage }) => buildExecutionToolStatusMessage('approve_step', getToolMessageText(toolMessage)),
    }
  );
}
