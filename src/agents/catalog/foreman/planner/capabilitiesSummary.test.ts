import { describe, expect, test } from 'bun:test';
import { PROMPTS } from '../../../../prompts';
import { renderCatalogForemanWorkerCapabilities } from './capabilitiesSummary';

describe('renderCatalogForemanWorkerCapabilities', () => {
  test('distinguishes owned mutations from research lookup access', () => {
    const summary = renderCatalogForemanWorkerCapabilities();

    expect(summary).toContain('### product-worker');
    expect(summary).toContain('**Меняет в своей зоне:** `wc_v3_products_create`');
    expect(summary).toContain(
      '**Research lookup в соседних доменах:** `wc_v3_products_categories_list`, `wc_v3_products_categories_read`',
    );
    expect(summary).toContain(
      '**Research lookup в соседних доменах:** `wc_v3_products_list`, `wc_v3_products_read`',
    );
  });

  test('is embedded into the foreman system prompt', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('- playbook');

    expect(prompt).toContain('## Возможности воркеров (инструменты)');
    expect(prompt).toContain('### variation-worker');
  });
});
