import { MemorySaver } from '@langchain/langgraph-checkpoint';

export const graphCheckpointer = new MemorySaver();

export function createGraphRunConfig(chatId: number) {
  return {
    configurable: {
      chatId,
      thread_id: `telegram-chat:${chatId}:run:${crypto.randomUUID()}`,
    },
  };
}
