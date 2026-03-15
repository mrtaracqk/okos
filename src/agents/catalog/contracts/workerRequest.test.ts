import { describe, expect, it } from 'bun:test';
import { buildWorkerInput, normalizeWorkerRequestMode, requiresWorkerToolCall } from './workerRequest';

describe('workerRequests', () => {
  it('defaults unknown worker request mode to execute', () => {
    expect(normalizeWorkerRequestMode(undefined)).toBe('execute');
    expect(normalizeWorkerRequestMode('anything-else')).toBe('execute');
  });

  it('keeps consult mode explicit', () => {
    expect(normalizeWorkerRequestMode('consult')).toBe('consult');
    expect(requiresWorkerToolCall('consult')).toBe(false);
    expect(requiresWorkerToolCall('execute')).toBe(true);
  });

  it('builds worker input with explicit handoff blocks', () => {
    expect(
      buildWorkerInput({
        mode: 'consult',
        whatToDo: 'Скажи, какой минимум полей нужен для создания товара.',
        dataForExecution: 'Тип товара пока не указан.',
        whyNow: 'Нужно ответить пользователю без предположений.',
        whatToReturn: '- status\n- data\n- missingData\n- note',
      })
    ).toContain('Режим запроса: consult');
    expect(
      buildWorkerInput({
        mode: 'consult',
        whatToDo: 'Скажи, какой минимум полей нужен для создания товара.',
        dataForExecution: 'Тип товара пока не указан.',
        whyNow: 'Нужно ответить пользователю без предположений.',
        whatToReturn: '- status\n- data\n- missingData\n- note',
      })
    ).toContain('Данные для выполнения:\nТип товара пока не указан.');

    expect(
      buildWorkerInput({
        mode: 'execute',
        whatToDo: 'Создай товар "iPhone 17".',
        whyNow: 'Для продолжения обработки нужен product_id.',
        whatToReturn: '- status\n- product_id',
      })
    ).toBe(
      'Режим запроса: execute\n\nЧто сделать:\nСоздай товар "iPhone 17".\n\nДанные для выполнения:\nНет дополнительных данных.\n\nПочему это нужно сделать сейчас:\nДля продолжения обработки нужен product_id.\n\nЧто вернуть:\n- status\n- product_id'
    );
  });
});
