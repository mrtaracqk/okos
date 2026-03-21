export type ApprovalErrorType = 'approval_rejected' | 'approval_timeout' | 'approval_unavailable';
export type ApprovalDecision = 'approved' | 'rejected';
type ApprovalCompletion = ApprovalDecision | 'timeout';

export type ApprovalPolicy = {
  requiresApproval(actionName: string): boolean;
};

export type ApprovalRequest<TContext extends Record<string, unknown>> = {
  approvalId: string;
  actionName: string;
  args: Record<string, unknown>;
  context: TContext;
  deadline: Date;
};

export type ApprovalPendingSnapshot<TContext extends Record<string, unknown>> = ApprovalRequest<TContext> & {
  channelMetadata?: unknown;
};

export type ApprovalChannelAdapter<TContext extends Record<string, unknown>> = {
  sendApprovalRequest(input: ApprovalRequest<TContext>): Promise<unknown>;
};

export type RunWithApprovalInput<TContext extends Record<string, unknown>, TResult> = {
  actionName: string;
  args: Record<string, unknown>;
  context?: TContext;
  execute: () => Promise<TResult>;
};

type PendingApproval<TContext extends Record<string, unknown>> = ApprovalPendingSnapshot<TContext> & {
  settled: boolean;
  timeoutHandle: ReturnType<typeof setTimeout>;
  resolveCompletion: (value: ApprovalCompletion) => void;
};

export class ApprovalGateError extends Error {
  readonly type: ApprovalErrorType;

  constructor(type: ApprovalErrorType, message: string) {
    super(message);
    this.name = 'ApprovalGateError';
    this.type = type;
  }
}

export function isApprovalGateError(error: unknown): error is ApprovalGateError {
  return error instanceof ApprovalGateError;
}

type ApprovalGateOptions<TContext extends Record<string, unknown>> = {
  policy: ApprovalPolicy;
  channelAdapter: ApprovalChannelAdapter<TContext>;
  timeoutMs: number;
};

export class ApprovalGate<TContext extends Record<string, unknown>> {
  private readonly pendingApprovals = new Map<string, PendingApproval<TContext>>();
  private readonly policy: ApprovalPolicy;
  private readonly channelAdapter: ApprovalChannelAdapter<TContext>;
  private readonly timeoutMs: number;

  constructor(options: ApprovalGateOptions<TContext>) {
    this.policy = options.policy;
    this.channelAdapter = options.channelAdapter;
    this.timeoutMs = options.timeoutMs;
  }

  async runWithApproval<TResult>(input: RunWithApprovalInput<TContext, TResult>): Promise<TResult> {
    if (!this.policy.requiresApproval(input.actionName)) {
      return input.execute();
    }

    if (!input.context) {
      throw new ApprovalGateError(
        'approval_unavailable',
        `Действие "${input.actionName}" требует подтверждения, но runtime-контекст запроса недоступен.`
      );
    }

    const approvalId = crypto.randomUUID();
    const deadline = new Date(Date.now() + this.timeoutMs);
    let resolveCompletion!: PendingApproval<TContext>['resolveCompletion'];
    const completionPromise = new Promise<ApprovalCompletion>((resolve) => {
      resolveCompletion = resolve;
    });

    const pendingApproval: PendingApproval<TContext> = {
      approvalId,
      actionName: input.actionName,
      args: input.args,
      context: input.context,
      deadline,
      settled: false,
      timeoutHandle: setTimeout(() => {
        this.completePendingApproval(approvalId, 'timeout');
      }, this.timeoutMs),
      resolveCompletion,
    };

    this.pendingApprovals.set(approvalId, pendingApproval);

    try {
      pendingApproval.channelMetadata = await this.channelAdapter.sendApprovalRequest({
        approvalId,
        actionName: input.actionName,
        args: input.args,
        context: input.context,
        deadline,
      });
    } catch (error) {
      this.discardPendingApproval(approvalId);
      const message = error instanceof Error ? error.message : 'Не удалось отправить запрос на подтверждение.';
      throw new ApprovalGateError('approval_unavailable', message);
    }

    const completion = await completionPromise;
    if (completion === 'rejected') {
      throw new ApprovalGateError('approval_rejected', `Действие "${input.actionName}" было отклонено оператором.`);
    }

    if (completion === 'timeout') {
      throw new ApprovalGateError(
        'approval_timeout',
        `Истекло время ожидания подтверждения действия "${input.actionName}" от оператора.`
      );
    }

    return input.execute();
  }

  getPendingApproval(approvalId: string): ApprovalPendingSnapshot<TContext> | null {
    const pendingApproval = this.pendingApprovals.get(approvalId);
    if (!pendingApproval) {
      return null;
    }

    return this.toPendingSnapshot(pendingApproval);
  }

  approve(approvalId: string) {
    return this.completePendingApproval(approvalId, 'approved');
  }

  reject(approvalId: string) {
    return this.completePendingApproval(approvalId, 'rejected');
  }

  private toPendingSnapshot(pendingApproval: PendingApproval<TContext>): ApprovalPendingSnapshot<TContext> {
    return {
      approvalId: pendingApproval.approvalId,
      actionName: pendingApproval.actionName,
      args: pendingApproval.args,
      context: pendingApproval.context,
      deadline: pendingApproval.deadline,
      channelMetadata: pendingApproval.channelMetadata,
    };
  }

  private completePendingApproval(approvalId: string, completion: ApprovalCompletion) {
    const pendingApproval = this.pendingApprovals.get(approvalId);
    if (!pendingApproval || pendingApproval.settled) {
      return null;
    }

    pendingApproval.settled = true;
    clearTimeout(pendingApproval.timeoutHandle);
    this.pendingApprovals.delete(approvalId);
    pendingApproval.resolveCompletion(completion);
    return this.toPendingSnapshot(pendingApproval);
  }

  private discardPendingApproval(approvalId: string) {
    const pendingApproval = this.pendingApprovals.get(approvalId);
    if (!pendingApproval) {
      return;
    }

    pendingApproval.settled = true;
    clearTimeout(pendingApproval.timeoutHandle);
    this.pendingApprovals.delete(approvalId);
  }
}
