import TelegramService from '../../services/telegram';

const CATALOG_DELEGATION_PLACEHOLDER_TEXT = 'Запрос передан менеджеру каталога…';

/** Pending Telegram message to replace when catalog delegation finishes (one active turn per chat). */
const catalogDelegationPlaceholderMessageIdByChatId = new Map<number, number>();

export function takeCatalogDelegationPlaceholderMessageId(chatId: number): number | undefined {
  const messageId = catalogDelegationPlaceholderMessageIdByChatId.get(chatId);
  if (messageId === undefined) {
    return undefined;
  }
  catalogDelegationPlaceholderMessageIdByChatId.delete(chatId);
  return messageId;
}

/** Drop placeholder state and remove the message (e.g. turn failed before final reply). */
export async function abandonCatalogDelegationPlaceholder(chatId: number): Promise<void> {
  const messageId = catalogDelegationPlaceholderMessageIdByChatId.get(chatId);
  if (messageId === undefined) {
    return;
  }
  catalogDelegationPlaceholderMessageIdByChatId.delete(chatId);
  try {
    await TelegramService.deleteMessage(chatId, messageId);
  } catch {
    // Best-effort: message may already be gone or too old.
  }
}

export type MainGraphProgressReporter = {
  onCatalogDelegation(input: { chatId: number; statusText?: string }): Promise<void>;
  /** Вызывается один раз за ход из `handleMessage` (finally), после `main_graph.invoke` и доставки ответа. */
  onRunComplete(input: { chatId: number }): Promise<void>;
};

export const noopMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation() {},
  async onRunComplete() {},
};

export const telegramMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation({ chatId, statusText: _statusText }) {
    const sent = await TelegramService.sendMessage(chatId, CATALOG_DELEGATION_PLACEHOLDER_TEXT);
    catalogDelegationPlaceholderMessageIdByChatId.set(chatId, sent.message_id);
    await TelegramService.sendChatAction(chatId, 'typing');
  },

  async onRunComplete() {},
};
