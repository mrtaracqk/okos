import { tool } from '@langchain/core/tools';
import { getConfig } from '@langchain/langgraph';
import { z } from 'zod';
import { PlanningCore, isPlanningRuntimeError } from './core';
import { TelegramPlanningAdapter } from './telegram-adapter';
import { PLAN_TASK_OWNERS, PLAN_TASK_STATUSES } from './types';

export const EXECUTION_PLAN_REQUIRED_MESSAGE = 'Сначала создай план выполнения.';
export const PLANNING_RUNTIME_UNAVAILABLE_MESSAGE = 'Runtime планирования недоступен для этого запуска.';

const runtimePlanTaskSchema = z.object({
  taskId: z.string(),
  title: z.string(),
  owner: z.enum(PLAN_TASK_OWNERS),
  status: z.enum(PLAN_TASK_STATUSES),
  notes: z.string().optional(),
});

export const manageExecutionPlanInputSchema = z.object({
  action: z.enum(['create', 'update', 'complete', 'fail']),
  tasks: z.array(runtimePlanTaskSchema).optional(),
});

type PlanningRunContext = {
  runId: string;
  chatId: number;
  startedAt?: Date;
  requestText?: string;
};

const planningRuntime = new PlanningCore({
  channelAdapter: new TelegramPlanningAdapter(),
});

function parseOptionalDate(value: unknown) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

export function getPlanningRunContext(): PlanningRunContext | null {
  const config = getConfig();
  const configurable = (config?.configurable ?? {}) as Record<string, unknown>;
  const runId = typeof configurable.thread_id === 'string' ? configurable.thread_id : null;
  const chatId = configurable.chatId;

  if (!runId || typeof chatId !== 'number' || !Number.isInteger(chatId)) {
    return null;
  }

  return {
    runId,
    chatId,
    startedAt: parseOptionalDate(configurable.startedAt),
    requestText: typeof configurable.requestText === 'string' ? configurable.requestText : undefined,
  };
}

export function getPlanningRuntime() {
  return planningRuntime;
}

function formatPlanMutationResult(message: string) {
  return `План выполнения обновлён. ${message}`;
}

function formatPlanningError(message: string) {
  return `Ошибка планирования: ${message}`;
}

export const manageExecutionPlanTool = tool(
  async (input) => {
    const runtimeContext = getPlanningRunContext();
    if (!runtimeContext) {
      return formatPlanningError(PLANNING_RUNTIME_UNAVAILABLE_MESSAGE);
    }

    try {
      switch (input.action) {
        case 'create': {
          if (!input.tasks) {
            return formatPlanningError('Для action="create" нужен полный снимок tasks.');
          }

          const plan = await planningRuntime.createPlan({
            runId: runtimeContext.runId,
            chatId: runtimeContext.chatId,
            tasks: input.tasks,
            startedAt: runtimeContext.startedAt,
            requestText: runtimeContext.requestText,
          });

          return formatPlanMutationResult(
            `Создан план с количеством задач: ${plan.tasks.length}.`
          );
        }
        case 'update': {
          if (!input.tasks) {
            return formatPlanningError('Для action="update" нужен полный снимок tasks.');
          }

          const plan = await planningRuntime.updatePlan({
            runId: runtimeContext.runId,
            tasks: input.tasks,
          });

          return formatPlanMutationResult(`Снимок плана заменён. Активных задач: ${plan.tasks.length}.`);
        }
        case 'complete': {
          const plan = await planningRuntime.completePlan(runtimeContext.runId);
          return formatPlanMutationResult(`План завершён со статусом "${plan.status}".`);
        }
        case 'fail': {
          const plan = await planningRuntime.failPlan(runtimeContext.runId);
          return formatPlanMutationResult(`План переведён в статус "${plan.status}".`);
        }
      }
    } catch (error) {
      if (isPlanningRuntimeError(error)) {
        return formatPlanningError(error.message);
      }

      throw error;
    }
  },
  {
    name: 'manage_execution_plan',
    description:
      'Управляй планом выполнения каталожной задачи. Используй action=create до первого вызова воркера, action=update с полным снимком tasks при каждом изменении плана, а action=complete или action=fail перед возвратом финального ответа.',
    schema: manageExecutionPlanInputSchema,
  }
);
