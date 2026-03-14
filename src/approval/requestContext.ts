import { AsyncLocalStorage } from 'node:async_hooks';

export type TelegramRequestContext = {
  chatId: number;
  telegramUserId: number;
  telegramUsername?: string;
};

const requestContextStorage = new AsyncLocalStorage<TelegramRequestContext>();

export function runWithTelegramRequestContext<T>(
  context: TelegramRequestContext,
  execute: () => Promise<T>
): Promise<T> {
  return requestContextStorage.run(context, execute);
}

export function getTelegramRequestContext() {
  return requestContextStorage.getStore();
}
