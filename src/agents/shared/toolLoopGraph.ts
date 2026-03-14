import { BaseMessage, SystemMessage, ToolMessage, isAIMessage } from '@langchain/core/messages';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { buildTraceAttributes, formatTraceText, formatTraceValue, runAgentSpan, runToolSpan } from '../../observability/traceContext';

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

function safeSerialize(value: unknown): string | null {
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : null;
  } catch {
    return null;
  }
}

function normalizeToolContentValue(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  if (value.length !== 1) {
    return safeSerialize(value);
  }

  const [item] = value;
  if (!isRecord(item) || typeof item.type !== 'string') {
    return safeSerialize(value);
  }

  if (item.type === 'text' && typeof item.text === 'string') {
    return item.text.trim();
  }

  if (item.type === 'resource' && isRecord(item.resource)) {
    return safeSerialize(item.resource);
  }

  if (
    item.type === 'resource_link' &&
    typeof item.name === 'string' &&
    typeof item.uri === 'string'
  ) {
    return `${item.name}: ${item.uri}`.trim();
  }

  return safeSerialize(value);
}

function dedupeToolPayload(value: Record<string, unknown>): Record<string, unknown> {
  const payload = { ...value };
  const text = typeof payload.text === 'string' ? payload.text.trim() : '';
  const structuredValue =
    payload.structured !== undefined ? safeSerialize(payload.structured) : null;
  const contentValue = normalizeToolContentValue(payload.content);

  if (text.length > 0 && structuredValue === text) {
    delete payload.structured;
  }

  if (
    (text.length > 0 && contentValue === text) ||
    ((text.length === 0 || !('text' in payload)) &&
      structuredValue !== null &&
      contentValue === structuredValue)
  ) {
    delete payload.content;
  }

  return payload;
}

function serializeToolPayload(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  const serializableValue = isRecord(value) ? dedupeToolPayload(value) : value;
  return safeSerialize(serializableValue) ?? String(serializableValue);
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
    return runAgentSpan(
      'worker.tool_loop.agent',
      async () => {
        const response = await model.bindTools(tools).invoke([new SystemMessage(systemPrompt()), ...state.messages]);

        return {
          messages: [response],
        };
      },
      {
        attributes: buildTraceAttributes({
          'worker.message_count': state.messages.length,
        }),
      }
    );
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
        const payload = await runToolSpan(
          'worker.tool_call',
          async () =>
            buildFailedToolPayload(
              toolCall.name,
              `Tool "${toolCall.name}" is not registered in the worker loop.`,
              'catalog-worker',
              'tool_not_registered'
            ),
          {
            attributes: buildTraceAttributes({
              'tool.name': toolCall.name,
              'tool.call_id': toolCallId,
              'tool.args': formatTraceValue(args, 1000),
              'tool.status': 'failed',
            }),
            statusMessage: () => `tool "${toolCall.name}" is not registered in the worker loop`,
          }
        );
        const normalizedRun = normalizeToolRun(toolCall.name, args, payload);
        toolRuns.push(normalizedRun);
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
        const payload = await runToolSpan(
          'worker.tool_call',
          async () => tool.invoke(args),
          {
            attributes: buildTraceAttributes({
              'tool.name': toolName,
              'tool.call_id': toolCallId,
              'tool.args': formatTraceValue(args, 1000),
            }),
            mapResultAttributes: (result) => {
              const normalizedRun = normalizeToolRun(toolName, args, result);
              return buildTraceAttributes({
                'tool.status': normalizedRun.status,
                'error.type': normalizedRun.error?.type,
                'error.code': normalizedRun.error?.code,
                'error.retryable': normalizedRun.error?.retryable,
                'output.value': formatTraceText(normalizedRun.text, 1200),
              });
            },
            statusMessage: (result) => {
              const normalizedRun = normalizeToolRun(toolName, args, result);
              return normalizedRun.status === 'failed' ? normalizedRun.error?.message ?? normalizedRun.text : undefined;
            },
          }
        );
        const normalizedRun = normalizeToolRun(toolName, args, payload);
        toolRuns.push(normalizedRun);
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
        const normalizedRun = normalizeToolRun(toolName, args, payload);
        toolRuns.push(normalizedRun);
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
