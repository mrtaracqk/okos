import { describe, expect, test } from 'bun:test';
import { approveStepTool, finishCatalogTurnTool, newExecutionPlanTool } from './executionPlanTools';

function getDescription(tool: { description?: string }) {
  return tool.description ?? '';
}

describe('catalog foreman tool descriptions', () => {
  test('keep orchestration tools at affordance layer', () => {
    const newPlanDescription = getDescription(newExecutionPlanTool);
    const approveDescription = getDescription(approveStepTool);
    const finishDescription = getDescription(finishCatalogTurnTool);
    const combined = [newPlanDescription, approveDescription, finishDescription].join('\n');

    expect(newPlanDescription).toBe(
      'Создать или заменить active executable plan и запустить первый шаг. Возвращает `catalog_execution_v3`.'
    );
    expect(approveDescription).toBe(
      'Продолжить active plan со следующего approvable шага. Возвращает `catalog_execution_v3`.'
    );
    expect(finishDescription).toBe(
      'Зафиксировать итоговый ответ пользователю и закончить ход каталога. С активным планом закрывает его; без плана — только финальный ответ (консультация без воркеров).'
    );

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
