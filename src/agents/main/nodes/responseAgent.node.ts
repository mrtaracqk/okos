import { SystemMessage } from '@langchain/core/messages';
import { chatModel } from '../../../config';
import { buildTraceAttributes, runAgentSpan } from '../../../observability/traceContext';
import { PROMPTS } from '../../../prompts';
import { MainGraphStateAnnotation, mainTools } from '../graphs/main.graph';

export const responseAgentNode = async (
  state: typeof MainGraphStateAnnotation.State
): Promise<Partial<typeof MainGraphStateAnnotation.State>> => {
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
      const response = await model.invoke([systemMessage, ...messages]);

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
