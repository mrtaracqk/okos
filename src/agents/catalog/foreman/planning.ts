import { getPlanningRunContext, getPlanningRuntime } from '../../../runtime-plugins/planning';

export function getCatalogAgentRuntimeRunId() {
  return getPlanningRunContext()?.runId ?? null;
}

export async function finalizeCatalogExecutionPlan(input: {
  runId: string;
  outcome: 'failed' | 'abandoned';
}) {
  const planningRuntime = getPlanningRuntime();
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
