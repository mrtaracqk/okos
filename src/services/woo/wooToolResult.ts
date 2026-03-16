export type ToolErrorSource = 'approval-gate' | 'woo-sdk' | 'woo-tool';

export type NormalizedToolError = {
  source: ToolErrorSource;
  message: string;
  code?: string;
  type?: string;
  retryable: boolean;
};

export type NormalizedToolResult = {
  ok: boolean;
  structured: unknown | null;
  error?: NormalizedToolError;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRetryableToolError(input: {
  source: ToolErrorSource;
  code?: string;
  type?: string;
  message: string;
}) {
  const normalizedMessage = input.message.toLowerCase();
  return (
    input.type === 'approval_timeout' ||
    normalizedMessage.includes('timeout') ||
    normalizedMessage.includes('timed out') ||
    normalizedMessage.includes('network') ||
    normalizedMessage.includes('temporar')
  );
}

export function buildToolSuccess(structured?: unknown | null): NormalizedToolResult {
  return {
    ok: true,
    structured: structured ?? null,
  };
}

export function normalizeToolFailure(input: {
  structured?: unknown | null;
  fallbackSource?: ToolErrorSource;
}): NormalizedToolResult {
  const nestedError = isRecord(input.structured) && isRecord(input.structured.error)
    ? input.structured.error
    : null;
  const code = typeof nestedError?.code === 'string' ? nestedError.code : undefined;
  const type = typeof nestedError?.type === 'string' ? nestedError.type : undefined;
  const nestedMessage = typeof nestedError?.message === 'string' ? nestedError.message.trim() : '';
  const message = nestedMessage || 'Инструмент вернул результат с ошибкой.';
  const source = input.fallbackSource ?? (type?.startsWith('approval_') ? 'approval-gate' : 'woo-tool');

  return {
    ok: false,
    structured: input.structured ?? null,
    error: {
      source,
      message,
      code,
      type,
      retryable: isRetryableToolError({ source, code, type, message }),
    },
  };
}

export function normalizeToolFailureFromError(
  error: unknown,
  fallbackSource: ToolErrorSource = 'woo-sdk'
): NormalizedToolResult {
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка выполнения инструмента.';
  return normalizeToolFailure({
    structured: { error: { message } },
    fallbackSource,
  });
}

