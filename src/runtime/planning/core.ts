import {
  PLAN_TASK_OWNERS,
  PLAN_TASK_STATUSES,
  type PlanTaskOwner,
  type PlanTaskStatus,
  type PlanningChannelAdapter,
  type RuntimePlan,
  type RuntimePlanContext,
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
  channelAdapter?: PlanningChannelAdapter;
};

const planTaskOwners = new Set<PlanTaskOwner>(PLAN_TASK_OWNERS);
const planTaskStatuses = new Set<PlanTaskStatus>(PLAN_TASK_STATUSES);

function cloneArtifacts(artifacts: unknown[]): unknown[] {
  return [...artifacts];
}

function cloneTask(task: RuntimePlanTask): RuntimePlanTask {
  return {
    taskId: task.taskId,
    title: task.title,
    owner: task.owner,
    status: task.status,
    ...(task.notes ? { notes: task.notes } : {}),
    ...(task.execution
      ? {
          execution: {
            ...task.execution,
            facts: [...task.execution.facts],
            constraints: [...task.execution.constraints],
          },
        }
      : {}),
  };
}

function clonePlanContext(planContext: RuntimePlanContext): RuntimePlanContext {
  return {
    goal: planContext.goal,
    facts: [...planContext.facts],
    constraints: [...planContext.constraints],
  };
}

function clonePlan(plan: RuntimePlan): RuntimePlan {
  return {
    runId: plan.runId,
    chatId: plan.chatId,
    status: plan.status,
    planContext: clonePlanContext(plan.planContext),
    tasks: plan.tasks.map(cloneTask),
    ...(plan.nextStepArtifacts !== undefined ? { nextStepArtifacts: cloneArtifacts(plan.nextStepArtifacts) } : {}),
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

function normalizeTextList(value: unknown, fieldPath: string) {
  if (!Array.isArray(value)) {
    throw new PlanningRuntimeError('planning_invalid', `${fieldPath} must be an array of strings.`);
  }

  return value.map((item) => normalizeOptionalText(typeof item === 'string' ? item : undefined) ?? '').filter(Boolean);
}

function normalizePlanContext(planContext: RuntimePlanContext, fieldPath: string): RuntimePlanContext {
  if (!planContext || typeof planContext !== 'object') {
    throw new PlanningRuntimeError('planning_invalid', `Поле ${fieldPath} обязательно.`);
  }

  return {
    goal: normalizeText(planContext.goal, `${fieldPath}.goal`),
    facts: normalizeTextList(planContext.facts, `${fieldPath}.facts`),
    constraints: normalizeTextList(planContext.constraints, `${fieldPath}.constraints`),
  };
}

function normalizeArtifacts(value: unknown, fieldPath: string): unknown[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new PlanningRuntimeError('planning_invalid', `${fieldPath} must be an array when present.`);
  }

  return cloneArtifacts(value);
}

function normalizeExecution(execution: RuntimePlanTask['execution'], fieldPath: string) {
  if (!execution) return undefined;

  const objective = normalizeText(execution.objective, `${fieldPath}.objective`);
  const expectedOutput = normalizeText(execution.expectedOutput, `${fieldPath}.expectedOutput`);

  const contextNotes = normalizeOptionalText(execution.contextNotes);

  return {
    objective,
    facts: normalizeTextList(execution.facts, `${fieldPath}.facts`),
    constraints: normalizeTextList(execution.constraints, `${fieldPath}.constraints`),
    expectedOutput,
    contextNotes,
  };
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
    const execution = normalizeExecution(task.execution, `tasks[${index}].execution`);

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
      ...(execution ? { execution } : {}),
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
  private readonly channelAdapter?: PlanningChannelAdapter;
  private readonly channelMessageIds = new Map<string, number>();

  constructor(options: PlanningCoreOptions = {}) {
    this.channelAdapter = options.channelAdapter;
  }

  async createPlan(input: RuntimePlanCreateInput): Promise<RuntimePlan> {
    const existingPlan = this.plans.get(input.runId);
    if (existingPlan) {
      throw new PlanningRuntimeError(
        'planning_conflict',
        `План выполнения для run "${input.runId}" уже существует и не может быть создан повторно.`
      );
    }

    const plan: RuntimePlan = {
      runId: normalizeText(input.runId, 'runId'),
      chatId: input.chatId,
      status: 'active',
      planContext: normalizePlanContext(input.planContext, 'planContext'),
      tasks: validateTasks(input.tasks),
      ...(input.nextStepArtifacts !== undefined
        ? { nextStepArtifacts: normalizeArtifacts(input.nextStepArtifacts, 'nextStepArtifacts') }
        : {}),
    };

    if (!Number.isInteger(plan.chatId)) {
      throw new PlanningRuntimeError('planning_invalid', 'chatId должен быть целым числом.');
    }

    this.plans.set(plan.runId, plan);

    try {
      await this.publishPlan(plan);
    } catch (error) {
      this.plans.delete(plan.runId);
      this.channelMessageIds.delete(plan.runId);
      throw error;
    }

    return clonePlan(plan);
  }

  async updatePlan(input: RuntimePlanUpdateInput): Promise<RuntimePlan> {
    const plan = this.getRequiredActivePlan(input.runId);
    plan.tasks = validateTasks(input.tasks);
    if (Object.prototype.hasOwnProperty.call(input, 'planContext')) {
      plan.planContext = normalizePlanContext(input.planContext as RuntimePlanContext, 'planContext');
    }
    if (Object.prototype.hasOwnProperty.call(input, 'nextStepArtifacts')) {
      const nextStepArtifacts = normalizeArtifacts(input.nextStepArtifacts, 'nextStepArtifacts');
      if (nextStepArtifacts !== undefined) {
        plan.nextStepArtifacts = nextStepArtifacts;
      } else {
        delete plan.nextStepArtifacts;
      }
    }

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
    const messageId = this.channelMessageIds.get(runId);
    try {
      if (typeof messageId === 'number' && this.channelAdapter) {
        await this.channelAdapter.deletePlan(clonePlan(plan), messageId);
      }
    } catch (error) {
      plan.status = 'active';
      throw error;
    }
    this.channelMessageIds.delete(runId);

    return clonePlan(plan);
  }

  async failPlan(runId: string): Promise<RuntimePlan> {
    const plan = this.getRequiredActivePlan(runId);
    const previousStatus = plan.status;
    plan.status = 'failed';

    try {
      await this.publishPlan(plan);
    } catch (error) {
      plan.status = previousStatus;
      throw error;
    }
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

    const previousStatus = plan.status;
    plan.status = 'abandoned';
    try {
      await this.publishPlan(plan);
    } catch (error) {
      plan.status = previousStatus;
      throw error;
    }
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
    const messageId = this.channelMessageIds.get(plan.runId);
    if (typeof messageId === 'number') {
      await this.channelAdapter.updatePlan(planSnapshot, messageId);
      return;
    }

    const nextMessageId = await this.channelAdapter.sendPlan(planSnapshot);
    if (typeof nextMessageId === 'number') {
      this.channelMessageIds.set(plan.runId, nextMessageId);
    }
  }
}
