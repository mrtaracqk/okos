import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';

let runId: string | null;
let finalizeError: Error | null;
let finalizeCalls: Array<{ runId: string }>;

mock.module('../../../../observability/traceContext', () => ({
  buildTraceAttributes: (input: Record<string, unknown>) => input,
  runChainSpan: async <T>(_name: string, execute: () => Promise<T>) => execute(),
}));

let createFinalizeNode: typeof import('./finalizeNode').createFinalizeNode;

beforeAll(async () => {
  ({ createFinalizeNode } = await import('./finalizeNode.js'));
});

beforeEach(() => {
  runId = 'run-1';
  finalizeError = null;
  finalizeCalls = [];
});

function getPlanningDeps(): CatalogPlanningDeps {
  return {
    planningRuntime: {
      getActivePlan: (candidateRunId) =>
        runId && candidateRunId === runId
          ? {
              runId,
              chatId: 1,
              status: 'active',
              planContext: {
                goal: 'goal',
                facts: [],
                constraints: [],
              },
              tasks: [
                {
                  taskId: 'task-1',
                  title: 'title',
                  owner: 'product-worker',
                  status: 'failed',
                },
              ],
            }
          : null,
      createPlan: async () => {
        throw new Error('not implemented');
      },
      updatePlan: async () => {
        throw new Error('not implemented');
      },
      completePlan: async () => {
        throw new Error('not implemented');
      },
      failPlan: async (candidateRunId) => {
        finalizeCalls.push({ runId: candidateRunId });
        if (finalizeError) {
          throw finalizeError;
        }

        return {
          runId: candidateRunId,
          chatId: 1,
          status: 'failed',
          planContext: {
            goal: 'goal',
            facts: [],
            constraints: [],
          },
          tasks: [],
        };
      },
      finalizeDanglingPlan: async () => {
        throw new Error('not implemented');
      },
    },
    resolveRunContext: () => (runId ? { runId, chatId: 1 } : null),
  };
}

describe('finalizeNode', () => {
  test('rethrows runtime plan finalization errors', async () => {
    finalizeError = new Error('runtime finalize failed');
    const finalizeNode = createFinalizeNode(getPlanningDeps());

    await expect(
      finalizeNode({
        workerRuns: [],
        finalizeOutcome: 'failed',
      } as any)
    ).rejects.toThrow('runtime finalize failed');

    expect(finalizeCalls).toEqual([{ runId: 'run-1' }]);
  });
});
