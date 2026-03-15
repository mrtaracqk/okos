export type WorkerRequestMode = 'execute' | 'consult';

export type WorkerRequest = {
  mode: WorkerRequestMode;
  whatToDo: string;
  dataForExecution?: string;
  whyNow: string;
  whatToReturn: string;
};

const EMPTY_EXECUTION_DATA = 'Нет дополнительных данных.';

export function normalizeWorkerRequestMode(value: unknown): WorkerRequestMode {
  return value === 'consult' ? 'consult' : 'execute';
}

export function requiresWorkerToolCall(mode: WorkerRequestMode) {
  return mode === 'execute';
}

export function buildWorkerInput(request: WorkerRequest) {
  const dataForExecution =
    request.dataForExecution && request.dataForExecution.trim().length > 0
      ? request.dataForExecution.trim()
      : EMPTY_EXECUTION_DATA;

  return [
    `Режим запроса: ${request.mode}`,
    `Что сделать:\n${request.whatToDo.trim()}`,
    `Данные для выполнения:\n${dataForExecution}`,
    `Почему это нужно сделать сейчас:\n${request.whyNow.trim()}`,
    `Что вернуть:\n${request.whatToReturn.trim()}`,
  ].join('\n\n');
}
