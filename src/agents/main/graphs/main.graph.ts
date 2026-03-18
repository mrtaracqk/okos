import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { Annotation, BaseCheckpointSaver, END, START, StateGraph, getConfig } from '@langchain/langgraph';
import { buildCatalogDelegationResultFromCatalogState, catalogAgentGraph, type CatalogDelegationResult } from '../../catalog';
import { graphCheckpointer } from '../../shared/checkpointing';
import { extractMessageText, getLastAIMessage, getLastAIMessageText } from '../../shared/messageUtils';
import { addTraceEvent, buildTraceAttributes, formatTraceText, runChainSpan } from '../../../observability/traceContext';
import { telegramMainGraphProgressReporter, type MainGraphProgressReporter } from '../progress';
import { parseCatalogDelegationRequest, renderCatalogDelegationRequestToPrompt } from '../catalogDelegation';
import { responseAgentNode } from '../nodes/responseAgent.node';
import { delegateCatalogTool } from '../tools/delegateCatalog.tool';

export const mainTools = [delegateCatalogTool];

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
        const request = parseCatalogDelegationRequest(toolCall.args);
        addTraceEvent('agent.handoff', {
          from_agent: 'main_graph.response_agent',
          to_agent: 'catalog_agent',
          'tool.name': delegateCatalogTool.name,
          status: request ? 'requested' : 'invalid',
        });

        if (!request) {
          const summary =
            'Не удалось передать запрос в catalog-agent: укажи цель (goal) и желаемый результат (desiredOutcome).';

          return {
            messages: [
              new ToolMessage({
                tool_call_id: toolCall.id ?? toolCall.name,
                name: toolCall.name,
                content: summary,
              }),
              new AIMessage(summary),
            ],
            catalogDelegation: {
              status: 'failed',
              summary,
            },
          };
        }

        await progressReporter.onCatalogDelegation({
          chatId: state.chatId,
          statusText,
        });

        const prompt = renderCatalogDelegationRequestToPrompt(request);
        const result = await catalogAgentGraph.invoke(
          {
            messages: [new HumanMessage(prompt)],
          },
          getConfig()
        );
        const summary = getLastAIMessageText(result.messages) || 'Catalog-agent завершил работу без текстового ответа.';
        const delegationResult = buildCatalogDelegationResultFromCatalogState({
          summary,
          workerRuns: Array.isArray(result.workerRuns) ? result.workerRuns : [],
        });
        addTraceEvent('agent.handoff', {
          from_agent: 'main_graph.response_agent',
          to_agent: 'catalog_agent',
          'tool.name': delegateCatalogTool.name,
          status: delegationResult.status,
          'catalog.worker_runs': Array.isArray(result.workerRuns) ? result.workerRuns.length : 0,
        });

        const messages: BaseMessage[] = [
          new ToolMessage({
            tool_call_id: toolCall.id ?? toolCall.name,
            name: toolCall.name,
            content: delegationResult.summary,
          }),
          new AIMessage(delegationResult.summary),
        ];

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
            (() => {
              const req = parseCatalogDelegationRequest(
                getLastAIMessage(state.messages)?.tool_calls?.find((c) => c.name === delegateCatalogTool.name)?.args
              );
              return req ? req.goal : '';
            })(),
            1500
          ),
        }),
        mapResultAttributes: (result) =>
          buildTraceAttributes({
            'catalog.status': result.catalogDelegation?.status,
            'output.value': result.catalogDelegation?.summary
              ? formatTraceText(result.catalogDelegation.summary, 1500)
              : undefined,
          }),
        statusMessage: (result) =>
          result.catalogDelegation?.status === 'failed' ? 'catalog handoff failed' : undefined,
      }
    );
  };
}

function getPostCatalogRoute(state: typeof MainGraphStateAnnotation.State) {
  return 'end';
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
