import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { productWorkerWooTools } from './shared/wooTools/productTools';
import { createCatalogWorkerHandoffTool } from './shared/handoffTool';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

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
  name: 'run_product_worker',
  handoffTool: createCatalogWorkerHandoffTool(
    'run_product_worker',
    'Делегируй задачи по родительскому товару: найти или прочитать товар по ID, SKU, slug, имени или фильтрам; создать, обновить или дублировать товар; изменить поля уровня товара, включая название, описания, статус, цены, остатки, категории, изображения и атрибуты товара или атрибуты по умолчанию. Не используй для глобальной таксономии атрибутов или дочерних вариаций.'
  ),
  graph: productWorkerGraph,
};
