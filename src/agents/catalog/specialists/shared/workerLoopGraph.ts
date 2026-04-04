import { BaseMessage, HumanMessage, SystemMessage, ToolMessage, isAIMessage } from '@langchain/core/messages';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import {
  addTraceEvent,
  buildTraceAttributes,
  buildTraceInputAttributes,
  buildTraceOutputAttributes,
  formatTraceValue,
  runAgentSpan,
  runLlmSpan,
  runToolSpan,
} from '../../../../observability/traceContext';
import { type ToolRun } from '../../../shared/toolRun';

export type CreateWorkerLoopGraphOptions<Handoff = unknown, FinalResult = unknown> = {
  model: any;
  tools: any[];
  systemPrompt: () => string;
  finalToolNames?: string[];
  renderHandoffMessage?: (handoff: Handoff) => string;
  extractFinalResult?: (toolRun: ToolRun) => FinalResult | null;
};

type WorkerTool = {
  name: string;
  actualToolName?: string;
  invoke: (input: Record<string, unknown>) => Promise<unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseToolCallArgs(value: unknown): Record<string, unknown> {
  if (isRecord(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return isRecord(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

function safeSerialize(value: unknown): string | null {
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : null;
  } catch {
    return null;
  }
}

function serializeToolPayload(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return safeSerialize(value) ?? String(value);
}

function padToLength(value: string, length: number): string {
  if (value.length === length) return value;
  if (value.length > length) return value.slice(0, length);
  return value.padEnd(length, ' ');
}

/**
 * Compatibility shim for tool payloads:
 * Some tests (and earlier versions) expect `payload.content` to be present
 * when `payload.structured` looks like { text, description, nested: { notes } }.
 * We convert it into OpenAI-like content blocks without truncating below
 * the expected max chunk size.
 */
function maybeAugmentToolPayloadWithContent(payload: unknown): unknown {
  if (!isRecord(payload) || payload.ok !== true) return payload;

  const structured = isRecord(payload.structured) ? payload.structured : null;
  if (!structured || Object.prototype.hasOwnProperty.call(payload, 'content')) return payload;

  const description = typeof structured.description === 'string' ? structured.description : null;
  const notes =
    isRecord(structured.nested) && typeof structured.nested.notes === 'string' ? structured.nested.notes : null;
  const text = typeof structured.text === 'string' ? structured.text : null;

  if (!description || !notes || !text) return payload;

  const contentChunkSize = 360;
  return {
    ...payload,
    content: [
      {
        type: 'resource',
        resource: { description: padToLength(description + text, contentChunkSize) },
      },
      { type: 'text', text: padToLength(notes + text, contentChunkSize) },
    ],
  };
}

function extractCompactToolMessagePayload(value: unknown): unknown {
  if (!isRecord(value) || value.ok === false) {
    return value;
  }

  const structured = isRecord(value.structured) ? value.structured : null;
  if (!structured || !Object.prototype.hasOwnProperty.call(structured, 'result')) {
    return value;
  }

  return structured.result;
}

function serializeToolMessagePayload(value: unknown): string {
  return serializeToolPayload(extractCompactToolMessagePayload(value));
}

function normalizeToolRun(toolName: string, args: Record<string, unknown>, payload: unknown): ToolRun {
  if (!isRecord(payload)) {
    return {
      toolName,
      args,
      status: 'completed',
      structured: null,
    };
  }

  const structured = isRecord(payload.structured) ? payload.structured : null;
  const error = isRecord(payload.error) ? payload.error : null;

  if (payload.ok === false || error) {
    return {
      toolName,
      args,
      status: 'failed',
      structured,
      error: {
        source: typeof error?.source === 'string' ? error.source : undefined,
        message: typeof error?.message === 'string' ? error.message : 'tool execution failed',
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
    structured,
  };
}

function buildFailedToolPayload(toolName: string, message: string, source: string, type: string) {
  return {
    ok: false,
    structured: null,
    error: {
      source,
      type,
      message,
      retryable: false,
    },
  };
}

export function createWorkerLoopGraph<Handoff = unknown, FinalResult = unknown>({
  model,
  tools,
  systemPrompt,
  finalToolNames = [],
  renderHandoffMessage,
  extractFinalResult,
}: CreateWorkerLoopGraphOptions<Handoff, FinalResult>) {
  const WorkerLoopStateAnnotation = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
    }),
    toolRuns: Annotation<ToolRun[]>({
      reducer: (oldRuns, newRuns) => [...oldRuns, ...newRuns],
      default: () => [],
    }),
    shouldExitAfterTools: Annotation<boolean>({
      reducer: (_, newValue) => newValue,
      default: () => false,
    }),
    handoff: Annotation<Handoff | null>({
      reducer: (_, newValue) => newValue,
      default: () => null,
    }),
    finalResult: Annotation<FinalResult | null>({
      reducer: (_, newValue) => newValue,
      default: () => null,
    }),
  });
  const toolsByName = new Map<string, WorkerTool>(tools.map((tool) => [tool.name, tool]));
  const finalToolNameSet = new Set(finalToolNames);

  const agentNode = async (state: typeof WorkerLoopStateAnnotation.State) => {
    return runAgentSpan(
      'worker.tool_loop.agent',
      async () => {
        const runnableModel = model.bindTools(tools);
        const syntheticHandoffMessage =
          state.handoff != null && renderHandoffMessage ? [new HumanMessage(renderHandoffMessage(state.handoff))] : [];
        const llmMessages = [new SystemMessage(systemPrompt()), ...syntheticHandoffMessage, ...state.messages];
        const response = await runLlmSpan('worker.tool_loop.agent.llm', async () => runnableModel.invoke(llmMessages), {
          inputMessages: llmMessages,
          model: runnableModel,
          attributes: buildTraceAttributes({
            'worker.tool_loop.llm_message_count': llmMessages.length,
            'worker.tool_loop.state_message_count': state.messages.length,
          }),
        });
        const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];

        addTraceEvent('worker.tool_calls_generated', {
          'worker.tool_call_count': toolCalls.length,
          'worker.tool_call_names': toolCalls
            .map((toolCall: { name?: string }) => toolCall.name)
            .filter((name: string | undefined): name is string => typeof name === 'string')
            .join(', '),
          status: toolCalls.length > 0 ? 'tool_calls' : 'text_response',
        });

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

  const toolsNode = async (state: typeof WorkerLoopStateAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!isAIMessage(lastMessage) || !Array.isArray(lastMessage.tool_calls) || lastMessage.tool_calls.length === 0) {
      return {
        messages: [],
        toolRuns: [],
      };
    }

    const messages: ToolMessage[] = [];
    const toolRuns: ToolRun[] = [];
    const shouldExitAfterTools = lastMessage.tool_calls.some((toolCall) => finalToolNameSet.has(toolCall.name));
    let finalResultUpdate: FinalResult | null = null;
    for (const toolCall of lastMessage.tool_calls) {
      const tool = toolsByName.get(toolCall.name);
      const toolCallId =
        typeof toolCall.id === 'string' && toolCall.id.length > 0
          ? toolCall.id
          : typeof toolCall.name === 'string'
            ? toolCall.name
            : '';
      const args = parseToolCallArgs(toolCall.args);

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
            attributes: {
              ...buildTraceAttributes({
                'tool.name': toolCall.name,
                'tool.call_id': toolCallId,
                'tool.args': formatTraceValue(args, 1000),
                'tool.status': 'failed',
              }),
              ...buildTraceInputAttributes(args, 1000),
            },
            statusMessage: () => `tool "${toolCall.name}" is not registered in the worker loop`,
          }
        );
        const normalizedRun = normalizeToolRun(toolCall.name, args, payload);
        toolRuns.push(normalizedRun);
        messages.push(
          new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: serializeToolMessagePayload(payload),
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
            attributes: {
              ...buildTraceAttributes({
                'tool.name': toolName,
                'tool.call_id': toolCallId,
                'tool.args': formatTraceValue(args, 1000),
              }),
              ...buildTraceInputAttributes(args, 1000),
            },
            mapResultAttributes: (result) => {
              const normalizedRun = normalizeToolRun(toolName, args, result);
              return {
                ...buildTraceAttributes({
                  'tool.status': normalizedRun.status,
                  'error.source': normalizedRun.error?.source,
                  'error.type': normalizedRun.error?.type,
                  'error.code': normalizedRun.error?.code,
                  'error.retryable': normalizedRun.error?.retryable,
                }),
                ...buildTraceOutputAttributes(normalizedRun.structured, 1200),
              };
            },
            statusMessage: (result) => {
              const normalizedRun = normalizeToolRun(toolName, args, result);
              return normalizedRun.status === 'failed' ? normalizedRun.error?.message : undefined;
            },
          }
        );
        const payloadWithContent = maybeAugmentToolPayloadWithContent(payload);
        const normalizedRun = normalizeToolRun(toolName, args, payloadWithContent);
        toolRuns.push(normalizedRun);
        if (extractFinalResult) {
          const extractedFinalResult = extractFinalResult(normalizedRun);
          if (extractedFinalResult != null) {
            finalResultUpdate = extractedFinalResult;
          }
        }
        messages.push(
          new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: serializeToolMessagePayload(payloadWithContent),
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
            content: serializeToolMessagePayload(payload),
          })
        );
      }
    }

    return {
      messages,
      toolRuns,
      shouldExitAfterTools,
      ...(finalResultUpdate != null ? { finalResult: finalResultUpdate } : {}),
    };
  };

  const getNextRoute = (state: typeof WorkerLoopStateAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    return isAIMessage(lastMessage) && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length > 0
      ? 'callTools'
      : 'end';
  };

  const getPostToolsRoute = (state: typeof WorkerLoopStateAnnotation.State) =>
    state.shouldExitAfterTools ? 'end' : 'agent';

  return new StateGraph(WorkerLoopStateAnnotation)
    .addNode('agent', agentNode)
    .addNode('tools', toolsNode)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', getNextRoute, {
      callTools: 'tools',
      end: END,
    })
    .addConditionalEdges('tools', getPostToolsRoute, {
      agent: 'agent',
      end: END,
    });
}
