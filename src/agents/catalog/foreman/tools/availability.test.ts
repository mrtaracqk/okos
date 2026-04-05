import { describe, expect, test } from 'bun:test';
import { type RuntimePlan } from '../../../../runtime/planning/types';
import {
  catalogForemanToolRegistry,
  getCatalogForemanToolNames,
  resolveCatalogForemanToolRegistration,
  sequencedCatalogForemanToolNames,
} from './availability';

function buildActivePlan(taskStatuses: RuntimePlan['tasks']) {
  return {
    runId: 'run-1',
    chatId: 1,
    status: 'active',
    planContext: {
      goal: 'Проверить каталог',
      facts: [],
      constraints: [],
    },
    tasks: taskStatuses,
  } satisfies RuntimePlan;
}

describe('getCatalogForemanToolNames', () => {
  test('exposes inspect, new_execution_plan, and finish_catalog_turn before a plan exists', () => {
    expect(getCatalogForemanToolNames(null)).toEqual([
      'inspect_catalog_playbook',
      'new_execution_plan',
      'finish_catalog_turn',
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
      'finish_catalog_turn',
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
      'finish_catalog_turn',
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
      'finish_catalog_turn',
    ]);
  });

  test('registry dispatch and sequencing stay aligned', () => {
    const availableBeforePlan = getCatalogForemanToolNames(null);

    expect(availableBeforePlan).toEqual(
      catalogForemanToolRegistry
        .filter((registration) => registration.isAvailable(null))
        .map((registration) => registration.name)
    );
    expect(resolveCatalogForemanToolRegistration('approve_step')?.sequenced).toBe(true);
    expect(resolveCatalogForemanToolRegistration('inspect_catalog_playbook')?.sequenced).toBe(false);
    expect(sequencedCatalogForemanToolNames).toEqual(
      new Set(['new_execution_plan', 'approve_step', 'finish_catalog_turn'])
    );
  });
});
