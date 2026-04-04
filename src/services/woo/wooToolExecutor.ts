import { isApprovalGateError } from '../../plugins/approval';
import { WooApiError } from '../woo-sdk/src/core/http';
import { getWooClient } from './wooClient';
import { runToolWithApprovalWhenRequested } from '../toolApproval';
import {
  buildToolSuccess,
  normalizeToolFailure,
  normalizeToolFailureFromError,
  type NormalizedToolResult,
} from './wooToolResult';
import type { WooClient } from '../woo-sdk/src/client';

export type WooToolExecutorRun = (client: WooClient) => Promise<unknown>;

export type ExecuteWooToolParams = {
  toolName: string;
  args: Record<string, unknown>;
  requiresApproval: boolean;
  run: WooToolExecutorRun;
};

function isNormalizedToolResult(value: unknown): value is NormalizedToolResult {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.ok === 'boolean' &&
    'structured' in o
  );
}

function resultToNormalized(toolName: string, value: unknown): NormalizedToolResult {
  if (isNormalizedToolResult(value)) {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'ok' in value && (value as { ok: boolean }).ok === false) {
    const o = value as Record<string, unknown>;
    return normalizeToolFailure({
      structured: 'structured' in o ? (o.structured as unknown) : null,
      fallbackSource: 'woo-tool',
    });
  }
  return buildToolSuccess(value);
}

export async function executeWooTool(params: ExecuteWooToolParams): Promise<NormalizedToolResult> {
  const { toolName, args, requiresApproval, run } = params;

  try {
    const raw = await runToolWithApprovalWhenRequested({
      actionName: toolName,
      args,
      requiresApproval,
      execute: async () => {
        const client = getWooClient();
        return run(client);
      },
    });
    const result = resultToNormalized(toolName, raw);
    return result;
  } catch (error) {
    if (isApprovalGateError(error)) {
      const failure = normalizeToolFailureFromError(error, 'approval-gate');
      return failure;
    }
    if (error instanceof WooApiError) {
      const message = error.message;
      const data = error.data;
      const structured =
        typeof data === 'object' && data !== null
          ? { error: { message, status: error.status, data } }
          : { error: { message, status: error.status } };
      const failure = normalizeToolFailure({
        structured: structured as Record<string, unknown>,
        fallbackSource: 'woo-sdk',
      });
      return failure;
    }
    const failure = normalizeToolFailureFromError(error, 'woo-sdk');
    return failure;
  }
}
