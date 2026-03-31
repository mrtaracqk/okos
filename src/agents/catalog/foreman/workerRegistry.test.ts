import { describe, expect, test } from 'bun:test';
import { type RuntimePlan } from '../../../runtime/planning/types';
import { getCatalogForemanToolNames } from './plannerToolAvailability';

function buildActivePlan(taskStatuses: RuntimePlan['tasks']) {
  return {
    runId: 'run-1',
    chatId: 1,
    status: 'active',
    tasks: taskStatuses,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  } satisfies RuntimePlan;
}

describe('getCatalogForemanToolNames', () => {
  test('exposes only inspect and new_execution_plan before a plan exists', () => {
    expect(getCatalogForemanToolNames(null)).toEqual([
      'inspect_catalog_playbook',
      'new_execution_plan',
    ]);
  });

  test('exposes approve_step only when the next pending task follows a completed task', () => {
    const activePlan = buildActivePlan([
      {
        taskId: 't1',
        title: 'first',
        owner: 'product-worker',
        status: 'completed',
      },
      {
        taskId: 't2',
        title: 'second',
        owner: 'variation-worker',
        status: 'pending',
      },
    ]);

    expect(getCatalogForemanToolNames(activePlan)).toEqual([
      'inspect_catalog_playbook',
      'new_execution_plan',
      'approve_step',
      'finish_execution_plan',
    ]);
  });

  test('hides approve_step when the previous task did not complete successfully', () => {
    const activePlan = buildActivePlan([
      {
        taskId: 't1',
        title: 'first',
        owner: 'product-worker',
        status: 'failed',
      },
      {
        taskId: 't2',
        title: 'second',
        owner: 'variation-worker',
        status: 'pending',
      },
    ]);

    expect(getCatalogForemanToolNames(activePlan)).toEqual([
      'inspect_catalog_playbook',
      'new_execution_plan',
      'finish_execution_plan',
    ]);
  });

  test('hides approve_step when there is no eligible pending continuation', () => {
    const activePlan = buildActivePlan([
      {
        taskId: 't1',
        title: 'only',
        owner: 'product-worker',
        status: 'completed',
      },
    ]);

    expect(getCatalogForemanToolNames(activePlan)).toEqual([
      'inspect_catalog_playbook',
      'new_execution_plan',
      'finish_execution_plan',
    ]);
  });
});
