import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { getWooExecuteWithHeaders } from '../../../../../services/woo/wooClient';
import { parseWpCollectionHeaders } from '../../../../../services/woo/wpCollectionHeaders';
import { buildPagedListSuccess, buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type {
  ProductVariationsCreateBody,
  ProductVariationUpdateBody,
  ProductVariationsBatchUpdateBody,
} from '../../../../../services/woo-sdk/src/models/products';

const variationAttributeItemSchema = z.object({
  id: z.coerce.number().int().min(1).describe('ID глобального атрибута Woo taxonomy.'),
  option: z.string().min(1).describe('Выбранное значение терма.'),
});

export const listVariationsTool = createWooTool({
  name: 'wc.v3.products_variations_list',
  description: 'Получить список вариаций товара. Возвращает paged list payload.',
  requiresApproval: false,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    page: z.number().int().min(1).optional(),
    per_page: z.number().int().min(1).max(100).optional(),
  }),
  run: async (input) => {
    const page = input.page ?? 1;
    const per_page = input.per_page ?? 10;
    const { data, headers } = await getWooExecuteWithHeaders()({
      method: 'GET',
      routeTemplate: '/products/{product_id}/variations',
      path: { product_id: input.product_id },
      query: { page, per_page },
    });
    const list = Array.isArray(data) ? data : [];
    const { total, total_pages } = parseWpCollectionHeaders(headers);
    return buildPagedListSuccess(list, { total, total_pages, page, per_page });
  },
});

export const getVariationTool = createWooTool({
  name: 'wc.v3.products_variations_read',
  description: 'Прочитать одну вариацию по product_id и id вариации.',
  requiresApproval: false,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const variation = await client.products.getProductVariation({
      path: { product_id: input.product_id, id: input.id },
    });
    return buildToolSuccess(variation);
  },
});

export const createVariationTool = createWooTool({
  name: 'wc.v3.products_variations_create',
  description: 'Создать вариацию. Возвращает structured variation payload.',
  requiresApproval: true,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    sku: z.string().optional(),
    regular_price: z.string().optional(),
    sale_price: z.string().optional(),
    stock_quantity: z.number().optional(),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
    attributes: z.array(variationAttributeItemSchema).optional(),
    description: z.string().optional(),
    manage_stock: z.boolean().optional(),
    backorders: z.enum(['no', 'notify', 'yes']).optional(),
  }),
  run: async (input, { client }) => {
    const { product_id, ...rest } = input;
    const body: Pick<
      ProductVariationsCreateBody,
      | 'sku'
      | 'regular_price'
      | 'sale_price'
      | 'stock_quantity'
      | 'stock_status'
      | 'status'
      | 'attributes'
      | 'description'
      | 'manage_stock'
      | 'backorders'
    > = rest;
    const variation = await client.products.createProductVariation({
      path: { product_id },
      body,
    });
    return buildToolSuccess(variation);
  },
});

export const updateVariationTool = createWooTool({
  name: 'wc.v3.products_variations_update',
  description: 'Обновить вариацию по product_id и id. Возвращает mutation result вариации.',
  requiresApproval: true,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1),
    sku: z.string().optional(),
    regular_price: z.string().optional(),
    sale_price: z.string().optional(),
    stock_quantity: z.number().optional(),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
    attributes: z.array(variationAttributeItemSchema).optional(),
    description: z.string().optional(),
    manage_stock: z.boolean().optional(),
    backorders: z.enum(['no', 'notify', 'yes']).optional(),
  }),
  run: async (input, { client }) => {
    const { product_id, id, ...rest } = input;
    const body: Pick<
      ProductVariationUpdateBody,
      | 'sku'
      | 'regular_price'
      | 'sale_price'
      | 'stock_quantity'
      | 'stock_status'
      | 'status'
      | 'attributes'
      | 'description'
      | 'manage_stock'
      | 'backorders'
    > = rest;
    await client.products.updateProductVariation({
      path: { product_id, id },
      body,
    });
    return buildToolSuccess(null);
  },
});

export const deleteVariationTool = createWooTool({
  name: 'wc.v3.products_variations_delete',
  description: 'Удалить вариацию по product_id и id. Опционально: force=true для постоянного удаления.',
  requiresApproval: true,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1),
    force: z.boolean().optional(),
  }),
  run: async (input, { client }) => {
    await client.products.deleteProductVariation({
      path: { product_id: input.product_id, id: input.id },
      query: input.force != null ? { force: input.force } : undefined,
    });
    return buildToolSuccess(null);
  },
});

export const batchVariationsTool = createWooTool({
  name: 'wc.v3.products_variations_batch',
  description: 'Выполнить batch-операции над вариациями по product_id. Возвращает structured batch payload.',
  requiresApproval: true,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    body: z
      .object({
        create: z.array(z.record(z.string(), z.unknown())).optional(),
        delete: z.array(z.number()).optional(),
        update: z.array(z.object({ id: z.number() }).passthrough()).optional(),
      })
      .optional(),
  }),
  run: async (input, { client }) => {
    const body = input.body as ProductVariationsBatchUpdateBody | undefined;
    const result = await client.products.batchUpdateProductVariations({
      path: { product_id: input.product_id },
      body,
    });
    return buildToolSuccess(result);
  },
});

export const generateVariationsTool = createWooTool({
  name: 'wc.v3.products_variations_generate_create',
  description: 'Сгенерировать вариации из product-level attributes товара. Возвращает structured Woo payload.',
  requiresApproval: true,
  schema: z.object({
    product_id: z.coerce.number().int().min(1).describe('ID вариативного товара.'),
  }),
  run: async (input, { client }) => {
    const result = await client.products.createProductVariationsGenerate({
      path: { product_id: input.product_id },
      body: {},
    });
    return buildToolSuccess(result);
  },
});
