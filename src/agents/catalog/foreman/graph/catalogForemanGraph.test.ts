import { beforeAll, describe, expect, test } from 'bun:test';

let catalogAgentGraph: (typeof import('./catalogForemanGraph.js'))['catalogAgentGraph'];
let getPostDispatchRoute: (typeof import('./catalogForemanGraph.js'))['getPostDispatchRoute'];

beforeAll(async () => {
  process.env.TELEGRAM_BOT_TOKEN ??= 'test-telegram-token';
  process.env.OPENAI_API_KEY ??= 'test-openai-key';
  process.env.OPENAI_MODEL_NAME ??= 'gpt-4o-mini';
  process.env.OPENAI_UTILITY_MODEL_NAME ??= 'gpt-4o-mini';

  const module = await import('./catalogForemanGraph.js');
  catalogAgentGraph = module.catalogAgentGraph;
  getPostDispatchRoute = module.getPostDispatchRoute;
});

describe('catalogAgentGraph', () => {
  test('exposes the compiled runtime surface', () => {
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
