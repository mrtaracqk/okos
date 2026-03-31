import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { PLAN_WORKER_OWNERS } from '../catalogWorkerKnowledge';

const workerTaskOwnerSchema = z.enum(PLAN_WORKER_OWNERS);

export const executableTaskInputSchema = z.object({
  taskId: z.string(),
  responsible: workerTaskOwnerSchema,
  task: z.string(),
  inputData: z.object({
    facts: z.array(z.string()).default([]),
    constraints: z.array(z.string()).default([]),
    contextNotes: z.string().optional(),
  }),
  responseStructure: z.string(),
});

export const newExecutionPlanInputSchema = z.object({
  tasks: z.array(executableTaskInputSchema).min(1),
});

export const approveStepInputSchema = z.object({
  reason: z.string().optional(),
});

export const finishExecutionPlanInputSchema = z.object({
  outcome: z.enum(['completed', 'failed']),
  summary: z.string().trim().min(1),
});

// NOTE: execution is implemented in `toolDispatcher.ts` (see executeCatalogToolCall switch).
export const newExecutionPlanTool = tool(
  async () => {
    return {
      ok: true,
      note: 'new_execution_plan is handled by catalog foreman dispatcher',
    };
  },
  {
    name: 'new_execution_plan',
    description:
      'Зафиксируй или полностью замени executable snapshot плана и запусти первую подзадачу (первая задача в списке становится in_progress). Используй, когда нужно изменить список шагов или execution (facts/constraints) для будущих задач. Если последний шаг уже успешен и следующий pending шаг можно выполнить с текущим snapshot — не пересоздавай план, вызови approve_step. После вызова придёт короткий ToolMessage и отдельное HumanMessage с итогом подзадачи — по ним выбирай approve_step, new_execution_plan или finish_execution_plan.',
    schema: newExecutionPlanInputSchema,
  }
);

export const approveStepTool = tool(
  async () => {
    return { ok: true, note: 'approve_step is handled by catalog foreman dispatcher' };
  },
  {
    name: 'approve_step',
    description:
      'Продолжить план после результата воркера: runtime переводит следующую pending задачу в работу и запускает её. Входные данные берутся только из snapshot плана (execution у задачи); facts из предыдущего шага в следующий не подставляются автоматически. Вызывай по умолчанию, если последняя завершённая подзадача успешна (completed) и менять tasks[] не нужно. Чтобы обновить хвост или facts для следующих шагов — new_execution_plan; чтобы закончить работу — finish_execution_plan. После вызова — короткий ToolMessage и отдельное HumanMessage с итогом шага.',
    schema: approveStepInputSchema,
  }
);

export const finishExecutionPlanTool = tool(
  async () => {
    return { ok: true, note: 'finish_execution_plan is handled by catalog foreman dispatcher' };
  },
  {
    name: 'finish_execution_plan',
    description:
      'Завершить работу по активному плану: outcome=completed — успешный итог, outcome=failed — ошибка или невозможность выполнить запрос; summary — готовый ответ пользователю (обязателен), факты из воркеров переноси дословно, без служебных префиксов вроде «Готово:».',
    schema: finishExecutionPlanInputSchema,
  }
);

export type ExecutableTaskInput = z.infer<typeof executableTaskInputSchema>;
export type ApproveStepInput = z.infer<typeof approveStepInputSchema>;
export type FinishExecutionPlanInput = z.infer<typeof finishExecutionPlanInputSchema>;
