import { HumanMessage } from '@langchain/core/messages';
import { classifierModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { getLastAIMessageText } from '../../shared/messageUtils';
import { createToolLoopGraph } from '../../shared/toolLoopGraph';
import { createGeneratedTransportTools } from '../tools/generatedTransportTools';

const categoryWorkerTools = createGeneratedTransportTools('category-worker');

function buildCategoryWorkerGraph() {
  return createToolLoopGraph({
    model: classifierModel,
    tools: categoryWorkerTools,
    systemPrompt: () => PROMPTS.CATALOG_WORKERS.CATEGORY(categoryWorkerTools.map((tool) => tool.name)),
  });
}

export const categoryWorkerGraph = buildCategoryWorkerGraph().compile({
  checkpointer: true,
  name: 'category-worker',
});

const categoryWorkerRootGraph = buildCategoryWorkerGraph().compile({
  name: 'category-worker-root',
});

export async function runCategoryWorker(task: string, context?: string): Promise<string> {
  const workerInput = context ? `${task}\n\nShared context:\n${context}` : task;
  const result = await categoryWorkerRootGraph.invoke({
    messages: [new HumanMessage(workerInput)],
  });

  return getLastAIMessageText(result.messages);
}
