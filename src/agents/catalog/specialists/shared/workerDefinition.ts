import { type BaseMessage } from '@langchain/core/messages';
import { type ToolRun } from '../../../shared/toolLoopGraph';
import { type WorkerResultEnvelope } from '../../contracts/workerResult';
import { type WorkerTaskEnvelope } from '../../contracts/workerRequest';
import { type CatalogWorkerToolName } from '../../contracts/workerRun';
import { createCatalogWorkerHandoffTool } from './handoffTool';

export type CatalogWorkerResult = {
  messages: BaseMessage[];
  toolRuns?: ToolRun[];
  /** Structured handoff passed into the worker (echo of input). */
  handoff?: WorkerTaskEnvelope | null;
  /** Set by the worker graph when report_worker_result completes. */
  finalResult?: WorkerResultEnvelope | null;
};

export type CatalogWorkerRuntime = {
  invoke(input: unknown, options?: unknown): Promise<CatalogWorkerResult>;
};

export type CatalogWorkerDefinition = {
  name: CatalogWorkerToolName;
  handoffTool: ReturnType<typeof createCatalogWorkerHandoffTool>;
  graph: CatalogWorkerRuntime;
};
