import { SystemMessage } from '@langchain/core/messages';
import { chatModel } from '../../../config';
import { PROMPTS } from '../../../prompts';
import { MainGraphStateAnnotation, mainTools } from '../graphs/main.graph';

export const responseAgentNode = async (
  state: typeof MainGraphStateAnnotation.State
): Promise<Partial<typeof MainGraphStateAnnotation.State>> => {
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
};
