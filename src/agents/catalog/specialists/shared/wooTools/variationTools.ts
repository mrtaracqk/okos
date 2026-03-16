import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type {
  ProductVariationsCreateBody,
  ProductVariationUpdateBody,
  ProductVariationsBatchUpdateBody,
} from '../../../../../services/woo-sdk/src/models/products';

const listVariationsTool = createWooTool({
  name: 'wc.v3.products_variations_list',
  description: 'Получить список вариаций товара по product_id.',
  requiresApproval: false,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    page: z.number().int().min(1).optional(),
    per_page: z.number().int().min(1).max(100).optional(),
  }),
  run: async (input, { client }) => {
    const response = await client.products.listProductVariations({
      path: { product_id: input.product_id },
      query: { page: input.page, per_page: input.per_page },
    });
    const list = Array.isArray(response) ? response : [];
    return buildToolSuccess(list);
  },
});

const getVariationTool = createWooTool({
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

const createVariationTool = createWooTool({
  name: 'wc.v3.products_variations_create',
  description:
    'Создать вариацию товара. Обязательно: product_id. Опционально: sku, regular_price, sale_price, stock_quantity, attributes, status и др.',
  requiresApproval: true,
  schema: z.object({
    product_id: z.coerce.number().int().min(1),
    sku: z.string().optional(),
    regular_price: z.string().optional(),
    sale_price: z.string().optional(),
    stock_quantity: z.number().optional(),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
    attributes: z
      .array(z.object({ id: z.number().optional(), name: z.string().optional(), option: z.string().optional() }))
      .optional(),
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

const updateVariationTool = createWooTool({
  name: 'wc.v3.products_variations_update',
  description: 'Обновить вариацию по product_id и id. Передай только изменяемые поля.',
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
    attributes: z
      .array(z.object({ id: z.number().optional(), name: z.string().optional(), option: z.string().optional() }))
      .optional(),
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

const deleteVariationTool = createWooTool({
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

const batchVariationsTool = createWooTool({
  name: 'wc.v3.products_variations_batch',
  description:
    'Пакетное создание/обновление/удаление вариаций товара. product_id обязательно. body: create (массив объектов вариаций), delete (массив id), update (массив { id, ...поля }).',
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

const generateVariationsTool = createWooTool({
  name: 'wc.v3.products_variations_generate_create',
  description: 'Сгенерировать все вариации товара по комбинациям его атрибутов. Обязательно: product_id.',
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

export const variationWorkerWooTools = [
  listVariationsTool,
  getVariationTool,
  createVariationTool,
  updateVariationTool,
  deleteVariationTool,
  batchVariationsTool,
  generateVariationsTool,
];
