import { describe, expect, test } from 'bun:test';
import { PlanningCore, PlanningRuntimeError } from './core';

describe('PlanningCore plan context and adjacent artifacts', () => {
  test('preserves planContext and clones nextStepArtifacts top-level array', async () => {
    const planningCore = new PlanningCore();
    const nextStepArtifacts = [{ product_id: 101 }];

    await planningCore.createPlan({
      runId: 'run-1',
      chatId: 101,
      planContext: {
        goal: 'Проверить и обновить товар',
        facts: ['sku=IP-17'],
        constraints: ['read-only'],
      },
      tasks: [
        {
          taskId: 'task-1',
          title: 'Проверить товар',
          owner: 'product-worker',
          status: 'pending',
          execution: {
            objective: 'Проверить товар',
            facts: ['sku=IP-17'],
            constraints: ['read-only'],
            expectedOutput: 'status, facts',
          },
        },
      ],
      nextStepArtifacts,
    });

    const activePlan = planningCore.getActivePlan('run-1');

    expect(activePlan?.planContext).toEqual({
      goal: 'Проверить и обновить товар',
      facts: ['sku=IP-17'],
      constraints: ['read-only'],
    });
    expect(activePlan?.nextStepArtifacts).toEqual(nextStepArtifacts);
    expect(activePlan?.nextStepArtifacts).not.toBe(nextStepArtifacts);
  });

  test('rejects non-array nextStepArtifacts', async () => {
    const planningCore = new PlanningCore();

    await expect(
      planningCore.createPlan({
        runId: 'run-1',
        chatId: 101,
        planContext: {
          goal: 'Проверить товар',
          facts: [],
          constraints: [],
        },
        tasks: [
          {
            taskId: 'task-1',
            title: 'Проверить товар',
            owner: 'product-worker',
            status: 'pending',
            execution: {
              objective: 'Проверить товар',
              facts: ['sku=IP-17'],
              constraints: ['read-only'],
              expectedOutput: 'status, facts',
            },
          },
        ],
        nextStepArtifacts: { invalid: true } as unknown as unknown[],
      })
    ).rejects.toBeInstanceOf(PlanningRuntimeError);
  });

  test('keeps transport message id internal while driving update and delete via adapter', async () => {
    const sentPlans: unknown[] = [];
    const updatedPlans: Array<{ plan: unknown; messageId: number }> = [];
    const deletedPlans: Array<{ plan: unknown; messageId: number }> = [];

    const planningCore = new PlanningCore({
      channelAdapter: {
        async sendPlan(plan) {
          sentPlans.push(plan);
          return 700;
        },
        async updatePlan(plan, messageId) {
          updatedPlans.push({ plan, messageId });
        },
        async deletePlan(plan, messageId) {
          deletedPlans.push({ plan, messageId });
        },
      },
    });

    await planningCore.createPlan({
      runId: 'run-1',
      chatId: 101,
      planContext: {
        goal: 'Подготовить каталог',
        facts: [],
        constraints: [],
      },
      tasks: [
        {
          taskId: 'task-1',
          title: 'Проверить товар',
          owner: 'product-worker',
          status: 'pending',
        },
      ],
    });

    expect(sentPlans).toEqual([
      {
        runId: 'run-1',
        chatId: 101,
        status: 'active',
        planContext: {
          goal: 'Подготовить каталог',
          facts: [],
          constraints: [],
        },
        tasks: [
          {
            taskId: 'task-1',
            title: 'Проверить товар',
            owner: 'product-worker',
            status: 'pending',
          },
        ],
      },
    ]);
    expect(sentPlans[0] && 'telegramMessageId' in (sentPlans[0] as Record<string, unknown>)).toBe(false);
    expect(sentPlans[0] && 'createdAt' in (sentPlans[0] as Record<string, unknown>)).toBe(false);

    await planningCore.updatePlan({
      runId: 'run-1',
      tasks: [
        {
          taskId: 'task-1',
          title: 'Проверить товар',
          owner: 'product-worker',
          status: 'completed',
        },
      ],
    });

    expect(updatedPlans).toEqual([
      {
        plan: {
          runId: 'run-1',
          chatId: 101,
          status: 'active',
          planContext: {
            goal: 'Подготовить каталог',
            facts: [],
            constraints: [],
          },
          tasks: [
            {
              taskId: 'task-1',
              title: 'Проверить товар',
              owner: 'product-worker',
              status: 'completed',
            },
          ],
        },
        messageId: 700,
      },
    ]);

    await planningCore.completePlan('run-1');

    expect(deletedPlans).toEqual([
      {
        plan: {
          runId: 'run-1',
          chatId: 101,
          status: 'completed',
          planContext: {
            goal: 'Подготовить каталог',
            facts: [],
            constraints: [],
          },
          tasks: [
            {
              taskId: 'task-1',
              title: 'Проверить товар',
              owner: 'product-worker',
              status: 'completed',
            },
          ],
        },
        messageId: 700,
      },
    ]);
  });

  test('rolls back completePlan when channel delete fails', async () => {
    const planningCore = new PlanningCore({
      channelAdapter: {
        async sendPlan() {
          return 700;
        },
        async updatePlan() {},
        async deletePlan() {
          throw new Error('telegram delete failed');
        },
      },
    });

    await planningCore.createPlan({
      runId: 'run-1',
      chatId: 101,
      planContext: {
        goal: 'Подготовить каталог',
        facts: [],
        constraints: [],
      },
      tasks: [
        {
          taskId: 'task-1',
          title: 'Проверить товар',
          owner: 'product-worker',
          status: 'completed',
        },
      ],
    });

    await expect(planningCore.completePlan('run-1')).rejects.toThrow('telegram delete failed');
    expect(planningCore.getActivePlan('run-1')?.status).toBe('active');
  });

  test('rolls back non-active transition when channel publish fails', async () => {
    let updateAttempts = 0;
    const planningCore = new PlanningCore({
      channelAdapter: {
        async sendPlan() {
          return 700;
        },
        async updatePlan() {
          updateAttempts += 1;
          throw new Error('telegram update failed');
        },
        async deletePlan() {},
      },
    });

    await planningCore.createPlan({
      runId: 'run-1',
      chatId: 101,
      planContext: {
        goal: 'Подготовить каталог',
        facts: [],
        constraints: [],
      },
      tasks: [
        {
          taskId: 'task-1',
          title: 'Проверить товар',
          owner: 'product-worker',
          status: 'pending',
        },
      ],
    });

    await expect(planningCore.failPlan('run-1')).rejects.toThrow('telegram update failed');
    expect(updateAttempts).toBe(1);
    expect(planningCore.getActivePlan('run-1')?.status).toBe('active');

    await expect(planningCore.finalizeDanglingPlan('run-1')).rejects.toThrow('telegram update failed');
    expect(updateAttempts).toBe(2);
    expect(planningCore.getActivePlan('run-1')?.status).toBe('active');
  });
});
