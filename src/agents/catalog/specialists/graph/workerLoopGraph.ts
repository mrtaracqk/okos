import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
  isAIMessage,
} from '@langchain/core/messages';
import { type ClientTool } from '@langchain/core/tools';
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
import { WORKER_RESULT_TOOL_NAME } from '../../contracts/workerResult';

export type CreateWorkerLoopGraphOptions<Handoff = unknown, FinalResult = unknown> = {
  model: WorkerLoopModel;
  tools: WorkerTool[];
  systemPrompt: () => string;
  renderHandoffMessage?: (handoff: Handoff) => string;
  extractFinalResult?: (toolRun: ToolRun) => FinalResult | null;
};

type WorkerLoopRunnable = {
  invoke(messages: BaseMessage[]): Promise<AIMessage>;
};

type WorkerLoopModel = {
  bindTools(tools: WorkerTool[]): WorkerLoopRunnable;
};

type WorkerTool = ClientTool & {
  actualToolName?: string;
};

type ParsedToolCallArgs =
  | {
      ok: true;
      args: Record<string, unknown>;
    }
  | {
      ok: false;
      args: Record<string, unknown>;
      error: {
        message: string;
        code: 'invalid_tool_args';
        type: 'invalid_tool_args';
        rawArgs: unknown;
      };
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function describeToolCallArgsShape(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function parseToolCallArgs(value: unknown): ParsedToolCallArgs {
  if (isRecord(value)) {
    return {
      ok: true,
      args: value,
    };
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (isRecord(parsed)) {
        return {
          ok: true,
          args: parsed,
        };
      }

      return {
        ok: false,
        args: {},
        error: {
          message: `tool_call.args must decode to a JSON object, got ${describeToolCallArgsShape(parsed)}.`,
          code: 'invalid_tool_args',
          type: 'invalid_tool_args',
          rawArgs: value,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse tool_call.args JSON.';
      return {
        ok: false,
        args: {},
        error: {
          message: `tool_call.args is not valid JSON: ${message}`,
          code: 'invalid_tool_args',
          type: 'invalid_tool_args',
          rawArgs: value,
        },
      };
    }
  }

  return {
    ok: false,
    args: {},
    error: {
      message: `tool_call.args must be an object or a JSON string, got ${describeToolCallArgsShape(value)}.`,
      code: 'invalid_tool_args',
      type: 'invalid_tool_args',
      rawArgs: value,
    },
  };
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

function buildFailedToolPayload(
  _toolName: string,
  message: string,
  source: string,
  type: string,
  code?: string,
  structured: Record<string, unknown> | null = null
) {
  return {
    ok: false,
    structured,
    error: {
      source,
      type,
      ...(code ? { code } : {}),
      message,
      retryable: false,
    },
  };
}

function buildIgnoredAfterFinalToolPayload(
  toolName: string,
  finalToolName: string,
  rawArgs: unknown,
  finalToolCallId?: string
) {
  return buildFailedToolPayload(
    toolName,
    `Protocol violation: tool "${toolName}" was ignored because final tool "${finalToolName}" was already called in the same model response.`,
    'catalog-worker',
    'protocol_error',
    'ignored_after_final_tool',
    {
      ignored: true,
      reason: 'final_tool_already_called',
      finalToolName,
      ...(finalToolCallId ? { finalToolCallId } : {}),
      rawArgs,
    }
  );
}

export function createWorkerLoopGraph<Handoff = unknown, FinalResult = unknown>({
  model,
  tools,
  systemPrompt,
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
  const finalToolNameSet = new Set([WORKER_RESULT_TOOL_NAME]);

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
    let firstFinalToolCall: {
      name: string;
      id: string;
    } | null = null;
    for (const toolCall of lastMessage.tool_calls) {
      const toolCallId =
        typeof toolCall.id === 'string' && toolCall.id.length > 0
          ? toolCall.id
          : typeof toolCall.name === 'string'
            ? toolCall.name
            : '';
      const toolCallName = typeof toolCall.name === 'string' ? toolCall.name : 'unknown_tool';
      const isFinalToolCall = toolCallName === WORKER_RESULT_TOOL_NAME;

      if (firstFinalToolCall) {
        const finalToolCall = firstFinalToolCall;
        const parsedArgs = parseToolCallArgs(toolCall.args);
        const payload = await runToolSpan(
          'worker.tool_call',
          async () =>
            buildIgnoredAfterFinalToolPayload(
              toolCallName,
              finalToolCall.name,
              parsedArgs.ok ? parsedArgs.args : toolCall.args,
              finalToolCall.id
            ),
          {
            attributes: {
              ...buildTraceAttributes({
                'tool.name': toolCallName,
                'tool.call_id': toolCallId,
                'tool.args': formatTraceValue(toolCall.args, 1000),
                'tool.status': 'failed',
                'tool.ignored': true,
                'error.type': 'protocol_error',
                'error.code': 'ignored_after_final_tool',
                'error.retryable': false,
              }),
              ...buildTraceInputAttributes(toolCall.args, 1000),
            },
            statusMessage: () =>
              `tool "${toolCallName}" ignored after final tool "${finalToolCall.name}" in the same model response`,
          }
        );
        const normalizedRun = normalizeToolRun(toolCallName, parsedArgs.ok ? parsedArgs.args : {}, payload);
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

      if (isFinalToolCall) {
        firstFinalToolCall = {
          name: toolCallName,
          id: toolCallId,
        };
      }

      const parsedArgs = parseToolCallArgs(toolCall.args);
      const args = parsedArgs.args;

      if (!parsedArgs.ok) {
        const toolName = typeof toolCall.name === 'string' ? toolCall.name : 'unknown_tool';
        const payload = await runToolSpan(
          'worker.tool_call',
          async () =>
            buildFailedToolPayload(
              toolName,
              parsedArgs.error.message,
              'catalog-worker',
              parsedArgs.error.type,
              parsedArgs.error.code,
              {
                rawArgs: parsedArgs.error.rawArgs,
              }
            ),
          {
            attributes: {
              ...buildTraceAttributes({
                'tool.name': toolName,
                'tool.call_id': toolCallId,
                'tool.args': formatTraceValue(parsedArgs.error.rawArgs, 1000),
                'tool.status': 'failed',
                'error.type': parsedArgs.error.type,
                'error.code': parsedArgs.error.code,
                'error.retryable': false,
              }),
              ...buildTraceInputAttributes(parsedArgs.error.rawArgs, 1000),
            },
            statusMessage: () => parsedArgs.error.message,
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
        continue;
      }

      const tool = toolsByName.get(toolCall.name);

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
            content: serializeToolPayload(payload),
          })
        );
        continue;
      }

      const toolName = typeof tool.actualToolName === 'string' ? tool.actualToolName : toolCall.name;

      try {
        const payload = await runToolSpan('worker.tool_call', async () => tool.invoke(args), {
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
        });
        const normalizedRun = normalizeToolRun(toolName, args, payload);
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
