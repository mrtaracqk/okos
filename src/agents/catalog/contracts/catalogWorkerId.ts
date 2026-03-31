/** Canonical worker identity: matches `task.owner` / `responsible` in the execution plan. */
export const CATALOG_WORKER_IDS = [
  'category-worker',
  'attribute-worker',
  'product-worker',
  'variation-worker',
] as const;

export type CatalogWorkerId = (typeof CATALOG_WORKER_IDS)[number];

const workerIdSet = new Set<string>(CATALOG_WORKER_IDS);

export function resolveCatalogWorkerId(owner: string): CatalogWorkerId | undefined {
  return workerIdSet.has(owner) ? (owner as CatalogWorkerId) : undefined;
}
