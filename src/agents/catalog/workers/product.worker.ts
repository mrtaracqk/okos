import { HumanMessage } from '@langchain/core/messages';
import { classifierModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { getLastAIMessageText } from '../../shared/messageUtils';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from '../tools/generatedTransportTools';

const productWorkerTools = createGeneratedTransportTools('product-worker');

function buildProductWorkerGraph() {
  return createToolLoopGraph({
    model: classifierModel,
    tools: productWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.PRODUCT(productWorkerTools.map((tool) => tool.name)),
  });
}

export const productWorkerGraph = buildProductWorkerGraph().compile({
  checkpointer: true,
  name: 'product-worker',
});

const productWorkerRootGraph = buildProductWorkerGraph().compile({
  name: 'product-worker-root',
});

export async function runProductWorker(task: string, context?: string): Promise<string> {
  const workerInput = context ? `${task}\n\nShared context:\n${context}` : task;
  const result = await productWorkerRootGraph.invoke({
    messages: [new HumanMessage(workerInput)],
  });

  return getLastAIMessageText(result.messages);
}
