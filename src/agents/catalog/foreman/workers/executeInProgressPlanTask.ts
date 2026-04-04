import { resolveCatalogWorkerId } from '../../../../contracts/catalogExecutionOwners';
import { type RuntimePlan } from '../../../../runtime/planning/types';
import { type WorkerRun } from '../../contracts/workerRun';
import { resolveCatalogWorker } from '../../specialists/registry';
import { type CatalogPlanningDeps } from '../runtimePlan/planningDeps';
import {
  buildRuntimePlanUpdateAfterWorkerRun,
  prepareInProgressPlanTaskExecution,
} from '../runtimePlan/transitions';
import { toolReply } from '../tools/protocol';
import { type CatalogToolCall } from '../tools/types';
import { executeWorkerHandoff } from './handoff';

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

export async function executeInProgressPlanTask(params: {
  planningDeps: Pick<CatalogPlanningDeps, 'planningRuntime'>;
  runId: string;
  workerRuns: WorkerRun[];
  replyToToolCall: Pick<CatalogToolCall, 'id' | 'name'>;
  phase: PlannerExecutionToolPhase;
}): Promise<
  | { ok: true; run: WorkerRun; planAfterWorker: RuntimePlan; completedTaskId: string }
  | { ok: false; toolMessage: ReturnType<typeof toolReply>; run?: WorkerRun }
> {
  const { planningDeps, runId, workerRuns, replyToToolCall, phase } = params;
  const msgs = getInProgressExecutionFailureMessages(phase);
  const planningRuntime = planningDeps.planningRuntime;

  const preparedTask = prepareInProgressPlanTaskExecution(planningRuntime.getActivePlan(runId));
  if (!preparedTask) {
    return {
      ok: false,
      toolMessage: toolReply(replyToToolCall, msgs.noExecutableInProgressTask),
    };
  }

  const workerId = resolveCatalogWorkerId(preparedTask.activeTask.owner);
  if (!workerId) {
    return {
      ok: false,
      toolMessage: toolReply(
        replyToToolCall,
        `Невозможно исполнить taskId="${preparedTask.activeTask.taskId}": неподдерживаемый owner="${preparedTask.activeTask.owner}".`
      ),
    };
  }

  const workerDef = resolveCatalogWorker(workerId);

  const { run } = await executeWorkerHandoff({
    requestEnvelope: preparedTask.requestEnvelope,
    previousWorkerRunsCount: workerRuns.length,
    worker: workerDef,
    replyToToolCall,
  });

  await planningRuntime.updatePlan({
    runId,
    ...buildRuntimePlanUpdateAfterWorkerRun({
      activePlan: preparedTask.activePlan,
      completedTaskId: preparedTask.activeTask.taskId,
      run,
    }),
  });

  const planAfterWorker = planningRuntime.getActivePlan(runId);
  if (!planAfterWorker) {
    return {
      ok: false,
      run,
      toolMessage: toolReply(replyToToolCall, msgs.planNotReloadedAfterWorker),
    };
  }

  return {
    ok: true,
    run,
    planAfterWorker,
    completedTaskId: preparedTask.activeTask.taskId,
  };
}
