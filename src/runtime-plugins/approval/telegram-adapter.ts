import TelegramBot from 'node-telegram-bot-api';
import TelegramService from '../../services/telegram';
import type { RuntimeTelegramMessageRef } from '../shared/runtime-plugin.types';
import type { ApprovalChannelAdapter, ApprovalRequest } from './core';
import type { TelegramRequestContext } from './request-context';

export type TelegramApprovalMetadata = RuntimeTelegramMessageRef;

export type ParsedTelegramApprovalDecision = {
  approvalId: string;
  decision: 'approved' | 'rejected';
};

function serializeArgs(args: Record<string, unknown>) {
  try {
    const serialized = JSON.stringify(args);
    if (serialized.length <= 1500) {
      return serialized;
    }

    return `${serialized.slice(0, 1497)}...`;
  } catch {
    return '[не удалось сериализовать аргументы]';
  }
}

function formatDeadline(deadline: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(deadline);
}

function buildDecisionPayload(approvalId: string, decision: 'approved' | 'rejected') {
  return `approval:${decision === 'approved' ? 'a' : 'r'}:${approvalId}`;
}

function buildDecisionText(decision: 'approved' | 'rejected') {
  return decision === 'approved' ? 'Подтвердить' : 'Отклонить';
}

function buildRequesterLabel(context: TelegramRequestContext) {
  if (context.telegramUsername) {
    return `@${context.telegramUsername} (${context.telegramUserId})`;
  }

  return String(context.telegramUserId);
}

function buildApprovalMessage(input: ApprovalRequest<TelegramRequestContext>) {
  return [
    'Подтверждаешь?',
    `Действие: ${input.actionName}`,
    `Запросил: ${buildRequesterLabel(input.context)}`,
    `До: ${formatDeadline(input.deadline)}`,
    `Аргументы: ${serializeArgs(input.args)}`,
  ].join('\n');
}

export class TelegramApprovalAdapter implements ApprovalChannelAdapter<TelegramRequestContext> {
  async sendApprovalRequest(
    input: ApprovalRequest<TelegramRequestContext>
  ): Promise<TelegramApprovalMetadata> {
    const message = await TelegramService.sendMessage(input.context.chatId, buildApprovalMessage(input), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: buildDecisionText('approved'), callback_data: buildDecisionPayload(input.approvalId, 'approved') },
            { text: buildDecisionText('rejected'), callback_data: buildDecisionPayload(input.approvalId, 'rejected') },
          ],
        ],
      },
    });

    return {
      chatId: input.context.chatId,
      messageId: message.message_id,
    };
  }

  parseDecisionPayload(payload: string | undefined): ParsedTelegramApprovalDecision | null {
    if (!payload) {
      return null;
    }

    const match = payload.match(/^approval:(a|r):([a-f0-9-]+)$/i);
    if (!match) {
      return null;
    }

    return {
      approvalId: match[2],
      decision: match[1].toLowerCase() === 'a' ? 'approved' : 'rejected',
    };
  }

  async acknowledgeDecision(input: {
    callbackQuery: TelegramBot.CallbackQuery;
    result: 'approved' | 'rejected' | 'not_found' | 'forbidden';
  }) {
    const callbackQueryId = input.callbackQuery.id;

    if (input.result === 'not_found') {
      await TelegramService.answerCallbackQuery(callbackQueryId, {
        text: 'Этот approval уже закрыт или был потерян после рестарта.',
        show_alert: true,
      });
      return;
    }

    if (input.result === 'forbidden') {
      await TelegramService.answerCallbackQuery(callbackQueryId, {
        text: 'Подтвердить действие может только тот, кто запустил запрос.',
        show_alert: true,
      });
      return;
    }

    await TelegramService.answerCallbackQuery(callbackQueryId, {
      text: input.result === 'approved' ? 'Действие подтверждено.' : 'Действие отклонено.',
    });

    const message = input.callbackQuery.message;
    if (!message) {
      return;
    }

    await TelegramService.deleteMessage(message.chat.id, message.message_id).catch(() => undefined);
  }
}
