import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { CATALOG_WORKER_KNOWLEDGE } from '../catalogWorkerKnowledge';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createCatalogToolLoopGraph } from './shared/catalogToolLoop';
import { getCatalogWorkerRuntimeTools } from './shared/workerToolsets';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const k = CATALOG_WORKER_KNOWLEDGE['category-worker'];

const categoryWorkerTools = [...getCatalogWorkerRuntimeTools(k.id), createWorkerResultTool()];

function buildCategoryWorkerGraph() {
  return createCatalogToolLoopGraph({
    model: chatModel,
    tools: categoryWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.CATEGORY(categoryWorkerTools.map((tool) => tool.name)),
    finalToolNames: [WORKER_RESULT_TOOL_NAME],
  });
}

export const categoryWorkerGraph = buildCategoryWorkerGraph().compile({
  checkpointer: true,
  name: 'category-worker',
});

export const categoryWorkerDefinition: CatalogWorkerDefinition = {
  id: k.id,
  graph: categoryWorkerGraph,
};
