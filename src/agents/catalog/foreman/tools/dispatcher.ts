import { ToolMessage } from '@langchain/core/messages';
import { type WorkerRun } from '../../contracts/workerRun';
import { resolveCatalogForemanToolRegistration } from './availability';
import { toolReply } from './protocol';
import { type CatalogToolCall, type CatalogToolCompletion, type CatalogToolExecutionContext } from './types';

export type { CatalogToolCompletion } from './types';

export async function executeCatalogToolCall(
  toolCall: CatalogToolCall,
  workerRuns: WorkerRun[],
  executionContext: CatalogToolExecutionContext
): Promise<{
  run?: WorkerRun;
  toolMessage: ToolMessage;
  completion?: CatalogToolCompletion;
  executionSnapshot?: import('../executionSnapshot').ExecutionSnapshot;
  clearExecutionSnapshot?: boolean;
}> {
  const registration = resolveCatalogForemanToolRegistration(toolCall.name);
  if (!registration) {
    return {
      toolMessage: toolReply(toolCall, `Каталожный инструмент "${toolCall.name}" не зарегистрирован.`),
    };
  }

  return registration.execute(toolCall, workerRuns, executionContext);
}
