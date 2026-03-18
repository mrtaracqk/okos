import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { buildToolSuccess } from '../../../../../services/woo/wooToolResult';

const truncateField = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') {
    return value;
  }
  return value.length > maxLength ? value.slice(0, maxLength) : value;
};

const toProductSummary = (product: any) => {
  if (!product || typeof product !== 'object') {
    return product;
  }

  return {
    id: product.id,
    type: product.type,
    name: product.name,
    status: product.status,
    categories: product.categories,
    date_created: product.date_created,
    default_attributes: product.default_attributes,
    description: truncateField(product.description, 300),
    short_description: truncateField(product.short_description, 300),
    permalink: product.permalink,
    regular_price: product.regular_price,
    sku: product.sku,
    variations: product.variations,
  };
};

const listProductsTool = createWooTool({
  name: 'wc.v3.products_list',
  description: 'Получить список товаров с опциональной фильтрацией по странице, поиску, статусу и др.',
  requiresApproval: false,
  schema: z.object({
    page: z.coerce.number().int().min(1).optional(),
    per_page: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
  }),
  run: async (input, { client }) => {
    const response = await client.products.listProducts({
      query: {
        page: input.page,
        per_page: input.per_page,
        search: input.search,
        status: input.status,
      },
    });
    const list = Array.isArray(response) ? response : [];
    return buildToolSuccess(list.map((item) => toProductSummary(item)));
  },
});

const getProductTool = createWooTool({
  name: 'wc.v3.products_read',
  description: 'Прочитать один товар по ID.',
  requiresApproval: false,
  schema: z.object({
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const product = await client.products.getProduct({ path: { id: input.id } });
    return buildToolSuccess(toProductSummary(product));
  },
});

const createProductCategoriesSchema = z
  .array(z.object({ id: z.number().int().min(1) }))
  .optional()
  .describe('Категории товара (из шага категории плейбука).');

const createProductAttributesSchema = z
  .array(
    z.object({
      id: z.number().int().optional(),
      name: z.string().optional(),
      options: z.array(z.string()).optional().describe('Список значений атрибута (термины).'),
    })
  )
  .optional()
  .describe('Атрибуты товара в формате WooCommerce (для variable — из шага атрибутов плейбука).');

const createProductTool = createWooTool({
  name: 'wc.v3.products_create',
  description:
    'Создать черновик товара по плейбуку. Обязательно: name. Опционально: type (simple/variable), status (draft), short_description, categories ([{id}]), attributes (для variable).',
  requiresApproval: true,
  schema: z.object({
    name: z.string().min(1).describe('Название товара.'),
    type: z.enum(['simple', 'variable']).optional().describe('Тип: simple или variable. По умолчанию simple.'),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional().describe('Статус. По умолчанию draft.'),
    short_description: z.string().optional().describe('Краткое описание.'),
    categories: createProductCategoriesSchema,
    attributes: createProductAttributesSchema,
  }),
  run: async (input, { client }) => {
    const product = await client.products.createProduct({
      body: {
        name: input.name,
        type: input.type ?? 'simple',
        status: input.status ?? 'draft',
        short_description: input.short_description,
        categories: input.categories,
        attributes: input.attributes,
      },
    });
    return buildToolSuccess(toProductSummary(product));
  },
});

const updateProductTool = createWooTool({
  name: 'wc.v3.products_update',
  description: 'Обновить существующий товар по ID. Передай только изменяемые поля.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
    name: z.string().min(1).optional(),
    regular_price: z.string().optional(),
    sku: z.string().optional(),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
    description: z.string().optional(),
  }),
  run: async (input, { client }) => {
    const { id, ...rest } = input;
    const body: Record<string, unknown> = { ...rest };
    const product = await client.products.updateProduct({
      path: { id },
      body: body as Parameters<typeof client.products.updateProduct>[0]['body'],
    });
    return buildToolSuccess(toProductSummary(product));
  },
});

const duplicateProductTool = createWooTool({
  name: 'wc.v3.products_duplicate_create',
  description: 'Дублировать товар по ID. Создаёт копию товара; опционально можно передать body для переопределения полей копии.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const product = await client.products.createProductDuplicate({
      path: { id: input.id },
    });
    return buildToolSuccess(toProductSummary(product));
  },
});

export const productWorkerWooTools = [
  listProductsTool,
  getProductTool,
  createProductTool,
  updateProductTool,
  duplicateProductTool,
];
