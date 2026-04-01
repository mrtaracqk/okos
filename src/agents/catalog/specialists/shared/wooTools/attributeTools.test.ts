import { describe, expect, test } from 'bun:test';
import { listAttributesTool, listAttributeTermsTool } from './attributeTools';

describe('attributeTools schemas', () => {
  test('requires search and per_page for attributes list', () => {
    const parsed = (
      listAttributesTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({});

    expect(parsed.success).toBe(false);
  });

  test('requires search and per_page for attribute terms list', () => {
    const parsed = (
      listAttributeTermsTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      attribute_id: 12,
    });

    expect(parsed.success).toBe(false);
  });

  test('accepts attribute terms list when required lookup filters are provided', () => {
    const parsed = (
      listAttributeTermsTool as { schema: { safeParse: (value: unknown) => { success: boolean } } }
    ).schema.safeParse({
      attribute_id: 12,
      per_page: 10,
      search: 'Black',
    });

    expect(parsed.success).toBe(true);
  });
});
