import { AIMessage, BaseMessage, isAIMessage } from '@langchain/core/messages';

export function extractMessageText(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map((part) => {
      if (!part || typeof part !== 'object' || !('type' in part)) {
        return '';
      }

      if ((part as { type?: string }).type === 'text') {
        return (part as { text?: string }).text ?? '';
      }

      return '';
    })
    .filter(Boolean)
    .join('\n');
}

export function getLastAIMessage(messages: BaseMessage[]): AIMessage | undefined {
  const lastMessage = messages[messages.length - 1];
  return isAIMessage(lastMessage) ? lastMessage : undefined;
}

export function getLastAIMessageText(messages: BaseMessage[]): string {
  return extractMessageText(getLastAIMessage(messages)?.content);
}
