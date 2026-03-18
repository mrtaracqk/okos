import { type WorkerRun } from './workerRun';

export type CatalogDelegationResult = {
  status: 'success' | 'failed';
  summary: string;
};

function getLastFailedWorker(workerRuns: WorkerRun[]) {
  for (let index = workerRuns.length - 1; index >= 0; index -= 1) {
    const workerRun = workerRuns[index];
    if (workerRun?.status === 'failed' || workerRun?.status === 'invalid') {
      return workerRun;
    }
  }
  return undefined;
}

export type BuildCatalogDelegationResultInput = {
  summary: string;
  workerRuns: WorkerRun[];
};

export function buildCatalogDelegationResultFromCatalogState(
  input: BuildCatalogDelegationResultInput
): CatalogDelegationResult {
  const summary = input.summary.trim() || 'Catalog-agent завершил работу без текстового ответа.';
  const { workerRuns } = input;
  const failedWorker = getLastFailedWorker(workerRuns);

  if (failedWorker) {
    return {
      status: 'failed',
      summary,
    };
  }

  return {
    status: 'success',
    summary,
  };
}
