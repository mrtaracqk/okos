import { BaseMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { Annotation, BaseCheckpointSaver, START, StateGraph, getConfig } from '@langchain/langgraph';
import { z } from 'zod';
import { classifierModel } from '../../config';
import { PROMPTS } from '../../prompts';
import { formatSystemLogMultilineValue, formatSystemLogValue, sendSystemLogFromCurrentRun } from '../../services/systemLog';
import { getLastAIMessageText } from '../shared/messageUtils';
import { type ToolRun } from '../shared/toolLoopGraph';
import { getCatalogPlaybookIds, getCatalogPlaybookInstructions, renderPlaybookIndexForPrompt } from './playbooks';
import { attributeWorkerGraph } from './workers/attribute.worker';
import { categoryWorkerGraph } from './workers/category.worker';
import { productWorkerGraph } from './workers/product.worker';
import { variationWorkerGraph } from './workers/variation.worker';

type CatalogWorkerToolName =
  | 'run_category_worker'
  | 'run_attribute_worker'
  | 'run_product_worker'
  | 'run_variation_worker';

export type WorkerRun = {
  agent: CatalogWorkerToolName;
  details?: string;
  status: 'completed' | 'failed' | 'invalid';
  task: string;
  toolRuns?: ToolRun[];
};

const MAX_PLANNER_ITERATIONS = 20;
const workerHandoffDescription = 'This tool is a graph handoff. The surrounding graph routes it to the correct worker.';

const delegateCategoryWorkerTool = tool(
  async () => workerHandoffDescription,
  {
    name: 'run_category_worker',
    description: 'Delegate a category-specific step to the category-worker using only category tools.',
    schema: z.object({
      task: z.string().describe('A precise category task extracted from the user request.'),
      context: z.string().optional().describe('Relevant shared context from previous steps.'),
    }),
  }
);

const delegateAttributeWorkerTool = tool(
  async () => workerHandoffDescription,
  {
    name: 'run_attribute_worker',
    description: 'Delegate an attribute or term step to the attribute-worker using only attribute tools.',
    schema: z.object({
      task: z.string().describe('A precise attribute or term task extracted from the user request.'),
      context: z.string().optional().describe('Relevant shared context from previous steps.'),
    }),
  }
);

const delegateProductWorkerTool = tool(
  async () => workerHandoffDescription,
  {
    name: 'run_product_worker',
    description: 'Delegate a product step to the product-worker using only product tools.',
    schema: z.object({
      task: z.string().describe('A precise product task extracted from the user request.'),
      context: z.string().optional().describe('Relevant shared context from previous steps.'),
    }),
  }
);

const delegateVariationWorkerTool = tool(
  async () => workerHandoffDescription,
  {
    name: 'run_variation_worker',
    description: 'Delegate a variation step to the variation-worker using only variation tools.',
    schema: z.object({
      task: z.string().describe('A precise variation task extracted from the user request.'),
      context: z.string().optional().describe('Relevant shared context from previous steps.'),
    }),
  }
);

const inspectCatalogPlaybookTool = tool(
  async ({ playbookId }: { playbookId: string }) => {
    const instructions = getCatalogPlaybookInstructions(playbookId);

    if (!instructions) {
      return `Unknown playbook "${playbookId}". Available playbooks: ${getCatalogPlaybookIds().join(', ')}`;
    }

    return instructions;
  },
  {
    name: 'inspect_catalog_playbook',
    description: 'Load the full instructions for a specific catalog playbook when you need execution details.',
    schema: z.object({
      playbookId: z.enum(getCatalogPlaybookIds() as [string, ...string[]]).describe('Catalog playbook ID to inspect.'),
    }),
  }
);

const catalogAgentTools = [
  inspectCatalogPlaybookTool,
  delegateCategoryWorkerTool,
  delegateAttributeWorkerTool,
  delegateProductWorkerTool,
  delegateVariationWorkerTool,
];

const workerToolNames = new Set<CatalogWorkerToolName>([
  'run_category_worker',
  'run_attribute_worker',
  'run_product_worker',
  'run_variation_worker',
]);

const CatalogGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  workerRuns: Annotation<WorkerRun[]>({
    reducer: (_, newWorkerRuns) => newWorkerRuns,
    default: () => [],
  }),
});

