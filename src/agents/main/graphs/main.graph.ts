import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { Annotation, BaseCheckpointSaver, END, START, StateGraph, getConfig } from '@langchain/langgraph';
import { catalogAgentGraph, type WorkerRun } from '../../catalog/catalog.agent';
import { graphCheckpointer } from '../../shared/checkpointing';
import { extractMessageText, getLastAIMessage, getLastAIMessageText } from '../../shared/messageUtils';
import { formatSystemLogMultilineValue, sendSystemLog } from '../../../services/systemLog';
import { telegramMainGraphProgressReporter, type MainGraphProgressReporter } from '../progress';
import { responseAgentNode } from '../nodes/responseAgent.node';
import { delegateCatalogTool } from '../tools/delegateCatalog.tool';

export const mainTools = [delegateCatalogTool];

type CatalogDelegationResult = {
  directResponse: string | null;
  failureWorker: string | null;
  rawText: string;
  status: 'success' | 'partial' | 'failed';
};

export const MainGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  chatId: Annotation<number>(),
  catalogDelegation: Annotation<CatalogDelegationResult | null>({
    reducer: (_oldValue, newValue) => newValue,
    default: () => null,
  }),
});

type CreateMainGraphOptions = {
  checkpointer?: BaseCheckpointSaver | boolean;
  name?: string;
  progressReporter?: MainGraphProgressReporter;
};

const getMainRoute = async (state: typeof MainGraphStateAnnotation.State, progressReporter: MainGraphProgressReporter) => {
  const lastMessage = getLastAIMessage(state.messages);
  const hasCatalogDelegation = lastMessage?.tool_calls?.some((toolCall) => toolCall.name === delegateCatalogTool.name);

  if (hasCatalogDelegation) {
    return 'catalogAgent';
  }

  return 'end';
};

function getCatalogDeclaredStatus(text: string) {
  const match = text.match(/^Status:\s*(ready|partial)\b/im);
  return match?.[1]?.toLowerCase() ?? null;
}

function formatWorkerName(workerName: WorkerRun['agent']) {
  return workerName.replace(/^run_/, '').replace(/_/g, '-');
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

function buildCatalogFailureMessage(rawText: string, failedWorker: WorkerRun) {
  const sections = [
    'Не удалось выполнить запрос к каталогу.',
    `Сбой на шаге ${formatWorkerName(failedWorker.agent)}.`,
  ];

  if (failedWorker.details?.trim()) {
    sections.push(failedWorker.details.trim());
  } else if (rawText.trim()) {
    sections.push(rawText.trim());
  }

  return sections.join('\n\n');
}

function buildCatalogDelegationResult(input: { rawText: string; workerRuns: WorkerRun[] }): CatalogDelegationResult {
  const failedWorker = getLastFailedWorker(input.workerRuns);
  if (failedWorker) {
    return {
      status: 'failed',
      rawText: input.rawText,
      failureWorker: formatWorkerName(failedWorker.agent),
      directResponse: buildCatalogFailureMessage(input.rawText, failedWorker),
    };
  }

  return {
    status: getCatalogDeclaredStatus(input.rawText) === 'partial' ? 'partial' : 'success',
    rawText: input.rawText,
    failureWorker: null,
    directResponse: null,
  };
}

function createCatalogAgentNode(progressReporter: MainGraphProgressReporter) {
  return async (state: typeof MainGraphStateAnnotation.State): Promise<Partial<typeof MainGraphStateAnnotation.State>> => {
    const lastMessage = getLastAIMessage(state.messages);
    const toolCall = lastMessage?.tool_calls?.find((candidate) => candidate.name === delegateCatalogTool.name);

    if (!lastMessage || !toolCall) {
      return {};
    }

    const statusText = extractMessageText(lastMessage.content).trim() || undefined;
    const userRequest = typeof toolCall.args?.userRequest === 'string' ? toolCall.args.userRequest.trim() : '';

    if (!userRequest) {
      const directResponse = 'Не удалось передать запрос в catalog-agent: отсутствует обязательный аргумент userRequest.';
      await sendSystemLog(state.chatId, {
        lines: [
          'main-agent -> catalog-agent',
          `tool: ${toolCall.name}`,
          'status: failed',
          'reason: missing required "userRequest" argument',
        ],
      });

      return {
        messages: [
          new ToolMessage({
            tool_call_id: toolCall.id ?? toolCall.name,
            name: toolCall.name,
            content: 'Catalog handoff failed: missing required "userRequest" argument.',
          }),
          new AIMessage(directResponse),
        ],
        catalogDelegation: {
          directResponse,
          failureWorker: null,
          rawText: 'Catalog handoff failed: missing required "userRequest" argument.',
          status: 'failed',
        },
      };
    }

    await progressReporter.onCatalogDelegation({
      chatId: state.chatId,
      statusText,
    });
    await sendSystemLog(state.chatId, {
      lines: [
        'main-agent -> catalog-agent',
        `tool: ${toolCall.name}`,
        statusText ? `statusText: ${formatSystemLogMultilineValue(statusText, 500)}` : null,
        `userRequest:\n${formatSystemLogMultilineValue(userRequest, 1500)}`,
      ],
    });

    const result = await catalogAgentGraph.invoke(
      {
        messages: [new HumanMessage(userRequest)],
      },
      getConfig()
    );
    const rawText = getLastAIMessageText(result.messages) || 'Catalog agent completed without a text response.';
    const workerRuns = Array.isArray(result.workerRuns) ? result.workerRuns : [];
    const delegationResult = buildCatalogDelegationResult({
      rawText,
      workerRuns,
    });
    await sendSystemLog(state.chatId, {
      lines: [
        'catalog-agent -> main-agent',
        `status: ${delegationResult.status}`,
        delegationResult.failureWorker ? `failureWorker: ${delegationResult.failureWorker}` : null,
        `workerRuns: ${workerRuns.length}`,
        `response:\n${formatSystemLogMultilineValue(rawText, 1500)}`,
      ],
    });

    const messages: BaseMessage[] = [
      new ToolMessage({
        tool_call_id: toolCall.id ?? toolCall.name,
        name: delegateCatalogTool.name,
        content: rawText,
      }),
    ];

    if (delegationResult.directResponse) {
      messages.push(new AIMessage(delegationResult.directResponse));
    }

    return {
      messages,
      catalogDelegation: delegationResult,
    };
  };
}

function getPostCatalogRoute(state: typeof MainGraphStateAnnotation.State) {
  return state.catalogDelegation?.directResponse ? 'end' : 'responseAgent';
}

export function createMainGraph({
  checkpointer = graphCheckpointer,
  name = 'Main Telegram Bot Graph',
  progressReporter = telegramMainGraphProgressReporter,
}: CreateMainGraphOptions = {}) {
  return new StateGraph(MainGraphStateAnnotation)
    .addNode('responseAgent', responseAgentNode)
    .addNode('catalogAgent', createCatalogAgentNode(progressReporter))
    .addNode('end', async (state) => {
      await progressReporter.onRunComplete({ chatId: state.chatId });
      return {};
    })
    .addEdge(START, 'responseAgent')
    .addConditionalEdges('responseAgent', (state) => getMainRoute(state, progressReporter), {
      catalogAgent: 'catalogAgent',
      end: 'end',
    })
    .addConditionalEdges('catalogAgent', getPostCatalogRoute, {
      responseAgent: 'responseAgent',
      end: 'end',
    })
    .addEdge('end', END)
    .compile({
      checkpointer,
      name,
      description: 'Main Telegram orchestration graph that delegates catalog work to the catalog-agent subgraph.',
    });
}

export const mainGraph = createMainGraph();
