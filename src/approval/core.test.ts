import { describe, expect, it } from 'bun:test';
import { ApprovalGate, ApprovalGateError, isApprovalGateError } from './core';

type TestContext = {
  chatId: number;
};

describe('ApprovalGate', () => {
  it('executes immediately when approval is not required', async () => {
    let adapterCalls = 0;
    let executeCalls = 0;
    const gate = new ApprovalGate<TestContext>({
      policy: {
        requiresApproval: () => false,
      },
      channelAdapter: {
        async sendApprovalRequest() {
          adapterCalls += 1;
          return null;
        },
      },
      timeoutMs: 50,
    });

    const result = await gate.runWithApproval({
      actionName: 'read_products',
      args: { limit: 10 },
      execute: async () => {
        executeCalls += 1;
        return 'ok';
      },
    });

    expect(result).toBe('ok');
    expect(executeCalls).toBe(1);
    expect(adapterCalls).toBe(0);
  });

  it('fails with approval_unavailable when context is missing', async () => {
    const gate = new ApprovalGate<TestContext>({
      policy: {
        requiresApproval: () => true,
      },
      channelAdapter: {
        async sendApprovalRequest() {
          return null;
        },
      },
      timeoutMs: 50,
    });

    try {
      await gate.runWithApproval({
        actionName: 'delete_product',
        args: { productId: 42 },
        execute: async () => 'never',
      });
      throw new Error('Expected runWithApproval to throw');
    } catch (error) {
      expect(isApprovalGateError(error)).toBe(true);
      expect(error).toBeInstanceOf(ApprovalGateError);
      expect((error as ApprovalGateError).type).toBe('approval_unavailable');
    }
  });

  it('stores pending approval metadata and executes after approval', async () => {
    let sentApprovalId = '';
    let executeCalls = 0;
    const gate = new ApprovalGate<TestContext>({
      policy: {
        requiresApproval: () => true,
      },
      channelAdapter: {
        async sendApprovalRequest(input) {
          sentApprovalId = input.approvalId;
          return { messageId: 777 };
        },
      },
      timeoutMs: 200,
    });

    const resultPromise = gate.runWithApproval({
      actionName: 'update_product',
      args: { productId: 42 },
      context: { chatId: 1001 },
      execute: async () => {
        executeCalls += 1;
        return 'approved-result';
      },
    });

    await Promise.resolve();

    const pending = gate.getPendingApproval(sentApprovalId);
    expect(pending).not.toBeNull();
    expect(pending?.context).toEqual({ chatId: 1001 });
    expect(pending?.channelMetadata).toEqual({ messageId: 777 });

    const completed = gate.approve(sentApprovalId);
    expect(completed?.approvalId).toBe(sentApprovalId);
    expect(gate.getPendingApproval(sentApprovalId)).toBeNull();

    await expect(resultPromise).resolves.toBe('approved-result');
    expect(executeCalls).toBe(1);
  });

  it('rejects action when operator rejects approval', async () => {
    let sentApprovalId = '';
    let executeCalls = 0;
    const gate = new ApprovalGate<TestContext>({
      policy: {
        requiresApproval: () => true,
      },
      channelAdapter: {
        async sendApprovalRequest(input) {
          sentApprovalId = input.approvalId;
          return null;
        },
      },
      timeoutMs: 200,
    });

    const resultPromise = gate.runWithApproval({
      actionName: 'delete_product',
      args: { productId: 42 },
      context: { chatId: 1001 },
      execute: async () => {
        executeCalls += 1;
        return 'never';
      },
    });

    await Promise.resolve();
    gate.reject(sentApprovalId);

    await expect(resultPromise).rejects.toMatchObject({
      type: 'approval_rejected',
    });
    expect(executeCalls).toBe(0);
    expect(gate.getPendingApproval(sentApprovalId)).toBeNull();
  });

  it('times out and clears pending approval', async () => {
    let sentApprovalId = '';
    const gate = new ApprovalGate<TestContext>({
      policy: {
        requiresApproval: () => true,
      },
      channelAdapter: {
        async sendApprovalRequest(input) {
          sentApprovalId = input.approvalId;
          return null;
        },
      },
      timeoutMs: 20,
    });

    const resultPromise = gate.runWithApproval({
      actionName: 'delete_product',
      args: { productId: 42 },
      context: { chatId: 1001 },
      execute: async () => 'never',
    });

    await Promise.resolve();
    expect(sentApprovalId).not.toBe('');

    await expect(resultPromise).rejects.toMatchObject({
      type: 'approval_timeout',
    });
    expect(gate.getPendingApproval(sentApprovalId)).toBeNull();
  });

  it('surfaces adapter failures as approval_unavailable and discards pending state', async () => {
    let capturedApprovalId = '';
    const gate = new ApprovalGate<TestContext>({
      policy: {
        requiresApproval: () => true,
      },
      channelAdapter: {
        async sendApprovalRequest(input) {
          capturedApprovalId = input.approvalId;
          throw new Error('telegram unavailable');
        },
      },
      timeoutMs: 200,
    });

    await expect(
      gate.runWithApproval({
        actionName: 'delete_product',
        args: { productId: 42 },
        context: { chatId: 1001 },
        execute: async () => 'never',
      })
    ).rejects.toMatchObject({
      type: 'approval_unavailable',
      message: 'telegram unavailable',
    });

    expect(gate.getPendingApproval(capturedApprovalId)).toBeNull();
  });
});
