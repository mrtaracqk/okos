import { buildTraceAttributes, runChainSpan } from '../../../../observability/traceContext';
import {
  finalizeCatalogExecutionPlan,
  getCatalogAgentRuntimeRunId,
} from '../runtimePlan/runtimePlanService';
import { getLastFailedWorker } from '../workers/runState';
import { type CatalogGraphState } from './state';

export const finalizeNode = async (state: CatalogGraphState): Promise<Partial<CatalogGraphState>> => {
  return runChainSpan(
    'catalog_agent.finalize',
    async () => {
      const runId = getCatalogAgentRuntimeRunId();
      if (!runId) {
        return {};
      }

      const outcome = state.finalizeOutcome ?? 'abandoned';
      if (outcome === 'completed') {
        return {};
      }

      try {
        await finalizeCatalogExecutionPlan({
          runId,
          outcome,
        });
      } catch (error) {
        console.warn('Не удалось финализировать план выполнения:', error);
      }

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

export const raiseFatalErrorNode = async (state: CatalogGraphState) => {
  throw new Error(state.fatalErrorMessage ?? 'Catalog foreman failed.');
};
