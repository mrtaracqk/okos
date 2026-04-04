import { ToolMessage } from '@langchain/core/messages';
import { type ExecutionSnapshot } from '../executionSnapshot';
import { type WorkerRun } from '../../contracts/workerRun';

export type CatalogToolCall = {
  id?: string;
  name?: string;
  args?: unknown;
};

export type CatalogToolCompletion = {
  summary: string;
  finalizeOutcome: 'completed' | 'failed';
};

export type CatalogToolExecutionContext = {
  activeExecutionSnapshot: ExecutionSnapshot | null;
};

export type CatalogToolExecutionResult = {
  run?: WorkerRun;
  toolMessage: ToolMessage;
  completion?: CatalogToolCompletion;
  executionSnapshot?: ExecutionSnapshot;
  clearExecutionSnapshot?: boolean;
};
