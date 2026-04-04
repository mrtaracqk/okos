import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from '@langchain/core/messages';
import { END, START, StateGraph, getConfig } from '@langchain/langgraph';
import {
  buildCatalogDelegationResultFromCatalogState,
  createCatalogAgentGraph,
  createDefaultCatalogPlanningDeps,
  formatCatalogDelegationUserMessage,
  type CatalogDelegationResult,
} from '../../catalog';
import { extractMessageText, getLastAIMessage, getLastAIMessageText } from '../../shared/messageUtils';
import {
  addTraceEvent,
  buildTraceAttributes,
  formatTraceText,
  runAgentSpan,
  runChainSpan,
} from '../../../observability/traceContext';
import { telegramMainGraphProgressReporter, type MainGraphProgressReporter } from '../progress';
import { parseCatalogDelegationRequest, renderCatalogDelegationRequestToPrompt } from '../catalogDelegation';
import { responseAgentNode } from '../nodes/responseAgent.node';
import { delegateCatalogTool } from '../tools';
import {
  defaultMainGraphCheckpointer,
  MainGraphStateAnnotation,
  type CreateMainGraphOptions,
  type MainGraphState,
} from '../state';

type CreateConfiguredMainGraphOptions = CreateMainGraphOptions & {
  progressReporter?: MainGraphProgressReporter;
};

const catalogAgentGraph = createCatalogAgentGraph(createDefaultCatalogPlanningDeps());

function getMainGraphRuntimeRunId(): string | undefined {
  const threadId = getConfig()?.configurable?.thread_id;
  return typeof threadId === 'string' && threadId.length > 0 ? threadId : undefined;
}

const getMainRoute = async (state: MainGraphState, progressReporter: MainGraphProgressReporter) => {
  const lastMessage = getLastAIMessage(state.messages);
  const hasCatalogDelegation = lastMessage?.tool_calls?.some((toolCall) => toolCall.name === delegateCatalogTool.name);

  if (hasCatalogDelegation) {
    return 'catalogAgent';
  }

  return 'end';
};

function createCatalogAgentNode(progressReporter: MainGraphProgressReporter) {
  return async (state: MainGraphState): Promise<Partial<MainGraphState>> => {
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
          const delegateToolCallId =
            typeof toolCall.id === 'string' && toolCall.id.length > 0
              ? toolCall.id
              : typeof toolCall.name === 'string'
                ? toolCall.name
                : '';

          const failedDelegation: CatalogDelegationResult = { status: 'failed', summary };
          return {
            messages: [
              new ToolMessage({
                tool_call_id: delegateToolCallId,
                name: toolCall.name,
                content: failedDelegation.summary,
              }),
              new AIMessage(formatCatalogDelegationUserMessage(failedDelegation)),
            ],
            catalogDelegation: failedDelegation,
          };
        }

        const runId = getMainGraphRuntimeRunId();
        await progressReporter.onCatalogDelegation({
          chatId: state.chatId,
          runId,
          statusText,
        });

        const prompt = renderCatalogDelegationRequestToPrompt(request);
        const result = await runAgentSpan(
          'catalog_agent.invoke',
          async () =>
            catalogAgentGraph.invoke(
              {
                messages: [new HumanMessage(prompt)],
              },
              getConfig()
            ),
          {
            attributes: buildTraceAttributes({
              'catalog.delegation_prompt_chars': prompt.length,
            }),
            mapResultAttributes: (r) =>
              buildTraceAttributes({
                'catalog.planner_iterations': r.plannerIteration,
                'catalog.worker_runs': Array.isArray(r.workerRuns) ? r.workerRuns.length : 0,
                'catalog.finalize_outcome': r.finalizeOutcome ?? undefined,
                ...(r.fatalErrorMessage
                  ? { 'catalog.fatal_error': formatTraceText(r.fatalErrorMessage, 500) }
                  : {}),
              }),
            statusMessage: (r) => r.fatalErrorMessage ?? undefined,
          }
        );
        const summary = getLastAIMessageText(result.messages) || 'Catalog-agent завершил работу без текстового ответа.';
        const delegationResult = buildCatalogDelegationResultFromCatalogState({
          summary,
          finalizeOutcome: result.finalizeOutcome ?? null,
          workerRuns: Array.isArray(result.workerRuns) ? result.workerRuns : [],
        });
        addTraceEvent('agent.handoff', {
          from_agent: 'catalog_agent',
          to_agent: 'main_graph.response_agent',
          'tool.name': delegateCatalogTool.name,
          status: delegationResult.status,
          'catalog.worker_runs': Array.isArray(result.workerRuns) ? result.workerRuns.length : 0,
        });

        const delegateToolCallId =
          typeof toolCall.id === 'string' && toolCall.id.length > 0
            ? toolCall.id
            : typeof toolCall.name === 'string'
              ? toolCall.name
              : '';

        const userFacingText = formatCatalogDelegationUserMessage(delegationResult);
        const messages: BaseMessage[] = [
          new ToolMessage({
            tool_call_id: delegateToolCallId,
            name: toolCall.name,
            content: delegationResult.summary,
          }),
          new AIMessage(userFacingText),
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

function getPostCatalogRoute(state: MainGraphState) {
  return 'end';
}

export function createMainGraph({
  checkpointer = defaultMainGraphCheckpointer,
  name = 'Основной граф Telegram-бота',
  progressReporter = telegramMainGraphProgressReporter,
}: CreateConfiguredMainGraphOptions = {}) {
  return new StateGraph(MainGraphStateAnnotation)
    .addNode('responseAgent', responseAgentNode)
    .addNode('catalogAgent', createCatalogAgentNode(progressReporter))
    .addNode('end', async () => ({}))
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
