import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type {
  ProductsCategoriesCreateBody,
  ProductsCategoryUpdateBody,
} from '../../../../../services/woo-sdk/src/models/products';

const listCategoriesTool = createWooTool({
  name: 'wc.v3.products_categories_list',
  description: 'Получить список категорий. Поиск по названию (search) и/или по родителю (parent).',
  requiresApproval: false,
  schema: z.object({
    search: z.string().optional().describe('Поиск по названию категории.'),
    parent: z.number().int().optional().describe('ID родительской категории (для подкатегорий).'),
  }),
  run: async (input, { client }) => {
    const response = await client.products.listProductsCategories({
      query: {
        search: input.search,
        parent: input.parent,
      },
    });
    const list = Array.isArray(response) ? response : [];
    return buildToolSuccess(list);
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
    return buildToolSuccess(category);
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
