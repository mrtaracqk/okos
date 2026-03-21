import { type ToolRun } from '../../shared/toolLoopGraph';
import { type CatalogWorkerToolName, type WorkerRun } from '../contracts/workerRun';
import { WORKER_RESULT_TOOL_NAME, type WorkerResultStatus } from '../contracts/workerResult';

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

export function buildNoToolCallFailure(workerName: CatalogWorkerToolName, task: string): ToolRun {
  return {
    toolName: '(no tool call)',
    args: {
      worker: workerName,
      task,
    },
    status: 'failed',
    structured: null,
    error: {
      source: 'catalog-worker',
      type: 'no_tool_calls',
      message:
        'Воркер завершился без вызова какого-либо инструмента WooCommerce. Этот сбой был сформирован на уровне агента до любого запроса в MAG или Woo.',
      retryable: false,
    },
  };
}

export function resolveWorkerRunStatus(
  toolRuns: ToolRun[],
  hasNoToolCallFailure: boolean,
  reportedStatus?: WorkerResultStatus | null
): WorkerRun['status'] {
  if (hasNoToolCallFailure) {
    return 'failed';
  }

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
