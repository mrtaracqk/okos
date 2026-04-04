import { SystemMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { type RuntimePlan } from '../../../runtime/planning/types';
import { toJsonSafeValue } from '../../shared/jsonSafe';
import { type WorkerRun } from '../contracts/workerRun';

export const CATALOG_EXECUTION_PROTOCOL = 'catalog_execution_v2';

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
  protocol: typeof CATALOG_EXECUTION_PROTOCOL;
  phase: ExecutionResultPhase;
  executionSessionId: string;
  revision: number;
  plan_event: ExecutionPlanEvent;
  plan: {
    status: 'active' | 'completed' | 'failed';
    tasks: Array<{
      taskId: string;
      title: string;
      owner: string;
      status: string;
    }>;
  };
  completed_task: {
    taskId: string;
    owner: string;
    status: WorkerRun['status'];
  };
  worker_result_raw: WorkerRun['result'] | null;
  protocol_error?: WorkerRun['protocolError'];
  next_action: {
    tool: ExecutionResultNextTool;
    reason_code: ExecutionResultReasonCode;
    instruction: string;
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

function getNextAction(run: WorkerRun, plan: RuntimePlan): CatalogExecutionResult['next_action'] {
  const nextPendingTask = plan.tasks.find((task) => task.status === 'pending');
  if (!nextPendingTask) {
    return {
      tool: 'finish_execution_plan',
      reason_code: 'plan_has_no_pending_steps',
      instruction: 'Call finish_execution_plan unless you intentionally replace the plan.',
    };
  }

  if (run.result?.blocker) {
    return {
      tool: 'new_execution_plan',
      reason_code: 'worker_blocker_requires_plan_rebuild',
      instruction: 'Do not call approve_step. Replace the plan before the next worker handoff.',
    };
  }

  if (run.status === 'completed') {
    return {
      tool: 'approve_step',
      reason_code: 'ready_for_next_pending_step',
      instruction: 'Call approve_step next.',
    };
  }

  return {
    tool: 'new_execution_plan',
    reason_code: 'failed_run_requires_plan_rebuild',
    instruction: 'Do not call approve_step. Rebuild the plan or finish the execution.',
  };
}

export function createExecutionSessionId() {
  return `exec_${randomUUID()}`;
}

export function buildExecutionResult(params: {
  phase: ExecutionResultPhase;
  executionSessionId: string;
  revision: number;
  planEvent: ExecutionPlanEvent;
  plan: RuntimePlan;
  run: WorkerRun;
  completedTaskId: string;
}): CatalogExecutionResult {
  const completedTask = params.plan.tasks.find((task) => task.taskId === params.completedTaskId);

  return {
    protocol: CATALOG_EXECUTION_PROTOCOL,
    phase: params.phase,
    executionSessionId: params.executionSessionId,
    revision: params.revision,
    plan_event: params.planEvent,
    plan: {
      status: getPlanStatus(params.plan),
      tasks: params.plan.tasks.map((task) => ({
        taskId: task.taskId,
        title: task.title,
        owner: task.owner,
        status: task.status,
      })),
    },
    completed_task: {
      taskId: params.completedTaskId,
      owner: completedTask?.owner ?? params.run.agent,
      status: params.run.status,
    },
    worker_result_raw: params.run.result ?? null,
    ...(params.run.protocolError ? { protocol_error: params.run.protocolError } : {}),
    next_action: getNextAction(params.run, params.plan),
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
      'Choose the next tool from `next_action.tool` and the active runtime plan only.',
      '```json',
      serializeExecutionResult(result),
      '```',
    ].join('\n')
  );
}
