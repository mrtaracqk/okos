import { getConfig } from '@langchain/langgraph';
import TelegramService from './telegram';

const SYSTEM_LOG_PREFIX = 'SYSTEM LOG';
const TELEGRAM_MESSAGE_LIMIT = 4096;
const SYSTEM_LOG_CHUNK_LIMIT = 3800;

type RunnableConfigLike = {
  configurable?: Record<string, unknown>;
};

type SystemLogMessageInput = {
  lines: Array<string | null | undefined>;
};

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function toSingleLine(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function formatSystemLogValue(value: unknown, maxLength = 600) {
  if (typeof value === 'string') {
    return truncateText(value.trim(), maxLength);
  }

  try {
    return truncateText(JSON.stringify(value), maxLength);
  } catch {
    return truncateText(String(value), maxLength);
  }
}

export function formatSystemLogMultilineValue(value: unknown, maxLength = 1200) {
  if (typeof value === 'string') {
    return truncateText(value.trim(), maxLength);
  }

  try {
    return truncateText(JSON.stringify(value, null, 2), maxLength);
  } catch {
    return truncateText(String(value), maxLength);
  }
}

function buildSystemLogMessage(input: SystemLogMessageInput) {
  const body = input.lines
    .filter((line): line is string => typeof line === 'string')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)
    .join('\n');

  return body ? `${SYSTEM_LOG_PREFIX}\n${body}` : SYSTEM_LOG_PREFIX;
}

function splitSystemLogMessage(message: string) {
  if (message.length <= TELEGRAM_MESSAGE_LIMIT) {
    return [message];
  }

  const lines = message.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const line of lines) {
    const nextChunk = currentChunk.length > 0 ? `${currentChunk}\n${line}` : line;

    if (nextChunk.length <= SYSTEM_LOG_CHUNK_LIMIT) {
      currentChunk = nextChunk;
      continue;
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    currentChunk = line.length <= SYSTEM_LOG_CHUNK_LIMIT ? line : truncateText(line, SYSTEM_LOG_CHUNK_LIMIT);
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks.map((chunk, index) =>
    index === 0 ? chunk : `${SYSTEM_LOG_PREFIX}\n${truncateText(toSingleLine(chunk), SYSTEM_LOG_CHUNK_LIMIT - SYSTEM_LOG_PREFIX.length - 1)}`
  );
}

export function getSystemLogChatId(config?: RunnableConfigLike) {
  const rawValue = config?.configurable?.chatId;
  return typeof rawValue === 'number' ? rawValue : null;
}

export async function sendSystemLog(chatId: number, input: SystemLogMessageInput) {
  const message = buildSystemLogMessage(input);
  const chunks = splitSystemLogMessage(message);

  for (const chunk of chunks) {
    await TelegramService.sendMessage(chatId, chunk, {
      disable_notification: true,
    });
  }
}

export async function sendSystemLogFromCurrentRun(input: SystemLogMessageInput) {
  const chatId = getSystemLogChatId(getConfig());
  if (!chatId) {
    return;
  }

  await sendSystemLog(chatId, input);
}
