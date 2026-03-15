import './observability/phoenix';
import { html } from '@elysiajs/html';
import { Elysia } from 'elysia';
import TelegramBot from 'node-telegram-bot-api';
import { runWithTelegramRequestContext, type TelegramRequestContext } from './runtime-plugins/approval';
import { handleClearHistory, handleMessage, handleSetOpenAIModel } from './handlers';
import MessageQueueService, { MessagePayload } from './services/messageQueue';
import { RedisService } from './services/redis';
import TelegramService from './services/telegram';
import { handleTelegramApprovalCallback } from './services/toolApproval';
import { validateWooCommerceTransportOnStartup } from './services/woocommerceTransport';

const port = process.env.PORT || 11435;
const OKOS_TOKEN = process.env.OKOS_TOKEN || 'default_token';
const OKOS_ADMIN_USERNAME = process.env.OKOS_ADMIN_USERNAME || '';

// Initialize bot using singleton
const bot = TelegramService.getInstance();

// Start the bot (this will initialize polling or webhook only once)
async function bootstrapCatalogTransport() {
  await validateWooCommerceTransportOnStartup();
}

void bootstrapCatalogTransport()
  .then(() => {
    TelegramService.startBot();
  })
  .catch((error) => {
    console.error('Failed to initialize WooCommerce transport:', error);
    process.exit(1);
  });

// Initialize services
const queueService = MessageQueueService.getInstance();
const redisService = new RedisService();

function buildTelegramRequestContext(input: {
  chatId: number;
  from?: TelegramBot.User;
}): TelegramRequestContext | null {
  if (!input.from) {
    return null;
  }

  return {
    chatId: input.chatId,
    telegramUserId: input.from.id,
    telegramUsername: input.from.username,
  };
}

function parseTelegramCommand(text: string) {
  if (!text.startsWith('/')) {
    return null;
  }

  const [commandToken, ...argTokens] = text.trim().split(/\s+/);
  const command = commandToken.slice(1).split('@')[0] || '';

  return {
    command,
    args: argTokens.join(' ').trim(),
  };
}

/**
 * Authentication guard function to check if a user is authorized
 * @param username The Telegram username to check
 * @param chatId The chat ID for sending responses
 * @param userInput Optional user input to check if it's a token
 * @returns True if the user is authorized, false otherwise
 */
async function authGuard(username: string | undefined, chatId: number, userInput?: string): Promise<boolean> {
  // Admin is always authorized
  if (username && username === OKOS_ADMIN_USERNAME) {
    return true;
  }

  // Check if user is already authorized
  if (username && (await redisService.isUserAuthorized(username))) {
    return true;
  }

  // Check if userInput is the token
  if (username && userInput && userInput === OKOS_TOKEN) {
    await redisService.addAuthorizedUser(username);
    await bot.sendMessage(chatId, 'Доступ к боту выдан.');
    return false;
  }

  // User is not authorized, send authentication message
  await bot.sendMessage(
    chatId,
    'У вас нет доступа к этому боту. Чтобы продолжить, отправьте токен доступа. Перед этим убедитесь, что у вас установлен Telegram Username.'
  );
  return false;
}

// Register the function that will process messages from the queue
queueService.registerMessageProcessor(async (payload: MessagePayload) => {
  const { chatId, type, content, context } = payload;

  try {
    await runWithTelegramRequestContext(context, async () => {
      if (type === 'text') {
        await handleMessage(chatId, content);
      } else if (type === 'sticker') {
        await handleMessage(chatId, content);
      }
    });
  } catch (error) {
    console.error(`Error processing ${type} message:`, error);
  }
});

new Elysia()
  .use(html())
  .get('/', async () => {
    const renderHtml = (body: string) => `
<html lang='en'>
  <head>
      <title>Okos - Telegram AI Bot</title>
  </head>
  <body>
      ${body}
  </body>
</html>`;

    try {
      const isPolling = await bot.isPolling();
      const botUser = await bot.getMe();

      return renderHtml(`
      <a href="https://t.me/${botUser.username}">${botUser.username}</a> в сети.<br />Режим: ${
        isPolling ? 'Polling' : 'Webhook'
      }
      `);
    } catch (error) {
      console.error('Error in root route:', error);
      return renderHtml('Бот запускается. Попробуйте ещё раз через несколько секунд.');
    }
  })
  .get('/healthz', () => ({
    ok: true,
  }))
  .post('/webhook', ({ body }: { body: TelegramBot.Update }) => {
    bot.processUpdate(body);
    return 'ok';
  })
  .listen(port, () => {
    console.log(`🦊 Elysia app listening on port ${port}`);
  });

