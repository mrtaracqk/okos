import { ToolMessage } from '@langchain/core/messages';
import { type WorkerRun } from '../../contracts/workerRun';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';
import { resolveCatalogForemanToolRegistration } from './availability';
import { toolReply } from './protocol';
import { type CatalogToolCall, type CatalogToolCompletion, type CatalogToolExecutionContext } from './types';

export type { CatalogToolCompletion } from './types';

export async function executeCatalogToolCall(
  planningDeps: CatalogPlanningDeps,
  toolCall: CatalogToolCall,
  workerRuns: WorkerRun[],
  executionContext: CatalogToolExecutionContext
): Promise<{
  run?: WorkerRun;
  toolMessage: ToolMessage;
  completion?: CatalogToolCompletion;
  executionResult?: import('../executionResult').CatalogExecutionResult;
  clearExecutionResult?: boolean;
}> {
  const registration = resolveCatalogForemanToolRegistration(toolCall.name);
  if (!registration) {
    return {
      toolMessage: toolReply(toolCall, `Каталожный инструмент "${toolCall.name}" не зарегистрирован.`),
    };
  }

  return registration.execute(planningDeps, toolCall, workerRuns, executionContext);
}
