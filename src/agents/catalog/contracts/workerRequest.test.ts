import { describe, expect, it } from 'bun:test';
import {
  buildWorkerInput,
  buildWorkerInputFromEnvelope,
  normalizeWorkerRequestMode,
  parseHandoffArgsToEnvelope,
  requiresWorkerToolCall,
  toWorkerTaskEnvelope,
  type WorkerRequest,
  type WorkerTaskEnvelope,
} from './workerRequest';

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

  it('converts WorkerRequest to WorkerTaskEnvelope and renders same text via buildWorkerInputFromEnvelope', () => {
    const request: WorkerRequest = {
      mode: 'execute',
      whatToDo: 'Создай товар "iPhone 17".',
      whyNow: 'Для продолжения обработки нужен product_id.',
      whatToReturn: '- status\n- product_id',
    };
    const envelope = toWorkerTaskEnvelope(request);
    expect(envelope.mode).toBe('execute');
    expect(envelope.objective).toBe('Создай товар "iPhone 17".');
    expect(envelope.facts).toEqual([]);
    expect(envelope.expectedOutput).toBe('- status\n- product_id');
    expect(envelope.contextNotes).toBe('Для продолжения обработки нужен product_id.');
    expect(buildWorkerInputFromEnvelope(envelope)).toBe(buildWorkerInput(request));
  });

  it('buildWorkerInputFromEnvelope uses facts for data block', () => {
    const envelope: WorkerTaskEnvelope = {
      mode: 'consult',
      objective: 'Проверь наличие полей.',
      facts: ['Тип: simple', 'Категория: 17'],
      constraints: [],
      expectedOutput: 'status, data, missingData',
      contextNotes: 'Нужно без предположений.',
    };
    const text = buildWorkerInputFromEnvelope(envelope);
    expect(text).toContain('Данные для выполнения:\nТип: simple\nКатегория: 17');
  });

  describe('parseHandoffArgsToEnvelope', () => {
    it('parses envelope-shaped tool args into WorkerTaskEnvelope', () => {
      const envelope = parseHandoffArgsToEnvelope({
        mode: 'execute',
        objective: 'Создай товар "iPhone 17".',
        facts: 'Тип: simple\nКатегория: 17',
        expectedOutput: '- status\n- product_id',
        contextNotes: 'Для продолжения нужен product_id.',
      });
      expect(envelope.mode).toBe('execute');
      expect(envelope.objective).toBe('Создай товар "iPhone 17".');
      expect(envelope.facts).toEqual(['Тип: simple', 'Категория: 17']);
      expect(envelope.constraints).toEqual([]);
      expect(envelope.expectedOutput).toBe('- status\n- product_id');
      expect(envelope.contextNotes).toBe('Для продолжения нужен product_id.');
    });

    it('defaults mode to execute when missing or invalid', () => {
      expect(parseHandoffArgsToEnvelope({ objective: 'X', expectedOutput: 'Y' }).mode).toBe('execute');
      expect(parseHandoffArgsToEnvelope({ mode: 'consult', objective: 'X', expectedOutput: 'Y' }).mode).toBe('consult');
    });

    it('trims and splits facts/constraints by newlines', () => {
      const envelope = parseHandoffArgsToEnvelope({
        objective: 'Task',
        expectedOutput: 'Out',
        facts: '  a  \n\n  b  \n  c  ',
        constraints: ' one \n two ',
      });
      expect(envelope.facts).toEqual(['a', 'b', 'c']);
      expect(envelope.constraints).toEqual(['one', 'two']);
    });
  });
});
