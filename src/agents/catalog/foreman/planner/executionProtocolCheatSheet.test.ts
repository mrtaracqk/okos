import { describe, expect, test } from 'bun:test';
import { renderCatalogExecutionProtocolCheatSheet } from './executionProtocolCheatSheet';

describe('renderCatalogExecutionProtocolCheatSheet', () => {
  test('keeps worker_result canonical and routes by structured runtime state', () => {
    const section = renderCatalogExecutionProtocolCheatSheet();

    expect(section).toContain('`completed_step.worker_result` — канонический structured result последнего шага');
    expect(section).not.toContain('`completed_step.highlights`');
    expect(section).toContain('`next_step.tool=approve_step`');
    expect(section).toContain('`new_execution_plan`');
    expect(section).toContain('`finish_execution_plan`');
  });
});
