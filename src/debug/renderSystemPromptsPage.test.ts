import { describe, expect, test } from 'bun:test';
import { renderSystemPromptsPage } from './renderSystemPromptsPage';

describe('renderSystemPromptsPage', () => {
  test('renders all system prompt sections on a single page', () => {
    const html = renderSystemPromptsPage();

    expect(html).toContain('<title>System Prompts</title>');
    expect(html).toContain('ОнлиАссистент');
    expect(html).toContain('catalog-agent');
    expect(html).toContain('category-worker');
    expect(html).toContain('attribute-worker');
    expect(html).toContain('product-worker');
    expect(html).toContain('variation-worker');
    expect(html).toContain('Expand all');
    expect(html).toContain('Collapse all');
  });
});
