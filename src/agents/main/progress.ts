import TelegramBot from 'node-telegram-bot-api';
import { redisService, STICKER } from '../../config';
import TelegramService from '../../services/telegram';
import { pickRandomElement } from '../../utils';

export type MainGraphProgressReporter = {
  onCatalogDelegation(input: { chatId: number; statusText?: string }): Promise<void>;
  onRunComplete(input: { chatId: number }): Promise<void>;
};

const pendingActionMessages = new Map<number, number>();

async function deletePendingActionMessage(chatId: number) {
  const messageId = pendingActionMessages.get(chatId);
  if (!messageId) {
    return;
  }

  pendingActionMessages.delete(chatId);

  try {
    await TelegramService.deleteMessage(chatId, messageId);
  } catch (error) {
    console.warn('Unable to delete pending Telegram progress message:', error);
  }
}

export const noopMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation() {},
  async onRunComplete() {},
};

export const telegramMainGraphProgressReporter: MainGraphProgressReporter = {
  async onCatalogDelegation({ chatId, statusText }) {
    if (statusText) {
      await redisService.saveAIMessage(chatId, statusText);
      await TelegramService.sendMessage(chatId, statusText);
    }

    await deletePendingActionMessage(chatId);

    let stickerMessage: TelegramBot.Message | undefined;
    try {
      stickerMessage = await TelegramService.sendSticker(chatId, pickRandomElement(STICKER.WRITING));
      pendingActionMessages.set(chatId, stickerMessage.message_id);
    } catch (error) {
      console.warn('Unable to send Telegram progress sticker:', error);
    }

    await TelegramService.sendChatAction(chatId, 'typing');
  },

  async onRunComplete({ chatId }) {
    await deletePendingActionMessage(chatId);
  },
};
