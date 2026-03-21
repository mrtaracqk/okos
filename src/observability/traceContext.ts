import {
  getLLMAttributes,
  getInputAttributes,
  getOutputAttributes,
  OITracer,
  setAttributes,
  setMetadata,
  setSession,
  setUser,
} from '@arizeai/openinference-core';
import type { Message as OpenInferenceMessage, TokenCount } from '@arizeai/openinference-core';
import { OpenInferenceSpanKind, SemanticConventions } from '@arizeai/openinference-semantic-conventions';
import { MimeType } from '@arizeai/openinference-semantic-conventions';
import {
  BaseMessage,
  isAIMessage,
  isHumanMessage,
  isSystemMessage,
  isToolMessage,
} from '@langchain/core/messages';
import {
  context as otelContext,
  trace,
  SpanStatusCode,
  type Attributes,
  type Context,
} from '@opentelemetry/api';
import { getConfig } from '@langchain/langgraph';
import { getTelegramRequestContext } from '../plugins/approval';
import { isPhoenixTracingEnabled } from './phoenix';

type PrimitiveAttribute = string | number | boolean;
type TraceAttributeArray = string[] | number[] | boolean[];
type TraceAttributeValue = PrimitiveAttribute | TraceAttributeArray;
type TraceAttributeRecord = Record<string, unknown>;
type OpenInferenceMessageContent =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      image: {
        url: string;
      };
    };

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

export function buildTraceInputAttributes(value: unknown, maxLength = 1000, mimeType = MimeType.JSON): Attributes {
  return getInputAttributes({
    value: formatTraceValue(value, maxLength),
    mimeType,
  });
}

export function buildTraceOutputAttributes(
  value: unknown,
  maxLength = 1500,
  mimeType = MimeType.TEXT
): Attributes {
  return getOutputAttributes({
    value: formatTraceText(value, maxLength),
    mimeType,
  });
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

function getMessageRole(message: BaseMessage): string {
  if (isSystemMessage(message)) {
    return 'system';
  }

  if (isHumanMessage(message)) {
    return 'user';
  }

  if (isAIMessage(message)) {
    return 'assistant';
  }

  if (isToolMessage(message)) {
    return 'tool';
  }

  return message.type;
}

function extractMessageContents(message: BaseMessage): OpenInferenceMessageContent[] | undefined {
  if (!Array.isArray(message.content)) {
    return undefined;
  }

  const contents: OpenInferenceMessageContent[] = [];

  for (const block of message.content) {
    if (!isRecord(block) || typeof block.type !== 'string') {
      continue;
    }

    if (block.type === 'text' && typeof block.text === 'string') {
      contents.push({
        type: 'text',
        text: truncateText(block.text.trim(), 4000),
      });
      continue;
    }

    if (block.type === 'image' && isRecord(block.image) && typeof block.image.url === 'string') {
      contents.push({
        type: 'image',
        image: {
          url: block.image.url,
        },
      });
      continue;
    }

    if (block.type === 'image_url' && isRecord(block.image_url) && typeof block.image_url.url === 'string') {
      contents.push({
        type: 'image',
        image: {
          url: block.image_url.url,
        },
      });
    }
  }

  return contents.length > 0 ? contents : undefined;
}

function extractMessageTextContent(message: BaseMessage) {
  const text = typeof message.text === 'string' ? normalizeWhitespace(message.text) : '';
  return text.length > 0 ? truncateText(text, 4000) : undefined;
}

function toOpenInferenceToolCalls(message: BaseMessage) {
  if (!isAIMessage(message) || !Array.isArray(message.tool_calls) || message.tool_calls.length === 0) {
    return undefined;
  }

  return message.tool_calls.map((toolCall) => ({
    ...(typeof toolCall.id === 'string' ? { id: toolCall.id } : {}),
    function: {
      ...(typeof toolCall.name === 'string' ? { name: toolCall.name } : {}),
      ...(toolCall.args !== undefined
        ? {
            arguments:
              typeof toolCall.args === 'string' || isRecord(toolCall.args) ? toolCall.args : formatTraceValue(toolCall.args, 1500),
          }
        : {}),
    },
  }));
}

function toOpenInferenceMessage(message: BaseMessage): OpenInferenceMessage {
  const content = extractMessageTextContent(message);
  const contents = extractMessageContents(message);
  const toolCalls = toOpenInferenceToolCalls(message);

  return {
    role: getMessageRole(message),
    ...(content ? { content } : {}),
    ...(contents ? { contents } : {}),
    ...(isToolMessage(message) ? { toolCallId: message.tool_call_id } : {}),
    ...(toolCalls ? { toolCalls } : {}),
  };
}

/**
 * Approximate byte/char weight of what the chat model receives for one message:
 * text/multimodal content plus full tool call arguments (not truncated like trace previews).
 */
function approximateMessagePayloadChars(message: BaseMessage): number {
  let total = 0;

  if (typeof message.content === 'string') {
    total += message.content.length;
  } else if (Array.isArray(message.content)) {
    for (const block of message.content) {
      if (isRecord(block) && block.type === 'text' && typeof block.text === 'string') {
        total += block.text.length;
      } else {
        total += approximateSerializedLength(block);
      }
    }
  } else if (message.content != null) {
    total += approximateSerializedLength(message.content);
  }

  if (isAIMessage(message) && Array.isArray(message.tool_calls)) {
    for (const toolCall of message.tool_calls) {
      if (!isRecord(toolCall)) {
        continue;
      }
      if (typeof toolCall.name === 'string') {
        total += toolCall.name.length;
      }
      const toolArgs = toolCall.args as unknown;
      if (toolArgs !== undefined) {
        total += typeof toolArgs === 'string' ? toolArgs.length : approximateSerializedLength(toolArgs);
      }
    }
  }

  return total;
}

function approximateSerializedLength(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'string') {
    return value.length;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).length;
  }
  try {
    return JSON.stringify(value).length;
  } catch {
    return String(value).length;
  }
}

