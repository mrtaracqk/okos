import { describe, expect, test } from 'bun:test';
import { type RuntimePlan, type RuntimePlanTask } from '../../../runtime/planning/types';
import {
  buildExecutionResult,
  buildExecutionResultAdditionalKwargs,
  serializeExecutionResult,
} from './executionResult';

const basePlanContext: RuntimePlan['planContext'] = {
  goal: 'Проверить товар',
  facts: [],
  constraints: [],
};

function createPlan(tasks: RuntimePlanTask[]): RuntimePlan {
  return {
    runId: 'run-1',
    chatId: 1,
    status: 'active',
    planContext: basePlanContext,
    tasks,
  };
}

describe('execution result invariants', () => {
  test('stores worker_result verbatim without derived narrative sidecar fields', () => {
    const workerResult = {
      status: 'failed' as const,
      data: ['checked parent product=101'],
      missingData: ['variation_id'],
      note: 'Нужен parent-level update.',
      blocker: {
        kind: 'wrong_owner' as const,
        owner: 'product-worker' as const,
        reason: 'Сначала нужен parent-level update.',
      },
      summary: 'Нужен другой owner.',
    };
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-1',
      planEvent: 'advanced',
      completedTaskId: 'task-2',
      run: {
        agent: 'variation-worker',
        task: 'Проверить вариации',
        status: 'failed',
        result: workerResult,
      },
      plan: createPlan([
        { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
        { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'failed' },
        { taskId: 'task-3', title: 'Обновить родителя', owner: 'product-worker', status: 'pending' },
      ]),
    });

    expect(result.completed_step.worker_result).toEqual(workerResult);
    expect(result.completed_step).not.toHaveProperty('highlights');
    expect(result.completed_step.summary).toBe('Шаг "Проверить вариации" завершился ошибкой.');
  });

  test('selects approve_step from runtime state when pending work remains after a completed run', () => {
    const result = buildExecutionResult({
      phase: 'new_execution_plan',
      executionSessionId: 'exec-2',
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
        ...createPlan([
          { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
          { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'pending' },
        ]),
        nextStepArtifacts: [{ product_id: 101 }],
      },
    });

    expect(result.plan_update).toEqual({
      type: 'created',
      summary: 'План создан.',
    });
    expect(result.next_step).toEqual({
      tool: 'approve_step',
      reason_code: 'ready_for_next_pending_step',
      task: {
        taskId: 'task-2',
        title: 'Проверить вариации',
        owner: 'variation-worker',
        status: 'pending',
      },
      summary: 'Следующий шаг: выполнить "Проверить вариации" через approve_step.',
    });
    expect(serializeExecutionResult(result)).not.toContain('"protocol"');
    expect(buildExecutionResultAdditionalKwargs(result)).toMatchObject({
      executionSessionId: 'exec-2',
      phase: 'new_execution_plan',
    });
  });

  test('requires new_execution_plan when a worker blocker changes the owner path', () => {
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-3',
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
      plan: createPlan([
        { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
        { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'failed' },
        { taskId: 'task-3', title: 'Обновить родителя', owner: 'product-worker', status: 'pending' },
      ]),
    });

    expect(result.plan.status).toBe('failed');
    expect(result.plan_update).toBeNull();
    expect(result.next_step).toEqual({
      tool: 'new_execution_plan',
      reason_code: 'worker_blocker_requires_plan_rebuild',
      task: null,
      summary: 'Следующий шаг: пересобрать план через new_execution_plan.',
    });
  });

  test('keeps protocol errors explicit instead of fabricating a worker_result', () => {
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-5',
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
      plan: createPlan([
        { taskId: 'task-1', title: 'Найти товар', owner: 'product-worker', status: 'completed' },
        { taskId: 'task-2', title: 'Проверить вариации', owner: 'variation-worker', status: 'failed' },
      ]),
    });

    expect(result.plan_update).toBeNull();
    expect(result.completed_step.worker_result).toBeNull();
    expect(result.completed_step.protocol_error).toEqual({
      code: 'missing_report_worker_result',
      message: 'worker did not send report_worker_result',
    });
    expect(result.completed_step).not.toHaveProperty('highlights');
    expect(result.next_step.tool).toBe('finish_catalog_turn');
  });
});
