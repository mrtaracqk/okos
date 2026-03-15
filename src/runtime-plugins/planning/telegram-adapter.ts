import TelegramService from '../../services/telegram';
import type { RuntimeTelegramMessageRef } from '../shared/runtime-plugin.types';
import type { PlanningProjectionAdapter, RuntimePlan, RuntimePlanStatus, RuntimePlanTask } from './types';

const taskStatusIcons: Record<RuntimePlanTask['status'], string> = {
  pending: '◻️',
  in_progress: '🔄',
  completed: '✅',
  blocked: '⛔',
  failed: '❌',
  skipped: '⏭️',
};

const planStatusLabels: Record<RuntimePlanStatus, string> = {
  active: 'в работе',
  completed: 'завершен',
  failed: 'завершен с ошибкой',
  abandoned: 'прерван',
};

function formatTask(task: RuntimePlanTask) {
  const lines = [`${taskStatusIcons[task.status]} ${task.title}`, `Ответственный: ${task.owner}`];
  if (task.notes) {
    lines.push(`Заметка: ${task.notes}`);
  }

  return lines.join('\n');
}

export function renderRuntimePlan(plan: RuntimePlan) {
  const lines = ['План выполнения'];

  if (plan.status !== 'active') {
    lines.push(`Статус: ${planStatusLabels[plan.status]}`);
  }

  lines.push('');
  lines.push(...plan.tasks.map(formatTask).flatMap((task, index) => (index === 0 ? [task] : ['', task])));

  return lines.join('\n').trim();
}

export class TelegramPlanningAdapter implements PlanningProjectionAdapter {
  async sendPlan(plan: RuntimePlan): Promise<RuntimeTelegramMessageRef | null> {
    const message = await TelegramService.sendMessage(plan.chatId, renderRuntimePlan(plan));
    return {
      chatId: plan.chatId,
      messageId: message.message_id,
    };
  }

  async updatePlan(plan: RuntimePlan): Promise<void> {
    if (!plan.telegramMessageId) {
      throw new Error(`План выполнения для run "${plan.runId}" нельзя обновить без telegramMessageId.`);
    }

    await TelegramService.editMessageText(renderRuntimePlan(plan), {
      chat_id: plan.chatId,
      message_id: plan.telegramMessageId,
    });
  }

  async deletePlan(plan: RuntimePlan): Promise<void> {
    if (!plan.telegramMessageId) {
      return;
    }

    await TelegramService.deleteMessage(plan.chatId, plan.telegramMessageId);
  }
}
