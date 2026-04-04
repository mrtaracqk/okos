import { type BaseMessage } from '@langchain/core/messages';
import { type ToolRun } from '../../../shared/toolRun';
import { type CatalogWorkerId } from '../../contracts/catalogWorkerId';
import { type WorkerTaskEnvelope } from '../../contracts/workerRequest';
import { type WorkerResultEnvelope } from '../../contracts/workerResult';

export type CatalogWorkerResult = {
  messages: BaseMessage[];
  toolRuns?: ToolRun[];
  handoff?: WorkerTaskEnvelope | null;
  finalResult?: WorkerResultEnvelope | null;
};

export type CatalogWorkerRuntime = {
  invoke(input: unknown, options?: unknown): Promise<CatalogWorkerResult>;
};

export type CatalogWorkerDefinition = {
  id: CatalogWorkerId;
  graph: CatalogWorkerRuntime;
};
