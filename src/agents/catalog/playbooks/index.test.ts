import { describe, expect, it } from 'bun:test';
import {
  getCatalogPlaybookIds,
  getCatalogPlaybookInstructions,
  renderPlaybookIndexForPrompt,
} from './index';

describe('catalog playbooks', () => {
  it('returns the stable playbook ids', () => {
    expect(getCatalogPlaybookIds()).toEqual(['add-simple-product', 'add-variable-product']);
  });

  it('renders a prompt index with summaries and worker order', () => {
    const index = renderPlaybookIndexForPrompt();

    expect(index).toContain('Playbook: add-simple-product');
    expect(index).toContain('Сводка: Создать простой товар в статусе draft.');
    expect(index).toContain('Порядок воркеров: category-worker -> product-worker');
    expect(index).toContain('Playbook: add-variable-product');
    expect(index).toContain('Порядок воркеров: category-worker -> attribute-worker -> product-worker -> variation-worker');
  });

  it('returns canonical instructions for a known playbook', () => {
    const instructions = getCatalogPlaybookInstructions('add-simple-product');

    expect(instructions).toContain('Playbook: add-simple-product');
    expect(instructions).toContain('Канонические инструкции:');
    expect(instructions).toContain('# Создание простого товара');
    expect(instructions).toContain('Тип товара = simple.');
  });

  it('returns undefined for an unknown playbook id', () => {
    expect(getCatalogPlaybookInstructions('missing-playbook')).toBeUndefined();
  });
});
