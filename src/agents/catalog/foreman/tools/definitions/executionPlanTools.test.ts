import { describe, expect, test } from 'bun:test';
import { approveStepTool, finishExecutionPlanTool, newExecutionPlanTool } from './executionPlanTools';

function getDescription(tool: { description?: string }) {
  return tool.description ?? '';
}

describe('catalog foreman tool descriptions', () => {
  test('keep orchestration tools at affordance layer', () => {
    const newPlanDescription = getDescription(newExecutionPlanTool);
    const approveDescription = getDescription(approveStepTool);
    const finishDescription = getDescription(finishExecutionPlanTool);
    const combined = [newPlanDescription, approveDescription, finishDescription].join('\n');

    expect(newPlanDescription).toBe(
      'Создать или заменить active executable plan и запустить первый шаг. Возвращает `catalog_execution_v3`.'
    );
    expect(approveDescription).toBe(
      'Продолжить active plan со следующего approvable шага. Возвращает `catalog_execution_v3`.'
    );
    expect(finishDescription).toBe('Завершить active plan и вернуть подтверждение финализации.');

    for (const forbiddenSnippet of [
      '`planContext`',
      '`tasks`',
      '`reason`',
      '`outcome`',
      '`summary`',
      '`completed_step`',
      '`next_step`',
      'не пересоздавай план',
      'отдельного HumanMessage',
      'по умолчанию, если `next_step.tool=approve_step`',
      'Чтобы обновить общий контекст плана',
      'факты из воркеров переноси дословно',
    ]) {
      expect(combined).not.toContain(forbiddenSnippet);
    }
  });
});
