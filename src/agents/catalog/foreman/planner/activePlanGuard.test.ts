import { AIMessage, SystemMessage } from '@langchain/core/messages';
import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';

process.env.TELEGRAM_BOT_TOKEN ??= 'test-telegram-token';
process.env.OPENAI_API_KEY ??= 'test-openai-key';
process.env.OPENAI_MODEL_NAME ??= 'gpt-4o-mini';
process.env.OPENAI_UTILITY_MODEL_NAME ??= 'gpt-4o-mini';

let activePlanSummary: string | null;
let applyActivePlanGuard: typeof import('./activePlanGuard').applyActivePlanGuard;

mock.module('../../../../observability/traceContext', () => ({
  addTraceEvent: () => {},
  buildTraceAttributes: (input: Record<string, unknown>) => input,
  buildTraceInputAttributes: (input: Record<string, unknown>) => input,
  buildTraceOutputAttributes: (input: Record<string, unknown>) => input,
  formatTraceText: (value: unknown) => (typeof value === 'string' ? value : JSON.stringify(value)),
  formatTraceValue: (value: unknown) => (typeof value === 'string' ? value : JSON.stringify(value)),
  runAgentSpan: async <T>(_name: string, execute: () => Promise<T>) => execute(),
  runChainSpan: async <T>(_name: string, execute: () => Promise<T>) => execute(),
  runLlmSpan: async <T>(_name: string, execute: () => Promise<T>) => execute(),
  runToolSpan: async <T>(_name: string, execute: () => Promise<T>) => execute(),
  summarizeToolCallNames: (toolCalls: Array<{ name?: string }> | undefined) =>
    Array.isArray(toolCalls) ? toolCalls.map((toolCall) => toolCall.name ?? '').join(', ') : undefined,
}));

beforeAll(async () => {
  ({ applyActivePlanGuard } = await import('./activePlanGuard.js'));
});

beforeEach(() => {
  activePlanSummary = '- task-1: Найти товар [owner=product-worker, status=completed]';
});

function getPlanningDeps(): CatalogPlanningDeps {
  return {
    planningRuntime: {
      getActivePlan: () =>
        activePlanSummary
          ? {
              runId: 'run-1',
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
                  title: 'Найти товар',
                  owner: 'product-worker',
                  status: 'completed',
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
      failPlan: async () => {
        throw new Error('not implemented');
      },
      finalizeDanglingPlan: async () => {},
    },
    resolveRunContext: () => ({
      runId: 'run-1',
      chatId: 1,
    }),
  };
}

describe('applyActivePlanGuard', () => {
  test('uses transient SystemMessage correction without persisting it in returned messages', async () => {
    let capturedMessages: unknown[] = [];
    const correctedResponse = new AIMessage({
      content: '',
      tool_calls: [{ id: 'tool-1', name: 'finish_catalog_turn', args: { outcome: 'completed', summary: 'ok' } }],
    });

    const result = await applyActivePlanGuard({
      planningDeps: getPlanningDeps(),
      iteration: 1,
      workerRunsCount: 1,
      promptPrefixMessages: [new SystemMessage('catalog system'), new SystemMessage('runtime snapshot')],
      stateMessages: [],
      response: new AIMessage('text without tool call'),
      runnableModel: {
        async invoke(messages) {
          capturedMessages = messages;
          return correctedResponse;
        },
      },
    });

    expect(capturedMessages.at(-1)).toBeInstanceOf(SystemMessage);
    expect(result.messages).toEqual([new AIMessage('text without tool call'), correctedResponse]);
    expect(result.messages.some((message) => message instanceof SystemMessage)).toBe(false);
    expect(result.toolCalls).toHaveLength(1);
  });
});
