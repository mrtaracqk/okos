import { describe, expect, it } from 'bun:test';
import {
  extractWorkerResult,
  normalizeWorkerResult,
  renderWorkerResult,
  renderWorkerResultEnvelopeSummary,
  WORKER_RESULT_TOOL_NAME,
  workerResultToEnvelope,
} from './workerResult';

describe('workerResult', () => {
  it('normalizes valid structured worker results', () => {
    expect(
      normalizeWorkerResult({
        status: 'completed',
        data: ['category_id: 17'],
        missingData: [],
        note: 'Категория подтверждена.',
      })
    ).toEqual({
      status: 'completed',
      data: ['category_id: 17'],
      missingData: [],
      note: 'Категория подтверждена.',
    });
  });

  it('renders the stable worker result text shape', () => {
    expect(
      renderWorkerResult({
        status: 'failed',
        data: [],
        missingData: ['product_id'],
        note: null,
      })
    ).toBe(
      'Статус:\n- failed\n\nДанные:\n- нет\n\nНедостающие данные:\n- product_id\n\nБлокер:\n- нет\n\nЗаметка:\n- нет'
    );
  });

  it('coerces legacy status=blocked payloads to failed when normalizing', () => {
    expect(
      normalizeWorkerResult({
        status: 'blocked',
        data: [],
        missingData: ['sku'],
        note: null,
      })
    ).toEqual({
      status: 'failed',
      data: [],
      missingData: ['sku'],
      note: null,
    });
  });

  it('includes summary in renderWorkerResult when present', () => {
    const out = renderWorkerResult({
      status: 'completed',
      data: ['id: 1'],
      missingData: [],
      note: null,
      summary: 'Товар создан.',
    });
    expect(out).toContain('Резюме:');
    expect(out).toContain('Товар создан.');
  });

  it('normalizes structured blocker payloads', () => {
    expect(
      normalizeWorkerResult({
        status: 'failed',
        data: [],
        missingData: ['Создать term Black для attribute Color'],
        note: 'Продолжение упирается в чужую мутацию.',
        blocker: {
          kind: 'external_mutation_required',
          owner: 'attribute-worker',
          reason: 'Нужно создать term Black у глобального атрибута Color.',
        },
      })
    ).toEqual({
      status: 'failed',
      data: [],
      missingData: ['Создать term Black для attribute Color'],
      note: 'Продолжение упирается в чужую мутацию.',
      blocker: {
        kind: 'external_mutation_required',
        owner: 'attribute-worker',
        reason: 'Нужно создать term Black у глобального атрибута Color.',
      },
    });
  });

  it('extracts the last structured worker result from tool runs', () => {
    expect(
      extractWorkerResult([
        {
          toolName: 'wc_v3_products_list',
          args: {},
          status: 'completed',
          structured: null,
        },
        {
          toolName: WORKER_RESULT_TOOL_NAME,
          args: {},
          status: 'completed',
          structured: {
            status: 'completed',
            data: ['product_id: 4335'],
            missingData: [],
            note: null,
          },
        },
      ])
    ).toEqual({
      status: 'completed',
      data: ['product_id: 4335'],
      missingData: [],
      note: null,
    });
  });

  it('converts WorkerResult to WorkerResultEnvelope', () => {
    const result = {
      status: 'completed' as const,
      data: ['category_id: 17'],
      missingData: [] as string[],
      note: 'Категория подтверждена.',
    };
    const envelope = workerResultToEnvelope(result);
    expect(envelope.status).toBe('completed');
    expect(envelope.facts).toEqual(['category_id: 17']);
    expect(envelope.missingInputs).toEqual([]);
    expect(envelope.summary).toBe('Категория подтверждена.');
  });

  it('preserves blocker in WorkerResultEnvelope', () => {
    const envelope = workerResultToEnvelope({
      status: 'failed',
      data: [],
      missingData: ['Создать attribute Color'],
      note: null,
      blocker: {
        kind: 'wrong_owner',
        owner: 'attribute-worker',
        reason: 'Шаг относится к глобальным атрибутам, а не к карточке товара.',
      },
    });
    expect(envelope.blocker).toEqual({
      kind: 'wrong_owner',
      owner: 'attribute-worker',
      reason: 'Шаг относится к глобальным атрибутам, а не к карточке товара.',
    });
  });

  it('workerResultToEnvelope uses summary when set, else note', () => {
    const withSummary = workerResultToEnvelope({
      status: 'failed',
      data: [],
      missingData: ['product_id'],
      note: 'old note',
      summary: 'Brief summary',
    });
    expect(withSummary.summary).toBe('Brief summary');
    const noteOnly = workerResultToEnvelope({
      status: 'completed',
      data: ['id: 1'],
      missingData: [],
      note: 'only note',
    });
    expect(noteOnly.summary).toBe('only note');
  });

  it('renderWorkerResultEnvelopeSummary uses summary when set', () => {
    const out = renderWorkerResultEnvelopeSummary({
      status: 'completed',
      facts: ['a', 'b'],
      missingInputs: [],
      summary: 'Done.',
    });
    expect(out).toContain('Статус: completed');
    expect(out).toContain('Done.');
  });

  it('renderWorkerResultEnvelopeSummary falls back to blocker when present', () => {
    const out = renderWorkerResultEnvelopeSummary({
      status: 'failed',
      facts: [],
      missingInputs: ['Создать term Black'],
      blocker: {
        kind: 'external_mutation_required',
        owner: 'attribute-worker',
        reason: 'Нужно создать term Black у атрибута Color.',
      },
      summary: null,
    });
    expect(out).toContain('Статус: failed');
    expect(out).toContain('Блокер: external_mutation_required -> attribute-worker');
    expect(out).toContain('Нужно создать term Black у атрибута Color.');
  });

  it('renderWorkerResultEnvelopeSummary falls back to counts and first fact when no summary', () => {
    const out = renderWorkerResultEnvelopeSummary({
      status: 'failed',
      facts: ['first fact here'],
      missingInputs: ['x'],
      summary: null,
    });
    expect(out).toContain('Статус: failed');
    expect(out).toContain('Фактов: 1');
    expect(out).toContain('Недостающие: 1');
    expect(out).toContain('first fact here');
  });
});
