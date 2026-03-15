import {
  PLAN_TASK_OWNERS,
  PLAN_TASK_STATUSES,
  type PlanTaskOwner,
  type PlanTaskStatus,
  type PlanningProjectionAdapter,
  type RuntimePlan,
  type RuntimePlanCreateInput,
  type RuntimePlanTask,
  type RuntimePlanUpdateInput,
} from './types';

export type PlanningErrorType =
  | 'planning_invalid'
  | 'planning_conflict'
  | 'planning_not_found'
  | 'planning_not_active';

export class PlanningRuntimeError extends Error {
  readonly type: PlanningErrorType;

  constructor(type: PlanningErrorType, message: string) {
    super(message);
    this.name = 'PlanningRuntimeError';
    this.type = type;
  }
}

export function isPlanningRuntimeError(error: unknown): error is PlanningRuntimeError {
  return error instanceof PlanningRuntimeError;
}

type PlanningCoreOptions = {
  channelAdapter?: PlanningProjectionAdapter;
  now?: () => Date;
};

const planTaskOwners = new Set<PlanTaskOwner>(PLAN_TASK_OWNERS);
const planTaskStatuses = new Set<PlanTaskStatus>(PLAN_TASK_STATUSES);

function cloneTask(task: RuntimePlanTask): RuntimePlanTask {
  return {
    taskId: task.taskId,
    title: task.title,
    owner: task.owner,
    status: task.status,
    ...(task.notes ? { notes: task.notes } : {}),
  };
}

function clonePlan(plan: RuntimePlan): RuntimePlan {
  return {
    ...plan,
    tasks: plan.tasks.map(cloneTask),
    createdAt: new Date(plan.createdAt),
    updatedAt: new Date(plan.updatedAt),
    ...(plan.completedAt ? { completedAt: new Date(plan.completedAt) } : {}),
    ...(plan.startedAt ? { startedAt: new Date(plan.startedAt) } : {}),
  };
}

function normalizeText(value: string, fieldName: string) {
  const normalized = value.trim();
  if (!normalized) {
    throw new PlanningRuntimeError('planning_invalid', `Поле ${fieldName} должно быть непустой строкой.`);
  }

  return normalized;
}

function normalizeOptionalText(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function validateTasks(tasks: RuntimePlanTask[]) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new PlanningRuntimeError('planning_invalid', 'План выполнения должен содержать хотя бы одну задачу.');
  }

  const seenTaskIds = new Set<string>();
  let inProgressCount = 0;
  const normalizedTasks = tasks.map((task, index) => {
    const taskId = normalizeText(task.taskId, `tasks[${index}].taskId`);
    const title = normalizeText(task.title, `tasks[${index}].title`);
    const notes = normalizeOptionalText(task.notes);

    if (!planTaskOwners.has(task.owner)) {
      throw new PlanningRuntimeError(
        'planning_invalid',
        `tasks[${index}].owner должен быть одним из: ${PLAN_TASK_OWNERS.join(', ')}.`
      );
    }

    if (!planTaskStatuses.has(task.status)) {
      throw new PlanningRuntimeError(
        'planning_invalid',
        `tasks[${index}].status должен быть одним из: ${PLAN_TASK_STATUSES.join(', ')}.`
      );
    }

    if (seenTaskIds.has(taskId)) {
      throw new PlanningRuntimeError('planning_invalid', `Повторяющийся taskId "${taskId}" недопустим.`);
    }
    seenTaskIds.add(taskId);

    if (task.status === 'in_progress') {
      inProgressCount += 1;
    }

    return {
      taskId,
      title,
      owner: task.owner,
      status: task.status,
      ...(notes ? { notes } : {}),
    };
  });

  if (inProgressCount > 1) {
    throw new PlanningRuntimeError(
      'planning_invalid',
      'План выполнения может содержать не более одной задачи со статусом "in_progress".'
    );
  }

  return normalizedTasks;
}

export class PlanningCore {
  private readonly plans = new Map<string, RuntimePlan>();
  private readonly channelAdapter?: PlanningProjectionAdapter;
  private readonly now: () => Date;

  constructor(options: PlanningCoreOptions = {}) {
    this.channelAdapter = options.channelAdapter;
    this.now = options.now ?? (() => new Date());
  }

