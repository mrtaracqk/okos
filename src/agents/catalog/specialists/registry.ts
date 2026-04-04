import { type BaseMessage } from '@langchain/core/messages';
import { chatModel } from '../../../config';
import { getCatalogWorkerPrompt } from '../../../prompts';
import { type CatalogWorkerId } from '../../../contracts/catalogExecutionOwners';
import { createWorkerResultTool } from '../contracts/workerResult';
import { extractCatalogFinalResult, renderWorkerHandoffMessage } from './graph/catalogWorkerProtocol';
import { createWorkerLoopGraph } from './graph/workerLoopGraph';
import { CATALOG_SPECIALIST_SPECS, type CatalogSpecialistSpec } from './specs';
import { type ToolRun } from '../../shared/toolRun';
import { type WorkerTaskEnvelope } from '../contracts/workerRequest';
import { type WorkerResult } from '../contracts/workerResult';

export type CatalogWorkerResult = {
  messages: BaseMessage[];
  toolRuns?: ToolRun[];
  handoff?: WorkerTaskEnvelope | null;
  finalResult?: WorkerResult | null;
};

export type CatalogWorkerRuntime = {
  invoke(input: unknown, options?: unknown): Promise<CatalogWorkerResult>;
};

export type CatalogWorkerDefinition = {
  id: CatalogWorkerId;
  graph: CatalogWorkerRuntime;
};

function createCatalogWorkerDefinition(spec: CatalogSpecialistSpec<CatalogWorkerId>): CatalogWorkerDefinition {
  const tools = [
    ...spec.tools.domainRead,
    ...spec.tools.domainMutations,
    ...spec.tools.researchRead,
    createWorkerResultTool(),
  ];
  const graph = createWorkerLoopGraph({
    model: chatModel,
    tools,
    systemPrompt: () =>
      getCatalogWorkerPrompt(
        spec.id,
        tools.map((tool) => tool.name)
      ),
    renderHandoffMessage: renderWorkerHandoffMessage,
    extractFinalResult: extractCatalogFinalResult,
  }).compile({
    checkpointer: true,
    name: spec.id,
  });

  return {
    id: spec.id,
    graph,
  };
}

const catalogWorkerDefinitionsById = Object.fromEntries(
  CATALOG_SPECIALIST_SPECS.map((spec) => [spec.id, createCatalogWorkerDefinition(spec)])
) as Record<CatalogWorkerId, CatalogWorkerDefinition>;

export function resolveCatalogWorker(workerId: CatalogWorkerId): CatalogWorkerDefinition {
  return catalogWorkerDefinitionsById[workerId];
}
