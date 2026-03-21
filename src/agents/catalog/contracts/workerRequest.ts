/**
 * Shared envelope for handoff from planner to worker. Single canonical shape
 * without scenario-specific schemas. Text views are derived from this.
 */
export type WorkerTaskEnvelope = {
  objective: string;
  facts: string[];
  constraints: string[];
  expectedOutput: string;
  contextNotes?: string;
};

export type WorkerRequest = {
  whatToDo: string;
  dataForExecution?: string;
  whyNow: string;
  whatToReturn: string;
};

/**
 * Shape of handoff tool arguments (envelope fields). Planner fills these;
 * dispatcher converts to WorkerTaskEnvelope.
 */
export type HandoffToolArgs = {
  objective?: string;
  facts?: string;
  constraints?: string;
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

/** Build WorkerTaskEnvelope from handoff tool args (envelope-shaped). */
export function parseHandoffArgsToEnvelope(args: HandoffToolArgs): WorkerTaskEnvelope {
  const objective = typeof args.objective === 'string' ? args.objective.trim() : '';
  const facts = splitNonEmptyLines(args.facts);
  const constraints = splitNonEmptyLines(args.constraints);
  const expectedOutput = typeof args.expectedOutput === 'string' ? args.expectedOutput.trim() : '';
  const contextNotes = typeof args.contextNotes === 'string' ? args.contextNotes.trim() || undefined : undefined;
  return {
    objective,
    facts,
    constraints,
    expectedOutput,
    contextNotes,
  };
}

/** Build envelope from legacy WorkerRequest (e.g. from tool args). */
export function toWorkerTaskEnvelope(request: WorkerRequest): WorkerTaskEnvelope {
  return {
    objective: request.whatToDo.trim(),
    facts: request.dataForExecution?.trim() ? [request.dataForExecution.trim()] : [],
    constraints: [],
    expectedOutput: request.whatToReturn.trim(),
    contextNotes: request.whyNow?.trim() || undefined,
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

/** Render envelope to text for worker HumanMessage. Includes optional constraints when present. */
export function buildWorkerInputFromEnvelope(envelope: WorkerTaskEnvelope) {
  const dataForExecution =
    envelope.facts.length > 0 ? envelope.facts.join('\n').trim() : EMPTY_EXECUTION_DATA;
  const whyNow = envelope.contextNotes?.trim() ?? '';
  const constraintsBlock =
    envelope.constraints.length > 0
      ? [`Ограничения:\n${envelope.constraints.join('\n').trim()}`]
      : [];

  return [
    `Что сделать:\n${envelope.objective}`,
    `Данные для выполнения:\n${dataForExecution}`,
    ...constraintsBlock,
    `Почему это нужно сделать сейчас:\n${whyNow}`,
    `Что вернуть:\n${envelope.expectedOutput}`,
  ].join('\n\n');
}
