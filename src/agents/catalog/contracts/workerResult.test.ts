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
        status: 'blocked',
        data: [],
        missingData: ['product_id'],
        note: null,
      })
    ).toBe(
      'Статус:\n- blocked\n\nДанные:\n- нет\n\nНедостающие данные:\n- product_id\n\nЗаметка:\n- нет'
    );
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

  it('workerResultToEnvelope uses summary when set, else note', () => {
    const withSummary = workerResultToEnvelope({
      status: 'blocked',
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

  it('renderWorkerResultEnvelopeSummary falls back to counts and first fact when no summary', () => {
    const out = renderWorkerResultEnvelopeSummary({
      status: 'blocked',
      facts: ['first fact here'],
      missingInputs: ['x'],
      summary: null,
    });
    expect(out).toContain('Статус: blocked');
    expect(out).toContain('Фактов: 1');
    expect(out).toContain('Недостающие: 1');
    expect(out).toContain('first fact here');
  });
});
