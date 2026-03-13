import { HumanMessage } from '@langchain/core/messages';
import { classifierModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { getLastAIMessageText } from '../../shared/messageUtils';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from '../tools/generatedTransportTools';

const attributeWorkerTools = createGeneratedTransportTools('attribute-worker');

function buildAttributeWorkerGraph() {
  return createToolLoopGraph({
    model: classifierModel,
    tools: attributeWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.ATTRIBUTE(attributeWorkerTools.map((tool) => tool.name)),
  });
}

export const attributeWorkerGraph = buildAttributeWorkerGraph().compile({
  checkpointer: true,
  name: 'attribute-worker',
});

const attributeWorkerRootGraph = buildAttributeWorkerGraph().compile({
  name: 'attribute-worker-root',
});

export async function runAttributeWorker(task: string, context?: string): Promise<string> {
  const workerInput = context ? `${task}\n\nShared context:\n${context}` : task;
  const result = await attributeWorkerRootGraph.invoke({
    messages: [new HumanMessage(workerInput)],
  });

  return getLastAIMessageText(result.messages);
}
