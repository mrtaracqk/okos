import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { PlanningCore } from '../../../../runtime/planning/core';
import { type ExecutionSnapshot } from '../executionSnapshot';
import { approveStepTool, finishExecutionPlanTool, newExecutionPlanTool } from './definitions/executionPlanTools';

type PlanningRunContext = {
  runId: string;
  chatId: number;
};

type FakeWorkerResult = {
  toolRuns?: Array<Record<string, unknown>>;
  finalResult?: {
    status: 'completed' | 'failed';
    facts: string[];
    missingInputs: string[];
    blocker?: { kind: string; owner: string; reason: string } | null;
    artifacts?: unknown[];
    summary?: string | null;
  };
  error?: Error;
};

let planningRuntime: PlanningCore;
let planningRunContext: PlanningRunContext | null;
let workerInvocations: Array<{ workerId: string; payload: unknown; config: unknown }>;
let workerResults: Map<string, FakeWorkerResult>;
let executionContext: { activeExecutionSnapshot: ExecutionSnapshot | null };

mock.module('../../../../runtime/planning', () => ({
  getPlanningRuntime: () => planningRuntime,
  getPlanningRunContext: () => planningRunContext,
}));

mock.module('../workers/registry', () => ({
  resolveCatalogForemanWorker(workerId: string) {
    return {
      id: workerId,
      graph: {
        async invoke(payload: unknown, config: unknown) {
          workerInvocations.push({ workerId, payload, config });
          const result = workerResults.get(workerId);
          if (!result) {
            throw new Error(`Unexpected worker invocation for "${workerId}".`);
          }
          if (result.error) {
            throw result.error;
          }
          return result;
        },
      },
    };
  },
}));

mock.module('./definitions/inspectPlaybookTool', () => ({
  inspectCatalogPlaybookInputSchema: {
    safeParse(input: unknown) {
      return { success: true as const, data: input as { playbookId: string } };
    },
  },
  inspectCatalogPlaybookTool: {
    name: 'inspect_catalog_playbook',
    async invoke({ playbookId }: { playbookId: string }) {
      return `playbook:${playbookId}`;
    },
  },
}));

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

let executeCatalogToolCall: typeof import('./dispatcher').executeCatalogToolCall;
let dispatchToolsNode: typeof import('../graph/dispatchNode').dispatchToolsNode;

function buildNewExecutionPlanCall(tasks: Array<Record<string, unknown>>) {
  return {
    id: 'tool-call-1',
    name: newExecutionPlanTool.name,
    args: {
      planContext: {
        goal: 'Найти и обновить товары',
        facts: ['channel=telegram'],
        constraints: ['Работать только через воркеров'],
      },
      tasks,
    },
  };
}

function syncExecutionContext(snapshot: ExecutionSnapshot | undefined, clearExecutionSnapshot: boolean | undefined) {
  if (clearExecutionSnapshot) {
    executionContext = { activeExecutionSnapshot: null };
    return;
  }

  if (snapshot) {
    executionContext = { activeExecutionSnapshot: snapshot };
  }
}

async function executeToolCall(toolCall: Parameters<typeof executeCatalogToolCall>[0], workerRuns: Parameters<typeof executeCatalogToolCall>[1]) {
  const result = await executeCatalogToolCall(toolCall, workerRuns, executionContext);
  syncExecutionContext(result.executionSnapshot, result.clearExecutionSnapshot);
  return result;
}

beforeAll(async () => {
  ({ executeCatalogToolCall } = await import('./dispatcher.js'));
  ({ dispatchToolsNode } = await import('../graph/dispatchNode.js'));
});

beforeEach(() => {
  planningRuntime = new PlanningCore();
  planningRunContext = {
    runId: 'run-1',
    chatId: 101,
  };
  workerInvocations = [];
  workerResults = new Map();
  executionContext = { activeExecutionSnapshot: null };
});

