import type { RuntimeTelegramMessageRef } from '../shared/runtime-plugin.types';

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
  sendPlan(plan: RuntimePlan): Promise<RuntimeTelegramMessageRef | null>;
  updatePlan(plan: RuntimePlan): Promise<void>;
  deletePlan(plan: RuntimePlan): Promise<void>;
};

