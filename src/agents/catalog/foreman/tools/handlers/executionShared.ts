import { type WorkerRun } from '../../../contracts/workerRun';
import {
  buildExecutionSnapshot,
  buildExecutionSnapshotAdditionalKwargs,
  renderExecutionSnapshot,
} from '../../executionSnapshot';
import {
  runInProgressPlanTaskAndSyncRuntime,
  type PlannerExecutionToolPhase,
} from '../../runtimePlan/runtimePlanService';
import { toolReplyWithMetadata } from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionResult } from '../types';

export async function executePreparedPlanTask(params: {
  runId: string;
  workerRuns: WorkerRun[];
  toolCall: CatalogToolCall;
  phase: PlannerExecutionToolPhase;
  executionSessionId: string;
  revision: number;
}): Promise<CatalogToolExecutionResult> {
  const exec = await runInProgressPlanTaskAndSyncRuntime({
    runId: params.runId,
    workerRuns: params.workerRuns,
    replyToToolCall: params.toolCall,
    phase: params.phase,
  });
  if (!exec.ok) {
    return exec.run ? { run: exec.run, toolMessage: exec.toolMessage } : { toolMessage: exec.toolMessage };
  }

  const { run, planAfterWorker, completedTaskId } = exec;
  const snapshot = buildExecutionSnapshot({
    executionSessionId: params.executionSessionId,
    revision: params.revision,
    lastTool: params.phase,
    completedTaskId,
    plan: planAfterWorker,
    run,
  });

  return {
    run,
    toolMessage: toolReplyWithMetadata(
      params.toolCall,
      renderExecutionSnapshot(snapshot),
      buildExecutionSnapshotAdditionalKwargs(snapshot)
    ),
    executionSnapshot: snapshot,
  };
}
