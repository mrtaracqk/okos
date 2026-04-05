import { type WorkerRun } from './workerRun';

export type CatalogDelegationResult = {
  status: 'success' | 'failed';
  summary: string;
};

/** Префикс для успешного итога в чате (строка из `finish_catalog_turn.summary` без префикса). */
export const CATALOG_SUCCESS_USER_PREFIX = 'Готово: ';

/** Текст сообщения пользователю после делегирования в catalog-agent (детерминированно от статуса). */
export function formatCatalogDelegationUserMessage(result: CatalogDelegationResult): string {
  if (result.status === 'success') {
    return `${CATALOG_SUCCESS_USER_PREFIX}${result.summary}`;
  }
  return result.summary;
}

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
  finalizeOutcome?: 'completed' | 'failed' | 'abandoned' | null;
};

export function buildCatalogDelegationResultFromCatalogState(
  input: BuildCatalogDelegationResultInput
): CatalogDelegationResult {
  const summary = input.summary.trim() || 'Catalog-agent завершил работу без текстового ответа.';
  const { workerRuns } = input;
  if (input.finalizeOutcome === 'completed') {
    return {
      status: 'success',
      summary,
    };
  }

  if (input.finalizeOutcome === 'failed') {
    return {
      status: 'failed',
      summary,
    };
  }

  if (input.finalizeOutcome === 'abandoned') {
    return {
      status: 'failed',
      summary,
    };
  }

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