// Set up command handlers
bot
  .setMyCommands([
    { command: 'clear_messages', description: 'Очистить историю сообщений' },
    { command: 'clear_all', description: 'Очистить историю чата' },
    { command: 'list_users', description: 'Показать авторизованных пользователей' },
    { command: 'remove_user', description: 'Удалить пользователя из авторизованных' },
    { command: 'set_model', description: 'Сменить OpenAI-модель' },
  ])
  .catch((error) => {
    console.error('Error setting commands:', error);
  });

bot.on('text', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username;
  const text = msg.text;
  const requestContext = buildTelegramRequestContext({
    chatId,
    from: msg.from,
  });

  if (!text) {
    return;
  }

  const command = parseTelegramCommand(text);

  // Check for commands
  if (command?.command === 'clear_messages') {
    // Allow commands even for unauthorized users
    await handleClearHistory(chatId, true);
    return;
  } else if (command?.command === 'clear_all') {
    // Allow commands even for unauthorized users
    await handleClearHistory(chatId, false);
    return;
  } else if (command?.command === 'list_users') {
    if (username !== OKOS_ADMIN_USERNAME) {
      await bot.sendMessage(chatId, 'Команда доступна только администратору.');
      return;
    }

    // Admin command to list all authorized users
    const users = await redisService.getAuthorizedUsers();
    if (users.length === 0) {
      await bot.sendMessage(chatId, 'Авторизованные пользователи не найдены.');
    } else {
      await bot.sendMessage(chatId, `Авторизованные пользователи:\n${users.join('\n')}`);
    }
    return;
  } else if (command?.command === 'remove_user') {
    if (username !== OKOS_ADMIN_USERNAME) {
      await bot.sendMessage(chatId, 'Команда доступна только администратору.');
      return;
    }

    // Admin command to remove a user
    const targetUsername = command.args;

    if (targetUsername) {
      await redisService.removeAuthorizedUser(targetUsername);
      await bot.sendMessage(chatId, `Пользователь @${targetUsername} удалён из списка авторизованных.`);
    } else {
      await bot.sendMessage(chatId, 'Укажите username для удаления. Использование: /remove_user username');
    }
    return;
  } else if (command?.command === 'set_model') {
    if (username !== OKOS_ADMIN_USERNAME) {
      await bot.sendMessage(chatId, 'Команда доступна только администратору.');
      return;
    }

    await handleSetOpenAIModel(chatId, command.args);
    return;
  }

  // Check if user is authorized
  const isAuthorized = await authGuard(username, chatId, text);
  if (!isAuthorized) {
    return;
  }

  if (!requestContext) {
    await bot.sendMessage(chatId, 'Не удалось обработать сообщение: отсутствует runtime-контекст Telegram.');
    return;
  }

  // Add message to queue instead of processing immediately
  await queueService.addMessage({
    chatId,
    type: 'text',
    content: text,
    context: requestContext,
  });
});

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username;
  const caption = msg.caption;

  // Check if user is authorized
  const isAuthorized = await authGuard(username, chatId, caption);
  if (!isAuthorized) {
    return;
  }

  await bot.sendMessage(chatId, 'Сообщения с изображениями больше не поддерживаются. Отправьте текстовый запрос.');
});

bot.on('sticker', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username;
  const sticker = msg.sticker;
  const emoji = sticker?.emoji;
  const requestContext = buildTelegramRequestContext({
    chatId,
    from: msg.from,
  });

  // Check if user is authorized
  const isAuthorized = await authGuard(username, chatId);
  if (!isAuthorized) {
    return;
  }

  if (emoji) {
    if (!requestContext) {
      await bot.sendMessage(chatId, 'Не удалось обработать сообщение: отсутствует runtime-контекст Telegram.');
      return;
    }

    return queueService.addMessage({
      chatId,
      type: 'sticker',
      content: emoji,
      context: requestContext,
    });
  }

  if (sticker?.file_id) {
    return bot.sendSticker(chatId, sticker.file_id);
  }
});

bot.on('callback_query', async (callbackQuery) => {
  try {
    const handled = await handleTelegramApprovalCallback(callbackQuery);
    if (!handled) {
      await TelegramService.answerCallbackQuery(callbackQuery.id);
    }
  } catch (error) {
    console.error('Error processing callback query:', error);
    await TelegramService.answerCallbackQuery(callbackQuery.id, {
      text: 'Не удалось обработать callback.',
      show_alert: true,
    }).catch(() => undefined);
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

bot.on('error', (error) => {
  console.error('General error:', error);
});

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing queues...');
  await queueService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing queues...');
  await queueService.close();
  process.exit(0);
});
