import { SystemMessage, ToolMessage } from '@langchain/core/messages';
import { randomUUID } from 'node:crypto';
import { type RuntimePlan } from '../../../runtime/planning/types';
import { type WorkerResultBlocker } from '../contracts/workerResult';
import { type WorkerRun } from '../contracts/workerRun';
import { toJsonSafeValue } from '../../shared/jsonSafe';

export const EXECUTION_SNAPSHOT_REASON_CODES = [
  'ready_for_next_pending_step',
  'worker_blocker_requires_plan_rebuild',
  'failed_run_requires_plan_rebuild',
  'plan_has_no_pending_steps',
] as const;

export type ExecutionSnapshotReasonCode = (typeof EXECUTION_SNAPSHOT_REASON_CODES)[number];
export type ExecutionSnapshotNextAction = 'approve_step' | 'new_execution_plan' | 'finish_execution_plan';

export type ExecutionSnapshot = {
  executionSessionId: string;
  revision: number;
  lastTool: 'new_execution_plan' | 'approve_step';
  planStatus: 'active' | 'completed' | 'failed';
  steps: Array<{
    taskId: string;
    title: string;
    owner: string;
    status: string;
  }>;
  lastCompletedStep?: {
    taskId: string;
    worker: string;
    status: WorkerRun['status'];
    summary: string | null;
    blocker: WorkerResultBlocker | null;
    missingInputsCount: number;
    artifactsCount: number;
  };
  nextAction: ExecutionSnapshotNextAction;
  nextActionReason: ExecutionSnapshotReasonCode;
  nextPendingStep?: {
    taskId: string;
    title: string;
    owner: string;
  };
  upstreamArtifactsCount: number;
};

function getPlanStatus(plan: RuntimePlan): ExecutionSnapshot['planStatus'] {
  if (plan.tasks.some((task) => task.status === 'failed')) {
    return 'failed';
  }

  if (plan.tasks.every((task) => task.status === 'completed')) {
    return 'completed';
  }

  return 'active';
}

function getNextAction(run: WorkerRun, plan: RuntimePlan): {
  nextAction: ExecutionSnapshotNextAction;
  nextActionReason: ExecutionSnapshotReasonCode;
} {
  const nextPendingTask = plan.tasks.find((task) => task.status === 'pending');
  if (!nextPendingTask) {
    return {
      nextAction: 'finish_execution_plan',
      nextActionReason: 'plan_has_no_pending_steps',
    };
  }

  if (run.result?.blocker) {
    return {
      nextAction: 'new_execution_plan',
      nextActionReason: 'worker_blocker_requires_plan_rebuild',
    };
  }

  if (run.status === 'completed') {
    return {
      nextAction: 'approve_step',
      nextActionReason: 'ready_for_next_pending_step',
    };
  }

  return {
    nextAction: 'new_execution_plan',
    nextActionReason: 'failed_run_requires_plan_rebuild',
  };
}

function formatReasonLabel(reason: ExecutionSnapshotReasonCode): string {
  switch (reason) {
    case 'ready_for_next_pending_step':
      return 'runtime подтвердил, что следующий pending шаг можно продолжать без перестройки плана';
    case 'worker_blocker_requires_plan_rebuild':
      return 'текущий шаг упёрся в blocker, хвост нужно перестроить через new_execution_plan';
    case 'failed_run_requires_plan_rebuild':
      return 'последний run завершился failed, для продолжения нужен новый план';
    case 'plan_has_no_pending_steps':
      return 'pending шагов больше нет, execution-часть плана завершена';
  }
}

function renderStepLine(step: ExecutionSnapshot['steps'][number]) {
  return `- ${step.taskId} | ${step.owner} | ${step.status} | ${step.title}`;
}

export function createExecutionSessionId() {
  return `exec_${randomUUID()}`;
}

