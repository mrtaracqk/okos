import { describe, expect, test } from 'bun:test';
import { CATALOG_SPECIALISTS_BY_ID, getCatalogWorkerRuntimeTools } from '../specs';

function actualNames(tools: readonly { actualToolName: string }[]) {
  return tools.map((tool) => tool.actualToolName);
}

describe('toolsets', () => {
  test('keeps category and attribute workers without cross-domain research tools', () => {
    expect(actualNames(CATALOG_SPECIALISTS_BY_ID['category-worker'].tools.researchRead)).toEqual([]);
    expect(actualNames(CATALOG_SPECIALISTS_BY_ID['attribute-worker'].tools.researchRead)).toEqual([]);
  });

  test('gives product-worker the stage 2 research lookup matrix', () => {
    expect(actualNames(CATALOG_SPECIALISTS_BY_ID['product-worker'].tools.researchRead)).toEqual([
      'wc.v3.products_categories_list',
      'wc.v3.products_categories_read',
      'wc.v3.products_attributes_list',
      'wc.v3.products_attributes_read',
      'wc.v3.products_attributes_terms_list',
      'wc.v3.products_attributes_terms_read',
      'wc.v3.products_variations_list',
      'wc.v3.products_variations_read',
    ]);
  });

  test('gives variation-worker the stage 2 research lookup matrix', () => {
    expect(actualNames(CATALOG_SPECIALISTS_BY_ID['variation-worker'].tools.researchRead)).toEqual([
      'wc.v3.products_list',
      'wc.v3.products_read',
      'wc.v3.products_attributes_list',
      'wc.v3.products_attributes_read',
      'wc.v3.products_attributes_terms_list',
      'wc.v3.products_attributes_terms_read',
    ]);
  });

  test('runtime tools are composed from domain reads, mutations and research reads', () => {
    expect(actualNames(getCatalogWorkerRuntimeTools('product-worker'))).toEqual([
      'wc.v3.products_list',
      'wc.v3.products_read',
      'wc.v3.products_create',
      'wc.v3.products_update',
      'wc.v3.products_append_attribute',
      'wc.v3.products_remove_attribute',
      'wc.v3.products_duplicate_create',
      'wc.v3.products_categories_list',
      'wc.v3.products_categories_read',
      'wc.v3.products_attributes_list',
      'wc.v3.products_attributes_read',
      'wc.v3.products_attributes_terms_list',
      'wc.v3.products_attributes_terms_read',
      'wc.v3.products_variations_list',
      'wc.v3.products_variations_read',
    ]);
  });
});
