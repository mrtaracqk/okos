import { type CatalogWorkerId } from '../contracts/catalogWorkerId';
import { inspectCatalogPlaybookTool } from './playbookInspection';
import { approveStepTool, finishExecutionPlanTool, newExecutionPlanTool } from './executionTools';
import { attributeWorkerDefinition } from '../specialists/attribute';
import { categoryWorkerDefinition } from '../specialists/category';
import { productWorkerDefinition } from '../specialists/product';
import { variationWorkerDefinition } from '../specialists/variation';
import { type CatalogWorkerDefinition } from '../specialists/shared/workerDefinition';
import { type RuntimePlan } from '../../../runtime/planning/types';
import { getCatalogForemanToolNames } from './plannerToolAvailability';

const workerRegistrations = [
  categoryWorkerDefinition,
  attributeWorkerDefinition,
  productWorkerDefinition,
  variationWorkerDefinition,
] as const satisfies ReadonlyArray<CatalogWorkerDefinition>;

const workerRegistrationsById = new Map<CatalogWorkerId, CatalogWorkerDefinition>(
  workerRegistrations.map((registration) => [registration.id, registration] as const)
);

export const catalogForemanRegistry = {
  resolveWorker(workerId: string): CatalogWorkerDefinition | undefined {
    return workerRegistrationsById.get(workerId as CatalogWorkerId);
  },
};

export function getCatalogForemanAgentTools(activePlan: RuntimePlan | null) {
  const toolsByName = {
    inspect_catalog_playbook: inspectCatalogPlaybookTool,
    new_execution_plan: newExecutionPlanTool,
    approve_step: approveStepTool,
    finish_execution_plan: finishExecutionPlanTool,
  } as const;

  return getCatalogForemanToolNames(activePlan).map((toolName) => toolsByName[toolName]);
}
