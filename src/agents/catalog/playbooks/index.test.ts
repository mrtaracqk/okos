import { describe, expect, test } from 'bun:test';
import { getCatalogPlaybookIds, getCatalogPlaybookInstructions, renderPlaybookIndexForPrompt } from './index';

describe('catalog playbooks stage 5 routing matrix', () => {
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
    expect(instructions).not.toContain('category-worker подберёт или создаст подходящую на основе названия товара');
  });

  test('describes owner-first routing with blocker fallbacks for variable products', () => {
    const instructions = getCatalogPlaybookInstructions('add-variable-product');

    expect(instructions).toContain('Owner шага создания родительского variable product — product-worker.');
    expect(instructions).toContain('category-worker и attribute-worker подключаются только по blocker');
    expect(instructions).toContain('### 1. Создание родительского товара -> product-worker');
    expect(instructions).toContain('### 2. Подготовка внешнего prerequisite -> category-worker или attribute-worker');
    expect(instructions).toContain('Если после минимального lookup нельзя надёжно выбрать категорию, атрибут или term');
    expect(instructions).toContain('Если не указана, товар можно создать без привязки категории.');
  });

  test('adds a variation-owned playbook with product and attribute fallback blockers', () => {
    const index = renderPlaybookIndexForPrompt();
    const instructions = getCatalogPlaybookInstructions('add-product-variation');

    expect(getCatalogPlaybookIds()).toContain('add-product-variation');
    expect(index).toContain('Playbook: add-product-variation');
    expect(index).toContain(
      'Порядок воркеров: variation-worker -> product-worker / attribute-worker (fallback) -> variation-worker (retry)'
    );
    expect(instructions).toContain('Owner конечного действия — variation-worker');
    expect(instructions).toContain('variation-worker сам пытается разрешить product_id родителя и taxonomy context атрибутов');
    expect(instructions).toContain('Если lookup показал, что родитель не найден, не является variable');
    expect(instructions).toContain('Если lookup показал, что глобального attribute или term-а не существует, вернуть blocker на attribute-worker.');
    expect(instructions).toContain('### 2. Подготовка внешнего prerequisite -> product-worker или attribute-worker');
    expect(instructions).toContain('### 3. Повторное создание variation -> variation-worker');
  });
});
