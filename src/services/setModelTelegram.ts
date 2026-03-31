import TelegramBot from 'node-telegram-bot-api';
import { MODEL_PROVIDER, openAIChatModelConfig } from '../config';
import { SET_MODEL_CHAT_PRESETS, buildSetModelModelCallbackData, parseSetModelModelCallbackData } from './setModelTelegramPayload';
import TelegramService from './telegram';

export { SET_MODEL_CHAT_PRESETS, parseSetModelModelCallbackData } from './setModelTelegramPayload';

function isSetModelCallback(data: string | undefined): boolean {
  return Boolean(data?.startsWith('sm:'));
}

function buildWizardIntroText(): string {
  return [
    'Выбор OpenAI-модели для чата (до перезапуска процесса).',
    `Текущая модель: ${openAIChatModelConfig.getCurrentModelName()}`,
    '',
    'Нажми пресет, чтобы применить:',
  ].join('\n');
}

export async function sendSetModelWizard(chatId: number): Promise<void> {
  if (MODEL_PROVIDER !== 'openai') {
    await TelegramService.sendMessage(
      chatId,
      'Команда /set_model доступна только при MODEL_PROVIDER=openai.'
    );
    return;
  }

  await TelegramService.sendMessage(chatId, buildWizardIntroText(), {
    reply_markup: {
      inline_keyboard: SET_MODEL_CHAT_PRESETS.map((name) => [
        { text: name, callback_data: buildSetModelModelCallbackData(name) },
      ]),
    },
  });
}

export async function handleSetModelCallback(
  callbackQuery: TelegramBot.CallbackQuery,
  adminUsername: string
): Promise<boolean> {
  const data = callbackQuery.data;
  if (!isSetModelCallback(data)) {
    return false;
  }

  const fromUsername = callbackQuery.from?.username;
  if (!adminUsername || fromUsername !== adminUsername) {
    await TelegramService.answerCallbackQuery(callbackQuery.id, {
      text: 'Команда доступна только администратору.',
      show_alert: true,
    });
    return true;
  }

  if (MODEL_PROVIDER !== 'openai') {
    await TelegramService.answerCallbackQuery(callbackQuery.id, {
      text: 'Провайдер не OpenAI.',
      show_alert: true,
    });
    return true;
  }

  const message = callbackQuery.message;
  if (!message || !('chat' in message)) {
    await TelegramService.answerCallbackQuery(callbackQuery.id, {
      text: 'Не удалось обновить сообщение.',
      show_alert: true,
    });
    return true;
  }

  const chatId = message.chat.id;
  const messageId = message.message_id;

  const presetModel = parseSetModelModelCallbackData(data);
  if (!presetModel) {
    await TelegramService.answerCallbackQuery(callbackQuery.id, {
      text: 'Неизвестное действие.',
      show_alert: true,
    });
    return true;
  }

  try {
    openAIChatModelConfig.setCurrentModelName(presetModel);
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Не удалось применить настройки.';
    await TelegramService.answerCallbackQuery(callbackQuery.id, { text, show_alert: true });
    return true;
  }

  await TelegramService.editMessageText(
    ['Настройки чат-модели обновлены.', `Модель: ${openAIChatModelConfig.getCurrentModelName()}`].join('\n'),
    {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    }
  );
  await TelegramService.answerCallbackQuery(callbackQuery.id, { text: 'Готово.' });
  return true;
}
