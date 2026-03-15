import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from './shared/generatedTransportTools';
import { createCatalogWorkerHandoffTool } from './shared/handoffTool';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const categoryWorkerTools = [...createGeneratedTransportTools('category-worker'), createWorkerResultTool()];

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
  name: 'run_category_worker',
  handoffTool: createCatalogWorkerHandoffTool(
    'run_category_worker',
    'Делегируй задачи только по категориям: найти категорию по имени, slug или ID; получить список, прочитать, создать, обновить или удалить категорию; подобрать или создать нужную категорию; управлять связями родитель-ребёнок. Не используй для поиска товаров внутри категории, редактирования товаров, атрибутов или вариаций.'
  ),
  graph: categoryWorkerGraph,
};
