import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { getWooExecuteWithHeaders } from '../../../../../services/woo/wooClient';
import { parseWpCollectionHeaders } from '../../../../../services/woo/wpCollectionHeaders';
import { buildPagedListSuccess, buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type {
  ProductsCategoriesCreateBody,
  ProductsCategoriesListResponse,
  ProductsCategoryUpdateBody,
} from '../../../../../services/woo-sdk/src/models/products';

const mapCategory = (item: ProductsCategoriesListResponse[number]) => ({
  id: item.id,
  name: item.name,
  count: item.count,
  parent: item.parent,
  slug: item.slug,
});

const listCategoriesTool = createWooTool({
  name: 'wc.v3.products_categories_list',
  description:
    'Получить список категорий. Поиск по названию (search) и/или по родителю (parent). Ответ: { items, count, total?, total_pages?, per_page }.',
  requiresApproval: false,
  schema: z.object({
    search: z.string().optional().describe('Поиск по названию категории.'),
    parent: z.number().int().optional().describe('ID родительской категории (для подкатегорий).'),
  }),
  run: async (input) => {
    const per_page = 100;
    const { data, headers } = await getWooExecuteWithHeaders()({
      method: 'GET',
      routeTemplate: '/products/categories',
      query: {
        search: input.search,
        parent: input.parent,
        per_page,
      },
    });
    const list = Array.isArray(data) ? data : [];
    const { total, total_pages } = parseWpCollectionHeaders(headers);
    return buildPagedListSuccess(list.map(mapCategory), { total, total_pages, per_page });
  },
});

const getCategoryTool = createWooTool({
  name: 'wc.v3.products_categories_read',
  description: 'Прочитать одну категорию по ID.',
  requiresApproval: false,
  schema: z.object({
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const category = await client.products.getProductsCategory({ path: { id: input.id } });
    return buildToolSuccess(mapCategory(category));
  },
});

const createCategoryTool = createWooTool({
  name: 'wc.v3.products_categories_create',
  description: 'Создать категорию. Обязательно: name. Опционально: parent (ID родительской категории для подкатегории).',
  requiresApproval: true,
  schema: z.object({
    name: z.string().min(1).describe('Название категории.'),
    parent: z.number().int().optional().describe('ID родительской категории, если создаётся подкатегория.'),
  }),
  run: async (input, { client }) => {
    const body: Pick<ProductsCategoriesCreateBody, 'name' | 'parent'> = {
      name: input.name,
      parent: input.parent,
    };
    const category = await client.products.createProductsCategory({ body });
    return buildToolSuccess(category);
  },
});

const updateCategoryTool = createWooTool({
  name: 'wc.v3.products_categories_update',
  description: 'Обновить категорию по ID. Передай только изменяемые поля.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
    name: z.string().optional(),
    parent: z.number().int().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    display: z.enum(['default', 'products', 'subcategories', 'both']).optional(),
    menu_order: z.number().int().optional(),
  }),
  run: async (input, { client }) => {
    const { id, ...rest } = input;
    const body: Pick<
      ProductsCategoryUpdateBody,
      'name' | 'parent' | 'slug' | 'description' | 'display' | 'menu_order'
    > = rest;
    await client.products.updateProductsCategory({ path: { id }, body });
    return buildToolSuccess(null);
  },
});

const deleteCategoryTool = createWooTool({
  name: 'wc.v3.products_categories_delete',
  description: 'Удалить категорию по ID. Опционально: force=true для постоянного удаления.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
    force: z.boolean().optional(),
  }),
  run: async (input, { client }) => {
    await client.products.deleteProductsCategory({
      path: { id: input.id },
      query: input.force != null ? { force: input.force } : undefined,
    });
    return buildToolSuccess(null);
  },
});

export const categoryWorkerWooTools = [
  listCategoriesTool,
  getCategoryTool,
  createCategoryTool,
  updateCategoryTool,
  deleteCategoryTool,
];
