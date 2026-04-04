import { beforeAll, describe, expect, test } from 'bun:test';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';

let createCatalogAgentGraph: (typeof import('./catalogForemanGraph.js'))['createCatalogAgentGraph'];
let getPostDispatchRoute: (typeof import('./catalogForemanGraph.js'))['getPostDispatchRoute'];

beforeAll(async () => {
  process.env.TELEGRAM_BOT_TOKEN ??= 'test-telegram-token';
  process.env.OPENAI_API_KEY ??= 'test-openai-key';
  process.env.OPENAI_MODEL_NAME ??= 'gpt-4o-mini';
  process.env.OPENAI_UTILITY_MODEL_NAME ??= 'gpt-4o-mini';

  const module = await import('./catalogForemanGraph.js');
  createCatalogAgentGraph = module.createCatalogAgentGraph;
  getPostDispatchRoute = module.getPostDispatchRoute;
});

function getPlanningDeps(): CatalogPlanningDeps {
  return {
    planningRuntime: {
      getActivePlan: () => null,
      createPlan: async () => {
        throw new Error('not implemented');
      },
      updatePlan: async () => {
        throw new Error('not implemented');
      },
      completePlan: async () => {
        throw new Error('not implemented');
      },
      failPlan: async () => {
        throw new Error('not implemented');
      },
      finalizeDanglingPlan: async () => {},
    },
    resolveRunContext: () => ({ runId: 'run-1', chatId: 1 }),
  };
}

describe('catalogAgentGraph', () => {
  test('exposes the compiled runtime surface', () => {
    const catalogAgentGraph = createCatalogAgentGraph(getPlanningDeps());
    expect(catalogAgentGraph).toBeDefined();
    expect(typeof catalogAgentGraph.invoke).toBe('function');
  });

  test('uses nextRoute after dispatch when no terminal outcome is present', () => {
    expect(
      getPostDispatchRoute({
        nextRoute: 'planner',
        finalizeOutcome: null,
        fatalErrorMessage: null,
      } as any)
    ).toBe('planner');

    expect(
      getPostDispatchRoute({
        nextRoute: 'finalize',
        finalizeOutcome: null,
        fatalErrorMessage: null,
      } as any)
    ).toBe('finalize');
  });
});
