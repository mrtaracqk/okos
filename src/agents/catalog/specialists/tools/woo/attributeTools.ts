import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { getWooExecuteWithHeaders } from '../../../../../services/woo/wooClient';
import { parseWpCollectionHeaders } from '../../../../../services/woo/wpCollectionHeaders';
import { buildPagedListSuccess, buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type {
  ProductsAttributesCreateBody,
  ProductsAttributeUpdateBody,
  ProductsAttributeTermsCreateBody,
  ProductsAttributeTermUpdateBody,
  ProductsAttributeTermsListQuery,
} from '../../../../../services/woo-sdk/src/models/products';

export const listAttributesTool = createWooTool({
  name: 'wc.v3.products_attributes_list',
  description:
    'Получить список глобальных атрибутов товаров. Обязательно: per_page и search; опционально: страница. Ответ: { items, count, total?, total_pages?, page?, per_page? }.',
  requiresApproval: false,
  schema: z.object({
    page: z.coerce.number().int().min(1).max(5).optional(),
    per_page: z.coerce.number().int().min(1).max(20),
    search: z.string().describe('Поиск по названию атрибута (REST query search).'),
  }),
  run: async (input) => {
    const page = input.page ?? 1;
    const per_page = input.per_page ?? 10;
    const { data, headers } = await getWooExecuteWithHeaders()({
      method: 'GET',
      routeTemplate: '/products/attributes',
      query: {
        page,
        per_page,
        search: input.search,
      },
    });
    const list = Array.isArray(data) ? data : [];
    const { total, total_pages } = parseWpCollectionHeaders(headers);
    return buildPagedListSuccess(list, { total, total_pages, page, per_page });
  },
});

export const getAttributeTool = createWooTool({
  name: 'wc.v3.products_attributes_read',
  description: 'Прочитать один атрибут по ID.',
  requiresApproval: false,
  schema: z.object({
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const attribute = await client.products.getProductsAttribute({ path: { id: input.id } });
    return buildToolSuccess(attribute);
  },
});

export const createAttributeTool = createWooTool({
  name: 'wc.v3.products_attributes_create',
  description: 'Создать глобальный атрибут товаров. Обязательно: name (название атрибута).',
  requiresApproval: true,
  schema: z.object({
    name: z.string().min(1).describe('Название атрибута.'),
  }),
  run: async (input, { client }) => {
    const body: Pick<ProductsAttributesCreateBody, 'name'> = { name: input.name };
    const attribute = await client.products.createProductsAttribute({ body });
    return buildToolSuccess(attribute);
  },
});

export const updateAttributeTool = createWooTool({
  name: 'wc.v3.products_attributes_update',
  description: 'Обновить глобальный атрибут по ID. Передай только изменяемые поля.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
    name: z.string().optional(),
    slug: z.string().optional(),
    type: z.enum(['select']).optional(),
    order_by: z.enum(['menu_order', 'name', 'name_num', 'id']).optional(),
    has_archives: z.boolean().optional(),
  }),
  run: async (input, { client }) => {
    const { id, ...rest } = input;
    const body: Pick<ProductsAttributeUpdateBody, 'name' | 'slug' | 'type' | 'order_by' | 'has_archives'> = rest;
    await client.products.updateProductsAttribute({ path: { id }, body });
    return buildToolSuccess(null);
  },
});

export const deleteAttributeTool = createWooTool({
  name: 'wc.v3.products_attributes_delete',
  description: 'Удалить глобальный атрибут по ID.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    await client.products.deleteProductsAttribute({
      path: { id: input.id }
    });
    return buildToolSuccess(null);
  },
});

export const listAttributeTermsTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_list',
  description:
    'Получить список значений (терминов) атрибута по attribute_id. Обязательно: per_page и search; опционально: страница. Ответ: { items, count, total?, total_pages?, page?, per_page? }.',
  requiresApproval: false,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1).describe('ID атрибута.'),
    page: z.coerce.number().int().min(1).max(5).optional(),
    per_page: z.coerce.number().int().min(1).max(30),
    search: z.string().describe('Поиск по названию (вхождению) термина.'),
  }),
  run: async (input) => {
    const page = input.page ?? 1;
    const per_page = input.per_page ?? 10;
    const query: ProductsAttributeTermsListQuery = {
      page,
      per_page,
      search: input.search,
    };
    const { data, headers } = await getWooExecuteWithHeaders()({
      method: 'GET',
      routeTemplate: '/products/attributes/{attribute_id}/terms',
      path: { attribute_id: input.attribute_id },
      query,
    });
    const list = Array.isArray(data) ? data : [];
    const { total, total_pages } = parseWpCollectionHeaders(headers);
    return buildPagedListSuccess(list, { total, total_pages, page, per_page });
  },
});

export const getAttributeTermTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_read',
  description: 'Прочитать один термин атрибута по attribute_id и id термина.',
  requiresApproval: false,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const term = await client.products.getProductsAttributeTerm({
      path: { attribute_id: input.attribute_id, id: input.id },
    });
    return buildToolSuccess(term);
  },
});

export const createAttributeTermTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_create',
  description: 'Создать значение (термин) атрибута. Обязательно: attribute_id, name (значение).',
  requiresApproval: true,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1).describe('ID атрибута.'),
    name: z.string().min(1).describe('Значение атрибута (название термина).'),
  }),
  run: async (input, { client }) => {
    const body: Pick<ProductsAttributeTermsCreateBody, 'name'> = { name: input.name };
    const term = await client.products.createProductsAttributeTerm({
      path: { attribute_id: input.attribute_id },
      body,
    });
    return buildToolSuccess(term);
  },
});

export const updateAttributeTermTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_update',
  description: 'Обновить термин атрибута по attribute_id и id. Передай только изменяемые поля.',
  requiresApproval: true,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1),
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    menu_order: z.number().int().optional(),
  }),
  run: async (input, { client }) => {
    const { attribute_id, id, ...rest } = input;
    const body: Pick<ProductsAttributeTermUpdateBody, 'name' | 'slug' | 'description' | 'menu_order'> = rest;
    await client.products.updateProductsAttributeTerm({
      path: { attribute_id, id },
      body,
    });
    return buildToolSuccess(null);
  },
});

export const deleteAttributeTermTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_delete',
  description: 'Удалить термин атрибута по attribute_id и id.',
  requiresApproval: true,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1)
  }),
  run: async (input, { client }) => {
    await client.products.deleteProductsAttributeTerm({
      path: { attribute_id: input.attribute_id, id: input.id },
    });
    return buildToolSuccess(null);
  },
});
