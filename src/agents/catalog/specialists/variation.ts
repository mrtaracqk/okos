import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { CATALOG_WORKER_KNOWLEDGE } from '../catalogWorkerKnowledge';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { variationWorkerWooTools } from './shared/wooTools/variationTools';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const k = CATALOG_WORKER_KNOWLEDGE['variation-worker'];

const variationWorkerTools = [...variationWorkerWooTools, createWorkerResultTool()];

function buildVariationWorkerGraph() {
  return createToolLoopGraph({
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
