import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { CATALOG_WORKER_IDS, type CatalogWorkerId } from '../../../contracts/catalogExecutionOwners';
import { type ToolRun } from '../../shared/toolRun';

export const WORKER_RESULT_TOOL_NAME = 'report_worker_result';

export type WorkerResultStatus = 'completed' | 'failed';

export type WorkerResultBlockerKind = 'external_mutation_required' | 'wrong_owner';

export type WorkerResultBlocker = {
  kind: WorkerResultBlockerKind;
  owner: CatalogWorkerId;
  reason: string;
};

/**
 * Shared trace/log envelope derived from canonical WorkerResult.
 */
export type WorkerResultEnvelope = {
  status: WorkerResultStatus;
  facts: string[];
  missingInputs: string[];
  blocker?: WorkerResultBlocker | null;
  artifacts?: unknown[];
  summary?: string | null;
};

export type WorkerResult = {
  status: WorkerResultStatus;
  /** Canonical structured facts/result lines for planner reasoning. */
  data: string[];
  /** Canonical list of missing inputs or prerequisites. */
  missingData: string[];
  /** Optional human-readable note for logs/operator reading. */
  note: string | null;
  /** Optional structured blocker for cross-owner handoff or external mutation. */
  blocker?: WorkerResultBlocker | null;
  /** Optional; mapped to WorkerResultEnvelope.artifacts */
  artifacts?: unknown[];
  /** Optional short digest for logs/operator reading; mapped to WorkerResultEnvelope.summary */
  summary?: string | null;
};

const workerResultBlockerSchema = z.object({
  kind: z
    .enum(['external_mutation_required', 'wrong_owner'])
    .describe(
      'external_mutation_required — для продолжения нужна чужая мутация в соседнем домене; wrong_owner — сам шаг не относится к твоей зоне ответственности.'
    ),
  owner: z
    .enum(CATALOG_WORKER_IDS)
    .describe('Какой worker владеет следующим шагом или требуемой мутацией.'),
  reason: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .describe('Коротко и по факту: почему возник blocker и что именно упёрлось в чужую зону.'),
});

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
    .describe('Короткая фактическая заметка, если нужна. Planner reason-ит по data/missingData/blocker.'),
  blocker: workerResultBlockerSchema
    .nullable()
    .optional()
    .describe('Структурный blocker, если lookup показал внешний блокер или шаг вообще не твой.'),
  artifacts: z.array(z.unknown()).optional().describe('Опциональные артефакты результата.'),
  summary: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional()
    .describe('Краткий human-readable digest результата для логов и операторского чтения.'),
});

function renderList(lines: string[], emptyValue = 'нет') {
  return lines.length > 0 ? lines.map((line) => `- ${line}`).join('\n') : `- ${emptyValue}`;
}

function renderBlocker(blocker: WorkerResultBlocker | null | undefined) {
  if (!blocker) return null;
  return `${blocker.kind} -> ${blocker.owner}: ${blocker.reason}`;
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
    ...(parsed.data.blocker !== undefined ? { blocker: parsed.data.blocker ?? null } : {}),
    artifacts: parsed.data.artifacts,
    summary: parsed.data.summary !== undefined ? (parsed.data.summary?.trim() ?? null) : undefined,
  };
}

/** Convert canonical WorkerResult to the trace/log envelope. */
export function workerResultToEnvelope(result: WorkerResult): WorkerResultEnvelope {
  return {
    status: result.status,
    facts: result.data,
    missingInputs: result.missingData,
    ...(result.blocker !== undefined ? { blocker: result.blocker ?? null } : {}),
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
    'Блокер:',
    `- ${renderBlocker(result.blocker) ?? 'нет'}`,
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
 * Short derived summary from the result envelope for trace/log-oriented text.
 */
export function renderWorkerResultEnvelopeSummary(envelope: WorkerResultEnvelope): string {
  const statusLine = `Статус: ${envelope.status}`;
  if (envelope.summary?.trim()) {
    return `${statusLine}\n\n${envelope.summary.trim()}`;
  }
  const blockerLine = renderBlocker(envelope.blocker);
  if (blockerLine) {
    return `${statusLine}\n\nБлокер: ${blockerLine}`;
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
        'Зафиксировать итоговый worker result и завершить работу воркера.',
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
