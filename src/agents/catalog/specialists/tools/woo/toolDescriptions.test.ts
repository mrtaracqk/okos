import { describe, expect, test } from 'bun:test';
import * as attributeTools from './attributeTools';
import * as categoryTools from './categoryTools';
import * as productTools from './productTools';
import * as variationTools from './variationTools';

function getToolDescriptions(moduleRecord: Record<string, unknown>) {
  return Object.values(moduleRecord)
    .filter(
      (value): value is { description: string } =>
        typeof value === 'object' &&
        value !== null &&
        'description' in value &&
        typeof (value as { description?: unknown }).description === 'string'
    )
    .map((tool) => tool.description);
}

describe('catalog woo tool descriptions', () => {
  test('stay concise and avoid repeating schema fields', () => {
    const allDescriptions = [
      ...getToolDescriptions(attributeTools),
      ...getToolDescriptions(categoryTools),
      ...getToolDescriptions(productTools),
      ...getToolDescriptions(variationTools),
    ];
    const combined = allDescriptions.join('\n');

    expect(productTools.listProductsTool.description).toBe('Получить список товаров. Возвращает paged list payload.');
    expect(productTools.createProductTool.description).toBe('Создать товар. Возвращает structured product payload.');
    expect(productTools.updateProductTool.description).toBe('Обновить товар по ID. Возвращает structured product payload.');
    expect(categoryTools.listCategoriesTool.description).toBe('Получить список категорий. Возвращает paged list payload.');
    expect(attributeTools.listAttributesTool.description).toBe(
      'Получить список глобальных атрибутов товаров. Возвращает paged list payload.'
    );
    expect(attributeTools.listAttributeTermsTool.description).toBe(
      'Получить список терминов атрибута. Возвращает paged list payload.'
    );
    expect(variationTools.listVariationsTool.description).toBe(
      'Получить список вариаций товара. Возвращает paged list payload.'
    );
    expect(variationTools.createVariationTool.description).toBe(
      'Создать вариацию. Возвращает structured variation payload.'
    );
    expect(variationTools.updateVariationTool.description).toBe(
      'Обновить вариацию по product_id и id. Возвращает mutation result вариации.'
    );

    for (const forbiddenSnippet of [
      '`url`',
      '`slug`',
      '`sku`',
      '`search_name_or_sku`',
      '`category`',
      '`page`',
      '`per_page`',
      '`product_id`',
      '`attributes`',
      '`status`',
      '`regular_price`',
      '`sale_price`',
      '`stock_quantity`',
      '`stock_status`',
      '`manage_stock`',
      '`backorders`',
      '{ items, count',
      '{ id, option }',
      'это не этот tool',
      'taxonomy context уже подтверждены',
      'подготовить родителя',
      'делается не этим tool',
      'уже подтверждённого variable product',
      'category-worker',
      'attribute-worker',
      'product-worker',
      'variation-worker',
    ]) {
      expect(combined).not.toContain(forbiddenSnippet);
    }
  });
});
