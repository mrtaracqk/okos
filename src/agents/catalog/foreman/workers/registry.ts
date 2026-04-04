import { type CatalogWorkerId } from '../../contracts/catalogWorkerId';
import { attributeWorkerDefinition } from '../../specialists/attribute';
import { categoryWorkerDefinition } from '../../specialists/category';
import { productWorkerDefinition } from '../../specialists/product';
import { variationWorkerDefinition } from '../../specialists/variation';
import { type CatalogWorkerDefinition } from '../../specialists/shared/workerDefinition';

const workerRegistrations = [
  categoryWorkerDefinition,
  attributeWorkerDefinition,
  productWorkerDefinition,
  variationWorkerDefinition,
] as const satisfies ReadonlyArray<CatalogWorkerDefinition>;

const workerRegistrationsById = new Map<CatalogWorkerId, CatalogWorkerDefinition>(
  workerRegistrations.map((registration) => [registration.id, registration] as const)
);

export function resolveCatalogForemanWorker(workerId: string): CatalogWorkerDefinition | undefined {
  return workerRegistrationsById.get(workerId as CatalogWorkerId);
}