export function buildExecutionSnapshot(params: {
  executionSessionId: string;
  revision: number;
  plan: RuntimePlan;
  run: WorkerRun;
  completedTaskId: string;
  lastTool: ExecutionSnapshot['lastTool'];
}): ExecutionSnapshot {
  const nextPendingTask = params.plan.tasks.find((task) => task.status === 'pending');
  const { nextAction, nextActionReason } = getNextAction(params.run, params.plan);
  const artifactsCount = Array.isArray(params.run.result?.artifacts) ? params.run.result.artifacts.length : 0;
  const missingInputsCount = Array.isArray(params.run.result?.missingInputs) ? params.run.result.missingInputs.length : 0;

  return {
    executionSessionId: params.executionSessionId,
    revision: params.revision,
    lastTool: params.lastTool,
    planStatus: getPlanStatus(params.plan),
    steps: params.plan.tasks.map((task) => ({
      taskId: task.taskId,
      title: task.title,
      owner: task.owner,
      status: task.status,
    })),
    lastCompletedStep: {
      taskId: params.completedTaskId,
      worker: params.run.agent,
      status: params.run.status,
      summary: params.run.result?.summary ?? null,
      blocker: params.run.result?.blocker ?? null,
      missingInputsCount,
      artifactsCount,
    },
    nextAction,
    nextActionReason,
    ...(nextPendingTask
      ? {
          nextPendingStep: {
            taskId: nextPendingTask.taskId,
            title: nextPendingTask.title,
            owner: nextPendingTask.owner,
          },
        }
      : {}),
    upstreamArtifactsCount: Array.isArray(params.plan.nextStepArtifacts) ? params.plan.nextStepArtifacts.length : 0,
  };
}

export function renderExecutionSnapshot(snapshot: ExecutionSnapshot): string {
  const lines = [
    'Execution Snapshot',
    `Session: ${snapshot.executionSessionId}`,
    `Revision: ${snapshot.revision}`,
    `Last tool: ${snapshot.lastTool}`,
    `Plan status: ${snapshot.planStatus}`,
    'Steps:',
    ...snapshot.steps.map(renderStepLine),
  ];

  if (snapshot.lastCompletedStep) {
    lines.push(
      'Last step:',
      `- ${snapshot.lastCompletedStep.taskId} | ${snapshot.lastCompletedStep.worker} | ${snapshot.lastCompletedStep.status}`,
      `- summary: ${snapshot.lastCompletedStep.summary ?? '(none)'}`,
      `- blocker: ${
        snapshot.lastCompletedStep.blocker
          ? JSON.stringify(toJsonSafeValue(snapshot.lastCompletedStep.blocker))
          : '(none)'
      }`,
      `- missingInputs: ${snapshot.lastCompletedStep.missingInputsCount}`,
      `- artifacts: ${snapshot.lastCompletedStep.artifactsCount}`
    );
  }

  lines.push(
    `Next action: ${snapshot.nextAction}`,
    `Reason: ${formatReasonLabel(snapshot.nextActionReason)}`,
    snapshot.nextPendingStep
      ? `Next pending step: ${snapshot.nextPendingStep.taskId} | ${snapshot.nextPendingStep.owner} | ${snapshot.nextPendingStep.title}`
      : 'Next pending step: (none)',
    `Upstream artifacts: ${snapshot.upstreamArtifactsCount}`
  );

  return lines.join('\n');
}

export function buildExecutionSnapshotRuntimeContextMessage(snapshot: ExecutionSnapshot) {
  return new SystemMessage(
    [
      'Runtime execution snapshot below is authoritative state for execution planning.',
      'Do not wait for WORKER_RESULT or narrative follow-up messages; they do not exist.',
      'Choose the next step from this snapshot and the active runtime plan only.',
      '```json',
      JSON.stringify(toJsonSafeValue(snapshot), null, 2),
      '```',
    ].join('\n')
  );
}

export function buildExecutionSnapshotAdditionalKwargs(snapshot: ExecutionSnapshot) {
  return {
    executionSnapshot: toJsonSafeValue(snapshot),
    executionSessionId: snapshot.executionSessionId,
    revision: snapshot.revision,
    toolResultKind: 'execution_snapshot',
  };
}