import './observability/phoenix';
import { html } from '@elysiajs/html';
import { Elysia } from 'elysia';
import TelegramBot from 'node-telegram-bot-api';
import { runWithTelegramRequestContext, type TelegramRequestContext } from './approval/requestContext';
import { handleClearHistory, handleMessage } from './handlers';
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
    await bot.sendMessage(chatId, 'You have been authorized to use this bot. Welcome!');
    return false;
  }

  // User is not authorized, send authentication message
  await bot.sendMessage(chatId, 'You are not authorized to use this bot. Please enter the access token to continue. Make sure you have set a Telegram Username before enter it.');
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
      <a href="https://t.me/${botUser.username}">${botUser.username}</a> is online!<br />Mode: ${
        isPolling ? 'Polling' : 'Webhook'
      }
      `);
    } catch (error) {
      console.error('Error in root route:', error);
      return renderHtml('Bot is starting up. Please try again in a moment.');
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
    { command: 'clear_messages', description: 'Clear your chat history' },
    { command: 'clear_all', description: 'Clear your chat history' },
    { command: 'list_users', description: 'List all authorized users (admin only)' },
    { command: 'remove_user', description: 'Remove a user from authorized list (admin only)' },
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

  // Check for commands
  if (text === '/clear_messages') {
    // Allow commands even for unauthorized users
    handleClearHistory(chatId, true);
    return;
  } else if (text === '/clear_all') {
    // Allow commands even for unauthorized users
    handleClearHistory(chatId, false);
    return;
  } else if (text === '/list_users' && username === OKOS_ADMIN_USERNAME) {
    // Admin command to list all authorized users
    const users = await redisService.getAuthorizedUsers();
    if (users.length === 0) {
      await bot.sendMessage(chatId, 'No authorized users found.');
    } else {
      await bot.sendMessage(chatId, `Authorized users:\n${users.join('\n')}`);
    }
    return;
  } else if (text.startsWith('/remove_user') && username === OKOS_ADMIN_USERNAME) {
    // Admin command to remove a user
    const targetUsername = text.substring('/remove_user '.length).trim();

    if (targetUsername) {
      await redisService.removeAuthorizedUser(targetUsername);
      await bot.sendMessage(chatId, `User @${targetUsername} has been removed from authorized users.`);
    } else {
      await bot.sendMessage(chatId, 'Please specify a username to remove. Usage: /remove_user username');
    }
    return;
  }

  // Check if user is authorized
  const isAuthorized = await authGuard(username, chatId, text);
  if (!isAuthorized) {
    return;
  }

  if (!requestContext) {
    await bot.sendMessage(chatId, 'Unable to process this message because the Telegram runtime context is missing.');
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

  await bot.sendMessage(chatId, 'Image messages are no longer supported. Please send a text request.');
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
      await bot.sendMessage(chatId, 'Unable to process this message because the Telegram runtime context is missing.');
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
