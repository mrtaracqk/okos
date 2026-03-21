import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const WORKER_TASK_OWNERS = ['category-worker', 'attribute-worker', 'product-worker', 'variation-worker'] as const;
const workerTaskOwnerSchema = z.enum(WORKER_TASK_OWNERS);

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

export const runExecutionPlanInputSchema = z.object({
  tasks: z.array(executableTaskInputSchema).min(1),
});

export type ExecutionPlanCheckpointAction = 'approve' | 'replan' | 'complete' | 'fail';

const foremanCompletionResultSchema = z.object({
  summary: z.string().trim().min(1),
});

// Single root object — OpenAI tool JSON Schema requires `type: "object"`.
// `discriminatedUnion` does not reliably serialize to a valid object schema.
export const foremanCheckpointInputSchema = z
  .object({
    action: z.enum(['approve', 'replan', 'complete', 'fail']),
    reason: z.string().optional(),
    result: foremanCompletionResultSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === 'complete' || data.action === 'fail') {
      const summary = data.result?.summary?.trim();
      if (!summary) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['result', 'summary'],
          message: 'Для action=complete|fail укажи result.summary с финальным ответом.',
        });
      }
    }
  });

// NOTE: execution is implemented in `toolDispatcher.ts` (see executeCatalogToolCall switch).
export const runExecutionPlanTool = tool(
  async () => {
    return {
      ok: true,
      note: 'run_execution_plan is handled by catalog foreman dispatcher',
    };
  },
  {
    name: 'run_execution_plan',
    description:
      'Запусти исполнение executable execution plan: зафиксируй задачи и выполни первую подзадачу. После выполнения верни результат для checkpoint decision.',
    schema: runExecutionPlanInputSchema,
  }
);

export const foremanCheckpointTool = tool(
  async () => {
    return { ok: true, note: 'foreman_checkpoint is handled by catalog foreman dispatcher' };
  },
  {
    name: 'foreman_checkpoint',
    description:
      'Checkpoint gate после результата воркера: approve — продолжить по плану, replan — запросить новый план, complete/fail — закрыть план и сразу передать финальный ответ через result.summary.',
    schema: foremanCheckpointInputSchema,
  }
);

// Helpful aliases for consumers (not required by dispatcher).
export type ExecutableTaskInput = z.infer<typeof executableTaskInputSchema>;
export type ForemanCheckpointInput = z.infer<typeof foremanCheckpointInputSchema>;

