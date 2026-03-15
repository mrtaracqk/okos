import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { WORKER_RESULT_TOOL_NAME, createWorkerResultTool } from '../contracts/workerResult';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from './shared/generatedTransportTools';
import { createCatalogWorkerHandoffTool } from './shared/handoffTool';
import { type CatalogWorkerDefinition } from './shared/workerDefinition';

const attributeWorkerTools = [...createGeneratedTransportTools('attribute-worker'), createWorkerResultTool()];

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
  name: 'run_attribute_worker',
  handoffTool: createCatalogWorkerHandoffTool(
    'run_attribute_worker',
    'Делегируй задачи по глобальной таксономии атрибутов: получить список, прочитать, создать, обновить или удалить атрибуты товара и их термы; проверить нужные значения; создать или скорректировать недостающие термы. Не используй для редактирования карточки товара, назначения атрибутов товару или управления вариациями.'
  ),
  graph: attributeWorkerGraph,
};
