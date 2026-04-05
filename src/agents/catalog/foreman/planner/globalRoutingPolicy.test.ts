import { describe, expect, test } from 'bun:test';
import { renderCatalogForemanGlobalRoutingPolicy } from './globalRoutingPolicy';

describe('renderCatalogForemanGlobalRoutingPolicy', () => {
  test('keeps global owner-first rules and specialist routing summary together', () => {
    const section = renderCatalogForemanGlobalRoutingPolicy();

    expect(section).toContain('## Зона и границы');
    expect(section).toContain('Owner шага выбирай по конечному действию');
    expect(section).toContain('Неточные пользовательские формулировки считай нормой');
    expect(section).toContain('## Routing Policy');
    expect(section).toContain('### product-worker');
    expect(section).toContain('### variation-worker');
  });
});
