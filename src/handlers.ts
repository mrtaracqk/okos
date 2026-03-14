import { HumanMessage, isAIMessage, trimMessages } from '@langchain/core/messages';
import { getTelegramRequestContext } from './approval/requestContext';
import { mainGraph } from './agents/main/graphs/main.graph';
import { telegramMainGraphProgressReporter } from './agents/main/progress';
import { createGraphRunConfig } from './agents/shared/checkpointing';
import { CHAT_CONFIG, createOpenAITokenCounter } from './config';
import {
  buildTelegramTraceContext,
  buildTraceAttributes,
  formatTraceValue,
  runAgentSpan,
  runChainSpan,
  withTraceContext,
} from './observability/traceContext';
import { RedisService } from './services/redis';
import TelegramService from './services/telegram';

const redisService = new RedisService();

export async function handleMessage(chatId: number, text: string) {
  const requestContext = getTelegramRequestContext();
  const runConfig = createGraphRunConfig(chatId);
  const runThreadId =
    typeof runConfig.configurable?.thread_id === 'string' ? runConfig.configurable.thread_id : undefined;
  const traceContext = buildTelegramTraceContext({
    chatId,
    inputText: text,
    runThreadId,
  });

  try {
    await withTraceContext(traceContext, async () =>
      runChainSpan(
        'assistant.turn',
        async () => {
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

          const result = await runAgentSpan(
            'main_graph.invoke',
            async () =>
              mainGraph.invoke(
                {
                  messages: trimmedMessages,
                  chatId,
                },
                {
                  ...runConfig,
                  recursionLimit: 100,
                }
              ),
            {
              attributes: buildTraceAttributes({
                'telegram.chat_id': chatId,
                'run.thread_id': runThreadId,
                'main_graph.message_count': trimmedMessages.length,
              }),
            }
          );

          if (result.messages?.length) {
            await runChainSpan(
              'main_graph.final_response',
              async () => {
                const lastMessage = result.messages.slice(-1)[0];
                if (!isAIMessage(lastMessage)) {
                  return {
                    delivered: false,
                    reason: 'last_message_not_ai',
                  };
                }

                const aiMessage = lastMessage.content;
                let aiResponse: string | undefined;

                if (typeof aiMessage === 'string') {
                  aiResponse = aiMessage;
                } else if (Array.isArray(aiMessage)) {
                  aiResponse = (aiMessage as any[]).filter((content) => content.type === 'text')[0]?.text ?? undefined;
                }

                if (!aiResponse) {
                  return {
                    delivered: false,
                    reason: 'empty_ai_response',
                  };
                }

                await redisService.saveAIMessage(chatId, aiResponse);
                await TelegramService.sendMessage(chatId, aiResponse);

                return {
                  delivered: true,
                  responsePreview: formatTraceValue(aiResponse, 600),
                };
              },
              {
                attributes: buildTraceAttributes({
                  'telegram.chat_id': chatId,
                  'run.thread_id': runThreadId,
                }),
                mapResultAttributes: (finalResponse) =>
                  buildTraceAttributes({
                    'response.delivered': finalResponse.delivered,
                    'response.reason': 'reason' in finalResponse ? finalResponse.reason : undefined,
                    'output.value': 'responsePreview' in finalResponse ? finalResponse.responsePreview : undefined,
                  }),
              }
            );
          }
        },
        {
          attributes: buildTraceAttributes({
            'input.value': text,
            'telegram.chat_id': chatId,
            'telegram.user_id': requestContext?.telegramUserId,
            'telegram.username': requestContext?.telegramUsername,
            'run.thread_id': runThreadId,
            'transport': 'telegram',
          }),
        }
      )
    );
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
