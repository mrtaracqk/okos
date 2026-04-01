import { describe, expect, test } from 'bun:test';
import {
  buildCatalogDelegationResultFromCatalogState,
  formatCatalogDelegationUserMessage,
} from './catalogDelegation';
import { type WorkerRun } from './workerRun';

describe('catalogDelegation', () => {
  test('treats completed finalize outcome as success even after fallback worker failures', () => {
    const workerRuns: WorkerRun[] = [
      {
        agent: 'product-worker',
        status: 'failed',
        task: 'Создать товар',
      },
      {
        agent: 'category-worker',
        status: 'completed',
        task: 'Подготовить категорию',
      },
      {
        agent: 'product-worker',
        status: 'completed',
        task: 'Повторить создание товара',
      },
    ];

    expect(
      buildCatalogDelegationResultFromCatalogState({
        summary: 'Товар создан.',
        workerRuns,
        finalizeOutcome: 'completed',
      })
    ).toEqual({
      status: 'success',
      summary: 'Товар создан.',
    });
  });

  test('falls back to failed when planner did not finalize and a worker failed', () => {
    expect(
      buildCatalogDelegationResultFromCatalogState({
        summary: 'Не удалось завершить.',
        workerRuns: [
          {
            agent: 'product-worker',
            status: 'failed',
            task: 'Создать товар',
          },
        ],
        finalizeOutcome: null,
      })
    ).toEqual({
      status: 'failed',
      summary: 'Не удалось завершить.',
    });
  });

  test('adds success prefix only for successful delegation results', () => {
    expect(formatCatalogDelegationUserMessage({ status: 'success', summary: 'Товар создан.' })).toBe(
      'Готово: Товар создан.'
    );
    expect(formatCatalogDelegationUserMessage({ status: 'failed', summary: 'Ошибка.' })).toBe('Ошибка.');
  });
});
