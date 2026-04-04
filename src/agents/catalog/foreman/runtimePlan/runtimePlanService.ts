import { type CatalogPlanningDeps } from './planningDeps';

export function getCatalogAgentRuntimeRunId(planningDeps: Pick<CatalogPlanningDeps, 'resolveRunContext'>) {
  return planningDeps.resolveRunContext()?.runId ?? null;
}

export async function finalizeCatalogExecutionPlan(input: {
  planningDeps: Pick<CatalogPlanningDeps, 'planningRuntime'>;
  runId: string;
  outcome: 'failed' | 'abandoned';
}) {
  const { planningDeps } = input;
  const planningRuntime = planningDeps.planningRuntime;
  const activePlan = planningRuntime.getActivePlan(input.runId);
  if (!activePlan) {
    return;
  }

  if (input.outcome === 'failed') {
    await planningRuntime.failPlan(input.runId);
    return;
  }

  await planningRuntime.finalizeDanglingPlan(input.runId);
}