function buildWorkerInput(task: string, context?: string) {
  return context && context.trim().length > 0 ? `${task}\n\nShared context:\n${context.trim()}` : task;
}

function getWorkerGraph(workerName: CatalogWorkerToolName) {
  switch (workerName) {
    case 'run_category_worker':
      return categoryWorkerGraph;
    case 'run_attribute_worker':
      return attributeWorkerGraph;
    case 'run_product_worker':
      return productWorkerGraph;
    case 'run_variation_worker':
      return variationWorkerGraph;
    default:
      return undefined;
  }
}

function getDeclaredWorkerStatus(workerText: string) {
  const match = workerText.match(/^Status:\s*(success|partial|failed)\b/im);
  return match?.[1]?.toLowerCase() ?? null;
}

function getWorkerFailure(toolRuns: ToolRun[]) {
  for (let index = toolRuns.length - 1; index >= 0; index -= 1) {
    if (toolRuns[index]?.status === 'failed') {
      return toolRuns[index];
    }
  }

  return undefined;
}

function buildNoToolCallFailure(workerName: CatalogWorkerToolName, task: string): ToolRun {
  return {
    toolName: '(no tool call)',
    args: {
      worker: workerName,
      task,
    },
    status: 'failed',
    text: 'Worker returned without calling any WooCommerce tool.',
    structured: null,
    error: {
      source: 'catalog-worker',
      type: 'no_tool_calls',
      message:
        'Worker returned without calling any WooCommerce tool. This failure was produced by the agent layer before any MAG or Woo request was made.',
      retryable: false,
    },
  };
}

function resolveWorkerRunStatus(
  workerText: string,
  toolRuns: ToolRun[],
  hasNoToolCallFailure: boolean
): WorkerRun['status'] {
  const declaredStatus = getDeclaredWorkerStatus(workerText);
  if (declaredStatus === 'failed') {
    return 'failed';
  }

  if (hasNoToolCallFailure) {
    return 'failed';
  }

  if (!declaredStatus && toolRuns[toolRuns.length - 1]?.status === 'failed') {
    return 'failed';
  }

  return 'completed';
}

function formatWorkerFailure(toolRun: ToolRun | undefined) {
  if (!toolRun) {
    return '';
  }

  const lines = [
    `Failure Tool: ${toolRun.toolName}`,
    `Failure Source: ${toolRun.error?.source ?? 'unknown'}`,
    `Failure Message: ${toolRun.error?.message ?? toolRun.text}`,
  ];

  if (toolRun.error?.type) {
    lines.push(`Failure Type: ${toolRun.error.type}`);
  }

  if (toolRun.error?.code) {
    lines.push(`Failure Code: ${toolRun.error.code}`);
  }

  if (typeof toolRun.error?.retryable === 'boolean') {
    lines.push(`Retryable: ${toolRun.error.retryable ? 'yes' : 'no'}`);
  }

  if (Object.keys(toolRun.args).length > 0) {
    lines.push(`Failure Args: ${JSON.stringify(toolRun.args)}`);
  }

  return lines.join('\n');
}

