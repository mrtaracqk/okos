import { BaseMessage, SystemMessage, isAIMessage } from '@langchain/core/messages';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';

export const ToolLoopStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
});

type CreateToolLoopGraphOptions = {
  model: any;
  tools: any[];
  systemPrompt: () => string;
};

export function createToolLoopGraph({ model, tools, systemPrompt }: CreateToolLoopGraphOptions) {
  const agentNode = async (state: typeof ToolLoopStateAnnotation.State) => {
    const response = await model.bindTools(tools).invoke([new SystemMessage(systemPrompt()), ...state.messages]);

    return {
      messages: [response],
    };
  };

  const getNextRoute = (state: typeof ToolLoopStateAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    return isAIMessage(lastMessage) && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length > 0
      ? 'callTools'
      : 'end';
  };

  return new StateGraph(ToolLoopStateAnnotation)
    .addNode('agent', agentNode)
    .addNode('tools', new ToolNode(tools))
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', getNextRoute, {
      callTools: 'tools',
      end: END,
    })
    .addEdge('tools', 'agent');
}
