import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { Annotation, BaseCheckpointSaver, END, START, StateGraph, getConfig } from '@langchain/langgraph';
import { catalogAgentGraph, type WorkerRun } from '../../catalog';
import { graphCheckpointer } from '../../shared/checkpointing';
import { extractMessageText, getLastAIMessage, getLastAIMessageText } from '../../shared/messageUtils';
import { addTraceEvent, buildTraceAttributes, formatTraceText, runChainSpan } from '../../../observability/traceContext';
import { telegramMainGraphProgressReporter, type MainGraphProgressReporter } from '../progress';
import { responseAgentNode } from '../nodes/responseAgent.node';
import { delegateCatalogTool } from '../tools/delegateCatalog.tool';

export const mainTools = [delegateCatalogTool];

type CatalogDelegationResult = {
  directResponse: string | null;
  failureWorker: string | null;
  rawText: string;
  status: 'success' | 'failed';
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
    status: 'success',
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
        addTraceEvent('agent.handoff', {
          from_agent: 'main_graph.response_agent',
          to_agent: 'catalog_agent',
          'tool.name': delegateCatalogTool.name,
          status: userRequest ? 'requested' : 'invalid',
        });

        if (!userRequest) {
          const directResponse = 'Не удалось передать запрос в catalog-agent: отсутствует обязательный аргумент userRequest.';

          return {
            messages: [
              new ToolMessage({
                tool_call_id: toolCall.id ?? toolCall.name,
                name: toolCall.name,
                content: 'Не удалось передать задачу в catalog-agent: отсутствует обязательный аргумент "userRequest".',
              }),
              new AIMessage(directResponse),
            ],
            catalogDelegation: {
              directResponse,
              failureWorker: null,
              rawText: 'Не удалось передать задачу в catalog-agent: отсутствует обязательный аргумент "userRequest".',
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
        const rawText = getLastAIMessageText(result.messages) || 'Catalog-agent завершил работу без текстового ответа.';
        const workerRuns = Array.isArray(result.workerRuns) ? result.workerRuns : [];
        const delegationResult = buildCatalogDelegationResult({
          rawText,
          workerRuns,
        });
        addTraceEvent('agent.handoff', {
          from_agent: 'main_graph.response_agent',
          to_agent: 'catalog_agent',
          'tool.name': delegateCatalogTool.name,
          status: delegationResult.status,
          'catalog.worker_runs': workerRuns.length,
          'catalog.failure_worker': delegationResult.failureWorker,
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
  name = 'Основной граф Telegram-бота',
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
      description: 'Основной orchestration-граф Telegram-бота, который делегирует работу по каталогу в подграф catalog-agent.',
    });
}

export const mainGraph = createMainGraph();