async function executeWorkerHandoff(
  toolCall: any,
  workerRuns: WorkerRun[]
): Promise<{ run: WorkerRun; toolMessage: ToolMessage }> {
  const workerName = toolCall.name as CatalogWorkerToolName;
  const task = typeof toolCall.args?.task === 'string' ? toolCall.args.task.trim() : '';
  const context = typeof toolCall.args?.context === 'string' ? toolCall.args.context : undefined;
  const toolCallId = toolCall.id ?? toolCall.name;

  await sendSystemLogFromCurrentRun({
    lines: [
      `catalog-agent -> ${workerName}`,
      `task: ${formatSystemLogValue(task || '(empty)', 800)}`,
      context ? `context:\n${formatSystemLogMultilineValue(context, 1000)}` : null,
      `previousWorkerRuns: ${workerRuns.length}`,
    ],
  });

  if (!task) {
    const run: WorkerRun = {
      agent: workerName,
      status: 'invalid',
      task: '',
      details: 'Missing required "task" argument.',
    };

    await sendSystemLogFromCurrentRun({
      lines: [
        `catalog-agent -> ${workerName}`,
        'status: invalid',
        'reason: missing required "task" argument',
      ],
    });

    return {
      run,
      toolMessage: new ToolMessage({
        tool_call_id: toolCallId,
        name: toolCall.name,
        content: 'Worker handoff failed: missing required "task" argument.',
      }),
    };
  }

  const workerGraph = getWorkerGraph(workerName);
  if (!workerGraph) {
    const run: WorkerRun = {
      agent: workerName,
      status: 'failed',
      task,
      details: 'Worker graph is not registered.',
    };

    await sendSystemLogFromCurrentRun({
      lines: [
        `catalog-agent -> ${workerName}`,
        'status: failed',
        'reason: worker graph is not registered',
      ],
    });

    return {
      run,
      toolMessage: new ToolMessage({
        tool_call_id: toolCallId,
        name: toolCall.name,
        content: `Worker "${toolCall.name}" is not registered.`,
      }),
    };
  }

  try {
    const result = await workerGraph.invoke(
      {
        messages: [new HumanMessage(buildWorkerInput(task, context))],
      },
      getConfig()
    );

    const workerText = getLastAIMessageText(result.messages) || `${workerName} completed without a text response.`;
    const rawWorkerToolRuns = Array.isArray(result.toolRuns) ? result.toolRuns : [];
    const synthesizedFailure =
      rawWorkerToolRuns.length === 0 ? buildNoToolCallFailure(workerName, task) : undefined;
    const workerToolRuns = synthesizedFailure ? [...rawWorkerToolRuns, synthesizedFailure] : rawWorkerToolRuns;
    const workerFailure = getWorkerFailure(workerToolRuns);
    const runStatus = resolveWorkerRunStatus(workerText, workerToolRuns, Boolean(synthesizedFailure));
    const details =
      runStatus === 'failed' && workerFailure
        ? `${workerText}\n\n${formatWorkerFailure(workerFailure)}`
        : workerText;
    const run: WorkerRun = {
      agent: workerName,
      status: runStatus,
      task,
      details,
      toolRuns: workerToolRuns,
    };

    await sendSystemLogFromCurrentRun({
      lines: [
        `${workerName} -> catalog-agent`,
        `status: ${runStatus}`,
        `toolRuns: ${workerToolRuns.length}`,
        `details:\n${formatSystemLogMultilineValue(details, 1200)}`,
      ],
    });

    return {
      run,
      toolMessage: new ToolMessage({
        tool_call_id: toolCallId,
        name: toolCall.name,
        content: details,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown worker execution error.';
    const run: WorkerRun = {
      agent: workerName,
      status: 'failed',
      task,
      details: message,
    };

    await sendSystemLogFromCurrentRun({
      lines: [
        `${workerName} -> catalog-agent`,
        'status: failed',
        `error: ${formatSystemLogValue(message, 1000)}`,
      ],
    });

    return {
      run,
      toolMessage: new ToolMessage({
        tool_call_id: toolCallId,
        name: toolCall.name,
        content: `Worker "${toolCall.name}" failed: ${message}`,
      }),
    };
  }
}

async function executeCatalogToolCall(
  toolCall: any,
  workerRuns: WorkerRun[]
): Promise<{ run?: WorkerRun; toolMessage: ToolMessage }> {
  if (workerToolNames.has(toolCall.name as CatalogWorkerToolName)) {
    const { run, toolMessage } = await executeWorkerHandoff(toolCall, workerRuns);
    return { run, toolMessage };
  }

  if (toolCall.name === inspectCatalogPlaybookTool.name) {
    const playbookId = typeof toolCall.args?.playbookId === 'string' ? toolCall.args.playbookId.trim() : '';
    const toolCallId = toolCall.id ?? toolCall.name;

    await sendSystemLogFromCurrentRun({
      lines: [
        'catalog-agent -> inspect_catalog_playbook',
        `playbookId: ${formatSystemLogValue(playbookId || '(empty)', 400)}`,
      ],
    });

    if (!playbookId) {
      await sendSystemLogFromCurrentRun({
        lines: [
          'catalog-agent -> inspect_catalog_playbook',
          'status: failed',
          'reason: missing required "playbookId" argument',
        ],
      });

      return {
        toolMessage: new ToolMessage({
          tool_call_id: toolCallId,
          name: toolCall.name,
          content: 'Playbook inspection failed: missing required "playbookId" argument.',
        }),
      };
    }

    const content = await inspectCatalogPlaybookTool.invoke({ playbookId });
    await sendSystemLogFromCurrentRun({
      lines: [
        'inspect_catalog_playbook -> catalog-agent',
        'status: completed',
        `playbookId: ${formatSystemLogValue(playbookId, 400)}`,
      ],
    });

    return {
      toolMessage: new ToolMessage({
        tool_call_id: toolCallId,
        name: toolCall.name,
        content: typeof content === 'string' ? content : JSON.stringify(content),
      }),
    };
  }

  return {
    toolMessage: new ToolMessage({
      tool_call_id: toolCall.id ?? toolCall.name,
      name: toolCall.name,
      content: `Catalog tool "${toolCall.name}" is not registered.`,
    }),
  };
}

const catalogAgentNode = async (
  state: typeof CatalogGraphStateAnnotation.State
): Promise<Partial<typeof CatalogGraphStateAnnotation.State>> => {
  const conversation: BaseMessage[] = [...state.messages];
  const workerRuns: WorkerRun[] = [...state.workerRuns];
  const systemMessage = new SystemMessage(PROMPTS.CATALOG_AGENT.SYSTEM(renderPlaybookIndexForPrompt()));
  const runnableModel = classifierModel.bindTools(catalogAgentTools);

  await sendSystemLogFromCurrentRun({
    lines: [
      'catalog-agent started',
      `input:\n${formatSystemLogMultilineValue(getLastAIMessageText(conversation) || conversation[conversation.length - 1]?.content, 1500)}`,
    ],
  });

  for (let iteration = 0; iteration < MAX_PLANNER_ITERATIONS; iteration += 1) {
    const response = await runnableModel.invoke([systemMessage, ...conversation]);
    conversation.push(response);

    const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];
    await sendSystemLogFromCurrentRun({
      lines: [
        `catalog-agent planner iteration ${iteration + 1}`,
        `toolCalls: ${toolCalls.length}`,
        toolCalls.length > 0
          ? `calls: ${toolCalls
              .map((toolCall) => `${toolCall.name}(${formatSystemLogValue(toolCall.args, 400)})`)
              .join('; ')}`
          : `response:\n${formatSystemLogMultilineValue(getLastAIMessageText([response]), 1000)}`,
      ],
    });

    if (toolCalls.length === 0) {
      return {
        messages: conversation.slice(state.messages.length),
        workerRuns,
      };
    }

    for (const toolCall of toolCalls) {
      const { run, toolMessage } = await executeCatalogToolCall(toolCall, workerRuns);
      if (run) {
        workerRuns.push(run);
      }
      conversation.push(toolMessage);
    }
  }

  conversation.push(
    new HumanMessage('Stop using worker agents. Return the best possible partial result with any missing inputs clearly listed.')
  );

  const fallbackResponse = await runnableModel.invoke([systemMessage, ...conversation]);
  conversation.push(fallbackResponse);
  await sendSystemLogFromCurrentRun({
    lines: [
      'catalog-agent planner limit reached',
      `iterations: ${MAX_PLANNER_ITERATIONS}`,
      `fallbackResponse:\n${formatSystemLogMultilineValue(getLastAIMessageText([fallbackResponse]), 1000)}`,
    ],
  });

  return {
    messages: conversation.slice(state.messages.length),
    workerRuns,
  };
};

function buildCatalogAgentGraph(checkpointer?: BaseCheckpointSaver | boolean, name = 'catalog-agent') {
  return new StateGraph(CatalogGraphStateAnnotation)
    .addNode('catalogForeman', catalogAgentNode)
    .addEdge(START, 'catalogForeman')
    .compile({
      checkpointer,
      name,
      description: 'Catalog foreman agent that plans the job and sequentially calls standalone worker agents.',
    });
}

export const catalogAgentGraph = buildCatalogAgentGraph(true, 'catalog-agent');

const catalogAgentRootGraph = buildCatalogAgentGraph(undefined, 'catalog-agent-root');

export async function runCatalogAgent(userRequest: string): Promise<string> {
  const result = await catalogAgentRootGraph.invoke({
    messages: [new HumanMessage(userRequest)],
  });

  return getLastAIMessageText(result.messages);
}
