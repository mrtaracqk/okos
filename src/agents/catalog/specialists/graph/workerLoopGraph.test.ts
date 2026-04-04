import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import { createWorkerLoopGraph } from './workerLoopGraph';

function createTestStructuredTool(
  name: string,
  invoke: (input: Record<string, unknown>) => Promise<unknown>
) {
  return tool(invoke, {
    name,
    description: `Test tool: ${name}`,
    schema: z.record(z.string(), z.unknown()),
  });
}

describe('createWorkerLoopGraph', () => {
  test('injects synthetic handoff message from structured state without upstream HumanMessage', async () => {
    let capturedMessages: any[] = [];
    const handoff = {
      taskId: 'task-1',
      objective: 'Найди товар по SKU',
    };
    const renderHandoffMessage = (value: typeof handoff) => `HANDOFF:${value.taskId}:${value.objective}`;

    const model = {
      bindTools: () => ({
        invoke: async (messages: any[]) => {
          capturedMessages = messages;
          return new AIMessage({ content: 'done' });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [],
      systemPrompt: () => 'system',
      renderHandoffMessage,
    }).compile();

    await graph.invoke({
      messages: [],
      handoff,
    });

    expect(capturedMessages).toHaveLength(2);
    expect(capturedMessages[0]?.content).toBe('system');
    expect(capturedMessages[1]?.content).toBe(renderHandoffMessage(handoff));
  });

  test('serializes successful tool payload as-is in ToolMessage content', async () => {
    let invocationCount = 0;
    const duplicatedText = '{"id":123,"name":"Sample"}';

    const model = {
      bindTools: () => ({
        invoke: async () => {
          invocationCount += 1;

          if (invocationCount === 1) {
            return new AIMessage({
              content: '',
              tool_calls: [
                {
                  id: 'call_1',
                  name: 'fetch_product',
                  args: {},
                },
              ],
            });
          }

          return new AIMessage({
            content: 'done',
          });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        createTestStructuredTool('fetch_product', async () => ({
          ok: true,
          structured: {
            text: duplicatedText,
            id: 123,
            name: 'Sample',
          },
        })),
      ],
      systemPrompt: () => 'system',
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('fetch product')],
    });

    const toolMessage = result.messages.find((message) => message instanceof ToolMessage);
    expect(toolMessage).toBeInstanceOf(ToolMessage);
    expect(toolMessage?.content).toBe(
      JSON.stringify({
        ok: true,
        structured: {
          text: duplicatedText,
          id: 123,
          name: 'Sample',
        },
      })
    );
  });

  test('serializes tool payload without truncating content', async () => {
    let invocationCount = 0;
    const longString = 'x'.repeat(350);
    const nestedLongString = 'y'.repeat(340);

    const model = {
      bindTools: () => ({
        invoke: async () => {
          invocationCount += 1;

          if (invocationCount === 1) {
            return new AIMessage({
              content: '',
              tool_calls: [
                {
                  id: 'call_1',
                  name: 'fetch_product',
                  args: {},
                },
              ],
            });
          }

          return new AIMessage({
            content: 'done',
          });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        createTestStructuredTool('fetch_product', async () => ({
          ok: true,
          structured: {
            text: 'summary',
            description: longString,
            nested: {
              notes: nestedLongString,
            },
          },
        })),
      ],
      systemPrompt: () => 'system',
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('fetch product')],
    });

    const toolMessage = result.messages.find((message) => message instanceof ToolMessage);
    const payload = JSON.parse(String(toolMessage?.content)) as Record<string, any>;

    expect(payload.structured.description).toHaveLength(350);
    expect(payload.structured.nested.notes).toHaveLength(340);
    expect(payload).not.toHaveProperty('content');
  });

  test('keeps successful Woo envelopes intact in ToolMessage content', async () => {
    let invocationCount = 0;
    const resultPayload = {
      id: 4335,
      name: 'MacBook Air 13',
      type: 'variable',
      status: 'publish',
    };

    const model = {
      bindTools: () => ({
        invoke: async () => {
          invocationCount += 1;

          if (invocationCount === 1) {
            return new AIMessage({
              content: '',
              tool_calls: [
                {
                  id: 'call_1',
                  name: 'fetch_product',
                  args: {},
                },
              ],
            });
          }

          return new AIMessage({
            content: 'done',
          });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        createTestStructuredTool('fetch_product', async () => ({
          ok: true,
          structured: {
            result: resultPayload,
          },
        })),
      ],
      systemPrompt: () => 'system',
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('fetch product')],
    });

    const toolMessage = result.messages.find((message) => message instanceof ToolMessage);
    expect(toolMessage).toBeInstanceOf(ToolMessage);
    expect(toolMessage?.content).toBe(
      JSON.stringify({
        ok: true,
        structured: {
          result: resultPayload,
        },
      })
    );
  });

  test('stops the loop after a designated final tool call', async () => {
    let invocationCount = 0;

    const model = {
      bindTools: () => ({
        invoke: async () => {
          invocationCount += 1;

          return new AIMessage({
            content: '',
            tool_calls: [
              {
                id: 'call_final',
                name: 'report_worker_result',
                args: {
                  status: 'completed',
                },
              },
            ],
          });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        tool(
          async () => ({
            ok: true,
            structured: {
              status: 'completed',
            },
          }),
          {
            name: 'report_worker_result',
            description: 'Finalize worker result.',
            schema: z.record(z.string(), z.unknown()),
          }
        ),
      ],
      systemPrompt: () => 'system',
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('finalize')],
    });

    expect(invocationCount).toBe(1);
    expect(result.toolRuns).toHaveLength(1);
    expect(result.toolRuns[0]?.toolName).toBe('report_worker_result');
  });

  test('ignores tail tool calls after report_worker_result in the same model response', async () => {
    let mutationInvokeCount = 0;

    const model = {
      bindTools: () => ({
        invoke: async () =>
          new AIMessage({
            content: '',
            tool_calls: [
              {
                id: 'call_final',
                name: 'report_worker_result',
                args: {
                  status: 'completed',
                  data: ['worker finished'],
                  missingData: [],
                  note: null,
                },
              },
              {
                id: 'call_mutation',
                name: 'dangerous_mutation',
                args: {
                  productId: 42,
                },
              },
            ],
          }),
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        tool(
          async () => ({
            ok: true,
            structured: {
              status: 'completed',
              data: ['worker finished'],
              missingData: [],
              note: null,
            },
          }),
          {
            name: 'report_worker_result',
            description: 'Finalize worker result.',
            schema: z.record(z.string(), z.unknown()),
          }
        ),
        createTestStructuredTool('dangerous_mutation', async () => {
          mutationInvokeCount += 1;
          return {
            ok: true,
            structured: {
              mutated: true,
            },
          };
        }),
      ],
      systemPrompt: () => 'system'
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('finalize')],
    });

    expect(mutationInvokeCount).toBe(0);
    expect(result.toolRuns).toHaveLength(2);
    expect(result.toolRuns[0]).toMatchObject({
      toolName: 'report_worker_result',
      status: 'completed',
      structured: {
        status: 'completed',
        data: ['worker finished'],
      },
    });
    expect(result.toolRuns[1]).toMatchObject({
      toolName: 'dangerous_mutation',
      args: {
        productId: 42,
      },
      status: 'failed',
      structured: {
        ignored: true,
        reason: 'final_tool_already_called',
        finalToolName: 'report_worker_result',
        finalToolCallId: 'call_final',
        rawArgs: {
          productId: 42,
        },
      },
      error: {
        source: 'catalog-worker',
        type: 'protocol_error',
        code: 'ignored_after_final_tool',
        retryable: false,
      },
    });

    const toolMessages = result.messages.filter((message) => message instanceof ToolMessage);
    expect(toolMessages).toHaveLength(2);
    expect(String(toolMessages[1]?.content)).toContain('ignored_after_final_tool');
  });

  test('ignores trailing tool calls after report_worker_result with invalid args in the same model response', async () => {
    let mutationInvokeCount = 0;

    const model = {
      bindTools: () => ({
        invoke: async () =>
          new AIMessage({
            content: '',
            tool_calls: [
              {
                id: 'call_final',
                name: 'report_worker_result',
                args: '{"status":"completed"',
              },
              {
                id: 'call_mutation',
                name: 'dangerous_mutation',
                args: {
                  productId: 42,
                },
              },
            ] as any,
          }),
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        tool(
          async () => ({
            ok: true,
            structured: {
              status: 'completed',
            },
          }),
          {
            name: 'report_worker_result',
            description: 'Finalize worker result.',
            schema: z.record(z.string(), z.unknown()),
          }
        ),
        createTestStructuredTool('dangerous_mutation', async () => {
          mutationInvokeCount += 1;
          return {
            ok: true,
            structured: {
              mutated: true,
            },
          };
        }),
      ],
      systemPrompt: () => 'system'
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('finalize')],
    });

    expect(mutationInvokeCount).toBe(0);
    expect(result.toolRuns).toHaveLength(2);
    expect(result.toolRuns[0]).toMatchObject({
      toolName: 'report_worker_result',
      args: {},
      status: 'failed',
      error: {
        source: 'catalog-worker',
        type: 'invalid_tool_args',
        code: 'invalid_tool_args',
        retryable: false,
      },
    });
    expect(result.toolRuns[1]).toMatchObject({
      toolName: 'dangerous_mutation',
      args: {
        productId: 42,
      },
      status: 'failed',
      structured: {
        ignored: true,
        reason: 'final_tool_already_called',
        finalToolName: 'report_worker_result',
        finalToolCallId: 'call_final',
        rawArgs: {
          productId: 42,
        },
      },
      error: {
        source: 'catalog-worker',
        type: 'protocol_error',
        code: 'ignored_after_final_tool',
        retryable: false,
      },
    });

    const toolMessages = result.messages.filter((message) => message instanceof ToolMessage);
    expect(toolMessages).toHaveLength(2);
    expect(String(toolMessages[0]?.content)).toContain('invalid_tool_args');
    expect(String(toolMessages[1]?.content)).toContain('ignored_after_final_tool');
  });

  test('parses tool_calls.args when they are a JSON string (e.g. from OpenAI)', async () => {
    let capturedArgs: Record<string, unknown> = {};
    let invocationCount = 0;
    const model = {
      bindTools: () => ({
        invoke: async () => {
          invocationCount += 1;
          if (invocationCount === 1) {
            return new AIMessage({
              content: '',
              tool_calls: [
                {
                  id: 'call_1',
                  name: 'wc_v3_products_list',
                  args: '{"page":1,"per_page":20,"search":"JBL Partybox Ultimate","status":"publish"}',
                },
              ] as any,
            });
          }
          return new AIMessage({ content: 'done' });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        createTestStructuredTool('wc_v3_products_list', async (input: Record<string, unknown>) => {
          capturedArgs = input;
          return {
            ok: true,
            structured: { result: [] },
          };
        }),
      ],
      systemPrompt: () => 'system',
    }).compile();

    await graph.invoke({
      messages: [new HumanMessage('find JBL Partybox Ultimate')],
    });

    expect(capturedArgs).toEqual({
      page: 1,
      per_page: 20,
      search: 'JBL Partybox Ultimate',
      status: 'publish',
    });
  });

  test('fails fast on malformed tool_calls.args and does not invoke the tool', async () => {
    let toolInvokeCount = 0;
    let invocationCount = 0;
    const model = {
      bindTools: () => ({
        invoke: async () => {
          invocationCount += 1;
          if (invocationCount === 1) {
            return new AIMessage({
              content: '',
              tool_calls: [
                {
                  id: 'call_1',
                  name: 'wc_v3_products_list',
                  args: '{"page":1,"per_page":20',
                },
              ] as any,
            });
          }
          return new AIMessage({ content: 'done' });
        },
      }),
    };

    const graph = createWorkerLoopGraph({
      model,
      tools: [
        createTestStructuredTool('wc_v3_products_list', async () => {
          toolInvokeCount += 1;
          return {
            ok: true,
            structured: { result: [] },
          };
        }),
      ],
      systemPrompt: () => 'system',
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('find JBL Partybox Ultimate')],
    });

    expect(toolInvokeCount).toBe(0);
    expect(result.toolRuns).toHaveLength(1);
    expect(result.toolRuns[0]).toMatchObject({
      toolName: 'wc_v3_products_list',
      args: {},
      status: 'failed',
      error: {
        source: 'catalog-worker',
        type: 'invalid_tool_args',
        code: 'invalid_tool_args',
        retryable: false,
      },
    });

    const toolMessage = result.messages.find((message) => message instanceof ToolMessage);
    const payload = JSON.parse(String(toolMessage?.content)) as Record<string, any>;

    expect(payload).toMatchObject({
      ok: false,
      structured: {
        rawArgs: '{"page":1,"per_page":20',
      },
      error: {
        source: 'catalog-worker',
        type: 'invalid_tool_args',
        code: 'invalid_tool_args',
        retryable: false,
      },
    });
    expect(payload.error.message).toContain('tool_call.args is not valid JSON');
  });
});
