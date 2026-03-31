import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { CATALOG_WORKER_KNOWLEDGE } from '../catalogWorkerKnowledge';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { categoryWorkerWooTools } from './shared/wooTools/categoryTools';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const k = CATALOG_WORKER_KNOWLEDGE['category-worker'];

const categoryWorkerTools = [...categoryWorkerWooTools, createWorkerResultTool()];

function buildCategoryWorkerGraph() {
  return createToolLoopGraph({
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
