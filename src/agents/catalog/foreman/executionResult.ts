import { SystemMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { type RuntimePlan } from '../../../runtime/planning/types';
import { toJsonSafeValue } from '../../shared/jsonSafe';
import { type WorkerRun } from '../contracts/workerRun';

export const EXECUTION_RESULT_REASON_CODES = [
  'ready_for_next_pending_step',
  'worker_blocker_requires_plan_rebuild',
  'failed_run_requires_plan_rebuild',
  'plan_has_no_pending_steps',
] as const;

export type ExecutionResultReasonCode = (typeof EXECUTION_RESULT_REASON_CODES)[number];
export type ExecutionResultNextTool = 'approve_step' | 'new_execution_plan' | 'finish_execution_plan';
export type ExecutionResultPhase = 'new_execution_plan' | 'approve_step';
export type ExecutionPlanEvent = 'created' | 'replaced' | 'advanced';

export type CatalogExecutionResult = {
  phase: ExecutionResultPhase;
  executionSessionId: string;
  plan: {
    status: 'active' | 'completed' | 'failed';
    tasks: Array<{
      taskId: string;
      title: string;
      owner: string;
      status: string;
    }>;
  };
  plan_update: null | {
    type: 'created' | 'replaced';
    summary: string;
  };
  completed_step: {
    taskId: string;
    title: string;
    owner: string;
    status: WorkerRun['status'];
    summary: string;
    highlights: string[];
    worker_result: WorkerRun['result'] | null;
    protocol_error?: WorkerRun['protocolError'];
  };
  next_step: {
    tool: ExecutionResultNextTool;
    reason_code: ExecutionResultReasonCode;
    task: null | {
      taskId: string;
      title: string;
      owner: string;
      status: string;
    };
    summary: string;
  };
};

function getPlanStatus(plan: RuntimePlan): CatalogExecutionResult['plan']['status'] {
  if (plan.tasks.some((task) => task.status === 'failed')) {
    return 'failed';
  }

  if (plan.tasks.every((task) => task.status === 'completed')) {
    return 'completed';
  }

  return 'active';
}

function getCompletedStepSummary(taskTitle: string, run: WorkerRun): string {
  if (run.protocolError && !run.result) {
    return `Шаг "${taskTitle}" завершился с protocol error.`;
  }

  if (run.status === 'failed' || run.status === 'invalid') {
    return `Шаг "${taskTitle}" завершился ошибкой.`;
  }

  return `Шаг "${taskTitle}" завершён.`;
}

function getCompletedStepHighlights(taskTitle: string, run: WorkerRun): string[] {
  const result = run.result;
  if (!result) {
    return run.protocolError ? [run.protocolError.message] : [];
  }

  const highlights: string[] = [];
  const normalizedResultSummary = result.summary?.trim() ?? '';
  const normalizedNote = result.note?.trim() ?? '';

  if (normalizedResultSummary) {
    highlights.push(normalizedResultSummary);
  }

  highlights.push(...result.data);

  if (result.missingData.length > 0) {
    highlights.push(`Недостающие данные: ${result.missingData.join(', ')}`);
  }

  if (result.blocker) {
    highlights.push(`Blocker: ${result.blocker.kind} -> ${result.blocker.owner}: ${result.blocker.reason}`);
  }

  if (normalizedNote && normalizedNote !== normalizedResultSummary) {
    highlights.push(normalizedNote);
  }

  return highlights;
}

function getPlanUpdate(
  phase: ExecutionResultPhase,
  planEvent: ExecutionPlanEvent
): CatalogExecutionResult['plan_update'] {
  if (phase !== 'new_execution_plan') {
    return null;
  }

  if (planEvent === 'created') {
    return { type: 'created', summary: 'План создан.' };
  }

  if (planEvent === 'replaced') {
    return { type: 'replaced', summary: 'План заменён.' };
  }

  return null;
}

function getNextStep(run: WorkerRun, plan: RuntimePlan): CatalogExecutionResult['next_step'] {
  const nextPendingTask = plan.tasks.find((task) => task.status === 'pending');
  if (!nextPendingTask) {
    return {
      tool: 'finish_execution_plan',
      reason_code: 'plan_has_no_pending_steps',
      task: null,
      summary: 'Следующий шаг: завершить выполнение через finish_execution_plan.',
    };
  }

  if (run.result?.blocker) {
    return {
      tool: 'new_execution_plan',
      reason_code: 'worker_blocker_requires_plan_rebuild',
      task: null,
      summary: 'Следующий шаг: пересобрать план через new_execution_plan.',
    };
  }

  if (run.status === 'completed') {
    return {
      tool: 'approve_step',
      reason_code: 'ready_for_next_pending_step',
      task: {
        taskId: nextPendingTask.taskId,
        title: nextPendingTask.title,
        owner: nextPendingTask.owner,
        status: nextPendingTask.status,
      },
      summary: `Следующий шаг: выполнить "${nextPendingTask.title}" через approve_step.`,
    };
  }

  return {
    tool: 'new_execution_plan',
    reason_code: 'failed_run_requires_plan_rebuild',
    task: null,
    summary: 'Следующий шаг: пересобрать план через new_execution_plan.',
  };
}

export function createExecutionSessionId() {
  return `exec_${randomUUID()}`;
}

export function buildExecutionResult(params: {
  phase: ExecutionResultPhase;
  executionSessionId: string;
  planEvent: ExecutionPlanEvent;
  plan: RuntimePlan;
  run: WorkerRun;
  completedTaskId: string;
}): CatalogExecutionResult {
  const completedTask = params.plan.tasks.find((task) => task.taskId === params.completedTaskId);
  const completedTaskTitle = completedTask?.title ?? params.run.task;

  return {
    phase: params.phase,
    executionSessionId: params.executionSessionId,
    plan: {
      status: getPlanStatus(params.plan),
      tasks: params.plan.tasks.map((task) => ({
        taskId: task.taskId,
        title: task.title,
        owner: task.owner,
        status: task.status,
      })),
    },
    plan_update: getPlanUpdate(params.phase, params.planEvent),
    completed_step: {
      taskId: params.completedTaskId,
      title: completedTaskTitle,
      owner: completedTask?.owner ?? params.run.agent,
      status: params.run.status,
      summary: getCompletedStepSummary(completedTaskTitle, params.run),
      highlights: getCompletedStepHighlights(completedTaskTitle, params.run),
      worker_result: params.run.result ?? null,
      ...(params.run.protocolError ? { protocol_error: params.run.protocolError } : {}),
    },
    next_step: getNextStep(params.run, params.plan),
  };
}

export function serializeExecutionResult(result: CatalogExecutionResult) {
  return JSON.stringify(toJsonSafeValue(result), null, 2);
}

export function buildExecutionResultAdditionalKwargs(result: CatalogExecutionResult) {
  return toJsonSafeValue(result) as Record<string, unknown>;
}

export function buildExecutionResultRuntimeContextMessage(result: CatalogExecutionResult) {
  return new SystemMessage(
    [
      'Runtime execution result below is the authoritative execution state.',
      'No WORKER_RESULT or narrative follow-up message will arrive after execution tools.',
      'Use `plan_update` to see whether the plan was created or replaced.',
      'Read `completed_step.highlights` as the result of the just-finished step.',
      'Choose the next tool from `next_step.tool` and `next_step.task` using the active runtime plan only.',
      '```json',
      serializeExecutionResult(result),
      '```',
    ].join('\n')
  );
}
