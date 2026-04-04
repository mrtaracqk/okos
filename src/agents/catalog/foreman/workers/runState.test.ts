import { describe, expect, test } from 'bun:test';
import { type ToolRun } from '../../../shared/toolRun';
import { getLastNonReportFailure, resolveWorkerRunStatus } from './runState';

function buildToolRun(toolName: string, status: ToolRun['status']): ToolRun {
  return {
    toolName,
    args: {},
    status,
    structured: null,
  };
}

describe('worker run state helpers', () => {
  test('prefers explicit worker_result status over tool-run fallback', () => {
    const toolRuns = [buildToolRun('wc_v3_products_read', 'failed')];

    expect(resolveWorkerRunStatus(toolRuns, 'completed')).toBe('completed');
    expect(resolveWorkerRunStatus(toolRuns)).toBe('failed');
  });

  test('ignores report_worker_result when searching for the last actionable failure', () => {
    const toolRuns = [
      buildToolRun('wc_v3_products_read', 'failed'),
      buildToolRun('report_worker_result', 'failed'),
    ];

    expect(getLastNonReportFailure(toolRuns)?.toolName).toBe('wc_v3_products_read');
  });
});
