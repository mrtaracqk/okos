import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { describe, expect, test } from 'bun:test';
import { type WorkerTaskEnvelope } from '../../contracts/workerRequest';
import { renderWorkerHandoffMessage } from './catalogToolLoop';
import { createWorkerLoopGraph } from './workerLoopGraph';

describe('createWorkerLoopGraph', () => {
  test('renders worker handoff as a stable structured message', () => {
    const handoff: WorkerTaskEnvelope = {
      planContext: {
        goal: 'Найти товар и проверить его состояние',
        facts: ['SKU: IPHONE-17-BLK'],
        constraints: ['Не создавать новые сущности'],
      },
      taskInput: {
        objective: 'Найди товар по SKU',
        facts: ['SKU: IPHONE-17-BLK', 'Тип: simple'],
        constraints: ['Только read-only'],
        expectedOutput: 'status, data, missingData',
        contextNotes: 'Нужно ответить пользователю без предположений.',
      },
      upstreamArtifacts: [{ product_id: 101, sku: 'IPHONE-17-BLK' }],
    };

    expect(renderWorkerHandoffMessage(handoff)).toBe(
      [
        'WORKER_HANDOFF',
        '```json',
        JSON.stringify(
          {
            planContext: {
              goal: 'Найти товар и проверить его состояние',
              facts: ['SKU: IPHONE-17-BLK'],
              constraints: ['Не создавать новые сущности'],
            },
            taskInput: {
              objective: 'Найди товар по SKU',
              facts: ['SKU: IPHONE-17-BLK', 'Тип: simple'],
              constraints: ['Только read-only'],
              expectedOutput: 'status, data, missingData',
              contextNotes: 'Нужно ответить пользователю без предположений.',
            },
            upstreamArtifacts: [{ product_id: 101, sku: 'IPHONE-17-BLK' }],
          },
          null,
          2
        ),
        '```',
      ].join('\n')
    );
  });

  test('injects synthetic handoff message from structured state without upstream HumanMessage', async () => {
    let capturedMessages: any[] = [];
    const handoff: WorkerTaskEnvelope = {
      planContext: {
        goal: 'Найти товар',
        facts: ['request=lookup'],
        constraints: [],
      },
      taskInput: {
        objective: 'Найди товар по SKU',
        facts: ['SKU: IPHONE-17-BLK'],
        constraints: ['Только read-only'],
        expectedOutput: 'status, data, missingData',
        contextNotes: 'Нужен точный ответ по каталогу.',
      },
    };

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
      renderHandoffMessage: renderWorkerHandoffMessage,
    }).compile();

    await graph.invoke({
      messages: [],
      handoff,
    });

    expect(capturedMessages).toHaveLength(2);
    expect(capturedMessages[0]?.content).toBe('system');
    expect(capturedMessages[1]?.content).toBe(renderWorkerHandoffMessage(handoff));
  });

  test('renders non-json-safe artifacts without throwing', () => {
    const circular: Record<string, unknown> = { label: 'artifact' };
    circular.self = circular;

    const handoff: WorkerTaskEnvelope = {
      planContext: {
        goal: 'Проверить payload',
        facts: [],
        constraints: [],
      },
      taskInput: {
        objective: 'Проверь payload',
        facts: [],
        constraints: [],
        expectedOutput: 'status',
      },
      upstreamArtifacts: [{ callable: function sample() {}, size: BigInt(17), circular }],
    };

    const rendered = renderWorkerHandoffMessage(handoff);

    expect(rendered).toContain('"upstreamArtifacts": [');
    expect(rendered).toContain('"callable": "function sample()');
    expect(rendered).toContain('"size": "17"');
    expect(rendered).toContain('"self": "[Circular]"');
  });

  test('deduplicates repeated text, structured, and content payloads in ToolMessage content', async () => {
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
        {
          name: 'fetch_product',
          invoke: async () => ({
            ok: true,
            structured: {
              text: duplicatedText,
              id: 123,
              name: 'Sample',
            },
          }),
        },
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
        {
          name: 'fetch_product',
          invoke: async () => ({
            ok: true,
            structured: {
              text: 'summary',
              description: longString,
              nested: {
                notes: nestedLongString,
              },
            },
          }),
        },
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
    expect(payload.content[0].resource.description).toHaveLength(360);
    expect(payload.content[1].text).toHaveLength(360);
  });

  test('uses structured.result as compact ToolMessage content for successful Woo envelopes', async () => {
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
        {
          name: 'fetch_product',
          invoke: async () => ({
            ok: true,
            structured: {
              result: resultPayload,
            },
          }),
        },
      ],
      systemPrompt: () => 'system',
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('fetch product')],
    });

    const toolMessage = result.messages.find((message) => message instanceof ToolMessage);
    expect(toolMessage).toBeInstanceOf(ToolMessage);
    expect(toolMessage?.content).toBe(JSON.stringify(resultPayload));
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
          }
        ),
      ],
      systemPrompt: () => 'system',
      finalToolNames: ['report_worker_result'],
    }).compile();

    const result = await graph.invoke({
      messages: [new HumanMessage('finalize')],
    });

    expect(invocationCount).toBe(1);
    expect(result.toolRuns).toHaveLength(1);
    expect(result.toolRuns[0]?.toolName).toBe('report_worker_result');
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
        {
          name: 'wc_v3_products_list',
          invoke: async (input: Record<string, unknown>) => {
            capturedArgs = input;
            return {
              ok: true,
              structured: { result: [] },
            };
          },
        },
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
        {
          name: 'wc_v3_products_list',
          invoke: async () => {
            toolInvokeCount += 1;
            return {
              ok: true,
              structured: { result: [] },
            };
          },
        },
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
