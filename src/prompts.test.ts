import { describe, expect, test } from 'bun:test';
import { PROMPTS } from './prompts';

describe('catalog-agent prompt stage 3 routing', () => {
  test('tells foreman to start with the final owner and keep lookup inside owner steps', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('playbooks');

    expect(prompt).toContain(
      'Для create/update товара или variation сначала планируй owner-а этого конечного действия'
    );
    expect(prompt).toContain('если конечный шаг — создать товар или обновить его categories, сначала product-worker');
    expect(prompt).toContain('Если конечный шаг — создать, найти или обновить конкретную variation, сначала variation-worker');
    expect(prompt).toContain('Не разбивай её на микрошаги вроде «найди category_id»');
  });
});