describe('executeCatalogToolCall', () => {
  test('new_execution_plan creates a session, returns snapshot rev=1, and does not append HumanMessage feedback', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'completed',
        facts: ['product_id=101', 'sku=IP-17'],
        missingInputs: [],
        artifacts: [{ product_id: 101, sku: 'IP-17' }],
        summary: 'Товар найден и подтвержден.',
      },
    });

    const result = await executeToolCall(
      buildNewExecutionPlanCall([
        {
          taskId: 'task-1',
          responsible: 'product-worker',
          task: 'Найти товар по SKU',
          inputData: {
            facts: ['sku=IP-17'],
            constraints: ['read-only'],
            contextNotes: 'Сначала нужен lookup',
          },
          responseStructure: 'status, facts, missingInputs, summary',
        },
        {
          taskId: 'task-2',
          responsible: 'variation-worker',
          task: 'Проверить вариации товара',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, facts, missingInputs, summary',
        },
      ]),
      []
    );

    expect(result.run?.status).toBe('completed');
    expect(result.executionSnapshot?.revision).toBe(1);
    expect(result.executionSnapshot?.nextAction).toBe('approve_step');
    expect(result.executionSnapshot?.upstreamArtifactsCount).toBe(1);
    expect(result.executionSnapshot?.executionSessionId).toBeTruthy();
    expect(result.toolMessage.content).toContain('Execution Snapshot');
    expect(result.toolMessage.additional_kwargs?.executionSessionId).toBe(result.executionSnapshot?.executionSessionId);
    expect(workerInvocations).toHaveLength(1);
    expect(workerInvocations[0]?.payload).toEqual({
      messages: [],
      handoff: {
        planContext: {
          goal: 'Найти и обновить товары',
          facts: ['channel=telegram'],
          constraints: ['Работать только через воркеров'],
        },
        taskInput: {
          objective: 'Найти товар по SKU',
          facts: ['sku=IP-17'],
          constraints: ['read-only'],
          expectedOutput: 'status, facts, missingInputs, summary',
          contextNotes: 'Сначала нужен lookup',
        },
      },
    });

    const activePlan = planningRuntime.getActivePlan('run-1');
    expect(activePlan?.tasks.map((task) => task.status)).toEqual(['completed', 'pending']);
    expect(activePlan?.nextStepArtifacts).toEqual([{ product_id: 101, sku: 'IP-17' }]);
  });

  test('approve_step keeps the same executionSessionId and increments revision from activeExecutionSnapshot', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'completed',
        facts: ['product_id=101'],
        missingInputs: [],
        artifacts: [{ product_id: 101 }],
        summary: 'Родитель найден.',
      },
    });

    const first = await executeToolCall(
      buildNewExecutionPlanCall([
        {
          taskId: 'task-1',
          responsible: 'product-worker',
          task: 'Собрать входные данные',
          inputData: {
            facts: ['sku=IP-17'],
            constraints: [],
          },
          responseStructure: 'status, facts',
        },
        {
          taskId: 'task-2',
          responsible: 'variation-worker',
          task: 'Проверить вариации',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
            contextNotes: 'Нужна точная карточка вариаций',
          },
          responseStructure: 'status, facts, missingInputs',
        },
        {
          taskId: 'task-3',
          responsible: 'category-worker',
          task: 'Проверить категории товара',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, facts, missingInputs',
        },
      ]),
      []
    );

    workerResults.set('variation-worker', {
      finalResult: {
        status: 'completed',
        facts: ['variation_id=201'],
        missingInputs: [],
        summary: 'Вариации проверены.',
      },
    });

    workerInvocations = [];

    const result = await executeToolCall(
      {
        id: 'tool-call-2',
        name: approveStepTool.name,
        args: {},
      },
      []
    );

    expect(result.run?.status).toBe('completed');
    expect(result.executionSnapshot?.revision).toBe(2);
    expect(result.executionSnapshot?.executionSessionId).toBe(first.executionSnapshot?.executionSessionId ?? '');
    expect(result.executionSnapshot?.nextAction).toBe('approve_step');
    expect(workerInvocations).toHaveLength(1);
    expect(workerInvocations[0]?.workerId).toBe('variation-worker');
    expect(workerInvocations[0]?.payload).toEqual({
      messages: [],
      handoff: {
        planContext: {
          goal: 'Найти и обновить товары',
          facts: ['channel=telegram'],
          constraints: ['Работать только через воркеров'],
        },
        taskInput: {
          objective: 'Проверить вариации',
          facts: ['product_id=101'],
          constraints: ['read-only'],
          expectedOutput: 'status, facts, missingInputs',
          contextNotes: 'Нужна точная карточка вариаций',
        },
        upstreamArtifacts: [{ product_id: 101 }],
      },
    });

    const activePlan = planningRuntime.getActivePlan('run-1');
    expect(activePlan?.tasks.map((task) => task.status)).toEqual(['completed', 'completed', 'pending']);
    expect(activePlan?.nextStepArtifacts).toBeUndefined();
  });

  test('new_execution_plan replaces plan context and starts a new execution session', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'completed',
        facts: ['product_id=101'],
        missingInputs: [],
        artifacts: [{ product_id: 101 }],
        summary: 'Родитель найден.',
      },
    });

    const first = await executeToolCall(
      buildNewExecutionPlanCall([
        {
          taskId: 'task-1',
          responsible: 'product-worker',
          task: 'Собрать входные данные',
          inputData: {
            facts: ['sku=IP-17'],
            constraints: [],
          },
          responseStructure: 'status, facts',
        },
        {
          taskId: 'task-2',
          responsible: 'variation-worker',
          task: 'Проверить вариации',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, facts, missingInputs',
        },
      ]),
      []
    );

    expect(planningRuntime.getActivePlan('run-1')?.nextStepArtifacts).toEqual([{ product_id: 101 }]);

    workerResults.set('variation-worker', {
      finalResult: {
        status: 'completed',
        facts: ['variation_id=201'],
        missingInputs: [],
        summary: 'Вариация найдена.',
      },
    });

    const result = await executeToolCall(
      {
        id: 'tool-call-1b',
        name: newExecutionPlanTool.name,
        args: {
          planContext: {
            goal: 'Проверить только вариации',
            facts: ['product_id=101'],
            constraints: ['Только read-only'],
          },
          tasks: [
            {
              taskId: 'task-10',
              responsible: 'variation-worker',
              task: 'Проверить вариации заново',
              inputData: {
                facts: ['product_id=101'],
                constraints: ['read-only'],
              },
              responseStructure: 'status, facts, missingInputs',
            },
          ],
        },
      },
      []
    );

    expect(result.run?.status).toBe('completed');
    expect(result.executionSnapshot?.revision).toBe(1);
    expect(result.executionSnapshot?.executionSessionId).toBeTruthy();
    expect(result.executionSnapshot?.executionSessionId).not.toBe(first.executionSnapshot?.executionSessionId ?? '');
    expect(workerInvocations.at(-1)?.payload).toEqual({
      messages: [],
      handoff: {
        planContext: {
          goal: 'Проверить только вариации',
          facts: ['product_id=101'],
          constraints: ['Только read-only'],
        },
        taskInput: {
          objective: 'Проверить вариации заново',
          facts: ['product_id=101'],
          constraints: ['read-only'],
          expectedOutput: 'status, facts, missingInputs',
          contextNotes: undefined,
        },
      },
    });
    expect(planningRuntime.getActivePlan('run-1')?.nextStepArtifacts).toBeUndefined();
  });

  test('finish_execution_plan clears active execution snapshot state', async () => {
    await planningRuntime.createPlan({
      runId: 'run-1',
      chatId: 101,
      planContext: {
        goal: 'Завершить уже готовый план',
        facts: [],
        constraints: [],
      },
      tasks: [
        {
          taskId: 'task-1',
          title: 'Готовый шаг',
          owner: 'product-worker',
          status: 'completed',
        },
      ],
    });
    executionContext = {
      activeExecutionSnapshot: {
        executionSessionId: 'exec-1',
        revision: 1,
        lastTool: 'new_execution_plan',
        planStatus: 'active',
        steps: [{ taskId: 'task-1', title: 'Готовый шаг', owner: 'product-worker', status: 'completed' }],
        lastCompletedStep: {
          taskId: 'task-1',
          worker: 'product-worker',
          status: 'completed',
          summary: 'ok',
          blocker: null,
          missingInputsCount: 0,
          artifactsCount: 0,
        },
        nextAction: 'finish_execution_plan',
        nextActionReason: 'plan_has_no_pending_steps',
        upstreamArtifactsCount: 0,
      },
    };

    const result = await executeToolCall(
      {
        id: 'tool-call-3',
        name: finishExecutionPlanTool.name,
        args: {
          outcome: 'completed',
          summary: 'Пользовательский ответ готов.',
        },
      },
      []
    );

    expect(result.completion).toEqual({
      summary: 'Пользовательский ответ готов.',
      finalizeOutcome: 'completed',
    });
    expect(result.clearExecutionSnapshot).toBe(true);
    expect(executionContext).toEqual({ activeExecutionSnapshot: null });
    expect(planningRuntime.getActivePlan('run-1')).toBeNull();
    expect(planningRuntime.getPlan('run-1')?.status).toBe('completed');
  });

  test('failed worker snapshot routes planner to new_execution_plan or finish_execution_plan deterministically', async () => {
    workerResults.set('product-worker', {
      toolRuns: [],
    });

    const result = await executeToolCall(
      buildNewExecutionPlanCall([
        {
          taskId: 'task-1',
          responsible: 'product-worker',
          task: 'Найти товар без финального отчёта',
          inputData: {
            facts: ['sku=MISS-1'],
            constraints: [],
          },
          responseStructure: 'status, facts',
        },
      ]),
      []
    );

    expect(result.run?.status).toBe('failed');
    expect(result.executionSnapshot?.planStatus).toBe('failed');
    expect(result.executionSnapshot?.nextAction).toBe('finish_execution_plan');
    expect(result.toolMessage.content).toContain('Execution Snapshot');
    expect(result.run?.errorSummary).toContain('report_worker_result');
    expect(planningRuntime.getActivePlan('run-1')?.tasks[0]?.status).toBe('failed');
  });

  test('returns a protocol-safe ToolMessage for an unknown tool name', async () => {
    const result = await executeToolCall(
      {
        id: 'tool-call-unknown',
        name: 'unknown_catalog_tool',
        args: {},
      },
      []
    );

    expect(result.run).toBeUndefined();
    expect(result.completion).toBeUndefined();
    expect(result.toolMessage.tool_call_id).toBe('tool-call-unknown');
    expect(result.toolMessage.content).toBe('Каталожный инструмент "unknown_catalog_tool" не зарегистрирован.');
  });

  test('dispatchToolsNode fatally fails when active plan exists without activeExecutionSnapshot', async () => {
    await planningRuntime.createPlan({
      runId: 'run-1',
      chatId: 101,
      planContext: {
        goal: 'Проверить товар',
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
        {
          taskId: 'task-2',
          title: 'Проверить вариации',
          owner: 'variation-worker',
          status: 'pending',
          execution: {
            objective: 'Проверить вариации',
            facts: ['product_id=101'],
            constraints: ['read-only'],
            expectedOutput: 'status, facts',
          },
        },
      ],
    });

    const result = await dispatchToolsNode({
      messages: [],
      workerRuns: [],
      activeExecutionSnapshot: null,
      plannerIteration: 1,
      pendingToolCalls: [{ id: 'tool-call-2', name: approveStepTool.name, args: {} }],
      nextRoute: 'dispatchTools',
      finalizeOutcome: null,
      fatalErrorMessage: null,
    });

    expect(result.messages).toEqual([]);
    expect(result.activeExecutionSnapshot).toBeNull();
    expect(result.fatalErrorMessage).toBe(
      'Нарушение протокола: active execution plan и activeExecutionSnapshot должны существовать вместе.'
    );
    expect(result.nextRoute).toBe('finalize');
    expect(workerInvocations).toHaveLength(0);
  });
});
