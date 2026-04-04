import { type ToolRun } from '../../../shared/toolRun';
import { type WorkerRun } from '../../contracts/workerRun';
import { type WorkerResult, WorkerResultStatus, WORKER_RESULT_TOOL_NAME } from '../../contracts/workerResult';

export function getWorkerFailure(toolRuns: ToolRun[]) {
  for (let index = toolRuns.length - 1; index >= 0; index -= 1) {
    if (toolRuns[index]?.status === 'failed') {
      return toolRuns[index];
    }
  }

  return undefined;
}

export function getLastFailedWorker(workerRuns: WorkerRun[]) {
  for (let index = workerRuns.length - 1; index >= 0; index -= 1) {
    const workerRun = workerRuns[index];
    if (workerRun?.status === 'failed' || workerRun?.status === 'invalid') {
      return workerRun;
    }
  }

  return undefined;
}

export function getLastWorkerResult(workerRuns: WorkerRun[]): WorkerResult | null {
  for (let index = workerRuns.length - 1; index >= 0; index -= 1) {
    const result = workerRuns[index]?.result;
    if (result != null) {
      return result;
    }
  }

  return null;
}

export function resolveWorkerRunStatus(
  toolRuns: ToolRun[],
  reportedStatus?: WorkerResultStatus | null
): WorkerRun['status'] {
  if (reportedStatus) {
    return reportedStatus;
  }

  if (toolRuns[toolRuns.length - 1]?.status === 'failed') {
    return 'failed';
  }

  return 'completed';
}

export function formatWorkerFailure(toolRun: ToolRun | undefined) {
  if (!toolRun) {
    return '';
  }

  const lines = [
    `Инструмент сбоя: ${toolRun.toolName}`,
    `Источник сбоя: ${toolRun.error?.source ?? 'unknown'}`,
    `Сообщение о сбое: ${toolRun.error?.message ?? ''}`,
  ];

  if (toolRun.error?.type) {
    lines.push(`Тип сбоя: ${toolRun.error.type}`);
  }

  if (toolRun.error?.code) {
    lines.push(`Код сбоя: ${toolRun.error.code}`);
  }

  if (typeof toolRun.error?.retryable === 'boolean') {
    lines.push(`Можно повторить: ${toolRun.error.retryable ? 'да' : 'нет'}`);
  }

  if (Object.keys(toolRun.args).length > 0) {
    lines.push(`Аргументы сбоя: ${JSON.stringify(toolRun.args)}`);
  }

  return lines.join('\n');
}

export function getLastNonReportFailure(toolRuns: ToolRun[]) {
  for (let index = toolRuns.length - 1; index >= 0; index -= 1) {
    const toolRun = toolRuns[index];
    if (toolRun?.toolName === WORKER_RESULT_TOOL_NAME) {
      continue;
    }

    if (toolRun?.status === 'failed') {
      return toolRun;
    }
  }

  return undefined;
}
