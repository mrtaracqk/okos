import TelegramService from '../../services/telegram';

export type MainGraphProgressReporter = {
  onCatalogDelegation(input: { chatId: number; statusText?: string }): Promise<void>;
  onRunComplete(input: { chatId: number }): Promise<void>;
};

export const noopMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation() {},
  async onRunComplete() {},
};

export const telegramMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation({ chatId, statusText: _statusText }) {
    await TelegramService.sendChatAction(chatId, 'typing');
  },

  async onRunComplete() {},
};
