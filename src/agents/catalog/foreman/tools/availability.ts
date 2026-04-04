import { type RuntimePlan } from '../../../../runtime/planning/types';
import { type WorkerRun } from '../../contracts/workerRun';
import { getNextApprovableTask } from '../runtimePlan/selectors';
import {
  approveStepTool,
  finishExecutionPlanTool,
  newExecutionPlanTool,
} from './definitions/executionPlanTools';
import { inspectCatalogPlaybookTool } from './definitions/inspectPlaybookTool';
import { type CatalogToolCall, type CatalogToolExecutionContext, type CatalogToolExecutionResult } from './types';

type CatalogForemanAgentTool =
  | typeof inspectCatalogPlaybookTool
  | typeof newExecutionPlanTool
  | typeof approveStepTool
  | typeof finishExecutionPlanTool;

type CatalogForemanToolRegistration = {
  name: string;
  tool: CatalogForemanAgentTool;
  sequenced: boolean;
  isAvailable(activePlan: RuntimePlan | null): boolean;
  execute(
    toolCall: CatalogToolCall,
    workerRuns: WorkerRun[],
    executionContext: CatalogToolExecutionContext
  ): Promise<CatalogToolExecutionResult>;
};

export const catalogForemanToolRegistry = [
  {
    name: inspectCatalogPlaybookTool.name,
    tool: inspectCatalogPlaybookTool,
    sequenced: false,
    isAvailable: () => true,
    execute: async (toolCall) => {
      const { handleInspectPlaybookToolCall } = await import('./handlers/inspectPlaybook.js');
      return handleInspectPlaybookToolCall(toolCall);
    },
  },
  {
    name: newExecutionPlanTool.name,
    tool: newExecutionPlanTool,
    sequenced: true,
    isAvailable: () => true,
    execute: async (toolCall, workerRuns, executionContext) => {
      const { handleNewExecutionPlanToolCall } = await import('./handlers/newExecutionPlan.js');
      return handleNewExecutionPlanToolCall(toolCall, workerRuns, executionContext);
    },
  },
  {
    name: approveStepTool.name,
    tool: approveStepTool,
    sequenced: true,
    isAvailable: (activePlan) => getNextApprovableTask(activePlan) != null,
    execute: async (toolCall, workerRuns, executionContext) => {
      const { handleApproveStepToolCall } = await import('./handlers/approveStep.js');
      return handleApproveStepToolCall(toolCall, workerRuns, executionContext);
    },
  },
  {
    name: finishExecutionPlanTool.name,
    tool: finishExecutionPlanTool,
    sequenced: true,
    isAvailable: (activePlan) => activePlan != null,
    execute: async (toolCall) => {
      const { handleFinishExecutionPlanToolCall } = await import('./handlers/finishExecutionPlan.js');
      return handleFinishExecutionPlanToolCall(toolCall);
    },
  },
] as const satisfies ReadonlyArray<CatalogForemanToolRegistration>;

const registrationsByName = new Map<string, CatalogForemanToolRegistration>(
  catalogForemanToolRegistry.map((registration) => [registration.name, registration] as const)
);

export const sequencedCatalogForemanToolNames = new Set<string>(
  catalogForemanToolRegistry.filter((registration) => registration.sequenced).map((registration) => registration.name)
);

export function resolveCatalogForemanToolRegistration(name: string | undefined) {
  if (!name) {
    return undefined;
  }

  return registrationsByName.get(name);
}

export function getCatalogForemanToolNames(activePlan: RuntimePlan | null): string[] {
  return catalogForemanToolRegistry
    .filter((registration) => registration.isAvailable(activePlan))
    .map((registration) => registration.name);
}

export function getCatalogForemanAgentTools(activePlan: RuntimePlan | null) {
  return catalogForemanToolRegistry
    .filter((registration) => registration.isAvailable(activePlan))
    .map((registration) => registration.tool);
}
