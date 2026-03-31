import { describe, expect, test } from 'bun:test';
import { getCatalogPlaybookInstructions, renderPlaybookIndexForPrompt } from './index';

describe('catalog playbooks stage 3 routing', () => {
  test('renders owner-first worker order for simple product creation', () => {
    const index = renderPlaybookIndexForPrompt();

    expect(index).toContain('Playbook: add-simple-product');
    expect(index).toContain('Порядок воркеров: product-worker -> category-worker (fallback) -> product-worker (retry)');
  });

  test('describes product-worker as the initial owner for simple product creation', () => {
    const instructions = getCatalogPlaybookInstructions('add-simple-product');

    expect(instructions).toContain('Owner конечного действия — product-worker');
    expect(instructions).toContain('category-worker подключается только если lookup product-worker показал');
    expect(instructions).toContain('### 1. Создание товара и lookup категории -> product-worker');
  });

  test('describes owner-first routing with blocker fallbacks for variable products', () => {
    const instructions = getCatalogPlaybookInstructions('add-variable-product');

    expect(instructions).toContain('Owner шага создания родительского variable product — product-worker.');
    expect(instructions).toContain('category-worker и attribute-worker подключаются только по blocker');
    expect(instructions).toContain('### 1. Создание родительского товара -> product-worker');
    expect(instructions).toContain('### 2. Подготовка внешнего prerequisite -> category-worker или attribute-worker');
  });
});
