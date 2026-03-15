import { MemorySaver } from '@langchain/langgraph-checkpoint';

export const graphCheckpointer = new MemorySaver();

export function createGraphRunConfig(chatId: number, requestText?: string) {
  return {
    configurable: {
      chatId,
      startedAt: new Date().toISOString(),
      ...(requestText ? { requestText } : {}),
      thread_id: `telegram-chat:${chatId}:run:${crypto.randomUUID()}`,
    },
  };
}
