export const PLAN_TASK_OWNERS = [
  'catalog-agent',
  'category-worker',
  'attribute-worker',
  'product-worker',
  'variation-worker',
] as const;

export const PLAN_TASK_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'blocked',
  'failed',
  'skipped',
] as const;

export const PLAN_STATUSES = ['active', 'completed', 'failed', 'abandoned'] as const;

export type PlanTaskOwner = (typeof PLAN_TASK_OWNERS)[number];
export type PlanTaskStatus = (typeof PLAN_TASK_STATUSES)[number];
export type RuntimePlanStatus = (typeof PLAN_STATUSES)[number];

export type RuntimePlanTask = {
  taskId: string;
  title: string;
  owner: PlanTaskOwner;
  status: PlanTaskStatus;
  notes?: string;
  /**
   * Optional executable contract for execution-driven planning.
   * If present, execution runtime can handoff objective/facts/etc to the responsible worker.
   */
  execution?: RuntimePlanExecution;
};

export type RuntimePlan = {
  runId: string;
  chatId: number;
  status: RuntimePlanStatus;
  tasks: RuntimePlanTask[];
  telegramMessageId?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  startedAt?: Date;
  requestText?: string;
  /**
   * Execution-driven planning guard.
   * When `true`, the next valid step after `foreman_checkpoint(action=replan)`
   * is to provide a fresh executable snapshot via `run_execution_plan`.
   */
  replanAwaitingSnapshot?: boolean;
};

export type RuntimePlanCreateInput = {
  runId: string;
  chatId: number;
  tasks: RuntimePlanTask[];
  startedAt?: Date;
  requestText?: string;
};

export type RuntimePlanUpdateInput = {
  runId: string;
  tasks: RuntimePlanTask[];
};

export type PlanningProjectionAdapter = {
  sendPlan(plan: RuntimePlan): Promise<{ chatId: number; messageId: number } | null>;
  updatePlan(plan: RuntimePlan): Promise<void>;
  deletePlan(plan: RuntimePlan): Promise<void>;
};

/**
 * Executable task input shape for `run_execution_plan`.
 * Maps to RuntimePlanTask.execution internally.
 */
export type ExecutableTaskOwner = Exclude<PlanTaskOwner, 'catalog-agent'>;

export type ExecutableTask = {
  taskId: string;
  /** Responsible worker (not catalog-agent). */
  responsible: ExecutableTaskOwner;
  /** Objective for worker (what it should do/read). */
  task: string;
  inputData: {
    facts: string[];
    constraints: string[];
    contextNotes?: string;
  };
  /** Strict worker response contract (fields + format). */
  responseStructure: string;
};

export type RuntimePlanExecution = {
  objective: string;
  facts: string[];
  constraints: string[];
  expectedOutput: string;
  contextNotes?: string;
};

