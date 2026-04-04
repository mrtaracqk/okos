import {
  buildCatalogWorkerIds,
  CATALOG_SPECIALIST_SPECS,
} from '../agents/catalog/specialists/specs';

export const CATALOG_AGENT_ID = 'catalog-agent' as const;
export type CatalogWorkerId = (typeof CATALOG_SPECIALIST_SPECS)[number]['id'];

function asNonEmptyTuple<T>(items: T[]): readonly [T, ...T[]] {
  const [first, ...rest] = items;

  if (first === undefined) {
    throw new Error('Catalog specialist registry must contain at least one worker.');
  }

  return [first, ...rest];
}

/**
 * Canonical executable worker identities shared across planning and catalog runtime.
 */
export const CATALOG_WORKER_IDS = asNonEmptyTuple(buildCatalogWorkerIds(CATALOG_SPECIALIST_SPECS));

/**
 * All valid runtime plan owners: planner + executable workers.
 */
export const CATALOG_TASK_OWNERS = [CATALOG_AGENT_ID, ...CATALOG_WORKER_IDS] as const;
const catalogWorkerIdSet = new Set<string>(CATALOG_WORKER_IDS);

export function resolveCatalogWorkerId(value: string): CatalogWorkerId | undefined {
  return catalogWorkerIdSet.has(value) ? (value as CatalogWorkerId) : undefined;
}
