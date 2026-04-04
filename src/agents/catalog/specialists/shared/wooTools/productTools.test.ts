import { describe, expect, test } from 'bun:test';
import { createProductTool, listProductsTool, updateProductTool } from './productTools';

describe('productTools schemas', () => {
  test('accepts minimal create payload with variable parent fields', () => {
    const parsed = (
      createProductTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      name: 'Test product',
      type: 'variable',
      status: 'draft',
      category_ids: [12],
      regular_price: '1990',
      attributes: [{ id: 7, options: ['Black'], variation: true }],
      default_attributes: [{ id: 7, option: 'Black' }],
    });

    expect(parsed.success).toBe(true);
  });

  test('rejects legacy raw Woo categories shape on create', () => {
    const parsed = (
      createProductTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      name: 'Test product',
      categories: [{ id: 12 }],
    });

    expect(parsed.success).toBe(false);
  });

  test('accepts only the reduced update payload', () => {
    const parsed = (
      updateProductTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      id: 42,
      name: 'Renamed product',
      status: 'publish',
      category_ids: [12, 15],
      regular_price: '2490',
    });

    expect(parsed.success).toBe(true);
  });

  test('rejects attributes on update', () => {
    const parsed = (
      updateProductTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      id: 42,
      attributes: [{ id: 7, options: ['Black'] }],
    });

    expect(parsed.success).toBe(false);
  });

  test('accepts product lookup by url and category', () => {
    const parsed = (
      listProductsTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      url: 'https://onlyphones.ru/product/jbl-partybox-ultimate/',
      category: 12,
    });

    expect(parsed.success).toBe(true);
  });

  test('accepts explicit slug and SKU-oriented lookup fields', () => {
    const parsed = (
      listProductsTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      slug: 'jbl-partybox-ultimate',
      sku: 'JBL-ULT-001',
      search_name_or_sku: 'JBL-ULT',
    });

    expect(parsed.success).toBe(true);
  });

  test('rejects ambiguous url+slug lookup', () => {
    const parsed = (
      listProductsTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      url: 'https://onlyphones.ru/product/jbl-partybox-ultimate/',
      slug: 'jbl-partybox-ultimate',
    });

    expect(parsed.success).toBe(false);
  });
});
