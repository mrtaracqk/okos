import { describe, expect, test } from 'bun:test';
import { buildExecutionSnapshot, renderExecutionSnapshot } from './executionSnapshot';

describe('executionSnapshot', () => {
  test('prefers approve_step after a completed run when pending work remains', () => {
    const snapshot = buildExecutionSnapshot({
      executionSessionId: 'exec-1',
      revision: 1,
      lastTool: 'new_execution_plan',
      completedTaskId: 'task-1',
      run: {
        agent: 'product-worker',
        task: 'Найти товар',
        status: 'completed',
        result: {
          status: 'completed',
          facts: ['product_id=101'],
          missingInputs: [],
          artifacts: [{ product_id: 101 }],
          summary: 'Товар найден.',
        },
      },
      plan: {
        runId: 'run-1',
        chatId: 1,
        status: 'active',
        planContext: { goal: 'Проверить товар', facts: [], constraints: [] },
        tasks: [
          { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
          { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'pending' },
        ],
        nextStepArtifacts: [{ product_id: 101 }],
      },
    });

    expect(snapshot.nextAction).toBe('approve_step');
    expect(snapshot.nextActionReason).toBe('ready_for_next_pending_step');
    expect(snapshot.upstreamArtifactsCount).toBe(1);
    expect(renderExecutionSnapshot(snapshot)).toContain('Execution Snapshot');
  });

  test('requires new_execution_plan after blocker or failed run while pending work remains', () => {
    const snapshot = buildExecutionSnapshot({
      executionSessionId: 'exec-2',
      revision: 2,
      lastTool: 'approve_step',
      completedTaskId: 'task-2',
      run: {
        agent: 'variation-worker',
        task: 'Проверить вариации',
        status: 'failed',
        result: {
          status: 'failed',
          facts: [],
          missingInputs: ['variation_id'],
          blocker: {
            kind: 'wrong_owner',
            owner: 'product-worker',
            reason: 'Сначала нужен parent-level update.',
          },
          summary: 'Нужен другой owner.',
        },
      },
      plan: {
        runId: 'run-1',
        chatId: 1,
        status: 'active',
        planContext: { goal: 'Проверить товар', facts: [], constraints: [] },
        tasks: [
          { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
          { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'failed' },
          { taskId: 'task-3', title: 'Обновить родителя', owner: 'product-worker', status: 'pending' },
        ],
      },
    });

    expect(snapshot.planStatus).toBe('failed');
    expect(snapshot.nextAction).toBe('new_execution_plan');
    expect(snapshot.nextActionReason).toBe('worker_blocker_requires_plan_rebuild');
  });

  test('requires finish_execution_plan when no pending steps remain', () => {
    const snapshot = buildExecutionSnapshot({
      executionSessionId: 'exec-3',
      revision: 3,
      lastTool: 'approve_step',
      completedTaskId: 'task-2',
      run: {
        agent: 'variation-worker',
        task: 'Проверить вариации',
        status: 'completed',
        result: {
          status: 'completed',
          facts: [],
          missingInputs: [],
          summary: 'Готово.',
        },
      },
      plan: {
        runId: 'run-1',
        chatId: 1,
        status: 'active',
        planContext: { goal: 'Проверить товар', facts: [], constraints: [] },
        tasks: [
          { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
          { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'completed' },
        ],
      },
    });

    expect(snapshot.planStatus).toBe('completed');
    expect(snapshot.nextAction).toBe('finish_execution_plan');
    expect(snapshot.nextActionReason).toBe('plan_has_no_pending_steps');
  });
});
