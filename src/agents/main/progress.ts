import TelegramService from '../../services/telegram';

const CATALOG_DELEGATION_PLACEHOLDER_TEXT = 'Запрос передан менеджеру каталога…';

type CatalogDelegationPlaceholder = {
  chatId: number;
  messageId: number;
};

/** Pending Telegram message to replace when a specific run finishes. */
const catalogDelegationPlaceholderByRunId = new Map<string, CatalogDelegationPlaceholder>();

export function takeCatalogDelegationPlaceholderMessageId(runId?: string): number | undefined {
  if (!runId) {
    return undefined;
  }

  const placeholder = catalogDelegationPlaceholderByRunId.get(runId);
  if (!placeholder) {
    return undefined;
  }

  catalogDelegationPlaceholderByRunId.delete(runId);
  return placeholder.messageId;
}

/** Drop placeholder state and remove the message (e.g. turn failed before final reply). */
export async function abandonCatalogDelegationPlaceholder(runId?: string): Promise<void> {
  if (!runId) {
    return;
  }

  const placeholder = catalogDelegationPlaceholderByRunId.get(runId);
  if (!placeholder) {
    return;
  }

  catalogDelegationPlaceholderByRunId.delete(runId);
  try {
    await TelegramService.deleteMessage(placeholder.chatId, placeholder.messageId);
  } catch {
    // Best-effort: message may already be gone or too old.
  }
}

export type MainGraphProgressReporter = {
  onCatalogDelegation(input: { chatId: number; runId?: string; statusText?: string }): Promise<void>;
  /** Вызывается один раз за ход из `handleMessage` (finally), после `main_graph.invoke` и доставки ответа. */
  onRunComplete(input: { chatId: number; runId?: string }): Promise<void>;
};

export const noopMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation() {},
  async onRunComplete() {},
};

export const telegramMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation({ chatId, runId, statusText: _statusText }) {
    if (!runId) {
      return;
    }

    const sent = await TelegramService.sendMessage(chatId, CATALOG_DELEGATION_PLACEHOLDER_TEXT);
    catalogDelegationPlaceholderByRunId.set(runId, {
      chatId,
      messageId: sent.message_id,
    });
    await TelegramService.sendChatAction(chatId, 'typing');
  },

  async onRunComplete({ runId }) {
    await abandonCatalogDelegationPlaceholder(runId);
  },
};
