import { ToolMessage } from '@langchain/core/messages';
import { getPlanningRunContext, getPlanningRuntime, type RuntimePlan } from '../../../../runtime/planning';
import { resolveCatalogWorkerId } from '../../contracts/catalogWorkerId';
import { type WorkerRun } from '../../contracts/workerRun';
import { toolReply } from '../tools/protocol';
import { type CatalogToolCall } from '../tools/types';
import { executeWorkerHandoff } from '../workers/handoff';
import { resolveCatalogForemanWorker } from '../workers/registry';
import { getInProgressExecutableTask } from './selectors';

export type PlannerExecutionToolPhase = 'new_execution_plan' | 'approve_step';

function getInProgressExecutionFailureMessages(phase: PlannerExecutionToolPhase): {
  noExecutableInProgressTask: string;
  planNotReloadedAfterWorker: string;
} {
  if (phase === 'new_execution_plan') {
    return {
      noExecutableInProgressTask: 'Нет task в статусе in_progress для исполнения.',
      planNotReloadedAfterWorker:
        'План зафиксирован, подзадача отработана, но активный план не прочитан из runtime после обновления.',
    };
  }

  return {
    noExecutableInProgressTask: 'Не удалось найти execution-данные для in_progress task.',
    planNotReloadedAfterWorker:
      'approve_step применён, подзадача отработана, но активный план не прочитан из runtime после обновления.',
  };
}

export function getCatalogAgentRuntimeRunId() {
  return getPlanningRunContext()?.runId ?? null;
}

export async function finalizeCatalogExecutionPlan(input: {
  runId: string;
  outcome: 'failed' | 'abandoned';
}) {
  const planningRuntime = getPlanningRuntime();
  const activePlan = planningRuntime.getActivePlan(input.runId);
  if (!activePlan) {
    return;
  }

  if (input.outcome === 'failed') {
    await planningRuntime.failPlan(input.runId);
    return;
  }

  await planningRuntime.finalizeDanglingPlan(input.runId);
}

/**
 * Исполняет единственную задачу плана в статусе in_progress (handoff воркеру) и записывает итоговый статус задачи в runtime.
 * Общий путь для new_execution_plan (после create/update) и approve_step (после перевода следующей pending → in_progress).
 */
export async function runInProgressPlanTaskAndSyncRuntime(params: {
  runId: string;
  workerRuns: WorkerRun[];
  replyToToolCall: Pick<CatalogToolCall, 'id' | 'name'>;
  phase: PlannerExecutionToolPhase;
}): Promise<
  | { ok: true; run: WorkerRun; planAfterWorker: RuntimePlan; completedTaskId: string }
  | { ok: false; toolMessage: ToolMessage; run?: WorkerRun }
> {
  const { runId, workerRuns, replyToToolCall, phase } = params;
  const msgs = getInProgressExecutionFailureMessages(phase);
  const planningRuntime = getPlanningRuntime();

  const activePlan = planningRuntime.getActivePlan(runId);
  const activeTask = getInProgressExecutableTask(activePlan);
  if (!activePlan || !activeTask?.execution) {
    return {
      ok: false,
      toolMessage: toolReply(replyToToolCall, msgs.noExecutableInProgressTask),
    };
  }

  const workerId = resolveCatalogWorkerId(activeTask.owner);
  if (!workerId) {
    return {
      ok: false,
      toolMessage: toolReply(
        replyToToolCall,
        `Невозможно исполнить taskId="${activeTask.taskId}": неподдерживаемый owner="${activeTask.owner}".`
      ),
    };
  }

  const workerDef = resolveCatalogForemanWorker(workerId);
  if (!workerDef) {
    return {
      ok: false,
      toolMessage: toolReply(replyToToolCall, `Не найден worker для id="${workerId}".`),
    };
  }

  const { run } = await executeWorkerHandoff({
    requestEnvelope: {
      planContext: {
        goal: activePlan.planContext.goal,
        facts: activePlan.planContext.facts,
        constraints: activePlan.planContext.constraints,
      },
      taskInput: {
        objective: activeTask.execution.objective,
        facts: activeTask.execution.facts,
        constraints: activeTask.execution.constraints,
        expectedOutput: activeTask.execution.expectedOutput,
        contextNotes: activeTask.execution.contextNotes,
      },
      ...(Array.isArray(activePlan.nextStepArtifacts) && activePlan.nextStepArtifacts.length > 0
        ? { upstreamArtifacts: [...activePlan.nextStepArtifacts] }
        : {}),
    },
    previousWorkerRunsCount: workerRuns.length,
    worker: workerDef,
    replyToToolCall,
  });

  const completedTaskStatus: RuntimePlan['tasks'][number]['status'] = run.status === 'completed' ? 'completed' : 'failed';
  const nextPlanTasks = activePlan.tasks.map((task) =>
    task.taskId === activeTask.taskId ? { ...task, status: completedTaskStatus } : task
  );

  const nextStepArtifacts =
    run.status === 'completed' && Array.isArray(run.result?.artifacts) && run.result.artifacts.length > 0
      ? [...run.result.artifacts]
      : undefined;

  await planningRuntime.updatePlan({
    runId,
    tasks: nextPlanTasks,
    nextStepArtifacts,
  });

  const planAfterWorker = planningRuntime.getActivePlan(runId);
  if (!planAfterWorker) {
    return {
      ok: false,
      run,
      toolMessage: toolReply(replyToToolCall, msgs.planNotReloadedAfterWorker),
    };
  }

  return { ok: true, run, planAfterWorker, completedTaskId: activeTask.taskId };
}
