import { buildTraceAttributes, runChainSpan } from '../../../../observability/traceContext';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';
import {
  finalizeCatalogExecutionPlan,
  getCatalogAgentRuntimeRunId,
} from '../runtimePlan/runtimePlanService';
import { getLastFailedWorker } from '../workers/runState';
import { type CatalogGraphState } from './state';

export function createFinalizeNode(planningDeps: CatalogPlanningDeps) {
  return async (state: CatalogGraphState): Promise<Partial<CatalogGraphState>> => {
    return runChainSpan(
      'catalog_agent.finalize',
      async () => {
        const runId = getCatalogAgentRuntimeRunId(planningDeps);
        if (!runId) {
          return {};
        }

        const outcome = state.finalizeOutcome ?? 'abandoned';
        if (outcome === 'completed') {
          return {};
        }

        await finalizeCatalogExecutionPlan({
          planningDeps,
          runId,
          outcome,
        });

        return {};
      },
      {
        attributes: buildTraceAttributes({
          'catalog.finalize_outcome': state.finalizeOutcome ?? 'abandoned',
          'catalog.worker_runs': state.workerRuns.length,
        }),
        mapResultAttributes: () =>
          buildTraceAttributes({
            'catalog.failure_worker': getLastFailedWorker(state.workerRuns)?.agent,
          }),
        statusMessage: () => {
          const failedWorker = getLastFailedWorker(state.workerRuns);
          return failedWorker ? `сбой каталожного воркера: ${failedWorker.agent}` : undefined;
        },
      }
    );
  };
}

export const raiseFatalErrorNode = async (state: CatalogGraphState) => {
  throw new Error(state.fatalErrorMessage ?? 'Catalog foreman failed.');
};
