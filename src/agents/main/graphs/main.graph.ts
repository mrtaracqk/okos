import { BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { Annotation, BaseCheckpointSaver, END, START, StateGraph, getConfig } from '@langchain/langgraph';
import { catalogAgentGraph } from '../../catalog/catalog.agent';
import { graphCheckpointer } from '../../shared/checkpointing';
import { extractMessageText, getLastAIMessage, getLastAIMessageText } from '../../shared/messageUtils';
import { telegramMainGraphProgressReporter, type MainGraphProgressReporter } from '../progress';
import { responseAgentNode } from '../nodes/responseAgent.node';
import { delegateCatalogTool } from '../tools/delegateCatalog.tool';

export const mainTools = [delegateCatalogTool];

export const MainGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  chatId: Annotation<number>(),
  summary: Annotation<string>(),
  memory: Annotation<string>(),
});

type CreateMainGraphOptions = {
  checkpointer?: BaseCheckpointSaver | boolean;
  name?: string;
  progressReporter?: MainGraphProgressReporter;
};

const getMainRoute = async (state: typeof MainGraphStateAnnotation.State, progressReporter: MainGraphProgressReporter) => {
  const lastMessage = getLastAIMessage(state.messages);
  const hasCatalogDelegation = lastMessage?.tool_calls?.some((toolCall) => toolCall.name === delegateCatalogTool.name);

  if (hasCatalogDelegation) {
    return 'catalogAgent';
  }

  await progressReporter.onRunComplete({ chatId: state.chatId });
  return 'end';
};

function createCatalogAgentNode(progressReporter: MainGraphProgressReporter) {
  return async (state: typeof MainGraphStateAnnotation.State): Promise<Partial<typeof MainGraphStateAnnotation.State>> => {
    const lastMessage = getLastAIMessage(state.messages);
    const toolCall = lastMessage?.tool_calls?.find((candidate) => candidate.name === delegateCatalogTool.name);

    if (!lastMessage || !toolCall) {
      return {};
    }

    const statusText = extractMessageText(lastMessage.content).trim() || undefined;
    const userRequest = typeof toolCall.args?.userRequest === 'string' ? toolCall.args.userRequest.trim() : '';

    if (!userRequest) {
      return {
        messages: [
          new ToolMessage({
            tool_call_id: toolCall.id ?? toolCall.name,
            name: toolCall.name,
            content: 'Catalog handoff failed: missing required "userRequest" argument.',
          }),
        ],
      };
    }

    await progressReporter.onCatalogDelegation({
      chatId: state.chatId,
      statusText,
    });

    const result = await catalogAgentGraph.invoke(
      {
        messages: [new HumanMessage(userRequest)],
      },
      getConfig()
    );

    return {
      messages: [
        new ToolMessage({
          tool_call_id: toolCall.id ?? toolCall.name,
          name: delegateCatalogTool.name,
          content: getLastAIMessageText(result.messages) || 'Catalog agent completed without a text response.',
        }),
      ],
    };
  };
}

export function createMainGraph({
  checkpointer = graphCheckpointer,
  name = 'Main Telegram Bot Graph',
  progressReporter = telegramMainGraphProgressReporter,
}: CreateMainGraphOptions = {}) {
  return new StateGraph(MainGraphStateAnnotation)
    .addNode('responseAgent', responseAgentNode)
    .addNode('catalogAgent', createCatalogAgentNode(progressReporter))
    .addEdge(START, 'responseAgent')
    .addConditionalEdges('responseAgent', (state) => getMainRoute(state, progressReporter), {
      catalogAgent: 'catalogAgent',
      end: END,
    })
    .addEdge('catalogAgent', 'responseAgent')
    .compile({
      checkpointer,
      name,
      description: 'Main Telegram orchestration graph that delegates catalog work to the catalog-agent subgraph.',
    });
}

export const mainGraph = createMainGraph();
