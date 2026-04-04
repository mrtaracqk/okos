import { describe, expect, it } from 'bun:test';
import { renderRuntimePlan } from './telegram-adapter';
import type { RuntimePlan } from '../../runtime/planning/types';

describe('renderRuntimePlan', () => {
  it('renders checklist style output with owners and task notes', () => {
    const plan: RuntimePlan = {
      runId: 'run-1',
      chatId: 101,
      status: 'failed',
      planContext: {
        goal: 'Подготовить каталог',
        facts: [],
        constraints: [],
      },
      tasks: [
        {
          taskId: 'category',
          title: 'Определить или создать категорию',
          owner: 'category-worker',
          status: 'completed',
        },
        {
          taskId: 'attributes',
          title: 'Подготовить атрибуты',
          owner: 'attribute-worker',
          status: 'failed',
          notes: 'Нет Storage',
        },
      ],
    };

    expect(renderRuntimePlan(plan)).toContain('Статус: завершен с ошибкой');
    expect(renderRuntimePlan(plan)).toContain('✅ Определить или создать категорию');
    expect(renderRuntimePlan(plan)).toContain('❌ Подготовить атрибуты');
    expect(renderRuntimePlan(plan)).toContain('Ответственный: attribute-worker');
  });

  it('shows immediate execution hint when a task is already in progress', () => {
    const plan: RuntimePlan = {
      runId: 'run-2',
      chatId: 101,
      status: 'active',
      planContext: {
        goal: 'Проверить товар',
        facts: [],
        constraints: [],
      },
      tasks: [
        {
          taskId: 'product',
          title: 'Найти товар',
          owner: 'product-worker',
          status: 'in_progress',
        },
      ],
    };

    expect(renderRuntimePlan(plan)).toContain('Статус: в работе');
    expect(renderRuntimePlan(plan)).toContain('Сейчас выполняется шаг, отмеченный 🔄.');
    expect(renderRuntimePlan(plan)).toContain('🔄 Найти товар');
  });
});
