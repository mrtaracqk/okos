import TelegramBot from 'node-telegram-bot-api';
import { generatedWooCommerceToolRegistry } from '../generated/woocommerceTools.generated';
import { ApprovalGate, getTelegramRequestContext, TelegramApprovalAdapter, type TelegramRequestContext } from '../runtime-plugins/approval';

const DEFAULT_APPROVAL_TIMEOUT_MS = 5 * 60 * 1000;
const approvalTimeoutMs = Number(process.env.WOOCOMMERCE_APPROVAL_TIMEOUT_MS || DEFAULT_APPROVAL_TIMEOUT_MS);
const telegramApprovalAdapter = new TelegramApprovalAdapter();

const APPROVAL_EXEMPT_WOOCOMMERCE_ACTIONS = new Set<string>([
  'wc.v3.products_attributes_list',
  'wc.v3.products_attributes_read',
  'wc.v3.products_attributes_terms_list',
  'wc.v3.products_attributes_terms_read',
  'wc.v3.products_categories_list',
  'wc.v3.products_categories_read',
  'wc.v3.products_duplicate_create',
  'wc.v3.products_read',
  'wc.v3.products_list',
  'wc.v3.products_variations_list',
  'wc.v3.products_variations_read'
]);

const unknownApprovalExemptActions = [...APPROVAL_EXEMPT_WOOCOMMERCE_ACTIONS].filter(
  (actionName) => !(actionName in generatedWooCommerceToolRegistry)
);

if (unknownApprovalExemptActions.length > 0) {
  throw new Error(
    `Неизвестные WooCommerce-действия, исключённые из approval: ${unknownApprovalExemptActions.join(', ')}`
  );
}

const requiredApprovalActions = new Set(
  Object.keys(generatedWooCommerceToolRegistry).filter(
    (actionName) => !APPROVAL_EXEMPT_WOOCOMMERCE_ACTIONS.has(actionName)
  )
);

const toolApprovalGate = new ApprovalGate<TelegramRequestContext>({
  policy: {
    requiresApproval(actionName: string) {
      return requiredApprovalActions.has(actionName);
    },
  },
  channelAdapter: telegramApprovalAdapter,
  timeoutMs: Number.isFinite(approvalTimeoutMs) && approvalTimeoutMs > 0 ? approvalTimeoutMs : DEFAULT_APPROVAL_TIMEOUT_MS,
});

export async function runWooCommerceToolWithApproval<TResult>(input: {
  actionName: string;
  args: Record<string, unknown>;
  execute: () => Promise<TResult>;
}) {
  return toolApprovalGate.runWithApproval({
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

  const pendingApproval = toolApprovalGate.getPendingApproval(parsedDecision.approvalId);
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
      ? toolApprovalGate.approve(parsedDecision.approvalId)
      : toolApprovalGate.reject(parsedDecision.approvalId);

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
