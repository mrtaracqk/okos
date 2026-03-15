import { describe, expect, it } from 'bun:test';
import { EXECUTION_PLAN_REQUIRED_MESSAGE, PLANNING_RUNTIME_UNAVAILABLE_MESSAGE } from './tool';

describe('planning tool constants', () => {
  it('keeps the worker guard message stable', () => {
    expect(EXECUTION_PLAN_REQUIRED_MESSAGE).toBe('Сначала создай план выполнения.');
  });

  it('exposes a stable runtime-unavailable message', () => {
    expect(PLANNING_RUNTIME_UNAVAILABLE_MESSAGE).toBe('Runtime планирования недоступен для этого запуска.');
  });
});
