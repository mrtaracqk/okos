import { describe, expect, test } from 'bun:test';
import { renderCatalogForemanWorkerCapabilities } from '../../foreman/planner/capabilitiesSummary';
import { listCategoriesTool } from '../tools/woo/categoryTools';
import {
  buildCatalogWorkerIds,
  CATALOG_SPECIALIST_SPECS,
  getCatalogWorkerRuntimeTools,
  type CatalogSpecialistSpec,
} from '.';
import { CATALOG_WORKER_IDS } from '../../../../contracts/catalogExecutionOwners';

describe('catalog specialist specs registry', () => {
  test('keeps unique ids and fully populated spec sections', () => {
    const ids = CATALOG_SPECIALIST_SPECS.map((spec) => spec.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const spec of CATALOG_SPECIALIST_SPECS) {
      expect(spec.tools.domainRead.length + spec.tools.domainMutations.length).toBeGreaterThan(0);
      expect(spec.knowledge.ownershipRules.length).toBeGreaterThan(0);
      expect(spec.knowledge.lookupRules.length).toBeGreaterThan(0);
      expect(spec.knowledge.blockerRules.length).toBeGreaterThan(0);
      expect(spec.routingRules.length).toBeGreaterThan(0);
    }
  });

  test('derived worker ids match the canonical registry order', () => {
    expect([...CATALOG_WORKER_IDS]).toEqual(buildCatalogWorkerIds(CATALOG_SPECIALIST_SPECS));
  });

  test('adding one more spec automatically extends ids, registry, knowledge, toolsets and capabilities summary', () => {
    const mockWorkerSpec = {
      id: 'mock-worker',
      tools: {
        domainRead: [listCategoriesTool],
        domainMutations: [],
        researchRead: [],
      },
      knowledge: {
        ownershipRules: ['Работаешь только с mock-доменом.'],
        lookupRules: ['Если нужен lookup, делай его только в mock-домене.'],
        blockerRules: ['Если нужна чужая mutation, верни blocker.'],
      },
      routingRules: ['Если конечный шаг mock-owned, сначала mock-worker.'],
    } as const satisfies CatalogSpecialistSpec<'mock-worker'>;
    const extendedSpecs = [...CATALOG_SPECIALIST_SPECS, mockWorkerSpec] as const;
    const ids = buildCatalogWorkerIds(extendedSpecs);
    const summary = renderCatalogForemanWorkerCapabilities(extendedSpecs);
    const byId = Object.fromEntries(extendedSpecs.map((spec) => [spec.id, spec])) as Record<
      (typeof extendedSpecs)[number]['id'],
      (typeof extendedSpecs)[number]
    >;
    const knowledge = Object.fromEntries(
      extendedSpecs.map((spec) => [spec.id, { id: spec.id, ...spec.knowledge }]),
    ) as Record<
      (typeof extendedSpecs)[number]['id'],
      { id: (typeof extendedSpecs)[number]['id'] } & (typeof extendedSpecs)[number]['knowledge']
    >;
    const runtimeTools = [...mockWorkerSpec.tools.domainRead, ...mockWorkerSpec.tools.domainMutations, ...mockWorkerSpec.tools.researchRead];

    expect(ids).toContain('mock-worker');
    expect(byId['mock-worker']).toEqual(mockWorkerSpec);
    expect(knowledge['mock-worker'].lookupRules).toEqual([
      'Если нужен lookup, делай его только в mock-домене.',
    ]);
    expect(runtimeTools).toEqual([listCategoriesTool]);
    expect(summary).toContain('### mock-worker');
    expect(summary).toContain('`wc_v3_products_categories_list`');
  });
});
