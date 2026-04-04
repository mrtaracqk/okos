import { describe, expect, mock, test } from 'bun:test';
import { CATALOG_SPECIALIST_SPECS } from './specs';

mock.module('../../../config', () => ({
  chatModel: {
    bindTools() {
      return {
        invoke: async () => {
          throw new Error('registry test should not invoke the model');
        },
      };
    },
    provider: 'test',
    modelName: 'test-model',
    model: 'test-model',
  },
}));

describe('catalog specialist registry wiring', () => {
  test('resolves every worker to a compiled graph with the expected registry identity', async () => {
    const { resolveCatalogWorker } = await import('./registry.js');

    for (const spec of CATALOG_SPECIALIST_SPECS) {
      const resolved = resolveCatalogWorker(spec.id);

      expect(resolved.id).toBe(spec.id);
      expect(resolved.graph).toBe(resolveCatalogWorker(spec.id).graph);
      expect(resolved.graph).toHaveProperty('name', spec.id);
      expect(resolved.graph).toHaveProperty('checkpointer', true);
      expect(resolved.graph).toHaveProperty('invoke');
      expect(resolved.graph).toHaveProperty('builder');
      expect(Object.keys((resolved.graph as unknown as { nodes: Record<string, unknown> }).nodes)).toEqual([
        '__start__',
        'agent',
        'tools',
      ]);
    }
  });
});
