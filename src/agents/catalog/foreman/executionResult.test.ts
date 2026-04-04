import { describe, expect, test } from 'bun:test';
import {
  buildExecutionResult,
  buildExecutionResultAdditionalKwargs,
  serializeExecutionResult,
} from './executionResult';

describe('executionResult', () => {
  test('prefers approve_step after a completed run when pending work remains', () => {
    const result = buildExecutionResult({
      phase: 'new_execution_plan',
      executionSessionId: 'exec-1',
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

    expect(result.plan_update).toEqual({
      type: 'created',
      summary: 'План создан.',
    });
    expect(result.completed_step).toEqual({
      taskId: 'task-1',
      title: 'Найти товар',
      owner: 'product-worker',
      status: 'completed',
      summary: 'Шаг "Найти товар" завершён.',
      highlights: ['Товар найден.', 'product_id=101'],
      worker_result: {
        status: 'completed',
        data: ['product_id=101'],
        missingData: [],
        note: null,
        artifacts: [{ product_id: 101 }],
        summary: 'Товар найден.',
      },
    });
    expect(result.next_step.tool).toBe('approve_step');
    expect(result.next_step.reason_code).toBe('ready_for_next_pending_step');
    expect(result.next_step.task).toEqual({
      taskId: 'task-2',
      title: 'Проверить вариации',
      owner: 'variation-worker',
      status: 'pending',
    });
    expect(result.next_step.summary).toBe('Следующий шаг: выполнить "Проверить вариации" через approve_step.');
    expect(result.completed_step.worker_result).toEqual({
      status: 'completed',
      data: ['product_id=101'],
      missingData: [],
      note: null,
      artifacts: [{ product_id: 101 }],
      summary: 'Товар найден.',
    });
    expect(serializeExecutionResult(result)).not.toContain('"protocol"');
    expect(buildExecutionResultAdditionalKwargs(result)).toMatchObject({
      executionSessionId: 'exec-1',
      phase: 'new_execution_plan',
    });
  });

  test('requires new_execution_plan after blocker or failed run while pending work remains', () => {
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-2',
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
    expect(result.plan_update).toBeNull();
    expect(result.completed_step.summary).toBe('Шаг "Проверить вариации" завершился ошибкой.');
    expect(result.completed_step.highlights).toEqual([
      'Нужен другой owner.',
      'Недостающие данные: variation_id',
      'Blocker: wrong_owner -> product-worker: Сначала нужен parent-level update.',
    ]);
    expect(result.next_step.tool).toBe('new_execution_plan');
    expect(result.next_step.reason_code).toBe('worker_blocker_requires_plan_rebuild');
    expect(result.next_step.task).toBeNull();
    expect(result.next_step.summary).toBe('Следующий шаг: пересобрать план через new_execution_plan.');
  });

  test('returns a protocol error result when worker report is missing', () => {
    const result = buildExecutionResult({
      phase: 'approve_step',
      executionSessionId: 'exec-3',
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

    expect(result.plan_update).toBeNull();
    expect(result.completed_step.worker_result).toBeNull();
    expect(result.completed_step.protocol_error).toEqual({
      code: 'missing_report_worker_result',
      message: 'worker did not send report_worker_result',
    });
    expect(result.completed_step.summary).toBe('Шаг "Проверить вариации" завершился с protocol error.');
    expect(result.completed_step.highlights).toEqual(['worker did not send report_worker_result']);
    expect(result.next_step.tool).toBe('finish_execution_plan');
    expect(result.next_step.reason_code).toBe('plan_has_no_pending_steps');
    expect(result.next_step.task).toBeNull();
    expect(result.next_step.summary).toBe('Следующий шаг: завершить выполнение через finish_execution_plan.');
  });
});
