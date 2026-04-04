import { BaseCheckpointSaver, END, START, StateGraph } from '@langchain/langgraph';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';
import { createDispatchToolsNode } from './dispatchNode';
import { createFinalizeNode, raiseFatalErrorNode } from './finalizeNode';
import { createPlannerLimitFallbackNode, createPlannerNode } from './plannerNode';
import { type CatalogGraphState, CatalogGraphStateAnnotation } from './state';

export function getPlannerRoute(state: CatalogGraphState) {
  return state.nextRoute;
}

export function getPostDispatchRoute(state: CatalogGraphState) {
  if (state.fatalErrorMessage || state.finalizeOutcome != null) {
    return 'finalize';
  }

  return state.nextRoute === 'finalize' ? 'finalize' : 'planner';
}

export function getPostFinalizeRoute(state: CatalogGraphState) {
  return state.fatalErrorMessage ? 'raiseFatalError' : 'end';
}

const checkpointer: BaseCheckpointSaver | boolean = true;
const name = 'catalog-agent';

export function createCatalogAgentGraph(planningDeps: CatalogPlanningDeps) {
  return new StateGraph(CatalogGraphStateAnnotation)
    .addNode('planner', createPlannerNode(planningDeps))
    .addNode('dispatchTools', createDispatchToolsNode(planningDeps))
    .addNode('plannerLimitFallback', createPlannerLimitFallbackNode(planningDeps))
    .addNode('finalize', createFinalizeNode(planningDeps))
    .addNode('raiseFatalError', raiseFatalErrorNode)
    .addEdge(START, 'planner')
    .addConditionalEdges('planner', getPlannerRoute, {
      dispatchTools: 'dispatchTools',
      plannerLimitFallback: 'plannerLimitFallback',
      finalize: 'finalize',
    })
    .addConditionalEdges('dispatchTools', getPostDispatchRoute, {
      planner: 'planner',
      finalize: 'finalize',
    })
    .addEdge('plannerLimitFallback', 'finalize')
    .addConditionalEdges('finalize', getPostFinalizeRoute, {
      raiseFatalError: 'raiseFatalError',
      end: END,
    })
    .compile({
      checkpointer,
      name,
      description: 'Агент-бригадир каталога с явным planner-dispatch циклом и отдельной финализацией плана.',
    });
}
