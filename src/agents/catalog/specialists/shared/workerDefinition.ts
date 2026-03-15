import { type BaseMessage } from '@langchain/core/messages';
import { type ToolRun } from '../../../shared/toolLoopGraph';
import { type CatalogWorkerToolName } from '../../contracts/workerRun';
import { createCatalogWorkerHandoffTool } from './handoffTool';

export type CatalogWorkerResult = {
  messages: BaseMessage[];
  toolRuns?: ToolRun[];
};

export type CatalogWorkerRuntime = {
  invoke(input: unknown, options?: unknown): Promise<CatalogWorkerResult>;
};

export type CatalogWorkerDefinition = {
  name: CatalogWorkerToolName;
  handoffTool: ReturnType<typeof createCatalogWorkerHandoffTool>;
  graph: CatalogWorkerRuntime;
};