/**
 * Numeric diagnostics for comparing LLM calls in Phoenix (e.g. planner vs worker).
 * `estimated_input_tokens` uses a rough chars/4 heuristic — compare runs, not billing.
 */
export function buildLlmInvocationDiagnostics(messages: BaseMessage[]): Attributes {
  if (messages.length === 0) {
    return buildTraceAttributes({
      'llm.diagnostics.message_count': 0,
      'llm.diagnostics.input_characters': 0,
      'llm.diagnostics.largest_message_characters': 0,
      'llm.diagnostics.estimated_input_tokens': 0,
      'llm.diagnostics.messages_by_role': '',
    });
  }

  const perMessageChars = messages.map(approximateMessagePayloadChars);
  const inputCharacters = perMessageChars.reduce((sum, n) => sum + n, 0);
  const largestMessageCharacters = Math.max(...perMessageChars);

  const roleCounts: Record<string, number> = {};
  for (const message of messages) {
    const role = getMessageRole(message);
    roleCounts[role] = (roleCounts[role] ?? 0) + 1;
  }

  const messagesByRole = Object.entries(roleCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([role, count]) => `${role}:${count}`)
    .join(',');

  return buildTraceAttributes({
    'llm.diagnostics.message_count': messages.length,
    'llm.diagnostics.input_characters': inputCharacters,
    'llm.diagnostics.largest_message_characters': largestMessageCharacters,
    'llm.diagnostics.estimated_input_tokens': Math.ceil(inputCharacters / 4),
    'llm.diagnostics.messages_by_role': messagesByRole,
  });
}

function buildLlmInputPayload(messages: BaseMessage[]) {
  return messages.map((message) => {
    const payload: Record<string, unknown> = {
      role: getMessageRole(message),
    };
    const content = extractMessageTextContent(message);
    const contents = extractMessageContents(message);
    const toolCalls = toOpenInferenceToolCalls(message);

    if (content) {
      payload.content = content;
    }

    if (contents) {
      payload.contents = contents;
    }

    if (isToolMessage(message)) {
      payload.tool_call_id = message.tool_call_id;
    }

    if (toolCalls) {
      payload.tool_calls = toolCalls;
    }

    return payload;
  });
}

function buildLlmOutputPayload(message: BaseMessage) {
  const payload: Record<string, unknown> = {
    role: getMessageRole(message),
  };
  const content = extractMessageTextContent(message);
  const contents = extractMessageContents(message);
  const toolCalls = toOpenInferenceToolCalls(message);

  if (content) {
    payload.content = content;
  }

  if (contents) {
    payload.contents = contents;
  }

  if (isToolMessage(message)) {
    payload.tool_call_id = message.tool_call_id;
  }

  if (toolCalls) {
    payload.tool_calls = toolCalls;
  }

  return payload;
}

function extractModelInvocationParameters(model: unknown) {
  if (!isRecord(model)) {
    return undefined;
  }

  const parameters = Object.fromEntries(
    Object.entries({
      temperature: model.temperature,
      top_p: model.topP,
      frequency_penalty: model.frequencyPenalty,
      presence_penalty: model.presencePenalty,
      max_tokens: model.maxTokens,
      max_retries: model.maxRetries,
      parallel_tool_calls: model.parallelToolCalls,
      tool_choice: model.toolChoice,
      timeout: model.timeout,
    }).filter(([, value]) => value !== undefined)
  );

  return Object.keys(parameters).length > 0 ? parameters : undefined;
}

function extractModelMetadata(model: unknown, response?: BaseMessage) {
  const responseMetadata = isRecord(response?.response_metadata) ? response.response_metadata : undefined;
  const provider =
    typeof responseMetadata?.model_provider === 'string'
      ? responseMetadata.model_provider
      : isRecord(model) && typeof model.provider === 'string'
        ? model.provider
        : Array.isArray((model as { lc_namespace?: unknown }).lc_namespace)
          ? ((model as { lc_namespace?: unknown[] }).lc_namespace?.find((value): value is string =>
              typeof value === 'string' && value.startsWith('@langchain/')
            ) || '')
              .replace('@langchain/', '')
          : undefined;
  const modelName =
    typeof responseMetadata?.model_name === 'string'
      ? responseMetadata.model_name
      : isRecord(model) && typeof model.modelName === 'string'
        ? model.modelName
        : isRecord(model) && typeof model.model === 'string'
          ? model.model
          : undefined;

  return {
    provider,
    modelName,
    system: provider,
    invocationParameters: extractModelInvocationParameters(model),
  };
}

