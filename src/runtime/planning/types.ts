import {
  CATALOG_TASK_OWNERS,
  type CatalogWorkerId,
} from '../../contracts/catalogExecutionOwners';

export const PLAN_TASK_OWNERS = CATALOG_TASK_OWNERS;

export const PLAN_TASK_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'failed',
  'skipped',
] as const;

export const PLAN_STATUSES = ['active', 'completed', 'failed', 'abandoned'] as const;

export type PlanTaskOwner = (typeof CATALOG_TASK_OWNERS)[number];
export type PlanTaskStatus = (typeof PLAN_TASK_STATUSES)[number];
export type RuntimePlanStatus = (typeof PLAN_STATUSES)[number];

export type RuntimePlanTask = {
  taskId: string;
  title: string;
  owner: PlanTaskOwner;
  status: PlanTaskStatus;
  notes?: string;
  /**
   * Optional step-local executable contract for execution-driven planning.
   */
  execution?: RuntimePlanExecution;
};

export type RuntimePlanContext = {
  goal: string;
  facts: string[];
  constraints: string[];
};

export type RuntimePlan = {
  runId: string;
  chatId: number;
  status: RuntimePlanStatus;
  planContext: RuntimePlanContext;
  tasks: RuntimePlanTask[];
  nextStepArtifacts?: unknown[];
};

export type RuntimePlanCreateInput = {
  runId: string;
  chatId: number;
  planContext: RuntimePlanContext;
  tasks: RuntimePlanTask[];
  nextStepArtifacts?: unknown[];
};

export type RuntimePlanUpdateInput = {
  runId: string;
  tasks: RuntimePlanTask[];
  planContext?: RuntimePlanContext;
  nextStepArtifacts?: unknown[];
};

export type PlanningChannelAdapter = {
  sendPlan(plan: RuntimePlan): Promise<number | null>;
  updatePlan(plan: RuntimePlan, messageId: number): Promise<void>;
  deletePlan(plan: RuntimePlan, messageId: number): Promise<void>;
};

/**
 * Executable task input shape for `new_execution_plan`.
 * Maps to RuntimePlanTask.execution internally.
 */
export type ExecutableTaskOwner = CatalogWorkerId;

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
