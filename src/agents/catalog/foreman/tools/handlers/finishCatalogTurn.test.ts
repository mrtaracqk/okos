import { describe, expect, test } from 'bun:test';
import { type CatalogPlanningDeps } from '../../runtimePlan/planningDeps';
import { handleFinishCatalogTurnToolCall } from './finishCatalogTurn';

function buildDeps(overrides: {
  getActivePlan: CatalogPlanningDeps['planningRuntime']['getActivePlan'];
  completePlan?: CatalogPlanningDeps['planningRuntime']['completePlan'];
}): CatalogPlanningDeps {
  return {
    resolveRunContext: () => ({ runId: 'run-test', chatId: 1 }),
    planningRuntime: {
      getActivePlan: overrides.getActivePlan,
      createPlan: async () => {
        throw new Error('unused');
      },
      updatePlan: async () => {
        throw new Error('unused');
      },
      completePlan: overrides.completePlan ?? (async () => ({ status: 'completed' } as never)),
      failPlan: async () => ({ status: 'failed' } as never),
      finalizeDanglingPlan: async () => {},
    },
  };
}

describe('handleFinishCatalogTurnToolCall', () => {
  test('without active plan returns completion and does not touch planning runtime', async () => {
    let completeCalls = 0;
    const deps = buildDeps({
      getActivePlan: () => null,
      completePlan: async () => {
        completeCalls += 1;
        return {} as never;
      },
    });

    const result = await handleFinishCatalogTurnToolCall(deps, {
      name: 'finish_catalog_turn',
      id: 'tc-1',
      args: { outcome: 'completed', summary: 'Краткий ответ.' },
    });

    expect(completeCalls).toBe(0);
    expect(result.completion).toEqual({ summary: 'Краткий ответ.', finalizeOutcome: 'completed' });
    expect(result.clearExecutionResult).toBeUndefined();
  });

  test('with active plan completed still completes runtime plan', async () => {
    let completeCalls = 0;
    const deps = buildDeps({
      getActivePlan: () =>
        ({
          runId: 'run-test',
          chatId: 1,
          status: 'active',
          planContext: { goal: 'g', facts: [], constraints: [] },
          tasks: [],
        }) as ReturnType<CatalogPlanningDeps['planningRuntime']['getActivePlan']>,
      completePlan: async () => {
        completeCalls += 1;
        return { status: 'completed' } as never;
      },
    });

    const result = await handleFinishCatalogTurnToolCall(deps, {
      name: 'finish_catalog_turn',
      args: { outcome: 'completed', summary: 'Готово.' },
    });

    expect(completeCalls).toBe(1);
    expect(result.completion).toEqual({ summary: 'Готово.', finalizeOutcome: 'completed' });
    expect(result.clearExecutionResult).toBe(true);
  });
});
