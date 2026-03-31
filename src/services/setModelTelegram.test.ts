import { describe, expect, test } from 'bun:test';
import { buildSetModelModelCallbackData, parseSetModelModelCallbackData, SET_MODEL_CHAT_PRESETS } from './setModelTelegramPayload';

describe('parseSetModelModelCallbackData', () => {
  test('parses preset model', () => {
    expect(parseSetModelModelCallbackData('sm:m:gpt-5.3-chat')).toBe('gpt-5.3-chat');
    expect(parseSetModelModelCallbackData('sm:m:gpt-5.4-mini')).toBe('gpt-5.4-mini');
    expect(parseSetModelModelCallbackData('sm:m:gpt-5.4')).toBe('gpt-5.4');
  });

  test('returns null for unknown model or prefix', () => {
    expect(parseSetModelModelCallbackData('sm:m:gpt-4o')).toBeNull();
    expect(parseSetModelModelCallbackData('approval:a:x')).toBeNull();
    expect(parseSetModelModelCallbackData(undefined)).toBeNull();
  });
});

describe('SET_MODEL_CHAT_PRESETS', () => {
  test('model callback payloads stay within Telegram 64-byte limit', () => {
    for (const model of SET_MODEL_CHAT_PRESETS) {
      const payload = buildSetModelModelCallbackData(model);
      expect(new TextEncoder().encode(payload).length).toBeLessThanOrEqual(64);
    }
  });
});
