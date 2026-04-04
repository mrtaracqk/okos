import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';

let nextMessageId: number;
let deleteCalls: Array<{ chatId: number; messageId: number }>;
let chatActionCalls: Array<{ chatId: number; action: string }>;

mock.module('../../services/telegram', () => ({
  default: {
    sendMessage: async () => ({ message_id: nextMessageId++ }),
    sendChatAction: async (chatId: number, action: string) => {
      chatActionCalls.push({ chatId, action });
    },
    deleteMessage: async (chatId: number, messageId: number) => {
      deleteCalls.push({ chatId, messageId });
    },
  },
}));

let progressModule: typeof import('./progress');

beforeAll(async () => {
  progressModule = await import('./progress.js');
});

beforeEach(() => {
  nextMessageId = 1;
  deleteCalls = [];
  chatActionCalls = [];
});

describe('telegramMainGraphProgressReporter', () => {
  test('tracks placeholders independently for concurrent runs in one chat', async () => {
    await progressModule.telegramMainGraphProgressReporter.onCatalogDelegation({
      chatId: 101,
      runId: 'run-1',
    });
    await progressModule.telegramMainGraphProgressReporter.onCatalogDelegation({
      chatId: 101,
      runId: 'run-2',
    });

    expect(progressModule.takeCatalogDelegationPlaceholderMessageId('run-1')).toBe(1);
    expect(progressModule.takeCatalogDelegationPlaceholderMessageId('run-2')).toBe(2);
    expect(chatActionCalls).toEqual([
      { chatId: 101, action: 'typing' },
      { chatId: 101, action: 'typing' },
    ]);
  });

  test('cleans up only the completed run placeholder', async () => {
    await progressModule.telegramMainGraphProgressReporter.onCatalogDelegation({
      chatId: 101,
      runId: 'run-1',
    });
    await progressModule.telegramMainGraphProgressReporter.onCatalogDelegation({
      chatId: 101,
      runId: 'run-2',
    });

    await progressModule.telegramMainGraphProgressReporter.onRunComplete({
      chatId: 101,
      runId: 'run-1',
    });

    expect(deleteCalls).toEqual([{ chatId: 101, messageId: 1 }]);
    expect(progressModule.takeCatalogDelegationPlaceholderMessageId('run-1')).toBeUndefined();
    expect(progressModule.takeCatalogDelegationPlaceholderMessageId('run-2')).toBe(2);
  });
});
