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
            tool: 'fetch_product',
            text: duplicatedText,
            structured: {
              id: 123,
              name: 'Sample',
            },
            content: [
              {
                type: 'text',
                text: duplicatedText,
              },
            ],
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
        tool: 'fetch_product',
        text: duplicatedText,
      })
    );
  });

  test('truncates long nested strings in serialized tool payloads by default', async () => {
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
            tool: 'fetch_product',
            text: 'summary',
            structured: {
              description: longString,
              nested: {
                notes: nestedLongString,
              },
            },
            content: [
              {
                type: 'resource',
                resource: {
                  description: contentLongString,
                },
              },
              {
                type: 'text',
                text: contentLongString,
              },
            ],
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

    expect(payload.structured.description).toHaveLength(300);
    expect(payload.structured.nested.notes).toHaveLength(300);
    expect(payload.content[0].resource.description).toHaveLength(300);
    expect(payload.content[1].text).toHaveLength(300);
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
            tool: 'fetch_product',
            text: JSON.stringify({
              ok: true,
              toolName: 'wc.v3.products_read',
              operationKey: 'PRODUCTS_READ',
              result: resultPayload,
              request: {
                path: {
                  id: 4335,
                },
              },
            }),
            structured: {
              ok: true,
              toolName: 'wc.v3.products_read',
              operationKey: 'PRODUCTS_READ',
              result: resultPayload,
              request: {
                path: {
                  id: 4335,
                },
              },
            },
            content: [
              {
                type: 'text',
                text: 'full envelope text that should not be passed to the model',
              },
            ],
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
            tool: 'report_worker_result',
            text: 'reported',
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
});
