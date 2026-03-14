import { describe, expect, it } from 'bun:test';
import { isMarkdown, pickRandomElement } from './utils';

describe('isMarkdown', () => {
  it('detects common markdown constructs', () => {
    expect(isMarkdown('# Heading\n\nBody text')).toBe(true);
    expect(isMarkdown('This has **bold** text')).toBe(true);
    expect(isMarkdown('Items:\n- first\n- second')).toBe(true);
    expect(isMarkdown('```ts\nconst a = 1;\n```')).toBe(true);
  });

  it('returns false for plain text', () => {
    expect(isMarkdown('This is plain text without markdown markers.')).toBe(false);
  });
});

describe('pickRandomElement', () => {
  it('picks an element using Math.random index calculation', () => {
    const originalRandom = Math.random;
    Math.random = () => 0.74;

    try {
      expect(pickRandomElement(['a', 'b', 'c', 'd'])).toBe('c');
    } finally {
      Math.random = originalRandom;
    }
  });
});
