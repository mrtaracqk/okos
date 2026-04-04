import { type RuntimePlan, type RuntimePlanTask } from '../../../../runtime/planning/types';

export function getInProgressExecutableTask(activePlan: RuntimePlan | null): RuntimePlanTask | null {
  const task = activePlan?.tasks.find((candidate) => candidate.status === 'in_progress');
  if (!task?.execution) {
    return null;
  }

  return task;
}

export function getNextPendingTask(activePlan: RuntimePlan | null): RuntimePlanTask | null {
  return activePlan?.tasks.find((task) => task.status === 'pending') ?? null;
}

export function getNextApprovableTask(activePlan: RuntimePlan | null): RuntimePlanTask | null {
  if (!activePlan) {
    return null;
  }

  const nextPendingTaskIndex = activePlan.tasks.findIndex((task) => task.status === 'pending');
  if (nextPendingTaskIndex <= 0) {
    return null;
  }

  return activePlan.tasks[nextPendingTaskIndex - 1]?.status === 'completed'
    ? activePlan.tasks[nextPendingTaskIndex]
    : null;
}
