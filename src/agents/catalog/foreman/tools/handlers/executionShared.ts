import { type WorkerRun } from '../../../contracts/workerRun';
import {
  buildExecutionResult,
  buildExecutionResultAdditionalKwargs,
  serializeExecutionResult,
  type ExecutionPlanEvent,
} from '../../executionResult';
import {
  runInProgressPlanTaskAndSyncRuntime,
  type PlannerExecutionToolPhase,
} from '../../runtimePlan/runtimePlanService';
import { type CatalogPlanningDeps } from '../../runtimePlan/planningDeps';
import { toolReplyWithMetadata } from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionResult } from '../types';

export async function executePreparedPlanTask(params: {
  planningDeps: Pick<CatalogPlanningDeps, 'planningRuntime'>;
  runId: string;
  workerRuns: WorkerRun[];
  toolCall: CatalogToolCall;
  phase: PlannerExecutionToolPhase;
  planEvent: ExecutionPlanEvent;
  executionSessionId: string;
  revision: number;
}): Promise<CatalogToolExecutionResult> {
  const exec = await runInProgressPlanTaskAndSyncRuntime({
    planningDeps: params.planningDeps,
    runId: params.runId,
    workerRuns: params.workerRuns,
    replyToToolCall: params.toolCall,
    phase: params.phase,
  });
  if (!exec.ok) {
    return exec.run ? { run: exec.run, toolMessage: exec.toolMessage } : { toolMessage: exec.toolMessage };
  }

  const { run, planAfterWorker, completedTaskId } = exec;
  const executionResult = buildExecutionResult({
    phase: params.phase,
    planEvent: params.planEvent,
    executionSessionId: params.executionSessionId,
    revision: params.revision,
    completedTaskId,
    plan: planAfterWorker,
    run,
  });

  return {
    run,
    toolMessage: toolReplyWithMetadata(
      params.toolCall,
      serializeExecutionResult(executionResult),
      buildExecutionResultAdditionalKwargs(executionResult)
    ),
    executionResult,
  };
}
