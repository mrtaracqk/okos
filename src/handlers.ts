import { HumanMessage, isAIMessage, trimMessages } from '@langchain/core/messages';
import { getTelegramRequestContext } from './plugins/approval';
import { mainGraph } from './agents/main/graphs/main.graph';
import {
  abandonCatalogDelegationPlaceholder,
  takeCatalogDelegationPlaceholderMessageId,
  telegramMainGraphProgressReporter,
} from './agents/main/progress';
import { createGraphRunConfig } from './agents/shared/checkpointing';
import { CHAT_CONFIG, createOpenAITokenCounter } from './config';
import {
  buildTelegramTraceContext,
  buildTraceAttributes,
  buildTraceInputAttributes,
  buildTraceOutputAttributes,
  formatTraceValue,
  runAgentSpan,
  runChainSpan,
  withTraceContext,
} from './observability/traceContext';
import { MimeType } from '@arizeai/openinference-semantic-conventions';
import { RedisService } from './services/redis';
import TelegramService from './services/telegram';

const redisService = new RedisService();

async function deliverAssistantTelegramText(chatId: number, text: string): Promise<void> {
  const placeholderMessageId = takeCatalogDelegationPlaceholderMessageId(chatId);
  if (placeholderMessageId !== undefined) {
    try {
      await TelegramService.editChatMessageText(chatId, placeholderMessageId, text);
    } catch {
      try {
        await TelegramService.deleteMessage(chatId, placeholderMessageId);
      } catch {
        // ignore
      }
      await TelegramService.sendMessage(chatId, text);
    }
  } else {
    await TelegramService.sendMessage(chatId, text);
  }
}

export async function handleMessage(chatId: number, text: string) {
  const requestContext = getTelegramRequestContext();
  const runConfig = createGraphRunConfig(chatId, text);
  const runThreadId =
    typeof runConfig.configurable?.thread_id === 'string' ? runConfig.configurable.thread_id : undefined;
  const traceContext = buildTelegramTraceContext({
    chatId,
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
            maxTokens: 6000,
            strategy: 'last',
            tokenCounter: createOpenAITokenCounter(),
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
            const finalResponse = await runChainSpan(
              'main_graph.final_response',
              async () => {
                if (result.catalogDelegation?.summary?.trim()) {
                  const responseText = result.catalogDelegation.summary.trim();
                  await redisService.saveAIMessage(chatId, responseText);
                  await deliverAssistantTelegramText(chatId, responseText);

                  return {
                    delivered: true,
                    responseText,
                    responsePreview: formatTraceValue(responseText, 600),
                  };
                }

                const lastMessage = result.messages.slice(-1)[0];
                let aiResponse: string | undefined;

                if (isAIMessage(lastMessage)) {
                  const aiMessage = lastMessage.content;
                  if (typeof aiMessage === 'string') {
                    aiResponse = aiMessage;
                  } else if (Array.isArray(aiMessage)) {
                    aiResponse = (aiMessage as any[]).filter((content) => content.type === 'text')[0]?.text ?? undefined;
                  }
                }

                if (!aiResponse) {
                  return {
                    delivered: false,
                    reason: isAIMessage(lastMessage) ? 'empty_ai_response' : 'last_message_not_ai',
                  };
                }

                await redisService.saveAIMessage(chatId, aiResponse);
                await deliverAssistantTelegramText(chatId, aiResponse);

                return {
                  delivered: true,
                  responseText: aiResponse,
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

            if (!finalResponse.delivered) {
              await abandonCatalogDelegationPlaceholder(chatId);
            }

            return {
              delivered: finalResponse.delivered,
              outputText: 'responseText' in finalResponse ? finalResponse.responseText : undefined,
            };
          }

          await abandonCatalogDelegationPlaceholder(chatId);

          return {
            delivered: false,
          };
        },
        {
          attributes: {
            ...buildTraceInputAttributes(text, 2000, MimeType.TEXT),
            ...buildTraceAttributes({
              'telegram.chat_id': chatId,
              'telegram.user_id': requestContext?.telegramUserId,
              'telegram.username': requestContext?.telegramUsername,
              'run.thread_id': runThreadId,
              'transport': 'telegram',
            }),
          },
          mapResultAttributes: (turnResult) => ({
            ...buildTraceAttributes({
              'response.delivered': turnResult.delivered,
            }),
            ...(turnResult.outputText ? buildTraceOutputAttributes(turnResult.outputText, 2000, MimeType.TEXT) : {}),
          }),
        }
      )
    );
  } catch (error: any) {
    console.error('Error processing message:', error);
    await abandonCatalogDelegationPlaceholder(chatId);
    if (error.status === 429) {
      await TelegramService.sendMessage(chatId, 'Вы превысили лимит запросов. Попробуйте позже.');
      return;
    }

    await TelegramService.sendMessage(chatId, 'Не удалось обработать ваше сообщение.');
  } finally {
    await telegramMainGraphProgressReporter.onRunComplete({ chatId });
  }
}

export async function handleClearHistory(chatId: number, onlyMessages: boolean = false) {
  try {
    await redisService.clearAll(chatId, onlyMessages);
    await TelegramService.sendMessage(chatId, 'История чата очищена.');
  } catch (error) {
    console.error('Error clearing chat history:', error);
    await TelegramService.sendMessage(chatId, 'Не удалось очистить ваши данные.');
  }
}
