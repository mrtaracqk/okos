export type WorkerPlanContext = {
  goal: string;
  facts: string[];
  constraints: string[];
};

export type WorkerTaskInput = {
  objective: string;
  facts: string[];
  constraints: string[];
  expectedOutput: string;
  contextNotes?: string;
};

/**
 * Shared envelope for handoff from planner to worker.
 * Plan-wide context and step-local input are kept separate on purpose.
 */
export type WorkerTaskEnvelope = {
  planContext: WorkerPlanContext;
  taskInput: WorkerTaskInput;
  upstreamArtifacts?: unknown[];
};

export type WorkerRequest = {
  whatToDo: string;
  dataForExecution?: string;
  whyNow: string;
  whatToReturn: string;
};

export type HandoffToolArgs = {
  planGoal?: string;
  planFacts?: string;
  planConstraints?: string;
  objective?: string;
  facts?: string;
  constraints?: string;
  upstreamArtifacts?: unknown[];
  expectedOutput?: string;
  contextNotes?: string;
};

function splitNonEmptyLines(value: string | undefined): string[] {
  if (value == null || typeof value !== 'string') return [];
  return value
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Build WorkerTaskEnvelope from envelope-shaped tool args. */
export function parseHandoffArgsToEnvelope(args: HandoffToolArgs): WorkerTaskEnvelope {
  const planGoal = typeof args.planGoal === 'string' ? args.planGoal.trim() : '';
  const objective = typeof args.objective === 'string' ? args.objective.trim() : '';
  const expectedOutput = typeof args.expectedOutput === 'string' ? args.expectedOutput.trim() : '';
  const contextNotes = typeof args.contextNotes === 'string' ? args.contextNotes.trim() || undefined : undefined;
  const upstreamArtifacts = Array.isArray(args.upstreamArtifacts) ? args.upstreamArtifacts : undefined;

  return {
    planContext: {
      goal: planGoal,
      facts: splitNonEmptyLines(args.planFacts),
      constraints: splitNonEmptyLines(args.planConstraints),
    },
    taskInput: {
      objective,
      facts: splitNonEmptyLines(args.facts),
      constraints: splitNonEmptyLines(args.constraints),
      expectedOutput,
      contextNotes,
    },
    ...(upstreamArtifacts !== undefined ? { upstreamArtifacts } : {}),
  };
}

/** Build envelope from legacy WorkerRequest (e.g. from tool args). */
export function toWorkerTaskEnvelope(request: WorkerRequest): WorkerTaskEnvelope {
  const whyNow = request.whyNow?.trim() || '';

  return {
    planContext: {
      goal: whyNow || request.whatToDo.trim(),
      facts: [],
      constraints: [],
    },
    taskInput: {
      objective: request.whatToDo.trim(),
      facts: request.dataForExecution?.trim() ? [request.dataForExecution.trim()] : [],
      constraints: [],
      expectedOutput: request.whatToReturn.trim(),
      contextNotes: whyNow || undefined,
    },
  };
}

const EMPTY_EXECUTION_DATA = 'Нет дополнительных данных.';

export function buildWorkerInput(request: WorkerRequest) {
  const dataForExecution =
    request.dataForExecution && request.dataForExecution.trim().length > 0
      ? request.dataForExecution.trim()
      : EMPTY_EXECUTION_DATA;

  return [
    `Что сделать:\n${request.whatToDo.trim()}`,
    `Данные для выполнения:\n${dataForExecution}`,
    `Почему это нужно сделать сейчас:\n${request.whyNow.trim()}`,
    `Что вернуть:\n${request.whatToReturn.trim()}`,
  ].join('\n\n');
}
