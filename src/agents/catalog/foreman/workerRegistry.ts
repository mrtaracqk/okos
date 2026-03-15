import { manageExecutionPlanTool } from '../../../runtime-plugins/planning';
import { type CatalogWorkerToolName } from '../contracts/workerRun';
import { inspectCatalogPlaybookTool } from './playbookInspection';
import { attributeWorkerDefinition } from '../specialists/attribute';
import { categoryWorkerDefinition } from '../specialists/category';
import { productWorkerDefinition } from '../specialists/product';
import { variationWorkerDefinition } from '../specialists/variation';
import { type CatalogWorkerDefinition } from '../specialists/shared/workerDefinition';

const workerRegistrations = [
  categoryWorkerDefinition,
  attributeWorkerDefinition,
  productWorkerDefinition,
  variationWorkerDefinition,
] as const satisfies ReadonlyArray<CatalogWorkerDefinition>;

const workerRegistrationsByName = new Map<CatalogWorkerToolName, CatalogWorkerDefinition>(
  workerRegistrations.map((registration) => [registration.name, registration] as const)
);

export const catalogForemanRegistry = {
  agentTools: [
    inspectCatalogPlaybookTool,
    manageExecutionPlanTool,
    ...workerRegistrations.map(({ handoffTool }) => handoffTool),
  ],
  resolveWorker(toolName: string): CatalogWorkerDefinition | undefined {
    return workerRegistrationsByName.get(toolName as CatalogWorkerToolName);
  },
};
