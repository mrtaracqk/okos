import { describe, expect, it } from 'bun:test';
import {
  buildWorkerInput,
  parseHandoffArgsToEnvelope,
  toWorkerTaskEnvelope,
  type WorkerRequest,
} from './workerRequest';

describe('workerRequests', () => {
  it('builds worker input with explicit handoff blocks', () => {
    expect(
      buildWorkerInput({
        whatToDo: 'Скажи, какой минимум полей нужен для создания товара.',
        dataForExecution: 'Тип товара пока не указан.',
        whyNow: 'Нужно ответить пользователю без предположений.',
        whatToReturn: '- status\n- data\n- missingData\n- note',
      })
    ).toContain('Данные для выполнения:\nТип товара пока не указан.');

    expect(
      buildWorkerInput({
        whatToDo: 'Создай товар "iPhone 17".',
        whyNow: 'Для продолжения обработки нужен product_id.',
        whatToReturn: '- status\n- product_id',
      })
    ).toBe(
      'Что сделать:\nСоздай товар "iPhone 17".\n\nДанные для выполнения:\nНет дополнительных данных.\n\nПочему это нужно сделать сейчас:\nДля продолжения обработки нужен product_id.\n\nЧто вернуть:\n- status\n- product_id'
    );
  });

  it('converts WorkerRequest to WorkerTaskEnvelope', () => {
    const request: WorkerRequest = {
      whatToDo: 'Создай товар "iPhone 17".',
      whyNow: 'Для продолжения обработки нужен product_id.',
      whatToReturn: '- status\n- product_id',
    };
    const envelope = toWorkerTaskEnvelope(request);
    expect(envelope.planContext).toEqual({
      goal: 'Для продолжения обработки нужен product_id.',
      facts: [],
      constraints: [],
    });
    expect(envelope.taskInput).toEqual({
      objective: 'Создай товар "iPhone 17".',
      facts: [],
      constraints: [],
      expectedOutput: '- status\n- product_id',
      contextNotes: 'Для продолжения обработки нужен product_id.',
    });
    expect(envelope.upstreamArtifacts).toBeUndefined();
  });

  describe('parseHandoffArgsToEnvelope', () => {
    it('parses envelope-shaped tool args into WorkerTaskEnvelope', () => {
      const envelope = parseHandoffArgsToEnvelope({
        planGoal: 'Найти и обновить товар',
        planFacts: 'shop=onlyphones\nrequest=lookup',
        planConstraints: 'Не создавать новые сущности',
        objective: 'Создай товар "iPhone 17".',
        facts: 'Тип: simple\nКатегория: 17',
        upstreamArtifacts: [{ product_id: 101 }],
        expectedOutput: '- status\n- product_id',
        contextNotes: 'Для продолжения нужен product_id.',
      });
      expect(envelope.planContext).toEqual({
        goal: 'Найти и обновить товар',
        facts: ['shop=onlyphones', 'request=lookup'],
        constraints: ['Не создавать новые сущности'],
      });
      expect(envelope.taskInput).toEqual({
        objective: 'Создай товар "iPhone 17".',
        facts: ['Тип: simple', 'Категория: 17'],
        constraints: [],
        expectedOutput: '- status\n- product_id',
        contextNotes: 'Для продолжения нужен product_id.',
      });
      expect(envelope.upstreamArtifacts).toEqual([{ product_id: 101 }]);
    });

    it('trims and splits facts/constraints by newlines', () => {
      const envelope = parseHandoffArgsToEnvelope({
        planGoal: '  Goal ',
        objective: 'Task',
        expectedOutput: 'Out',
        planFacts: '  global a  \n\n  global b  ',
        facts: '  a  \n\n  b  \n  c  ',
        constraints: ' one \n two ',
      });
      expect(envelope.planContext).toEqual({
        goal: 'Goal',
        facts: ['global a', 'global b'],
        constraints: [],
      });
      expect(envelope.taskInput.facts).toEqual(['a', 'b', 'c']);
      expect(envelope.taskInput.constraints).toEqual(['one', 'two']);
    });
  });
});
