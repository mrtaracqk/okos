import type { RuntimePlan, RuntimePlanExecution } from '../../../runtime/planning/types';
import type { WorkerRun } from '../contracts/workerRun';
import { type WorkerResultBlocker } from '../contracts/workerResult';
import { renderWorkerResultEnvelopeSummary } from '../contracts/workerResult';

const MAX_OBJECTIVE = 240;
const MAX_FACT = 280;
const MAX_CONSTRAINT = 140;

function truncate(value: string, max: number): string {
  const t = value.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/** Что реально получит следующий воркер (из текущего плана). */
function formatNextStepInput(execution: RuntimePlanExecution | undefined): string[] {
  if (!execution) {
    return ['  (в плане не указано, что передать на вход)'];
  }
  const lines: string[] = [`  Задача: ${truncate(execution.objective, MAX_OBJECTIVE)}`];

  if (execution.facts.length) {
    lines.push('  Известно на вход:');
    for (const f of execution.facts.slice(0, 10)) {
      lines.push(`    - ${truncate(f, 180)}`);
    }
    if (execution.facts.length > 10) {
      lines.push(`    … ещё ${execution.facts.length - 10}`);
    }
  } else {
    lines.push('  Известно на вход: ничего');
  }

  if (execution.constraints.length) {
    lines.push('  Ограничения:');
    for (const c of execution.constraints.slice(0, 6)) {
      lines.push(`    - ${truncate(c, MAX_CONSTRAINT)}`);
    }
    if (execution.constraints.length > 6) {
      lines.push(`    … ещё ${execution.constraints.length - 6}`);
    }
  }

  lines.push(`  Нужно вернуть: ${truncate(execution.expectedOutput, MAX_OBJECTIVE)}`);

  if (execution.contextNotes?.trim()) {
    lines.push(`  Примечание: ${truncate(execution.contextNotes, MAX_OBJECTIVE)}`);
  }

  return lines;
}

function workerOutcomeLines(run: WorkerRun): string[] {
  const lines: string[] = [];
  if (run.result) {
    lines.push(`Результат: ${renderWorkerResultEnvelopeSummary(run.result)}`);
    if (run.result.facts.length > 0) {
      lines.push('Данные из отчёта:');
      for (const fact of run.result.facts.slice(0, 14)) {
        lines.push(`  - ${truncate(fact, MAX_FACT)}`);
      }
      if (run.result.facts.length > 14) {
        lines.push(`  … ещё ${run.result.facts.length - 14}`);
      }
    }
    if (run.result.missingInputs.length > 0) {
      lines.push(`Не хватает: ${run.result.missingInputs.join('; ')}`);
    }
    if (run.result.blocker) {
      lines.push(`Блокер: ${formatBlocker(run.result.blocker)}`);
    }
  } else {
    lines.push(`Служебное сообщение: ${truncate(run.details || run.task || '(нет)', 1400)}`);
  }
  return lines;
}

function formatBlocker(blocker: WorkerResultBlocker): string {
  return `${blocker.kind} -> ${blocker.owner}: ${truncate(blocker.reason, MAX_OBJECTIVE)}`;
}

export type PlannerSubtaskNarrativePhase = 'new_execution_plan' | 'approve_step';

/**
 * Сообщение бригадиру между шагами: что сделано, что дальше, какой вход у следующего воркера.
 */
export function buildPlannerSubtaskNarrative(options: {
  phase: PlannerSubtaskNarrativePhase;
  plan: RuntimePlan;
  completedTaskId: string;
  run: WorkerRun;
}): string {
  const { phase, plan, completedTaskId, run } = options;
  const completedTask = plan.tasks.find((t) => t.taskId === completedTaskId);
  const title = completedTask?.title ?? completedTaskId;
  const owner = completedTask?.owner ?? run.agent;
  const planStatus = completedTask?.status ?? '(нет в плане)';
  const blocker = run.result?.blocker;

  const lines: string[] = [
    'Итог выполненной подзадачи:',
    '',
    `Подзадача: ${completedTaskId} — ${truncate(title, 200)}`,
    `Исполнитель: ${owner}. Статус в плане: ${planStatus}`,
    '',
    ...workerOutcomeLines(run),
    '',
  ];

  const nextPending = plan.tasks.find((t) => t.status === 'pending');
  const inProgress = plan.tasks.find((t) => t.status === 'in_progress');

  if (nextPending) {
    lines.push(
      'Следующий шаг (после approve_step пойдёт он):',
      `${nextPending.taskId} — ${truncate(nextPending.title, 200)} · ${nextPending.owner}`,
      '',
      'На вход следующему воркеру уйдёт только то, что записано в плане ниже. Отчёт сверху в этот список сам не добавляется.',
      blocker
        ? `Текущий worker вернул blocker (${formatBlocker(blocker)}). Обычно здесь нужен new_execution_plan, а не approve_step.`
        : 'Если шаг прошёл успешно и этот вход всё ещё подходит — вызови approve_step.',
      'Если нужно обновить вход для оставшихся шагов, сменить owner или изменить список шагов — new_execution_plan.',
      '',
      'Вход для следующего шага:',
      ...formatNextStepInput(nextPending.execution)
    );
  } else if (inProgress) {
    lines.push(
      `Сейчас в работе: ${inProgress.taskId} · ${inProgress.owner}`,
      '',
      'Вход для этой подзадачи:',
      ...formatNextStepInput(inProgress.execution)
    );
  } else {
    lines.push(
      blocker
        ? `Очереди подзадач нет, а worker вернул blocker (${formatBlocker(blocker)}). Либо перестрой план на нужного owner через new_execution_plan, либо закрой работу через finish_execution_plan, если запрос упёрся в недостающий вход.`
        : 'Очереди подзадач нет. Либо закрой работу: finish_execution_plan (summary — ответ пользователю), либо набери новый план: new_execution_plan, если запрос ещё не закрыт.'
    );
  }

  lines.push(
    '',
    'Инструменты:',
    '· approve_step — запуск следующей подзадачи из плана',
    '· new_execution_plan — другой состав шагов или другой вход для хвоста',
    '· finish_execution_plan — конец, итог в summary'
  );

  return lines.join('\n');
}
