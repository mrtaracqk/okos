import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { describe, expect, test } from 'bun:test';
import { createToolLoopGraph } from './toolLoopGraph';

describe('createToolLoopGraph', () => {
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

    const graph = createToolLoopGraph({
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
    const contentLongString = 'z'.repeat(360);

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

    const graph = createToolLoopGraph({
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

    const graph = createToolLoopGraph({
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

    const graph = createToolLoopGraph({
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
              ],
            });
          }
          return new AIMessage({ content: 'done' });
        },
      }),
    };

    const graph = createToolLoopGraph({
      model,
      tools: [
        {
          name: 'wc_v3_products_list',
          invoke: async (input) => {
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
});
