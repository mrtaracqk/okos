import { BaseMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { Annotation, BaseCheckpointSaver, START, StateGraph, getConfig } from '@langchain/langgraph';
import { z } from 'zod';
import { classifierModel } from '../../config';
import { PROMPTS } from '../../prompts';
import { getLastAIMessageText } from '../shared/messageUtils';
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

type WorkerRun = {
  agent: CatalogWorkerToolName;
  details?: string;
  status: 'completed' | 'failed' | 'invalid';
  task: string;
};

const MAX_PLANNER_ITERATIONS = 8;
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

async function executeWorkerHandoff(
  toolCall: any,
  workerRuns: WorkerRun[]
): Promise<{ run: WorkerRun; toolMessage: ToolMessage }> {
  const workerName = toolCall.name as CatalogWorkerToolName;
  const task = typeof toolCall.args?.task === 'string' ? toolCall.args.task.trim() : '';
  const context = typeof toolCall.args?.context === 'string' ? toolCall.args.context : undefined;
  const toolCallId = toolCall.id ?? toolCall.name;

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
    const result = await workerGraph.invoke(
      {
        messages: [new HumanMessage(buildWorkerInput(task, context))],
      },
      getConfig()
    );

    const workerText = getLastAIMessageText(result.messages) || `${workerName} completed without a text response.`;
    const run: WorkerRun = {
      agent: workerName,
      status: 'completed',
      task,
      details: workerText,
    };

    return {
      run,
      toolMessage: new ToolMessage({
        tool_call_id: toolCallId,
        name: toolCall.name,
        content: workerText,
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

  for (let iteration = 0; iteration < MAX_PLANNER_ITERATIONS; iteration += 1) {
    const response = await runnableModel.invoke([systemMessage, ...conversation]);
    conversation.push(response);

    const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];
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
