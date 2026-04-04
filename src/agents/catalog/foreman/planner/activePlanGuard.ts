import { AIMessage, BaseMessage, SystemMessage } from '@langchain/core/messages';
import {
  addTraceEvent,
  buildTraceAttributes,
  runLlmSpan,
  summarizeToolCallNames,
} from '../../../../observability/traceContext';
import { getPlanningRuntime } from '../../../../runtime/planning';
import { getCatalogAgentRuntimeRunId } from '../runtimePlan/runtimePlanService';

function buildActivePlanCorrectionMessage(activePlanSummary: string) {
  return new SystemMessage(
    [
      'Execution plan всё ещё активен. Нельзя завершать задачу свободным текстом, пока активный план не закрыт.',
      'Сделай один из следующих шагов:',
      '- вызови `approve_step` (runtime запустит следующую pending подзадачу)',
      '- или пересобери план через `new_execution_plan([...])`, если нужны другие входные данные для хвоста',
      '- или закрой план через `finish_execution_plan(outcome=completed|failed, summary=...)`; runtime сразу завершит граф этим итогом',
      'Текущий активный план:',
      activePlanSummary,
    ].join('\n')
  );
}

export function formatActivePlanTaskSummary(runId: string): string | null {
  const activePlan = getPlanningRuntime().getActivePlan(runId);
  if (!activePlan) {
    return null;
  }

  const taskLines = activePlan.tasks.map(
    (task) => `- ${task.taskId}: ${task.title} [owner=${task.owner}, status=${task.status}]${task.notes ? ` (${task.notes})` : ''}`
  );

  return taskLines.join('\n');
}

type PlannerRunnableModel = {
  invoke(messages: BaseMessage[]): Promise<AIMessage>;
};

export async function applyActivePlanGuard(params: {
  iteration: number;
  workerRunsCount: number;
  promptPrefixMessages: BaseMessage[];
  stateMessages: BaseMessage[];
  response: AIMessage;
  runnableModel: PlannerRunnableModel;
}): Promise<{
  messages: BaseMessage[];
  response: AIMessage;
  toolCalls: AIMessage['tool_calls'];
  activePlanSummaryStillOpen: string | null;
}> {
  const { iteration, workerRunsCount, promptPrefixMessages, stateMessages, response, runnableModel } = params;
  const toolCalls = Array.isArray(response.tool_calls) ? response.tool_calls : [];
  const runId = getCatalogAgentRuntimeRunId();
  const activePlanSummary = runId ? formatActivePlanTaskSummary(runId) : null;

  if (toolCalls.length > 0 || !activePlanSummary) {
    return {
      messages: [response],
      response,
      toolCalls,
      activePlanSummaryStillOpen: activePlanSummary,
    };
  }

  const correctionMessage = buildActivePlanCorrectionMessage(activePlanSummary);
  const correctedLlmMessages = [...promptPrefixMessages, ...stateMessages, response, correctionMessage];
  const correctedResponse = await runLlmSpan(
    'catalog_agent.planner_iteration.correction_llm',
    async () => runnableModel.invoke(correctedLlmMessages),
    {
      inputMessages: correctedLlmMessages,
      model: runnableModel,
      attributes: buildTraceAttributes({
        'catalog.planner.iteration': iteration,
        'catalog.planner.branch': 'correction',
        'catalog.planner.worker_runs': workerRunsCount,
      }),
    }
  );
  const correctedToolCalls = Array.isArray(correctedResponse.tool_calls) ? correctedResponse.tool_calls : [];

  addTraceEvent('planner.tool_calls_generated', {
    'catalog.iteration': iteration,
    'catalog.tool_call_count': correctedToolCalls.length,
    'catalog.tool_call_names': summarizeToolCallNames(correctedToolCalls),
    status: correctedToolCalls.length > 0 ? 'tool_calls_after_correction' : 'text_response_after_correction',
  });

  return {
    messages: [response, correctedResponse],
    response: correctedResponse,
    toolCalls: correctedToolCalls,
    activePlanSummaryStillOpen: runId ? formatActivePlanTaskSummary(runId) : null,
  };
}
