import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { CATALOG_WORKER_KNOWLEDGE } from '../catalogWorkerKnowledge';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { productWorkerWooTools } from './shared/wooTools/productTools';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const k = CATALOG_WORKER_KNOWLEDGE['product-worker'];

const productWorkerTools = [...productWorkerWooTools, createWorkerResultTool()];

function buildProductWorkerGraph() {
  return createToolLoopGraph({
    model: chatModel,
    tools: productWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.PRODUCT(productWorkerTools.map((tool) => tool.name)),
    finalToolNames: [WORKER_RESULT_TOOL_NAME],
  });
}

export const productWorkerGraph = buildProductWorkerGraph().compile({
  checkpointer: true,
  name: 'product-worker',
});

export const productWorkerDefinition: CatalogWorkerDefinition = {
  id: k.id,
  graph: productWorkerGraph,
};
