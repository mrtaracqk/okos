import { describe, expect, it } from 'bun:test';
import {
  extractWorkerResult,
  normalizeWorkerResult,
  renderWorkerResult,
  WORKER_RESULT_TOOL_NAME,
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
});
