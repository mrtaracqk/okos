import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { Annotation, BaseCheckpointSaver, END, START, StateGraph, getConfig } from '@langchain/langgraph';
import { catalogAgentGraph, type WorkerRun } from '../../catalog/catalog.agent';
import { graphCheckpointer } from '../../shared/checkpointing';
import { extractMessageText, getLastAIMessage, getLastAIMessageText } from '../../shared/messageUtils';
import { buildTraceAttributes, formatTraceText, runChainSpan } from '../../../observability/traceContext';
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
    return runChainSpan(
      'main_graph.catalog_agent_handoff',
      async () => {
        const lastMessage = getLastAIMessage(state.messages);
        const toolCall = lastMessage?.tool_calls?.find((candidate) => candidate.name === delegateCatalogTool.name);

        if (!lastMessage || !toolCall) {
          return {};
        }

        const statusText = extractMessageText(lastMessage.content).trim() || undefined;
        const userRequest = typeof toolCall.args?.userRequest === 'string' ? toolCall.args.userRequest.trim() : '';

        if (!userRequest) {
          const directResponse = 'Не удалось передать запрос в catalog-agent: отсутствует обязательный аргумент userRequest.';

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
            } satisfies CatalogDelegationResult,
          };
        }

        await progressReporter.onCatalogDelegation({
          chatId: state.chatId,
          statusText,
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
      },
      {
        attributes: buildTraceAttributes({
          'telegram.chat_id': state.chatId,
          'tool.name': delegateCatalogTool.name,
          'catalog.status_text': formatTraceText(extractMessageText(getLastAIMessage(state.messages)?.content).trim() || '', 500),
          'catalog.user_request': formatTraceText(
            typeof getLastAIMessage(state.messages)?.tool_calls?.find((candidate) => candidate.name === delegateCatalogTool.name)?.args
              ?.userRequest === 'string'
              ? getLastAIMessage(state.messages)?.tool_calls?.find((candidate) => candidate.name === delegateCatalogTool.name)?.args
                  ?.userRequest
              : '',
            1500
          ),
        }),
        mapResultAttributes: (result) =>
          buildTraceAttributes({
            'catalog.status': result.catalogDelegation?.status,
            'catalog.failure_worker': result.catalogDelegation?.failureWorker,
            'catalog.direct_response': result.catalogDelegation?.directResponse
              ? formatTraceText(result.catalogDelegation.directResponse, 1000)
              : undefined,
            'output.value': result.catalogDelegation?.rawText
              ? formatTraceText(result.catalogDelegation.rawText, 1500)
              : undefined,
          }),
        statusMessage: (result) =>
          result.catalogDelegation?.status === 'failed'
            ? result.catalogDelegation.failureWorker
              ? `catalog worker failed: ${result.catalogDelegation.failureWorker}`
              : 'catalog handoff failed'
            : undefined,
      }
    );
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
