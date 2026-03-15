import { describe, expect, it } from 'bun:test';
import { PlanningCore, PlanningRuntimeError, isPlanningRuntimeError } from './core';
import type { PlanningProjectionAdapter, RuntimePlan } from './types';

function createTestAdapter() {
  const sentPlans: RuntimePlan[] = [];
  const updatedPlans: RuntimePlan[] = [];
  const deletedPlans: RuntimePlan[] = [];

  const adapter: PlanningProjectionAdapter = {
    async sendPlan(plan) {
      sentPlans.push(plan);
      return {
        chatId: plan.chatId,
        messageId: 901,
      };
    },
    async updatePlan(plan) {
      updatedPlans.push(plan);
    },
    async deletePlan(plan) {
      deletedPlans.push(plan);
    },
  };

  return { adapter, sentPlans, updatedPlans, deletedPlans };
}

describe('PlanningCore', () => {
  it('creates a plan and publishes the initial telegram projection', async () => {
    const { adapter, sentPlans } = createTestAdapter();
    const core = new PlanningCore({
      channelAdapter: adapter,
      now: () => new Date('2026-03-14T10:00:00.000Z'),
    });

    const plan = await core.createPlan({
      runId: 'run-1',
      chatId: 101,
      tasks: [
        {
          taskId: 'category',
          title: 'Определить категорию',
          owner: 'category-worker',
          status: 'pending',
        },
      ],
      requestText: 'Создай товар',
    });

    expect(plan.status).toBe('active');
    expect(plan.telegramMessageId).toBe(901);
    expect(plan.requestText).toBe('Создай товар');
    expect(sentPlans).toHaveLength(1);
    expect(core.getActivePlan('run-1')?.telegramMessageId).toBe(901);
  });

  it('replaces the full task snapshot on update and edits the existing telegram message', async () => {
    const { adapter, updatedPlans } = createTestAdapter();
    const core = new PlanningCore({
      channelAdapter: adapter,
      now: () => new Date('2026-03-14T10:00:00.000Z'),
    });

    await core.createPlan({
      runId: 'run-2',
      chatId: 102,
      tasks: [
        {
          taskId: 'category',
          title: 'Определить категорию',
          owner: 'category-worker',
          status: 'pending',
        },
      ],
    });

    const updatedPlan = await core.updatePlan({
      runId: 'run-2',
      tasks: [
        {
          taskId: 'category',
          title: 'Определить категорию',
          owner: 'category-worker',
          status: 'completed',
        },
        {
          taskId: 'attributes',
          title: 'Подготовить атрибуты',
          owner: 'attribute-worker',
          status: 'in_progress',
          notes: 'Color и Storage',
        },
      ],
    });

    expect(updatedPlan.tasks).toHaveLength(2);
    expect(updatedPlans).toHaveLength(1);
    expect(updatedPlans[0].telegramMessageId).toBe(901);
    expect(core.getActivePlan('run-2')?.tasks[1]).toMatchObject({
      taskId: 'attributes',
      status: 'in_progress',
    });
  });

  it('deletes the telegram message when the plan is completed successfully', async () => {
    const { adapter, deletedPlans } = createTestAdapter();
    const core = new PlanningCore({
      channelAdapter: adapter,
      now: () => new Date('2026-03-14T10:00:00.000Z'),
    });

    await core.createPlan({
      runId: 'run-3',
      chatId: 103,
      tasks: [
        {
          taskId: 'product',
          title: 'Создать draft product',
          owner: 'product-worker',
          status: 'completed',
        },
      ],
    });

    const completedPlan = await core.completePlan('run-3');

    expect(completedPlan.status).toBe('completed');
    expect(core.getActivePlan('run-3')).toBeNull();
    expect(deletedPlans).toHaveLength(1);
    expect(deletedPlans[0].telegramMessageId).toBe(901);
  });

  it('keeps the telegram message and re-renders the final state when the plan fails', async () => {
    const { adapter, updatedPlans, deletedPlans } = createTestAdapter();
    const core = new PlanningCore({
      channelAdapter: adapter,
      now: () => new Date('2026-03-14T10:00:00.000Z'),
    });

    await core.createPlan({
      runId: 'run-4',
      chatId: 104,
      tasks: [
        {
          taskId: 'variations',
          title: 'Создать вариации',
          owner: 'variation-worker',
          status: 'blocked',
        },
      ],
    });

    const failedPlan = await core.failPlan('run-4');

    expect(failedPlan.status).toBe('failed');
    expect(updatedPlans).toHaveLength(1);
    expect(deletedPlans).toHaveLength(0);
    expect(core.getPlan('run-4')?.status).toBe('failed');
  });

  it('marks an active plan as abandoned during finalization and keeps the last projection', async () => {
    const { adapter, updatedPlans, deletedPlans } = createTestAdapter();
    const core = new PlanningCore({
      channelAdapter: adapter,
      now: () => new Date('2026-03-14T10:00:00.000Z'),
    });

    await core.createPlan({
      runId: 'run-5',
      chatId: 105,
      tasks: [
        {
          taskId: 'category',
          title: 'Определить категорию',
          owner: 'category-worker',
          status: 'in_progress',
        },
      ],
    });

    await core.finalizeDanglingPlan('run-5');

    expect(core.getPlan('run-5')?.status).toBe('abandoned');
    expect(updatedPlans).toHaveLength(1);
    expect(deletedPlans).toHaveLength(0);
  });

  it('rejects invalid plans and exposes typed runtime errors', async () => {
    const core = new PlanningCore();

    try {
      await core.createPlan({
        runId: 'run-6',
        chatId: 106,
        tasks: [
          {
            taskId: 'category',
            title: 'Определить категорию',
            owner: 'category-worker',
            status: 'in_progress',
          },
          {
            taskId: 'product',
            title: 'Создать продукт',
            owner: 'product-worker',
            status: 'in_progress',
          },
        ],
      });
      throw new Error('Expected createPlan to throw');
    } catch (error) {
      expect(isPlanningRuntimeError(error)).toBe(true);
      expect(error).toBeInstanceOf(PlanningRuntimeError);
      expect((error as PlanningRuntimeError).type).toBe('planning_invalid');
    }
  });

  it('refuses to complete a plan while a task is still in progress', async () => {
    const core = new PlanningCore();
    await core.createPlan({
      runId: 'run-7',
      chatId: 107,
      tasks: [
        {
          taskId: 'product',
          title: 'Создать продукт',
          owner: 'product-worker',
          status: 'in_progress',
        },
      ],
    });

    await expect(core.completePlan('run-7')).rejects.toMatchObject({
      type: 'planning_invalid',
    });
  });
});
