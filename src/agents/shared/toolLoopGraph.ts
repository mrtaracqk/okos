import { BaseMessage, SystemMessage, ToolMessage, isAIMessage } from '@langchain/core/messages';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';

export type ToolRun = {
  toolName: string;
  args: Record<string, unknown>;
  status: 'completed' | 'failed';
  text: string;
  structured: Record<string, unknown> | null;
  error?: {
    source?: string;
    message: string;
    code?: string;
    type?: string;
    retryable?: boolean;
  };
};

export const ToolLoopStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  toolRuns: Annotation<ToolRun[]>({
    reducer: (oldRuns, newRuns) => [...oldRuns, ...newRuns],
    default: () => [],
  }),
});

type CreateToolLoopGraphOptions = {
  model: any;
  tools: any[];
  systemPrompt: () => string;
};

type WorkerTool = {
  name: string;
  actualToolName?: string;
  invoke: (input: Record<string, unknown>) => Promise<unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeArgs(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function serializeToolPayload(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function normalizeToolRun(toolName: string, args: Record<string, unknown>, payload: unknown): ToolRun {
  if (!isRecord(payload)) {
    return {
      toolName,
      args,
      status: 'completed',
      text: serializeToolPayload(payload),
      structured: null,
    };
  }

  const text = typeof payload.text === 'string' && payload.text.trim().length > 0 ? payload.text : serializeToolPayload(payload);
  const structured = isRecord(payload.structured) ? payload.structured : null;
  const error = isRecord(payload.error) ? payload.error : null;

  if (payload.ok === false || error) {
    return {
      toolName,
      args,
      status: 'failed',
      text,
      structured,
      error: {
        source: typeof error?.source === 'string' ? error.source : undefined,
        message: typeof error?.message === 'string' ? error.message : text,
        code: typeof error?.code === 'string' ? error.code : undefined,
        type: typeof error?.type === 'string' ? error.type : undefined,
        retryable: typeof error?.retryable === 'boolean' ? error.retryable : undefined,
      },
    };
  }

  return {
    toolName,
    args,
    status: 'completed',
    text,
    structured,
  };
}

function buildFailedToolPayload(toolName: string, message: string, source: string, type: string) {
  return {
    ok: false,
    tool: toolName,
    text: message,
    structured: null,
    error: {
      source,
      type,
      message,
      retryable: false,
    },
  };
}

export function createToolLoopGraph({ model, tools, systemPrompt }: CreateToolLoopGraphOptions) {
  const toolsByName = new Map<string, WorkerTool>(tools.map((tool) => [tool.name, tool]));

  const agentNode = async (state: typeof ToolLoopStateAnnotation.State) => {
    const response = await model.bindTools(tools).invoke([new SystemMessage(systemPrompt()), ...state.messages]);

    return {
      messages: [response],
    };
  };

  const toolsNode = async (state: typeof ToolLoopStateAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!isAIMessage(lastMessage) || !Array.isArray(lastMessage.tool_calls) || lastMessage.tool_calls.length === 0) {
      return {
        messages: [],
        toolRuns: [],
      };
    }

    const messages: ToolMessage[] = [];
    const toolRuns: ToolRun[] = [];

    for (const toolCall of lastMessage.tool_calls) {
      const tool = toolsByName.get(toolCall.name);
      const toolCallId = toolCall.id ?? toolCall.name;
      const args = normalizeArgs(toolCall.args);

      if (!tool) {
        const payload = buildFailedToolPayload(
          toolCall.name,
          `Tool "${toolCall.name}" is not registered in the worker loop.`,
          'catalog-worker',
          'tool_not_registered'
        );
        toolRuns.push(normalizeToolRun(toolCall.name, args, payload));
        messages.push(
          new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: serializeToolPayload(payload),
          })
        );
        continue;
      }

      const toolName = typeof tool.actualToolName === 'string' ? tool.actualToolName : toolCall.name;

      try {
        const payload = await tool.invoke(args);
        toolRuns.push(normalizeToolRun(toolName, args, payload));
        messages.push(
          new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: serializeToolPayload(payload),
          })
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown worker tool execution error.';
        const payload = buildFailedToolPayload(toolName, message, 'catalog-worker', 'tool_execution_failed');
        toolRuns.push(normalizeToolRun(toolName, args, payload));
        messages.push(
          new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: serializeToolPayload(payload),
          })
        );
      }
    }

    return {
      messages,
      toolRuns,
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
    .addNode('tools', toolsNode)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', getNextRoute, {
      callTools: 'tools',
      end: END,
    })
    .addEdge('tools', 'agent');
}
