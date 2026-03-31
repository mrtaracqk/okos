import { type CatalogWorkerId } from '../../contracts/catalogWorkerId';
import { type WooTool } from './wooTools';
import {
  createAttributeTermTool,
  createAttributeTool,
  deleteAttributeTermTool,
  deleteAttributeTool,
  getAttributeTermTool,
  getAttributeTool,
  listAttributeTermsTool,
  listAttributesTool,
  updateAttributeTermTool,
  updateAttributeTool,
} from './wooTools/attributeTools';
import {
  createCategoryTool,
  deleteCategoryTool,
  getCategoryTool,
  listCategoriesTool,
  updateCategoryTool,
} from './wooTools/categoryTools';
import {
  appendProductAttributeTool,
  createProductTool,
  duplicateProductTool,
  getProductTool,
  listProductsTool,
  removeProductAttributeTool,
  updateProductTool,
} from './wooTools/productTools';
import {
  batchVariationsTool,
  createVariationTool,
  deleteVariationTool,
  generateVariationsTool,
  getVariationTool,
  listVariationsTool,
  updateVariationTool,
} from './wooTools/variationTools';

export type CatalogWorkerToolset = {
  domainRead: readonly WooTool[];
  domainMutations: readonly WooTool[];
  researchRead: readonly WooTool[];
};

export const CATALOG_WORKER_TOOLSETS = {
  'category-worker': {
    domainRead: [listCategoriesTool, getCategoryTool],
    domainMutations: [createCategoryTool, updateCategoryTool, deleteCategoryTool],
    researchRead: [],
  },
  'attribute-worker': {
    domainRead: [listAttributesTool, getAttributeTool, listAttributeTermsTool, getAttributeTermTool],
    domainMutations: [
      createAttributeTool,
      updateAttributeTool,
      deleteAttributeTool,
      createAttributeTermTool,
      updateAttributeTermTool,
      deleteAttributeTermTool,
    ],
    researchRead: [],
  },
  'product-worker': {
    domainRead: [listProductsTool, getProductTool],
    domainMutations: [
      createProductTool,
      updateProductTool,
      appendProductAttributeTool,
      removeProductAttributeTool,
      duplicateProductTool,
    ],
    researchRead: [
      listCategoriesTool,
      getCategoryTool,
      listAttributesTool,
      getAttributeTool,
      listAttributeTermsTool,
      getAttributeTermTool,
      listVariationsTool,
      getVariationTool,
    ],
  },
  'variation-worker': {
    domainRead: [listVariationsTool, getVariationTool],
    domainMutations: [
      createVariationTool,
      updateVariationTool,
      deleteVariationTool,
      batchVariationsTool,
      generateVariationsTool,
    ],
    researchRead: [
      listProductsTool,
      getProductTool,
      listAttributesTool,
      getAttributeTool,
      listAttributeTermsTool,
      getAttributeTermTool,
    ],
  },
} as const satisfies Record<CatalogWorkerId, CatalogWorkerToolset>;

export function getCatalogWorkerToolset(workerId: CatalogWorkerId): CatalogWorkerToolset {
  return CATALOG_WORKER_TOOLSETS[workerId];
}

export function getCatalogWorkerRuntimeTools(workerId: CatalogWorkerId): WooTool[] {
  const toolset = getCatalogWorkerToolset(workerId);
  return [...toolset.domainRead, ...toolset.domainMutations, ...toolset.researchRead];
}
