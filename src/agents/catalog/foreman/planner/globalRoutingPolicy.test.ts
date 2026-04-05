import { describe, expect, test } from 'bun:test';
import { renderCatalogForemanGlobalRoutingPolicy } from './globalRoutingPolicy';

describe('renderCatalogForemanGlobalRoutingPolicy', () => {
  test('merges global zone rules and per-worker routing into one section', () => {
    const section = renderCatalogForemanGlobalRoutingPolicy();

    expect(section).toContain('## Зона и маршрутизация');
    expect(section).toContain('Слой данных Woo:');
    expect(section).toContain('Owner шага выбирай по конечному действию');
    expect(section).toContain('Неточные пользовательские формулировки считай нормой');
    expect(section).not.toContain('## Routing Policy');
    expect(section).not.toContain('## Ownership (воркеры)');
    expect(section).toContain('### product-worker');
    expect(section).toContain('### variation-worker');
    expect(section).not.toContain('wc_v3_');
  });
});
