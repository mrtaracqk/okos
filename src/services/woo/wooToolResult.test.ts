import { describe, expect, test } from 'bun:test';
import {
  buildToolSuccess,
  normalizeToolFailure,
  normalizeToolFailureFromError,
} from './wooToolResult';

describe('wooToolResult', () => {
  test('buildToolSuccess returns correct shape', () => {
    const r = buildToolSuccess({ id: 1 });
    expect(r.ok).toBe(true);
    expect(r.structured).toEqual({ id: 1 });
  });

  test('normalizeToolFailure extracts nested error and sets source', () => {
    const r = normalizeToolFailure({
      structured: { error: { message: 'nested', type: 'approval_timeout' } },
    });
    expect(r.ok).toBe(false);
    expect(r.error?.message).toBe('nested');
    expect(r.error?.source).toBe('approval-gate');
    expect(r.error?.retryable).toBe(true);
  });

  test('normalizeToolFailureFromError uses error message and fallbackSource', () => {
    const r = normalizeToolFailureFromError(new Error('network error'), 'woo-sdk');
    expect(r.ok).toBe(false);
    expect(r.error?.message).toBe('network error');
    expect(r.error?.source).toBe('woo-sdk');
  });

});
