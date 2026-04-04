import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { CATALOG_WORKER_KNOWLEDGE } from '../catalogWorkerKnowledge';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createCatalogToolLoopGraph } from './shared/catalogToolLoop';
import { getCatalogWorkerRuntimeTools } from './shared/workerToolsets';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const k = CATALOG_WORKER_KNOWLEDGE['variation-worker'];

const variationWorkerTools = [...getCatalogWorkerRuntimeTools(k.id), createWorkerResultTool()];

function buildVariationWorkerGraph() {
  return createCatalogToolLoopGraph({
    model: chatModel,
    tools: variationWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.VARIATION(variationWorkerTools.map((tool) => tool.name)),
    finalToolNames: [WORKER_RESULT_TOOL_NAME],
  });
}

export const variationWorkerGraph = buildVariationWorkerGraph().compile({
  checkpointer: true,
  name: 'variation-worker',
});

export const variationWorkerDefinition: CatalogWorkerDefinition = {
  id: k.id,
  graph: variationWorkerGraph,
};
