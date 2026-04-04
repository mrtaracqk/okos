import { describe, expect, test } from 'bun:test';
import {
  appendProductAttributeRows,
  removeProductAttributeRows,
  removeProductDefaultAttributes,
  upsertProductDefaultAttributes,
} from './productAttributeHelpers';

describe('productAttributeHelpers', () => {
  test('merges attributes by id', () => {
    const result = appendProductAttributeRows(
      [{ id: 7, name: 'Color', options: ['Black'], variation: false }],
      { id: 7, options: ['White'], variation: true },
    );

    expect(result).toEqual([{ id: 7, name: 'Color', options: ['Black', 'White'], variation: true }]);
  });

  test('merges attributes by normalized name when id is absent', () => {
    const result = appendProductAttributeRows(
      [{ name: 'Материал', options: ['Cotton'], visible: true }],
      { name: '  материал  ', options: ['Linen'] },
    );

    expect(result).toEqual([{ name: '  материал  ', options: ['Cotton', 'Linen'], visible: true }]);
  });

  test('dedupes merged attribute options', () => {
    const result = appendProductAttributeRows(
      [{ id: 9, options: ['Black', 'White'] }],
      { id: 9, options: ['White', 'Blue'] },
    );

    expect(result[0]?.options).toEqual(['Black', 'White', 'Blue']);
  });

  test('removes attribute and cleans matching default_attributes', () => {
    const selector = { attribute_name: 'color' };
    const attributes = removeProductAttributeRows(
      [
        { name: 'Color', options: ['Black', 'White'] },
        { name: 'Size', options: ['M'] },
      ],
      selector,
    );
    const defaults = removeProductDefaultAttributes(
      [
        { name: 'Color', option: 'Black' },
        { name: 'Size', option: 'M' },
      ],
      selector,
    );

    expect(attributes).toEqual([{ name: 'Size', options: ['M'] }]);
    expect(defaults).toEqual([{ name: 'Size', option: 'M' }]);
  });

  test('upserts default_attributes for appended attributes', () => {
    const defaults = upsertProductDefaultAttributes([{ id: 7, option: 'Black' }], { id: 7 }, 'White');

    expect(defaults).toEqual([{ id: 7, option: 'White' }]);
  });
});
