import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { CATALOG_WORKER_IDS } from '../../../../../contracts/catalogExecutionOwners';

const workerTaskOwnerSchema = z.enum(CATALOG_WORKER_IDS);

export const executionPlanContextSchema = z.object({
  goal: z.string().trim().min(1).describe('Цель плана.'),
  facts: z.array(z.string()).default([]).describe('Общие факты для всего плана.'),
  constraints: z.array(z.string()).default([]).describe('Общие ограничения для всего плана.'),
});

export const executableTaskInputSchema = z.object({
  taskId: z.string().describe('Стабильный ID шага.'),
  responsible: workerTaskOwnerSchema.describe('Worker owner для шага.'),
  task: z.string().describe('Краткая формулировка задачи.'),
  inputData: z.object({
    facts: z.array(z.string()).default([]).describe('Факты только для этого шага.'),
    constraints: z.array(z.string()).default([]).describe('Ограничения только для этого шага.'),
    contextNotes: z.string().optional().describe('Дополнительные пояснения для шага.'),
  }).describe('Step-local input для воркера.'),
  responseStructure: z.string().describe('Какой structured output ожидается от шага.'),
});

export const newExecutionPlanInputSchema = z.object({
  planContext: executionPlanContextSchema.describe('Общий контекст executable plan.'),
  tasks: z.array(executableTaskInputSchema).min(1).describe('Упорядоченный список шагов плана.'),
});

export const approveStepInputSchema = z.object({
  reason: z.string().optional().describe('Короткая причина продолжения шага.'),
});

export const finishExecutionPlanInputSchema = z.object({
  outcome: z.enum(['completed', 'failed']).describe('Финальный исход плана.'),
  summary: z.string().trim().min(1).describe('Итоговый ответ пользователю.'),
});

// NOTE: execution is implemented in `tools/dispatcher.ts` (see executeCatalogToolCall switch).
export const newExecutionPlanTool = tool(
  async () => {
    return {
      ok: true,
      note: 'new_execution_plan is handled by catalog foreman dispatcher',
    };
  },
  {
    name: 'new_execution_plan',
    description: 'Создать или заменить active executable plan и запустить первый шаг. Возвращает `catalog_execution_v3`.',
    schema: newExecutionPlanInputSchema,
  }
);

export const approveStepTool = tool(
  async () => {
    return { ok: true, note: 'approve_step is handled by catalog foreman dispatcher' };
  },
  {
    name: 'approve_step',
    description: 'Продолжить active plan со следующего approvable шага. Возвращает `catalog_execution_v3`.',
    schema: approveStepInputSchema,
  }
);

export const finishExecutionPlanTool = tool(
  async () => {
    return { ok: true, note: 'finish_execution_plan is handled by catalog foreman dispatcher' };
  },
  {
    name: 'finish_execution_plan',
    description: 'Завершить active plan и вернуть подтверждение финализации.',
    schema: finishExecutionPlanInputSchema,
  }
);

export type ExecutableTaskInput = z.infer<typeof executableTaskInputSchema>;
export type ApproveStepInput = z.infer<typeof approveStepInputSchema>;
export type FinishExecutionPlanInput = z.infer<typeof finishExecutionPlanInputSchema>;
