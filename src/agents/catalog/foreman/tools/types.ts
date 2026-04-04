import { ToolMessage } from '@langchain/core/messages';
import { type CatalogExecutionResult } from '../executionResult';
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
  activeExecutionResult: CatalogExecutionResult | null;
};

export type CatalogToolExecutionResult = {
  run?: WorkerRun;
  toolMessage: ToolMessage;
  completion?: CatalogToolCompletion;
  executionResult?: CatalogExecutionResult;
  clearExecutionResult?: boolean;
};
