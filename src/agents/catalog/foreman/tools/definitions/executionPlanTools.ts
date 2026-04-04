import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { PLAN_WORKER_OWNERS } from '../../../contracts/catalogWorkerId';

const workerTaskOwnerSchema = z.enum(PLAN_WORKER_OWNERS);

export const executionPlanContextSchema = z.object({
  goal: z.string().trim().min(1),
  facts: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
});

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
  planContext: executionPlanContextSchema,
  tasks: z.array(executableTaskInputSchema).min(1),
});

export const approveStepInputSchema = z.object({
  reason: z.string().optional(),
});

export const finishExecutionPlanInputSchema = z.object({
  outcome: z.enum(['completed', 'failed']),
  summary: z.string().trim().min(1),
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
    description:
      'Зафиксируй или полностью замени executable plan и запусти первую подзадачу (первая задача в списке становится in_progress). Передай общий planContext (goal/facts/constraints) для всего плана и step-local inputData у задач. Новый план всегда чистый: runtime сбросит artifacts от предыдущего плана. Если последний шаг уже успешен и следующий pending шаг можно выполнить с текущим execution result — не пересоздавай план, вызови approve_step. Tool result вернёт только JSON payload `catalog_execution_v2`; отдельного HumanMessage после вызова не будет.',
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
      'Продолжить план после результата воркера: runtime переводит следующую pending задачу в работу и запускает её. Следующий воркер получит planContext текущего плана, step-local inputData своей задачи и upstreamArtifacts только от непосредственно предыдущего completed шага, если они были. Вызывай по умолчанию, если `next_action.tool=approve_step` и не нужно менять planContext/tasks. Чтобы обновить общий контекст плана или хвост шагов — new_execution_plan; чтобы закончить работу — finish_execution_plan. Tool result вернёт только JSON payload `catalog_execution_v2`; отдельного HumanMessage после вызова не будет.',
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
