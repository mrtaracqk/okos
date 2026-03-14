import { OITracer, setAttributes, setMetadata, setSession, setUser } from '@arizeai/openinference-core';
import { OpenInferenceSpanKind, SemanticConventions } from '@arizeai/openinference-semantic-conventions';
import {
  context as otelContext,
  trace,
  SpanStatusCode,
  type Attributes,
  type Context,
} from '@opentelemetry/api';
import { getConfig } from '@langchain/langgraph';
import { getTelegramRequestContext } from '../approval/requestContext';
import { isPhoenixTracingEnabled } from './phoenix';

type PrimitiveAttribute = string | number | boolean;
type TraceAttributeArray = string[] | number[] | boolean[];
type TraceAttributeValue = PrimitiveAttribute | TraceAttributeArray;
type TraceAttributeRecord = Record<string, unknown>;

const tracer = new OITracer({
  tracer: trace.getTracer('op-assistant-observability'),
});

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function toPrimitiveAttribute(value: unknown): TraceAttributeValue | undefined {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    const stringItems = value.filter((item): item is string => typeof item === 'string');
    if (stringItems.length === value.length && stringItems.length > 0) {
      return stringItems;
    }

    const numberItems = value.filter((item): item is number => typeof item === 'number');
    if (numberItems.length === value.length && numberItems.length > 0) {
      return numberItems;
    }

    const booleanItems = value.filter((item): item is boolean => typeof item === 'boolean');
    if (booleanItems.length === value.length && booleanItems.length > 0) {
      return booleanItems;
    }

    return undefined;
  }

  return undefined;
}

export function formatTraceValue(value: unknown, maxLength = 1000) {
  if (typeof value === 'string') {
    return truncateText(value.trim(), maxLength);
  }

  try {
    return truncateText(JSON.stringify(value), maxLength);
  } catch {
    return truncateText(String(value), maxLength);
  }
}

export function formatTraceText(value: unknown, maxLength = 1500) {
  if (typeof value === 'string') {
    return truncateText(value.trim(), maxLength);
  }

  try {
    return truncateText(JSON.stringify(value, null, 2), maxLength);
  } catch {
    return truncateText(String(value), maxLength);
  }
}

export function buildTraceAttributes(input: TraceAttributeRecord): Attributes {
  const entries = Object.entries(input)
    .map(([key, value]) => {
      const primitive = toPrimitiveAttribute(value);
      if (primitive !== undefined) {
        return [key, primitive] as const;
      }

      if (value === null || value === undefined) {
        return null;
      }

      return [key, formatTraceValue(value)] as const;
    })
    .filter((entry): entry is readonly [string, TraceAttributeValue] => entry !== null);

  return Object.fromEntries(entries);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' ? error : 'Unknown observability error.';
}

function getErrorType(error: unknown) {
  if (error instanceof Error) {
    return error.name;
  }

  return typeof error;
}

export function getCurrentRunThreadId() {
  const config = getConfig();
  const threadId = config?.configurable?.thread_id;
  return typeof threadId === 'string' ? threadId : undefined;
}

export function buildTelegramTraceContext(input: {
  chatId: number;
  inputText: string;
  runThreadId?: string;
}) {
  const requestContext = getTelegramRequestContext();
  let currentContext = otelContext.active();

  currentContext = setSession(currentContext, {
    sessionId: `telegram-chat:${input.chatId}`,
  });

  if (requestContext?.telegramUserId) {
    currentContext = setUser(currentContext, {
      userId: String(requestContext.telegramUserId),
    });
  }

  currentContext = setMetadata(currentContext, {
    chat_id: input.chatId,
    telegram_user_id: requestContext?.telegramUserId,
    telegram_username: requestContext?.telegramUsername,
    run_thread_id: input.runThreadId,
    transport: 'telegram',
  });

  currentContext = setAttributes(
    currentContext,
    buildTraceAttributes({
      'input.value': input.inputText,
      'session.id': `telegram-chat:${input.chatId}`,
      'user.id': requestContext?.telegramUserId ? String(requestContext.telegramUserId) : undefined,
      'telegram.chat_id': input.chatId,
      'telegram.user_id': requestContext?.telegramUserId,
      'telegram.username': requestContext?.telegramUsername,
      'run.thread_id': input.runThreadId,
      'transport': 'telegram',
    })
  );

  return currentContext;
}

export function withTraceContext<T>(context: Context, execute: () => Promise<T>): Promise<T> {
  return otelContext.with(context, execute);
}

type ObservedSpanOptions<T> = {
  attributes?: Attributes;
  kind: OpenInferenceSpanKind;
  mapResultAttributes?: (result: T) => Attributes;
  name: string;
  statusMessage?: (result: T) => string | undefined;
};

async function runObservedSpan<T>(
  options: ObservedSpanOptions<T>,
  execute: () => Promise<T>
): Promise<T> {
  if (!isPhoenixTracingEnabled()) {
    return execute();
  }

  return tracer.startActiveSpan(
    options.name,
    {
      attributes: {
        ...options.attributes,
        [SemanticConventions.OPENINFERENCE_SPAN_KIND]: options.kind,
      },
    },
    async (span) => {
      try {
        const result = await execute();
        const resultAttributes = options.mapResultAttributes?.(result);
        if (resultAttributes && Object.keys(resultAttributes).length > 0) {
          span.setAttributes(resultAttributes);
        }

        const statusMessage = options.statusMessage?.(result);
        span.setStatus({
          code: statusMessage ? SpanStatusCode.ERROR : SpanStatusCode.OK,
          ...(statusMessage ? { message: statusMessage } : {}),
        });

        return result;
      } catch (error) {
        span.setAttributes(
          buildTraceAttributes({
            'error.type': getErrorType(error),
            'error.message': getErrorMessage(error),
          })
        );
        span.recordException(error instanceof Error ? error : new Error(getErrorMessage(error)));
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: getErrorMessage(error),
        });
        throw error;
      } finally {
        span.end();
      }
    }
  );
}

export function runChainSpan<T>(
  name: string,
  execute: () => Promise<T>,
  options: Omit<ObservedSpanOptions<T>, 'kind' | 'name'> = {}
) {
  return runObservedSpan(
    {
      ...options,
      kind: OpenInferenceSpanKind.CHAIN,
      name,
    },
    execute
  );
}

export function runAgentSpan<T>(
  name: string,
  execute: () => Promise<T>,
  options: Omit<ObservedSpanOptions<T>, 'kind' | 'name'> = {}
) {
  return runObservedSpan(
    {
      ...options,
      kind: OpenInferenceSpanKind.AGENT,
      name,
    },
    execute
  );
}

export function runToolSpan<T>(
  name: string,
  execute: () => Promise<T>,
  options: Omit<ObservedSpanOptions<T>, 'kind' | 'name'> = {}
) {
  return runObservedSpan(
    {
      ...options,
      kind: OpenInferenceSpanKind.TOOL,
      name,
    },
    execute
  );
}

export function summarizeToolCallNames(toolCalls: Array<{ name?: string }> | undefined) {
  if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
    return undefined;
  }

  return toolCalls
    .map((toolCall) => normalizeWhitespace(toolCall.name ?? '(unknown)'))
    .filter((name) => name.length > 0)
    .join(', ');
}