function extractTokenCount(message: BaseMessage): TokenCount | undefined {
  if (!isAIMessage(message) || !isRecord(message.usage_metadata)) {
    return undefined;
  }

  const prompt = typeof message.usage_metadata.input_tokens === 'number' ? message.usage_metadata.input_tokens : undefined;
  const completion =
    typeof message.usage_metadata.output_tokens === 'number' ? message.usage_metadata.output_tokens : undefined;
  const total = typeof message.usage_metadata.total_tokens === 'number' ? message.usage_metadata.total_tokens : undefined;
  const inputTokenDetails = isRecord(message.usage_metadata.input_token_details)
    ? message.usage_metadata.input_token_details
    : undefined;
  const promptDetails =
    inputTokenDetails &&
    (typeof inputTokenDetails.audio === 'number' ||
      typeof inputTokenDetails.cache_read === 'number' ||
      typeof inputTokenDetails.cache_creation === 'number')
      ? {
          ...(typeof inputTokenDetails.audio === 'number' ? { audio: inputTokenDetails.audio } : {}),
          ...(typeof inputTokenDetails.cache_read === 'number' ? { cacheRead: inputTokenDetails.cache_read } : {}),
          ...(typeof inputTokenDetails.cache_creation === 'number'
            ? { cacheWrite: inputTokenDetails.cache_creation }
            : {}),
        }
      : undefined;

  if (prompt === undefined && completion === undefined && total === undefined) {
    return undefined;
  }

  return {
    ...(prompt !== undefined ? { prompt } : {}),
    ...(completion !== undefined ? { completion } : {}),
    ...(total !== undefined ? { total } : {}),
    ...(promptDetails ? { promptDetails } : {}),
  };
}

function extractFinishReason(message: BaseMessage) {
  const responseMetadata = isRecord(message.response_metadata) ? message.response_metadata : undefined;

  if (!responseMetadata) {
    return undefined;
  }

  const finishReasonCandidates = [
    responseMetadata.finish_reason,
    responseMetadata.finishReason,
    responseMetadata.stop_reason,
    responseMetadata.stopReason,
  ];

  return finishReasonCandidates.find((candidate): candidate is string => typeof candidate === 'string');
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

export function addTraceEvent(name: string, attributes?: TraceAttributeRecord) {
  if (!isPhoenixTracingEnabled()) {
    return;
  }

  const activeSpan = trace.getActiveSpan();
  if (!activeSpan) {
    return;
  }

  activeSpan.addEvent(name, attributes ? buildTraceAttributes(attributes) : undefined);
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

type LlmSpanOptions<T extends BaseMessage> = Omit<ObservedSpanOptions<T>, 'kind' | 'name'> & {
  inputMessages: BaseMessage[];
  model?: unknown;
};

export function runLlmSpan<T extends BaseMessage>(
  name: string,
  execute: () => Promise<T>,
  options: LlmSpanOptions<T>
) {
  const inputMessages = buildLlmInputPayload(options.inputMessages);
  const initialModelMetadata = extractModelMetadata(options.model);

  return runObservedSpan(
    {
      ...options,
      kind: OpenInferenceSpanKind.LLM,
      name,
      attributes: {
        ...options.attributes,
        ...buildLlmInvocationDiagnostics(options.inputMessages),
        ...buildTraceInputAttributes(inputMessages, 5000, MimeType.JSON),
        ...getLLMAttributes({
          provider: initialModelMetadata.provider,
          system: initialModelMetadata.system,
          modelName: initialModelMetadata.modelName,
          invocationParameters: initialModelMetadata.invocationParameters,
          inputMessages: options.inputMessages.map(toOpenInferenceMessage),
        }),
      },
      mapResultAttributes: (result) => {
        const resultModelMetadata = extractModelMetadata(options.model, result);
        const finishReason = extractFinishReason(result);

        return {
          ...getLLMAttributes({
            provider: resultModelMetadata.provider,
            system: resultModelMetadata.system,
            modelName: resultModelMetadata.modelName,
            invocationParameters: resultModelMetadata.invocationParameters,
            inputMessages: options.inputMessages.map(toOpenInferenceMessage),
            outputMessages: [toOpenInferenceMessage(result)],
            tokenCount: extractTokenCount(result),
          }),
          ...buildTraceOutputAttributes(buildLlmOutputPayload(result), 5000, MimeType.JSON),
          ...buildTraceAttributes({
            'llm.finish_reason': finishReason,
          }),
          ...(options.mapResultAttributes?.(result) ?? {}),
        };
      },
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
