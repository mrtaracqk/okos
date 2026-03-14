import { AIMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
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
});
