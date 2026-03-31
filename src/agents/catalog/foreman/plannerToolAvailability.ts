import { type RuntimePlan } from '../../../runtime/planning/types';

export const CATALOG_FOREMAN_TOOL_NAMES = [
  'inspect_catalog_playbook',
  'new_execution_plan',
  'approve_step',
  'finish_execution_plan',
] as const;

export type CatalogForemanToolName = (typeof CATALOG_FOREMAN_TOOL_NAMES)[number];

function canApproveStep(activePlan: RuntimePlan | null) {
  if (!activePlan) {
    return false;
  }

  const nextPendingTaskIndex = activePlan.tasks.findIndex((task) => task.status === 'pending');
  if (nextPendingTaskIndex <= 0) {
    return false;
  }

  return activePlan.tasks[nextPendingTaskIndex - 1]?.status === 'completed';
}

export function getCatalogForemanToolNames(activePlan: RuntimePlan | null): CatalogForemanToolName[] {
  const toolNames: CatalogForemanToolName[] = ['inspect_catalog_playbook', 'new_execution_plan'];

  if (canApproveStep(activePlan)) {
    toolNames.push('approve_step');
  }

  if (activePlan) {
    toolNames.push('finish_execution_plan');
  }

  return toolNames;
}
