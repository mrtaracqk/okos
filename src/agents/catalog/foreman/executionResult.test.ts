import { describe, expect, test } from 'bun:test';
import { buildExecutionResult, serializeExecutionResult } from './executionResult';

describe('executionResult', () => {
  test('prefers approve_step after a completed run when pending work remains', () => {
    const result = buildExecutionResult({
      phase: 'new_execution_plan',
      executionSessionId: 'exec-1',
      revision: 1,
      planEvent: 'created',
      completedTaskId: 'task-1',
      run: {
        agent: 'product-worker',
        task: 'Найти товар',
        status: 'completed',
        result: {
          status: 'completed',
          data: ['product_id=101'],
          missingData: [],
          note: null,
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

    expect(result.next_action.tool).toBe('approve_step');
    expect(result.next_action.reason_code).toBe('ready_for_next_pending_step');
    expect(result.worker_result_raw).toEqual({
      status: 'completed',
      data: ['product_id=101'],
      missingData: [],
      note: null,
      artifacts: [{ product_id: 101 }],
      summary: 'Товар найден.',
    });
    expect(serializeExecutionResult(result)).toContain('"protocol": "catalog_execution_v2"');
  });

  test('requires new_execution_plan after blocker or failed run while pending work remains', () => {
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-2',
      revision: 2,
      planEvent: 'advanced',
      completedTaskId: 'task-2',
      run: {
        agent: 'variation-worker',
        task: 'Проверить вариации',
        status: 'failed',
        result: {
          status: 'failed',
          data: [],
          missingData: ['variation_id'],
          note: null,
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

    expect(result.plan.status).toBe('failed');
    expect(result.next_action.tool).toBe('new_execution_plan');
    expect(result.next_action.reason_code).toBe('worker_blocker_requires_plan_rebuild');
  });

  test('returns a protocol error result when worker report is missing', () => {
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-3',
      revision: 3,
      planEvent: 'advanced',
      completedTaskId: 'task-2',
      run: {
        agent: 'variation-worker',
        task: 'Проверить вариации',
        status: 'failed',
        protocolError: {
          code: 'missing_report_worker_result',
          message: 'worker did not send report_worker_result',
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
        ],
      },
    });

    expect(result.worker_result_raw).toBeNull();
    expect(result.protocol_error).toEqual({
      code: 'missing_report_worker_result',
      message: 'worker did not send report_worker_result',
    });
    expect(result.next_action.tool).toBe('finish_execution_plan');
    expect(result.next_action.reason_code).toBe('plan_has_no_pending_steps');
  });
});
