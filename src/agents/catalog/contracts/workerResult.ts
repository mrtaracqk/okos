import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { type ToolRun } from '../../shared/toolLoopGraph';

export const WORKER_RESULT_TOOL_NAME = 'report_worker_result';

export type WorkerResultStatus = 'completed' | 'blocked' | 'failed';

export type WorkerResult = {
  status: WorkerResultStatus;
  data: string[];
  missingData: string[];
  note: string | null;
};

const workerResultSchema = z.object({
  status: z
    .enum(['completed', 'blocked', 'failed'])
    .describe('completed — шаг завершён; blocked — не хватает обязательных данных или предусловия; failed — произошло фактическое выполнение с ошибкой.'),
  data: z
    .array(z.string().min(1))
    .default([])
    .describe('Только факты и результаты выполнения в формате коротких строк.'),
  missingData: z
    .array(z.string().min(1))
    .default([])
    .describe('Только реально недостающие данные, без советов и следующих шагов.'),
  note: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional()
    .describe('Короткая фактическая заметка, если нужна.'),
});

function renderList(lines: string[], emptyValue = 'нет') {
  return lines.length > 0 ? lines.map((line) => `- ${line}`).join('\n') : `- ${emptyValue}`;
}

export function normalizeWorkerResult(value: unknown): WorkerResult | null {
  const parsed = workerResultSchema.safeParse(value);
  if (!parsed.success) {
    return null;
  }

  return {
    status: parsed.data.status,
    data: parsed.data.data,
    missingData: parsed.data.missingData,
    note: parsed.data.note?.trim() ? parsed.data.note.trim() : null,
  };
}

export function renderWorkerResult(result: WorkerResult) {
  return [
    'Статус:',
    `- ${result.status}`,
    '',
    'Данные:',
    renderList(result.data),
    '',
    'Недостающие данные:',
    renderList(result.missingData),
    '',
    'Заметка:',
    `- ${result.note ?? 'нет'}`,
  ].join('\n');
}

export function createWorkerResultTool() {
  return tool(
    async (input) => {
      const result = normalizeWorkerResult(input);
      if (!result) {
        throw new Error('Некорректный payload report_worker_result.');
      }

      return {
        ok: true,
        structured: result,
      };
    },
    {
      name: WORKER_RESULT_TOOL_NAME,
      description:
        'Финализируй итогоый ответ. Вызывай ровно один раз, когда вся задача завершена, заблокирована или завершилась ошибкой. После этого не вызывай другие инструменты.',
      schema: workerResultSchema,
    }
  );
}

export function extractWorkerResult(toolRuns: ToolRun[]) {
  for (let index = toolRuns.length - 1; index >= 0; index -= 1) {
    const toolRun = toolRuns[index];
    if (toolRun?.toolName !== WORKER_RESULT_TOOL_NAME) {
      continue;
    }

    const result = normalizeWorkerResult(toolRun.structured);
    if (result) {
      return result;
    }
  }

  return null;
}

export function countDomainToolRuns(toolRuns: ToolRun[]) {
  return toolRuns.filter((toolRun) => toolRun.toolName !== WORKER_RESULT_TOOL_NAME).length;
}
