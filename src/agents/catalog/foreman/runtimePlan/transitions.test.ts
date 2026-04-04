import { describe, expect, test } from 'bun:test';
import { type RuntimePlan } from '../../../../runtime/planning/types';
import { type WorkerRun } from '../../contracts/workerRun';
import {
  buildRuntimePlanUpdateAfterWorkerRun,
  prepareInProgressPlanTaskExecution,
} from './transitions';

function buildActivePlan(): RuntimePlan {
  return {
    runId: 'run-1',
    chatId: 101,
    status: 'active',
    planContext: {
      goal: 'Обновить карточку товара',
      facts: ['channel=telegram'],
      constraints: ['Только через воркеров'],
    },
    tasks: [
      {
        taskId: 'task-1',
        title: 'Найти товар',
        owner: 'product-worker',
        status: 'in_progress',
        execution: {
          objective: 'Найти товар по SKU',
          facts: ['sku=IP-17'],
          constraints: ['read-only'],
          expectedOutput: 'status, data, missingData',
          contextNotes: 'Сначала нужен lookup',
        },
      },
      {
        taskId: 'task-2',
        title: 'Проверить вариации',
        owner: 'variation-worker',
        status: 'pending',
        execution: {
          objective: 'Проверить вариации',
          facts: ['product_id=101'],
          constraints: ['read-only'],
          expectedOutput: 'status, data',
        },
      },
    ],
    nextStepArtifacts: [{ product_id: 101 }],
  };
}

describe('runtimePlan transitions', () => {
  test('prepareInProgressPlanTaskExecution builds a pure worker handoff envelope from the active plan', () => {
    const activePlan = buildActivePlan();

    const prepared = prepareInProgressPlanTaskExecution(activePlan);

    expect(prepared).toEqual({
      activePlan,
      activeTask: {
        ...activePlan.tasks[0],
        execution: activePlan.tasks[0]?.execution!,
      },
      requestEnvelope: {
        planContext: {
          goal: 'Обновить карточку товара',
          facts: ['channel=telegram'],
          constraints: ['Только через воркеров'],
        },
        taskInput: {
          objective: 'Найти товар по SKU',
          facts: ['sku=IP-17'],
          constraints: ['read-only'],
          expectedOutput: 'status, data, missingData',
          contextNotes: 'Сначала нужен lookup',
        },
        upstreamArtifacts: [{ product_id: 101 }],
      },
    });
  });

  test('prepareInProgressPlanTaskExecution returns null when the in-progress task has no execution contract', () => {
    const activePlan = buildActivePlan();
    activePlan.tasks[0] = {
      taskId: 'task-1',
      title: 'Найти товар',
      owner: 'product-worker',
      status: 'in_progress',
    };

    expect(prepareInProgressPlanTaskExecution(activePlan)).toBeNull();
  });

  test('buildRuntimePlanUpdateAfterWorkerRun marks the completed task and carries forward worker artifacts', () => {
    const activePlan = buildActivePlan();
    const run: WorkerRun = {
      agent: 'product-worker',
      status: 'completed',
      task: 'Найти товар по SKU',
      result: {
        status: 'completed',
        data: ['product_id=101'],
        missingData: [],
        note: null,
        artifacts: [{ product_id: 101, sku: 'IP-17' }],
        summary: 'Товар найден.',
      },
    };

    const update = buildRuntimePlanUpdateAfterWorkerRun({
      activePlan,
      completedTaskId: 'task-1',
      run,
    });

    expect(update).toEqual({
      tasks: [
        {
          ...activePlan.tasks[0],
          status: 'completed',
        },
        activePlan.tasks[1],
      ],
      nextStepArtifacts: [{ product_id: 101, sku: 'IP-17' }],
    });
  });

  test('buildRuntimePlanUpdateAfterWorkerRun fails the task and clears artifacts for non-completed worker runs', () => {
    const activePlan = buildActivePlan();
    const run: WorkerRun = {
      agent: 'product-worker',
      status: 'invalid',
      task: 'Найти товар по SKU',
      errorSummary: 'Отсутствуют обязательные аргументы handoff.',
    };

    const update = buildRuntimePlanUpdateAfterWorkerRun({
      activePlan,
      completedTaskId: 'task-1',
      run,
    });

    expect(update).toEqual({
      tasks: [
        {
          ...activePlan.tasks[0],
          status: 'failed',
        },
        activePlan.tasks[1],
      ],
      nextStepArtifacts: undefined,
    });
  });
});
