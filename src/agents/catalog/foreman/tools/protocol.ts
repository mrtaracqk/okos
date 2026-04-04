import { ToolMessage } from '@langchain/core/messages';
import {
  buildTraceAttributes,
  formatTraceText,
  formatTraceValue,
} from '../../../../observability/traceContext';
import { type WorkerRun } from '../../contracts/workerRun';
import { type CatalogToolCall } from './types';

export const PLANNING_RUNTIME_UNAVAILABLE_MESSAGE = 'Runtime планирования недоступен для этого запуска.';
export const ACTIVE_PLAN_SNAPSHOT_PROTOCOL_ERROR =
  'Нарушение протокола: active execution plan и activeExecutionSnapshot должны существовать вместе.';

function replyToolCallId(toolCall: Pick<CatalogToolCall, 'id' | 'name'>): string {
  if (typeof toolCall.id === 'string' && toolCall.id.length > 0) return toolCall.id;
  if (typeof toolCall.name === 'string') return toolCall.name;
  return '';
}

export function toolReply(toolCall: Pick<CatalogToolCall, 'id' | 'name'>, content: string) {
  return new ToolMessage({
    tool_call_id: replyToolCallId(toolCall),
    name: toolCall.name ?? '',
    content,
  });
}
export function toolReplyWithMetadata(
  toolCall: Pick<CatalogToolCall, 'id' | 'name'>,
  content: string,
  additional_kwargs: Record<string, unknown>
) {
  return new ToolMessage({
    tool_call_id: replyToolCallId(toolCall),
    name: toolCall.name ?? '',
    content,
    additional_kwargs,
  });
}

export function ignoredToolCallReply(toolCall: Pick<CatalogToolCall, 'id' | 'name'>) {
  return toolReply(
    toolCall,
    'Протокол выполнения: в одном ответе выполняй только один tool call. Дополнительный tool call ' +
      `"${toolCall.name}"` +
      ' не выполнен; повтори его в следующей итерации после ответа по предыдущему tool call.'
  );
}

export function getToolMessageText(toolMessage: ToolMessage) {
  return typeof toolMessage.content === 'string' ? toolMessage.content : JSON.stringify(toolMessage.content);
}

export function buildExecutionToolResultAttributes(result: { toolMessage: ToolMessage; run?: WorkerRun }) {
  const toolText = getToolMessageText(result.toolMessage);
  const executionSessionId =
    typeof result.toolMessage.additional_kwargs?.executionSessionId === 'string'
      ? result.toolMessage.additional_kwargs.executionSessionId
      : undefined;
  const revision =
    typeof result.toolMessage.additional_kwargs?.revision === 'number'
      ? result.toolMessage.additional_kwargs.revision
      : undefined;
  return buildTraceAttributes({
    'output.value': formatTraceText(toolText, 1000),
    'catalog.execution_session_id': executionSessionId,
    'catalog.execution_snapshot_revision': revision,
    ...(result.run
      ? {
          'catalog.worker_status': result.run.status,
          'catalog.worker_name': result.run.agent,
          'catalog.worker_task_preview': formatTraceValue(result.run.task, 500),
        }
      : {}),
  });
}

export function buildExecutionToolStatusMessage(toolName: string, toolMessageText: string) {
  if (
    toolMessageText.startsWith(`Сбой ${toolName}:`) ||
    toolMessageText.includes(`Ошибка ${toolName}.`) ||
    toolMessageText.includes(PLANNING_RUNTIME_UNAVAILABLE_MESSAGE) ||
    toolMessageText.includes(ACTIVE_PLAN_SNAPSHOT_PROTOCOL_ERROR)
  ) {
    return toolMessageText;
  }

  return undefined;
}
