import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { PlanningCore } from '../../../../runtime/planning/core';
import { type CatalogExecutionResult } from '../executionResult';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';
import { approveStepTool, finishExecutionPlanTool, newExecutionPlanTool } from './definitions/executionPlanTools';

type PlanningRunContext = {
  runId: string;
  chatId: number;
};

type FakeWorkerResult = {
  toolRuns?: Array<Record<string, unknown>>;
  finalResult?: {
    status: 'completed' | 'failed';
    data: string[];
    missingData: string[];
    note?: string | null;
    blocker?: { kind: string; owner: string; reason: string } | null;
    artifacts?: unknown[];
    summary?: string | null;
  } | null;
  error?: Error;
};

let planningRuntime: PlanningCore;
let planningRunContext: PlanningRunContext | null;
let workerInvocations: Array<{ workerId: string; payload: unknown; config: unknown }>;
let workerResults: Map<string, FakeWorkerResult>;
let executionContext: { activeExecutionResult: CatalogExecutionResult | null };

mock.module('../../specialists/registry', () => ({
  resolveCatalogWorker(workerId: string) {
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
let createDispatchToolsNode: typeof import('../graph/dispatchNode').createDispatchToolsNode;

function getPlanningDeps(): CatalogPlanningDeps {
  return {
    planningRuntime,
    resolveRunContext: () => planningRunContext,
  };
}

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

function syncExecutionContext(result: CatalogExecutionResult | undefined, clearExecutionResult: boolean | undefined) {
  if (clearExecutionResult) {
    executionContext = { activeExecutionResult: null };
    return;
  }

  if (result) {
    executionContext = { activeExecutionResult: result };
  }
}

function parseExecutionToolPayload(content: unknown) {
  return JSON.parse(typeof content === 'string' ? content : JSON.stringify(content)) as CatalogExecutionResult;
}

async function executeToolCall(toolCall: Parameters<typeof executeCatalogToolCall>[1], workerRuns: Parameters<typeof executeCatalogToolCall>[2]) {
  const result = await executeCatalogToolCall(getPlanningDeps(), toolCall, workerRuns, executionContext);
  syncExecutionContext(result.executionResult, result.clearExecutionResult);
  return result;
}

beforeAll(async () => {
  ({ executeCatalogToolCall } = await import('./dispatcher.js'));
  ({ createDispatchToolsNode } = await import('../graph/dispatchNode.js'));
});

beforeEach(() => {
  planningRuntime = new PlanningCore();
  planningRunContext = {
    runId: 'run-1',
    chatId: 101,
  };
  workerInvocations = [];
  workerResults = new Map();
  executionContext = { activeExecutionResult: null };
});

describe('executeCatalogToolCall', () => {
  test('new_execution_plan creates a session, runs the first worker immediately, and returns one JSON execution result', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'completed',
        data: ['product_id=101', 'sku=IP-17'],
        missingData: [],
        note: 'lookup done',
        artifacts: [{ product_id: 101, sku: 'IP-17', payload: { nested: ['a', 'b'] } }],
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
          responseStructure: 'status, data, missingData, summary',
        },
        {
          taskId: 'task-2',
          responsible: 'variation-worker',
          task: 'Проверить вариации товара',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, data, missingData, summary',
        },
      ]),
      []
    );

    const payload = parseExecutionToolPayload(result.toolMessage.content);

    expect(result.run?.status).toBe('completed');
    expect(result.executionResult).toEqual(payload);
    expect(result.toolMessage.additional_kwargs).toEqual(payload);
    expect(payload.phase).toBe('new_execution_plan');
    expect(payload.executionSessionId).toBeTruthy();
    expect(payload.plan.status).toBe('active');
    expect(payload.plan.tasks.map((task) => task.status)).toEqual(['completed', 'pending']);
    expect(payload.plan_update).toEqual({
      type: 'created',
      summary: 'План создан.',
    });
    expect(payload.completed_step).toEqual({
      taskId: 'task-1',
      title: 'Найти товар по SKU',
      owner: 'product-worker',
      status: 'completed',
      summary: 'Шаг "Найти товар по SKU" завершён.',
      worker_result: {
        status: 'completed',
        data: ['product_id=101', 'sku=IP-17'],
        missingData: [],
        note: 'lookup done',
        artifacts: [{ product_id: 101, sku: 'IP-17', payload: { nested: ['a', 'b'] } }],
        summary: 'Товар найден и подтвержден.',
      },
    });
    expect(payload.next_step).toEqual({
      tool: 'approve_step',
      reason_code: 'ready_for_next_pending_step',
      task: {
        taskId: 'task-2',
        title: 'Проверить вариации товара',
        owner: 'variation-worker',
        status: 'pending',
      },
      summary: 'Следующий шаг: выполнить "Проверить вариации товара" через approve_step.',
    });
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
          expectedOutput: 'status, data, missingData, summary',
          contextNotes: 'Сначала нужен lookup',
        },
      },
    });

    const activePlan = planningRuntime.getActivePlan('run-1');
    expect(activePlan?.tasks.map((task) => task.status)).toEqual(['completed', 'pending']);
    expect(activePlan?.nextStepArtifacts).toEqual([{ product_id: 101, sku: 'IP-17', payload: { nested: ['a', 'b'] } }]);
  });

  test('approve_step keeps the same executionSessionId and increments revision from activeExecutionResult', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'completed',
        data: ['product_id=101'],
        missingData: [],
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
          responseStructure: 'status, data',
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
          responseStructure: 'status, data, missingData',
        },
        {
          taskId: 'task-3',
          responsible: 'category-worker',
          task: 'Проверить категории товара',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, data, missingData',
        },
      ]),
      []
    );

    workerResults.set('variation-worker', {
      finalResult: {
        status: 'completed',
        data: ['variation_id=201'],
        missingData: [],
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

    const payload = parseExecutionToolPayload(result.toolMessage.content);

    expect(result.run?.status).toBe('completed');
    expect(payload.phase).toBe('approve_step');
    expect(payload.plan_update).toBeNull();
    expect(payload.executionSessionId).toBe(first.executionResult?.executionSessionId ?? '');
    expect(payload.completed_step.title).toBe('Проверить вариации');
    expect(payload.completed_step).not.toHaveProperty('highlights');
    expect(payload.next_step.tool).toBe('approve_step');
    expect(payload.next_step.task?.title).toBe('Проверить категории товара');
    expect(payload.next_step.summary).toBe('Следующий шаг: выполнить "Проверить категории товара" через approve_step.');
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
          expectedOutput: 'status, data, missingData',
          contextNotes: 'Нужна точная карточка вариаций',
        },
        upstreamArtifacts: [{ product_id: 101 }],
      },
    });

    const activePlan = planningRuntime.getActivePlan('run-1');
    expect(activePlan?.tasks.map((task) => task.status)).toEqual(['completed', 'completed', 'pending']);
    expect(activePlan?.nextStepArtifacts).toBeUndefined();
  });

  test('new_execution_plan replaces the plan and returns plan_update=replaced with a new execution session', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'completed',
        data: ['product_id=101'],
        missingData: [],
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
          responseStructure: 'status, data',
        },
        {
          taskId: 'task-2',
          responsible: 'variation-worker',
          task: 'Проверить вариации',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, data, missingData',
        },
      ]),
      []
    );

    expect(planningRuntime.getActivePlan('run-1')?.nextStepArtifacts).toEqual([{ product_id: 101 }]);

    workerResults.set('variation-worker', {
      finalResult: {
        status: 'completed',
        data: ['variation_id=201'],
        missingData: [],
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
              responseStructure: 'status, data, missingData',
            },
          ],
        },
      },
      []
    );

    const payload = parseExecutionToolPayload(result.toolMessage.content);

    expect(result.run?.status).toBe('completed');
    expect(payload.plan_update).toEqual({
      type: 'replaced',
      summary: 'План заменён.',
    });
    expect(payload.executionSessionId).toBeTruthy();
    expect(payload.executionSessionId).not.toBe(first.executionResult?.executionSessionId ?? '');
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
          expectedOutput: 'status, data, missingData',
          contextNotes: undefined,
        },
      },
    });
    expect(planningRuntime.getActivePlan('run-1')?.nextStepArtifacts).toBeUndefined();
  });

  test('blocker result routes planner to new_execution_plan through next_step.tool', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'failed',
        data: [],
        missingData: ['approved_category_id'],
        blocker: {
          kind: 'wrong_owner',
          owner: 'category-worker',
          reason: 'Сначала нужен category-worker.',
        },
        summary: 'Нужен другой owner.',
      },
    });

    const result = await executeToolCall(
      buildNewExecutionPlanCall([
        {
          taskId: 'task-1',
          responsible: 'product-worker',
          task: 'Подготовить карточку товара',
          inputData: {
            facts: ['sku=IP-17'],
            constraints: [],
          },
          responseStructure: 'status, data, missingData, blocker',
        },
        {
          taskId: 'task-2',
          responsible: 'variation-worker',
          task: 'Проверить вариации',
          inputData: {
            facts: ['product_id=101'],
            constraints: ['read-only'],
          },
          responseStructure: 'status, data',
        },
      ]),
      []
    );

    const payload = parseExecutionToolPayload(result.toolMessage.content);

    expect(payload.plan.status).toBe('failed');
    expect(payload.completed_step).not.toHaveProperty('highlights');
    expect(payload.next_step).toEqual({
      tool: 'new_execution_plan',
      reason_code: 'worker_blocker_requires_plan_rebuild',
      task: null,
      summary: 'Следующий шаг: пересобрать план через new_execution_plan.',
    });
  });

  test('failed result without pending steps routes planner to finish_execution_plan', async () => {
    workerResults.set('product-worker', {
      finalResult: {
        status: 'failed',
        data: [],
        missingData: ['sku'],
        summary: 'Недостаточно данных.',
      },
    });

    const result = await executeToolCall(
      buildNewExecutionPlanCall([
        {
          taskId: 'task-1',
          responsible: 'product-worker',
          task: 'Найти товар',
          inputData: {
            facts: [],
            constraints: [],
          },
          responseStructure: 'status, data, missingData',
        },
      ]),
      []
    );

    const payload = parseExecutionToolPayload(result.toolMessage.content);

    expect(payload.plan.status).toBe('failed');
    expect(payload.completed_step).not.toHaveProperty('highlights');
    expect(payload.next_step.tool).toBe('finish_execution_plan');
    expect(payload.next_step.reason_code).toBe('plan_has_no_pending_steps');
    expect(payload.next_step.task).toBeNull();
    expect(payload.next_step.summary).toBe('Следующий шаг: завершить выполнение через finish_execution_plan.');
  });

  test('missing report_worker_result returns a deterministic protocol error without inventing a summary', async () => {
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
          responseStructure: 'status, data',
        },
      ]),
      []
    );

    const payload = parseExecutionToolPayload(result.toolMessage.content);

    expect(result.run?.status).toBe('failed');
    expect(result.run?.errorSummary).toContain('report_worker_result');
    expect(payload.plan.status).toBe('failed');
    expect(payload.completed_step.worker_result).toBeNull();
    expect(payload.completed_step.protocol_error).toEqual({
      code: 'missing_report_worker_result',
      message:
        'Протокол воркера нарушен: "product-worker" завершил работу без финального report_worker_result. Используй этот текст только как промежуточный сигнал и при необходимости перепоручи следующий шаг явно.',
    });
    expect(payload.completed_step).not.toHaveProperty('highlights');
    expect(payload.next_step.tool).toBe('finish_execution_plan');
    expect(planningRuntime.getActivePlan('run-1')?.tasks[0]?.status).toBe('failed');
  });

  test('finish_execution_plan clears active execution result state', async () => {
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
      activeExecutionResult: {
        phase: 'new_execution_plan',
        executionSessionId: 'exec-1',
        plan: {
          status: 'completed',
          tasks: [{ taskId: 'task-1', title: 'Готовый шаг', owner: 'product-worker', status: 'completed' }],
        },
        plan_update: {
          type: 'created',
          summary: 'План создан.',
        },
        completed_step: {
          taskId: 'task-1',
          title: 'Готовый шаг',
          owner: 'product-worker',
          status: 'completed',
          summary: 'Шаг "Готовый шаг" завершён.',
          worker_result: {
            status: 'completed',
            data: ['ok'],
            missingData: [],
            note: null,
          },
        },
        next_step: {
          tool: 'finish_execution_plan',
          reason_code: 'plan_has_no_pending_steps',
          task: null,
          summary: 'Следующий шаг: завершить выполнение через finish_execution_plan.',
        },
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
    expect(result.clearExecutionResult).toBe(true);
    expect(executionContext).toEqual({ activeExecutionResult: null });
    expect(planningRuntime.getActivePlan('run-1')).toBeNull();
    expect(planningRuntime.getPlan('run-1')?.status).toBe('completed');
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

  test('dispatchToolsNode fatally fails when active plan exists without activeExecutionResult', async () => {
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
            expectedOutput: 'status, data',
          },
        },
      ],
    });

    const dispatchToolsNode = createDispatchToolsNode(getPlanningDeps());
    const result = await dispatchToolsNode({
      messages: [],
      workerRuns: [],
      activeExecutionResult: null,
      plannerIteration: 1,
      pendingToolCalls: [{ id: 'tool-call-2', name: approveStepTool.name, args: {} }],
      nextRoute: 'dispatchTools',
      finalizeOutcome: null,
      fatalErrorMessage: null,
    });

    expect(result.messages).toEqual([]);
    expect(result.activeExecutionResult).toBeNull();
    expect(result.fatalErrorMessage).toBe(
      'Нарушение протокола: active execution plan и activeExecutionResult должны существовать вместе.'
    );
    expect(result.nextRoute).toBe('finalize');
    expect(workerInvocations).toHaveLength(0);
  });
});
