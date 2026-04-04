import { type RuntimePlan, type RuntimePlanTask, type RuntimePlanUpdateInput } from '../../../../runtime/planning/types';
import { type WorkerTaskEnvelope } from '../../contracts/workerRequest';
import { type WorkerRun } from '../../contracts/workerRun';
import { getInProgressExecutableTask } from './selectors';

type ExecutableRuntimePlanTask = RuntimePlanTask & {
  execution: NonNullable<RuntimePlanTask['execution']>;
};

export type PreparedInProgressPlanTask = {
  activePlan: RuntimePlan;
  activeTask: ExecutableRuntimePlanTask;
  requestEnvelope: WorkerTaskEnvelope;
};

function isExecutableRuntimePlanTask(task: RuntimePlanTask | null): task is ExecutableRuntimePlanTask {
  return task?.execution != null;
}

export function prepareInProgressPlanTaskExecution(activePlan: RuntimePlan | null): PreparedInProgressPlanTask | null {
  const activeTask = getInProgressExecutableTask(activePlan);
  if (!activePlan || !isExecutableRuntimePlanTask(activeTask)) {
    return null;
  }

  return {
    activePlan,
    activeTask,
    requestEnvelope: {
      planContext: activePlan.planContext,
      taskInput: activeTask.execution,
      ...(Array.isArray(activePlan.nextStepArtifacts) && activePlan.nextStepArtifacts.length > 0
        ? { upstreamArtifacts: activePlan.nextStepArtifacts }
        : {}),
    },
  };
}

export function buildRuntimePlanUpdateAfterWorkerRun(params: {
  activePlan: RuntimePlan;
  completedTaskId: string;
  run: WorkerRun;
}): Pick<RuntimePlanUpdateInput, 'tasks' | 'nextStepArtifacts'> {
  const completedTaskStatus: RuntimePlanTask['status'] = params.run.status === 'completed' ? 'completed' : 'failed';
  const tasks = params.activePlan.tasks.map((task) =>
    task.taskId === params.completedTaskId ? { ...task, status: completedTaskStatus } : task
  );

  const nextStepArtifacts =
    params.run.status === 'completed' && Array.isArray(params.run.result?.artifacts) && params.run.result.artifacts.length > 0
      ? [...params.run.result.artifacts]
      : undefined;

  return {
    tasks,
    nextStepArtifacts,
  };
}
