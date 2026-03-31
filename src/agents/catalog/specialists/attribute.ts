import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { CATALOG_WORKER_KNOWLEDGE } from '../catalogWorkerKnowledge';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { getCatalogWorkerRuntimeTools } from './shared/workerToolsets';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const k = CATALOG_WORKER_KNOWLEDGE['attribute-worker'];

const attributeWorkerTools = [...getCatalogWorkerRuntimeTools(k.id), createWorkerResultTool()];

function buildAttributeWorkerGraph() {
  return createToolLoopGraph({
    model: chatModel,
    tools: attributeWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.ATTRIBUTE(attributeWorkerTools.map((tool) => tool.name)),
    finalToolNames: [WORKER_RESULT_TOOL_NAME],
  });
}

export const attributeWorkerGraph = buildAttributeWorkerGraph().compile({
  checkpointer: true,
  name: 'attribute-worker',
});

export const attributeWorkerDefinition: CatalogWorkerDefinition = {
  id: k.id,
  graph: attributeWorkerGraph,
};
