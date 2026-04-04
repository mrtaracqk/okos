import { type RuntimePlan } from '../../../../runtime/planning/types';
import { type ExecutionSnapshot } from '../executionSnapshot';
import { ACTIVE_PLAN_SNAPSHOT_PROTOCOL_ERROR } from '../tools/protocol';
import { type CatalogForemanRoute, type CatalogGraphState } from './state';

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Неизвестная ошибка catalog foreman.';
}

export function buildFailureState(error: unknown): Pick<
  CatalogGraphState,
  'pendingToolCalls' | 'nextRoute' | 'finalizeOutcome' | 'fatalErrorMessage'
> {
  return {
    pendingToolCalls: [],
    nextRoute: 'finalize' as CatalogForemanRoute,
    finalizeOutcome: 'failed',
    fatalErrorMessage: toErrorMessage(error),
  };
}

export function assertExecutionSnapshotInvariant(
  activePlan: RuntimePlan | null,
  activeExecutionSnapshot: ExecutionSnapshot | null
) {
  if (Boolean(activePlan) !== Boolean(activeExecutionSnapshot)) {
    throw new Error(ACTIVE_PLAN_SNAPSHOT_PROTOCOL_ERROR);
  }
}
