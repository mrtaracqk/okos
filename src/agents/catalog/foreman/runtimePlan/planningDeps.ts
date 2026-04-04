import { getPlanningRunContext, getPlanningRuntime } from '../../../../runtime/planning';

export type CatalogPlanningRunContext = NonNullable<ReturnType<typeof getPlanningRunContext>>;

export type CatalogPlanningRuntime = Pick<
  ReturnType<typeof getPlanningRuntime>,
  'getActivePlan' | 'createPlan' | 'updatePlan' | 'completePlan' | 'failPlan' | 'finalizeDanglingPlan'
>;

export type CatalogPlanningDeps = {
  planningRuntime: CatalogPlanningRuntime;
  resolveRunContext: () => CatalogPlanningRunContext | null;
};

export function createDefaultCatalogPlanningDeps(): CatalogPlanningDeps {
  return {
    planningRuntime: getPlanningRuntime(),
    resolveRunContext: getPlanningRunContext,
  };
}
