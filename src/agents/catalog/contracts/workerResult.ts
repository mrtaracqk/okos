import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { type ToolRun } from '../../shared/toolLoopGraph';

export const WORKER_RESULT_TOOL_NAME = 'report_worker_result';

export type WorkerResultStatus = 'completed' | 'failed';

/**
 * Shared envelope for worker result. Single canonical shape without
 * scenario-specific schemas. Used in state and tracing.
 */
export type WorkerResultEnvelope = {
  status: WorkerResultStatus;
  facts: string[];
  missingInputs: string[];
  artifacts?: unknown[];
  summary?: string | null;
};

export type WorkerResult = {
  status: WorkerResultStatus;
  data: string[];
  missingData: string[];
  note: string | null;
  /** Optional; mapped to WorkerResultEnvelope.artifacts */
  artifacts?: unknown[];
  /** Optional; mapped to WorkerResultEnvelope.summary (overrides note when set) */
  summary?: string | null;
};

const workerResultSchema = z.object({
  status: z
    .enum(['completed', 'failed'])
    .describe(
      'completed — шаг завершён или дан корректный ответ; failed — ошибка выполнения или шаг невозможен без недостающих данных (укажи missingData).'
    ),
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
  artifacts: z.array(z.unknown()).optional().describe('Опциональные артефакты результата.'),
  summary: z.string().trim().max(1000).nullable().optional().describe('Краткое резюме результата.'),
});

function renderList(lines: string[], emptyValue = 'нет') {
  return lines.length > 0 ? lines.map((line) => `- ${line}`).join('\n') : `- ${emptyValue}`;
}

function coerceLegacyWorkerResultPayload(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const rec = value as Record<string, unknown>;
  if (rec.status === 'blocked') {
    return { ...rec, status: 'failed' };
  }
  return value;
}

export function normalizeWorkerResult(value: unknown): WorkerResult | null {
  const parsed = workerResultSchema.safeParse(coerceLegacyWorkerResultPayload(value));
  if (!parsed.success) {
    return null;
  }

  return {
    status: parsed.data.status,
    data: parsed.data.data,
    missingData: parsed.data.missingData,
    note: parsed.data.note?.trim() ? parsed.data.note.trim() : null,
    artifacts: parsed.data.artifacts,
    summary: parsed.data.summary !== undefined ? (parsed.data.summary?.trim() ?? null) : undefined,
  };
}

/** Convert tool result to shared envelope for state and tracing. */
export function workerResultToEnvelope(result: WorkerResult): WorkerResultEnvelope {
  return {
    status: result.status,
    facts: result.data,
    missingInputs: result.missingData,
    artifacts: result.artifacts,
    summary: result.summary !== undefined ? result.summary : result.note,
  };
}

export function renderWorkerResult(result: WorkerResult) {
  const sections = [
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
  ];
  if (result.summary != null && result.summary.trim() !== '') {
    sections.push('', 'Резюме:', `- ${result.summary.trim()}`);
  }
  return sections.join('\n');
}

/**
 * Short derived summary from the result envelope for ToolMessage.content.
 * Source of truth remains the envelope in state; this is for planner readability only.
 */
export function renderWorkerResultEnvelopeSummary(envelope: WorkerResultEnvelope): string {
  const statusLine = `Статус: ${envelope.status}`;
  if (envelope.summary?.trim()) {
    return `${statusLine}\n\n${envelope.summary.trim()}`;
  }
  const parts = [
    statusLine,
    `Фактов: ${envelope.facts.length}`,
    `Недостающие: ${envelope.missingInputs.length}`,
  ];
  if (envelope.facts.length > 0 && envelope.facts[0]) {
    parts.push(envelope.facts[0].slice(0, 200));
  }
  return parts.join('. ');
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
        'Финализируй итоговый ответ. Вызывай ровно один раз, когда задача завершена успешно, невозможна без недостающих данных (status=failed + missingData) или завершилась ошибкой. После этого не вызывай другие инструменты.',
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
