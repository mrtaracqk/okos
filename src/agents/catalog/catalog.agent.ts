import { BaseMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { Annotation, BaseCheckpointSaver, START, StateGraph, getConfig } from '@langchain/langgraph';
import { z } from 'zod';
import { classifierModel } from '../../config';
import { buildTraceAttributes, formatTraceText, formatTraceValue, runAgentSpan, runChainSpan, runToolSpan, summarizeToolCallNames } from '../../observability/traceContext';
import { PROMPTS } from '../../prompts';
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

function getLastFailedWorker(workerRuns: WorkerRun[]) {
  for (let index = workerRuns.length - 1; index >= 0; index -= 1) {
    const workerRun = workerRuns[index];
    if (workerRun?.status === 'failed' || workerRun?.status === 'invalid') {
      return workerRun;
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

  return runAgentSpan(
    'catalog_agent.worker_handoff',
    async () => {
      if (!task) {
        const run: WorkerRun = {
          agent: workerName,
          status: 'invalid',
          task: '',
          details: 'Missing required "task" argument.',
        };

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
        const result = await runAgentSpan(
          `worker.${workerName}`,
          async () =>
            workerGraph.invoke(
              {
                messages: [new HumanMessage(buildWorkerInput(task, context))],
              },
              getConfig()
            ),
          {
            attributes: buildTraceAttributes({
              'catalog.worker_name': workerName,
              'catalog.task': formatTraceValue(task, 800),
              'catalog.context': context ? formatTraceText(context, 1000) : undefined,
            }),
          }
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

        return {
          run,
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: `Worker "${toolCall.name}" failed: ${message}`,
          }),
        };
      }
    },
    {
      attributes: buildTraceAttributes({
        'catalog.worker_name': workerName,
        'catalog.previous_worker_runs': workerRuns.length,
        'catalog.task': formatTraceValue(task || '(empty)', 800),
        'catalog.context': context ? formatTraceText(context, 1000) : undefined,
      }),
      mapResultAttributes: ({ run }) =>
        buildTraceAttributes({
          'catalog.status': run.status,
          'catalog.worker_name': run.agent,
          'catalog.tool_runs': run.toolRuns?.length,
          'output.value': run.details ? formatTraceText(run.details, 1200) : undefined,
        }),
      statusMessage: ({ run }) =>
        run.status === 'failed' || run.status === 'invalid' ? run.details || `worker handoff ${run.status}` : undefined,
    }
  );
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

    return runToolSpan(
      'catalog_agent.inspect_playbook',
      async () => {
        if (!playbookId) {
          return {
            toolMessage: new ToolMessage({
              tool_call_id: toolCallId,
              name: toolCall.name,
              content: 'Playbook inspection failed: missing required "playbookId" argument.',
            }),
          };
        }

        const content = await inspectCatalogPlaybookTool.invoke({ playbookId });

        return {
          toolMessage: new ToolMessage({
            tool_call_id: toolCallId,
            name: toolCall.name,
            content: typeof content === 'string' ? content : JSON.stringify(content),
          }),
        };
      },
      {
        attributes: buildTraceAttributes({
          'catalog.playbook_id': playbookId || '(empty)',
        }),
        mapResultAttributes: ({ toolMessage }) =>
          buildTraceAttributes({
            'output.value': formatTraceText(toolMessage.content, 1000),
          }),
        statusMessage: () => (!playbookId ? 'missing required "playbookId" argument' : undefined),
      }
    );
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
  return runAgentSpan(
    'catalog_agent.invoke',
    async () => {
      const conversation: BaseMessage[] = [...state.messages];
      const workerRuns: WorkerRun[] = [...state.workerRuns];
      const systemMessage = new SystemMessage(PROMPTS.CATALOG_AGENT.SYSTEM(renderPlaybookIndexForPrompt()));
      const runnableModel = classifierModel.bindTools(catalogAgentTools);

      for (let iteration = 0; iteration < MAX_PLANNER_ITERATIONS; iteration += 1) {
        const iterationResult = await runChainSpan(
          'catalog_agent.planner_iteration',
          async () => {
            const response = await runnableModel.invoke([systemMessage, ...conversation]);
            const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];

            return {
              response,
              toolCalls,
            };
          },
          {
            attributes: buildTraceAttributes({
              'catalog.iteration': iteration + 1,
              'catalog.worker_runs': workerRuns.length,
            }),
            mapResultAttributes: ({ response, toolCalls }) =>
              buildTraceAttributes({
                'catalog.iteration': iteration + 1,
                'catalog.tool_call_count': toolCalls.length,
                'catalog.tool_call_names': summarizeToolCallNames(toolCalls),
                'output.value': toolCalls.length === 0 ? formatTraceText(getLastAIMessageText([response]), 1000) : undefined,
              }),
          }
        );

        conversation.push(iterationResult.response);

        if (iterationResult.toolCalls.length === 0) {
          return {
            messages: conversation.slice(state.messages.length),
            workerRuns,
          };
        }

        for (const toolCall of iterationResult.toolCalls) {
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

      const fallbackResponse = await runChainSpan(
        'catalog_agent.planner_iteration',
        async () => runnableModel.invoke([systemMessage, ...conversation]),
        {
          attributes: buildTraceAttributes({
            'catalog.iteration': MAX_PLANNER_ITERATIONS + 1,
            'catalog.status': 'planner_limit_reached',
          }),
          mapResultAttributes: (response) =>
            buildTraceAttributes({
              'output.value': formatTraceText(getLastAIMessageText([response]), 1000),
            }),
          statusMessage: () => 'planner iteration limit reached',
        }
      );
      conversation.push(fallbackResponse);

      return {
        messages: conversation.slice(state.messages.length),
        workerRuns,
      };
    },
    {
      attributes: buildTraceAttributes({
        'catalog.input': formatTraceText(
          getLastAIMessageText(state.messages) || state.messages[state.messages.length - 1]?.content,
          1500
        ),
      }),
      mapResultAttributes: (result) =>
        buildTraceAttributes({
          'catalog.worker_runs': result.workerRuns.length,
          'catalog.failure_worker': getLastFailedWorker(result.workerRuns)?.agent,
        }),
      statusMessage: (result) => {
        const failedWorker = getLastFailedWorker(result.workerRuns);
        return failedWorker ? `catalog worker failed: ${failedWorker.agent}` : undefined;
      },
    }
  );
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
