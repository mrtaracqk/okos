import { describe, expect, test } from 'bun:test';
import { CATALOG_WORKER_IDS } from '../../../../contracts/catalogExecutionOwners';
import { renderCatalogForemanGlobalRoutingPolicy } from '../../foreman/planner/globalRoutingPolicy';
import { listCategoriesTool } from '../tools/woo/categoryTools';
import {
  buildCatalogWorkerIds,
  CATALOG_FOREMAN_SPECIALIST_SUMMARIES,
  CATALOG_SPECIALIST_SPECS,
  CATALOG_SPECIALISTS_BY_ID,
  CATALOG_WORKER_CONTRACTS,
  type CatalogSpecialistSpec,
} from '.';

describe('catalog specialist spec invariants', () => {
  test('registry remains the single source of worker ids, toolsets, worker contracts and foreman summaries', () => {
    const ids = CATALOG_SPECIALIST_SPECS.map((spec) => spec.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const spec of CATALOG_SPECIALIST_SPECS) {
      expect(CATALOG_SPECIALISTS_BY_ID[spec.id]).toBe(spec);
      expect(CATALOG_WORKER_CONTRACTS[spec.id].responsibility).toEqual(spec.worker.responsibility);
      expect(CATALOG_WORKER_CONTRACTS[spec.id].workflow).toEqual(spec.worker.workflow);
      expect(CATALOG_WORKER_CONTRACTS[spec.id].toolUsage).toEqual(spec.worker.toolUsage);
      expect(CATALOG_WORKER_CONTRACTS[spec.id].blockerRules).toEqual(spec.worker.blockerRules);
      expect(CATALOG_FOREMAN_SPECIALIST_SUMMARIES[spec.id].routingSummary).toEqual(
        spec.foreman.routingSummary,
      );
      expect(CATALOG_FOREMAN_SPECIALIST_SUMMARIES[spec.id].consultationSummary).toEqual(
        spec.foreman.consultationSummary,
      );
      expect(spec.tools.domainRead.length + spec.tools.domainMutations.length).toBeGreaterThan(0);
      expect(spec.worker.responsibility.length).toBeGreaterThan(0);
      expect(spec.worker.toolUsage.length).toBeGreaterThan(0);
      expect(spec.worker.blockerRules.length).toBeGreaterThan(0);
      expect(spec.foreman.routingSummary.length).toBeGreaterThan(0);
    }
  });

  test('derived worker ids keep the canonical registry order', () => {
    expect([...CATALOG_WORKER_IDS]).toEqual(buildCatalogWorkerIds(CATALOG_SPECIALIST_SPECS));
  });

  test('foreman zone prompt embeds per-worker routing bullets in one section', () => {
    const section = renderCatalogForemanGlobalRoutingPolicy();

    expect(section).toContain('## Зона и маршрутизация');

    for (const spec of CATALOG_SPECIALIST_SPECS) {
      expect(section).toContain(`### ${spec.id}`);
      for (const rule of spec.foreman.routingSummary) {
        expect(section).toContain(rule);
      }
      for (const line of spec.foreman.consultationSummary ?? []) {
        expect(section).not.toContain(line);
      }
    }

    expect(section).not.toContain('## Routing Policy');
    expect(section).not.toContain('## Ownership (воркеры)');
    expect(section).not.toContain('**Читает в своей зоне:**');
    expect(section).not.toContain('wc_v3_');
  });

  test('extending the spec list updates ids, registry, contracts, toolsets and foreman routing text in one place', () => {
    const mockWorkerSpec = {
      id: 'mock-worker',
      tools: {
        domainRead: [listCategoriesTool],
        domainMutations: [],
        researchRead: [],
      },
      worker: {
        responsibility: ['Работаешь только с mock-доменом.'],
        workflow: ['Держи шаг в границах mock-домена.'],
        toolUsage: ['Если нужен lookup, делай его только в mock-домене.'],
        blockerRules: ['Если нужна чужая mutation, верни blocker.'],
      },
      foreman: {
        routingSummary: [
          'Mock-домен; только categories list для read; handoff при чужой mutation.',
          'Если конечный шаг mock-owned, сначала mock-worker.',
        ],
        consultationSummary: ['По каким случаям mock-worker остаётся owner-ом шага.'],
      },
    } as const satisfies CatalogSpecialistSpec<'mock-worker'>;
    const extendedSpecs = [...CATALOG_SPECIALIST_SPECS, mockWorkerSpec] as const;
    const ids = buildCatalogWorkerIds(extendedSpecs);
    const section = renderCatalogForemanGlobalRoutingPolicy(extendedSpecs);
    const runtimeTools = getCatalogWorkerRuntimeToolsFromSpecs(extendedSpecs, 'mock-worker');
    const byId = Object.fromEntries(extendedSpecs.map((spec) => [spec.id, spec])) as Record<
      (typeof extendedSpecs)[number]['id'],
      (typeof extendedSpecs)[number]
    >;
    const workerContracts = Object.fromEntries(
      extendedSpecs.map((spec) => [spec.id, { id: spec.id, ...spec.worker }]),
    ) as Record<
      (typeof extendedSpecs)[number]['id'],
      { id: (typeof extendedSpecs)[number]['id'] } & (typeof extendedSpecs)[number]['worker']
    >;
    const foremanSummaries = Object.fromEntries(
      extendedSpecs.map((spec) => [spec.id, { id: spec.id, ...spec.foreman }]),
    ) as Record<
      (typeof extendedSpecs)[number]['id'],
      { id: (typeof extendedSpecs)[number]['id'] } & (typeof extendedSpecs)[number]['foreman']
    >;

    expect(ids).toContain('mock-worker');
    expect(byId['mock-worker']).toEqual(mockWorkerSpec);
    expect(workerContracts['mock-worker'].toolUsage).toEqual([
      'Если нужен lookup, делай его только в mock-домене.',
    ]);
    expect(foremanSummaries['mock-worker'].consultationSummary).toEqual([
      'По каким случаям mock-worker остаётся owner-ом шага.',
    ]);
    expect(runtimeTools).toEqual([listCategoriesTool]);
    expect(section).toContain('### mock-worker');
    expect(section).toContain(mockWorkerSpec.foreman.routingSummary[0]);
  });
});

function getCatalogWorkerRuntimeToolsFromSpecs<
  const TSpecs extends readonly CatalogSpecialistSpec[],
  TId extends TSpecs[number]['id'],
>(specs: TSpecs, workerId: TId) {
  const spec = specs.find((candidate) => candidate.id === workerId);
  if (!spec) {
    throw new Error(`Unknown worker ${workerId}`);
  }

  return [...spec.tools.domainRead, ...spec.tools.domainMutations, ...spec.tools.researchRead];
}
