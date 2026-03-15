import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from './shared/generatedTransportTools';
import { createCatalogWorkerHandoffTool } from './shared/handoffTool';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const variationWorkerTools = [...createGeneratedTransportTools('variation-worker'), createWorkerResultTool()];

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
  name: 'run_variation_worker',
  handoffTool: createCatalogWorkerHandoffTool(
    'run_variation_worker',
    'Делегируй задачи по дочерним вариациям существующего вариативного товара: получить список, прочитать, создать, обновить или удалить вариации; пакетно изменить много вариаций; или сгенерировать все вариации по атрибутам родительского товара. Для задач в режиме execute родительский товар уже должен быть определён. Не используй для полей родительского товара или глобальных атрибутов и термов.'
  ),
  graph: variationWorkerGraph,
};
