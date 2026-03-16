import TelegramBot from 'node-telegram-bot-api';
import { ApprovalGate, getTelegramRequestContext, TelegramApprovalAdapter, type TelegramRequestContext } from '../runtime-plugins/approval';

const DEFAULT_APPROVAL_TIMEOUT_MS = 5 * 60 * 1000;
const approvalTimeoutMs = Number(process.env.WOOCOMMERCE_APPROVAL_TIMEOUT_MS || DEFAULT_APPROVAL_TIMEOUT_MS);
const telegramApprovalAdapter = new TelegramApprovalAdapter();

const approvalGateWhenRequested = new ApprovalGate<TelegramRequestContext>({
  policy: { requiresApproval: () => true },
  channelAdapter: telegramApprovalAdapter,
  timeoutMs: Number.isFinite(approvalTimeoutMs) && approvalTimeoutMs > 0 ? approvalTimeoutMs : DEFAULT_APPROVAL_TIMEOUT_MS,
});

export async function runToolWithApprovalWhenRequested<TResult>(input: {
  actionName: string;
  args: Record<string, unknown>;
  requiresApproval: boolean;
  execute: () => Promise<TResult>;
}): Promise<TResult> {
  if (!input.requiresApproval) {
    return input.execute();
  }
  return approvalGateWhenRequested.runWithApproval({
    actionName: input.actionName,
    args: input.args,
    context: getTelegramRequestContext(),
    execute: input.execute,
  });
}

export async function runWooCommerceToolWithApproval<TResult>(input: {
  actionName: string;
  args: Record<string, unknown>;
  execute: () => Promise<TResult>;
}) {
  return approvalGateWhenRequested.runWithApproval({
    actionName: input.actionName,
    args: input.args,
    context: getTelegramRequestContext(),
    execute: input.execute,
  });
}

export async function handleTelegramApprovalCallback(callbackQuery: TelegramBot.CallbackQuery) {
  const parsedDecision = telegramApprovalAdapter.parseDecisionPayload(callbackQuery.data);
  if (!parsedDecision) {
    return false;
  }

  const pendingApproval = approvalGateWhenRequested.getPendingApproval(parsedDecision.approvalId);
  if (!pendingApproval) {
    await telegramApprovalAdapter.acknowledgeDecision({
      callbackQuery,
      result: 'not_found',
    });
    return true;
  }

  const callbackChatId = callbackQuery.message?.chat.id;
  const callbackUserId = callbackQuery.from.id;
  if (callbackChatId !== pendingApproval.context.chatId || callbackUserId !== pendingApproval.context.telegramUserId) {
    await telegramApprovalAdapter.acknowledgeDecision({
      callbackQuery,
      result: 'forbidden',
    });
    return true;
  }

  const resolvedApproval =
    parsedDecision.decision === 'approved'
      ? approvalGateWhenRequested.approve(parsedDecision.approvalId)
      : approvalGateWhenRequested.reject(parsedDecision.approvalId);

  if (!resolvedApproval) {
    await telegramApprovalAdapter.acknowledgeDecision({
      callbackQuery,
      result: 'not_found',
    });
    return true;
  }

  await telegramApprovalAdapter.acknowledgeDecision({
    callbackQuery,
    result: parsedDecision.decision,
  });
  return true;
}
