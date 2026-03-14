import { HumanMessage, isAIMessage, trimMessages } from '@langchain/core/messages';
import { mainGraph } from './agents/main/graphs/main.graph';
import { telegramMainGraphProgressReporter } from './agents/main/progress';
import { createGraphRunConfig } from './agents/shared/checkpointing';
import { CHAT_CONFIG, createOpenAITokenCounter } from './config';
import { RedisService } from './services/redis';
import TelegramService from './services/telegram';

const redisService = new RedisService();

export async function handleMessage(chatId: number, text: string) {
  try {
    await redisService.saveHumanMessage(chatId, text);

    let state = await redisService.getState(chatId);
    if (!state) {
      const humanMessage = new HumanMessage(text);
      state = {
        messages: [humanMessage],
      };
    }

    const trimmedMessages = await trimMessages(state.messages, {
      maxTokens: 4096,
      strategy: 'last',
      tokenCounter: createOpenAITokenCounter(process.env.OPENAI_MODEL_NAME || 'gpt-4o'),
      startOn: 'human',
      includeSystem: true,
    });

    await TelegramService.sendChatAction(chatId, 'typing');

    const result = await mainGraph.invoke(
      {
        messages: trimmedMessages,
        chatId: chatId,
      },
      {
        ...createGraphRunConfig(chatId),
        recursionLimit: 20,
      }
    );

    if (result.messages?.length) {
      const lastMessage = result.messages.slice(-1)[0];
      if (isAIMessage(lastMessage)) {
        const aiMessage = lastMessage.content;
        let aiResponse: string | undefined;

        // Parse the AI message for both text and complex array
        if (typeof aiMessage === 'string') {
          aiResponse = aiMessage;
        } else if (Array.isArray(aiMessage)) {
          aiResponse = (aiMessage as any[]).filter((c) => c.type === 'text')[0]?.text ?? undefined;
        }

        if (aiResponse) {
          await redisService.saveAIMessage(chatId, aiResponse);
          await TelegramService.sendMessage(chatId, aiResponse);
        }
      }
    }
  } catch (error: any) {
    console.error('Error processing message:', error);
    if (error.status === 429) {
      await TelegramService.sendMessage(chatId, 'You have exceeded the rate limit. Please try again later.');
      return;
    }

    await TelegramService.sendMessage(chatId, 'Sorry, there was an error processing your message.');
  } finally {
    await telegramMainGraphProgressReporter.onRunComplete({ chatId });
  }
}

export async function handleClearHistory(chatId: number, onlyMessages: boolean = false) {
  try {
    await redisService.clearAll(chatId, onlyMessages);
    await TelegramService.sendMessage(chatId, 'Your chat history has been cleared.');
  } catch (error) {
    console.error('Error clearing chat history:', error);
    await TelegramService.sendMessage(chatId, 'Sorry, there was an error clearing your data.');
  }
}
