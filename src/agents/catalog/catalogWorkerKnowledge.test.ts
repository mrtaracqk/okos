import { describe, expect, test } from 'bun:test';
import {
  CATALOG_WORKER_ENTRIES,
  CATALOG_WORKER_KNOWLEDGE,
  PLAN_WORKER_OWNERS,
} from './catalogWorkerKnowledge';
import { resolveCatalogWorkerId } from './contracts/catalogWorkerId';

describe('catalogWorkerKnowledge', () => {
  test('entries align with plan owners and knowledge map', () => {
    expect(PLAN_WORKER_OWNERS.length === CATALOG_WORKER_ENTRIES.length).toBe(true);
    for (const entry of CATALOG_WORKER_ENTRIES) {
      expect(PLAN_WORKER_OWNERS.includes(entry.id)).toBe(true);
      expect(CATALOG_WORKER_KNOWLEDGE[entry.id].id).toBe(entry.id);
    }
  });

  test('resolveCatalogWorkerId handles non-worker owners', () => {
    expect(resolveCatalogWorkerId('catalog-agent')).toBeUndefined();
    expect(resolveCatalogWorkerId('category-worker')).toBe('category-worker');
  });
});
