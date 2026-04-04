import TelegramService from '../../services/telegram';
import type {
  PlanningChannelAdapter,
  RuntimePlan,
  RuntimePlanStatus,
  RuntimePlanTask,
} from '../../runtime/planning/types';

const taskStatusIcons: Record<RuntimePlanTask['status'], string> = {
  pending: '◻️',
  in_progress: '🔄',
  completed: '✅',
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
  const lines = [`Статус: ${planStatusLabels[plan.status]}`];

  if (plan.status === 'active' && plan.tasks.some((task) => task.status === 'in_progress')) {
    lines.push('Сейчас выполняется шаг, отмеченный 🔄.');
  }

  lines.push('');
  lines.push(...plan.tasks.map(formatTask).flatMap((task, index) => (index === 0 ? [task] : ['', task])));

  return lines.join('\n').trim();
}

export class TelegramPlanningAdapter implements PlanningChannelAdapter {
  async sendPlan(plan: RuntimePlan): Promise<number | null> {
    const message = await TelegramService.sendMessage(plan.chatId, renderRuntimePlan(plan));
    return message.message_id;
  }

  async updatePlan(plan: RuntimePlan, messageId: number): Promise<void> {
    await TelegramService.editMessageText(renderRuntimePlan(plan), {
      chat_id: plan.chatId,
      message_id: messageId,
    });
  }

  async deletePlan(plan: RuntimePlan, messageId: number): Promise<void> {
    await TelegramService.deleteMessage(plan.chatId, messageId);
  }
}
