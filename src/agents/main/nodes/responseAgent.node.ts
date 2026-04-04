import { SystemMessage } from '@langchain/core/messages';
import { chatModel } from '../../../config';
import { buildTraceAttributes, runAgentSpan, runLlmSpan } from '../../../observability/traceContext';
import { PROMPTS } from '../../../prompts';
import { type MainGraphState } from '../state';
import { mainTools } from '../tools';

export const responseAgentNode = async (state: MainGraphState): Promise<Partial<MainGraphState>> => {
  return runAgentSpan(
    'main_graph.response_agent',
    async () => {
      const { messages, chatId } = state;
      const model = chatModel.bindTools(mainTools);

      let systemPrompt = PROMPTS.MAIN.SYSTEM();

      systemPrompt += `\n\n<additional-context>
Chat ID: ${chatId}`;
      systemPrompt += '\n</additional-context>\n';

      const systemMessage = new SystemMessage(systemPrompt);
      const llmMessages = [systemMessage, ...messages];
      const response = await runLlmSpan('main_graph.response_agent.llm', async () => model.invoke(llmMessages), {
        inputMessages: llmMessages,
        model,
      });

      return {
        messages: [response],
      };
    },
    {
      attributes: buildTraceAttributes({
        'telegram.chat_id': state.chatId,
        'main_graph.message_count': state.messages.length,
      }),
    }
  );
};
