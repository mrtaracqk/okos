import { describe, expect, test } from 'bun:test';
import { OpenAIChatModelConfig, normalizeOpenAIChatModelName } from './openAIChatModelConfig';

describe('normalizeOpenAIChatModelName', () => {
  test('strips optional openai provider prefix', () => {
    expect(normalizeOpenAIChatModelName('openai/gpt-5-mini')).toBe('gpt-5-mini');
    expect(normalizeOpenAIChatModelName(' OpenAI/gpt-5-mini ')).toBe('gpt-5-mini');
  });

  test('preserves raw model names', () => {
    expect(normalizeOpenAIChatModelName('gpt-5-mini')).toBe('gpt-5-mini');
  });
});

describe('OpenAIChatModelConfig', () => {
  test('loads normalized default model name', () => {
    const config = new OpenAIChatModelConfig(' openai/gpt-5-mini ');

    expect(config.getDefaultModelName()).toBe('gpt-5-mini');
    expect(config.getCurrentModelName()).toBe('gpt-5-mini');
  });

  test('updates current model name from raw or provider-prefixed values', () => {
    const config = new OpenAIChatModelConfig('gpt-4o');

    expect(config.setCurrentModelName('gpt-5-mini')).toBe('gpt-5-mini');
    expect(config.getCurrentModelName()).toBe('gpt-5-mini');

    expect(config.setCurrentModelName('openai/gpt-5')).toBe('gpt-5');
    expect(config.getCurrentModelName()).toBe('gpt-5');
  });

  test('rejects empty model names after normalization', () => {
    const config = new OpenAIChatModelConfig('gpt-4o');

    expect(() => config.setCurrentModelName(' openai/ ')).toThrow('Имя модели не задано');
  });
});
