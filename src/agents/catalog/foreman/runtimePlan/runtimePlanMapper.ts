import { type ExecutableTask, type RuntimePlan, type RuntimePlanTask } from '../../../../runtime/planning/types';

export function tasksToRuntimePlanTasks(tasks: ExecutableTask[]): RuntimePlanTask[] {
  return tasks.map((task, index) => ({
    taskId: task.taskId,
    title: task.task,
    owner: task.responsible,
    status: index === 0 ? 'in_progress' : 'pending',
    notes: task.inputData.contextNotes,
    execution: {
      objective: task.task,
      facts: task.inputData.facts,
      constraints: task.inputData.constraints,
      expectedOutput: task.responseStructure,
      contextNotes: task.inputData.contextNotes,
    },
  }));
}

export function promoteNextPendingTaskToInProgress(activePlan: RuntimePlan): RuntimePlanTask[] {
  const nextPendingTask = activePlan.tasks.find((task) => task.status === 'pending');
  if (!nextPendingTask) {
    return activePlan.tasks;
  }

  return activePlan.tasks.map((task) =>
    task.taskId === nextPendingTask.taskId ? { ...task, status: 'in_progress' as const } : task
  );
}