  async createPlan(input: RuntimePlanCreateInput): Promise<RuntimePlan> {
    const existingPlan = this.plans.get(input.runId);
    if (existingPlan) {
      throw new PlanningRuntimeError(
        'planning_conflict',
        `План выполнения для run "${input.runId}" уже существует и не может быть создан повторно.`
      );
    }

    const createdAt = this.now();
    const plan: RuntimePlan = {
      runId: normalizeText(input.runId, 'runId'),
      chatId: input.chatId,
      status: 'active',
      tasks: validateTasks(input.tasks),
      createdAt,
      updatedAt: createdAt,
      ...(input.startedAt ? { startedAt: new Date(input.startedAt) } : {}),
      ...(normalizeOptionalText(input.requestText) ? { requestText: normalizeOptionalText(input.requestText) } : {}),
    };

    if (!Number.isInteger(plan.chatId)) {
      throw new PlanningRuntimeError('planning_invalid', 'chatId должен быть целым числом.');
    }

    this.plans.set(plan.runId, plan);

    try {
      await this.publishPlan(plan);
    } catch (error) {
      this.plans.delete(plan.runId);
      throw error;
    }

    return clonePlan(plan);
  }

  async updatePlan(input: RuntimePlanUpdateInput): Promise<RuntimePlan> {
    const plan = this.getRequiredActivePlan(input.runId);
    plan.tasks = validateTasks(input.tasks);
    plan.updatedAt = this.now();

    await this.publishPlan(plan);
    return clonePlan(plan);
  }

  async completePlan(runId: string): Promise<RuntimePlan> {
    const plan = this.getRequiredActivePlan(runId);
    const hasInProgressTask = plan.tasks.some((task) => task.status === 'in_progress');
    if (hasInProgressTask) {
      throw new PlanningRuntimeError(
        'planning_invalid',
        'Нельзя завершить план выполнения, пока хотя бы одна задача находится в статусе "in_progress".'
      );
    }

    plan.status = 'completed';
    plan.updatedAt = this.now();
    plan.completedAt = new Date(plan.updatedAt);

    if (plan.telegramMessageId && this.channelAdapter) {
      await this.channelAdapter.deletePlan(clonePlan(plan));
    }

    return clonePlan(plan);
  }

  async failPlan(runId: string): Promise<RuntimePlan> {
    const plan = this.getRequiredActivePlan(runId);
    plan.status = 'failed';
    plan.updatedAt = this.now();
    plan.completedAt = new Date(plan.updatedAt);

    await this.publishPlan(plan);
    return clonePlan(plan);
  }

  getPlan(runId: string): RuntimePlan | null {
    const plan = this.plans.get(runId);
    return plan ? clonePlan(plan) : null;
  }

  getActivePlan(runId: string): RuntimePlan | null {
    const plan = this.plans.get(runId);
    if (!plan || plan.status !== 'active') {
      return null;
    }

    return clonePlan(plan);
  }

  async finalizeDanglingPlan(runId: string): Promise<void> {
    const plan = this.plans.get(runId);
    if (!plan || plan.status !== 'active') {
      return;
    }

    plan.status = 'abandoned';
    plan.updatedAt = this.now();
    plan.completedAt = new Date(plan.updatedAt);
    await this.publishPlan(plan);
  }

  private getRequiredActivePlan(runId: string) {
    const plan = this.plans.get(runId);
    if (!plan) {
      throw new PlanningRuntimeError('planning_not_found', `План выполнения для run "${runId}" не найден.`);
    }

    if (plan.status !== 'active') {
      throw new PlanningRuntimeError(
        'planning_not_active',
        `План выполнения для run "${runId}" уже завершён со статусом "${plan.status}".`
      );
    }

    return plan;
  }

  private async publishPlan(plan: RuntimePlan) {
    if (!this.channelAdapter) {
      return;
    }

    const planSnapshot = clonePlan(plan);
    if (plan.telegramMessageId) {
      await this.channelAdapter.updatePlan(planSnapshot);
      return;
    }

    const messageRef = await this.channelAdapter.sendPlan(planSnapshot);
    if (messageRef?.messageId) {
      plan.telegramMessageId = messageRef.messageId;
    }
  }
}
