import { HumanMessage } from '@langchain/core/messages';
import { classifierModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { getLastAIMessageText } from '../../shared/messageUtils';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from '../tools/generatedTransportTools';

const variationWorkerTools = createGeneratedTransportTools('variation-worker');

function buildVariationWorkerGraph() {
  return createToolLoopGraph({
    model: classifierModel,
    tools: variationWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.VARIATION(variationWorkerTools.map((tool) => tool.name)),
  });
}

export const variationWorkerGraph = buildVariationWorkerGraph().compile({
  checkpointer: true,
  name: 'variation-worker',
});

const variationWorkerRootGraph = buildVariationWorkerGraph().compile({
  name: 'variation-worker-root',
});

export async function runVariationWorker(task: string, context?: string): Promise<string> {
  const workerInput = context ? `${task}\n\nShared context:\n${context}` : task;
  const result = await variationWorkerRootGraph.invoke({
    messages: [new HumanMessage(workerInput)],
  });

  return getLastAIMessageText(result.messages);
}
