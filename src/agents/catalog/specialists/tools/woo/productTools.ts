import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { getWooExecuteWithHeaders } from '../../../../../services/woo/wooClient';
import { parseWpCollectionHeaders } from '../../../../../services/woo/wpCollectionHeaders';
import { buildPagedListSuccess, buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import {
  CreateProductInput,
  createProductInputSchema,
  omitUndefined,
  ProductAttributeRow,
  productAttributeRowSchema,
  ProductDefaultAttributeRow,
  toWooCategories,
  truncateField,
  UpdateProductInput,
  updateProductInputSchema,
} from './productToolSchemas';
import { ProductsCreateBody, ProductUpdateBody } from '../../../../../services/woo-sdk/src';
import {
  appendProductAttributeRows,
  upsertProductDefaultAttributes,
  removeProductAttributeRows,
  removeProductDefaultAttributes,
} from './productAttributeHelpers';

const productLookupInputSchema = z
  .object({
    page: z.coerce.number().int().min(1).max(5).optional(),
    per_page: z.coerce.number().int().min(1).max(20).optional(),
    search: z
      .string()
      .min(1)
      .optional()
      .describe('Общий текстовый поиск Woo. Не используй как замену slug/SKU lookup.'),
    slug: z
      .string()
      .min(1)
      .optional()
      .describe('Точный slug товара. Предпочтительно, если во входе есть permalink или slug.'),
    sku: z.string().min(1).optional().describe('Точный SKU товара.'),
    search_name_or_sku: z
      .string()
      .min(1)
      .optional()
      .describe(
        'Частичный поиск по name или SKU. Предпочтительнее обычного search, если строка может быть названием или SKU.'
      ),
    url: z
      .string()
      .url()
      .optional()
      .describe('Permalink товара. Если передан, tool локально извлечёт slug из URL и отправит в Woo query.slug.'),
    category: z.coerce
      .number()
      .int()
      .min(1)
      .optional()
      .describe('ID категории WooCommerce: только товары, назначенные в эту категорию (REST query category).'),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.url && value.slug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Use either url or slug, not both.',
        path: ['url'],
      });
    }
  });

type ProductLookupInput = z.infer<typeof productLookupInputSchema>;

function extractSlugFromProductUrl(rawUrl: string): string | undefined {
  try {
    const parsed = new URL(rawUrl);
    const segments = parsed.pathname
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean);

    const lastSegment = segments.at(-1);
    return lastSegment ? decodeURIComponent(lastSegment) : undefined;
  } catch {
    return undefined;
  }
}

export const toProductSummary = (product: any) => {
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
    attributes: product.attributes,
    default_attributes: product.default_attributes,
    description: truncateField(product.description, 50),
    short_description: truncateField(product.short_description, 50),
    permalink: product.permalink,
    regular_price: product.regular_price,
    sku: product.sku,
    variations: product.variations,
  };
};

export const listProductsTool = createWooTool({
  name: 'wc.v3.products_list',
  description:
    'Список товаров. Для permalink/url ищи через url->slug, для точного slug через slug, для SKU через sku или search_name_or_sku; общий search оставляй для обычного текста.',
  requiresApproval: false,
  schema: productLookupInputSchema,
  run: async (input) => {
    const { url, ...rest } = input as ProductLookupInput;
    const page = input.page ?? 1;
    const per_page = input.per_page ?? 10;
    const resolvedSlug = url ? extractSlugFromProductUrl(url) : rest.slug;
    const { data, headers } = await getWooExecuteWithHeaders()({
      method: 'GET',
      routeTemplate: '/products',
      query: {
        page,
        per_page,
        search: rest.search,
        slug: resolvedSlug,
        sku: rest.sku,
        search_name_or_sku: rest.search_name_or_sku,
        status: 'any',
        ...(rest.category != null ? { category: String(rest.category) } : {}),
      },
    });
    const list = Array.isArray(data) ? data : [];
    const { total, total_pages } = parseWpCollectionHeaders(headers);
    return buildPagedListSuccess(
      list.map((item) => toProductSummary(item)),
      { total, total_pages, page, per_page }
    );
  },
});

export const getProductTool = createWooTool({
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

export const createProductTool = createWooTool({
  name: 'wc.v3.products_create',
  description:
    'Создать товар (POST /products). Доступны только name, type, status, category_ids, regular_price, attributes и default_attributes.',
  requiresApproval: true,
  schema: createProductInputSchema,
  run: async (input, { client }) => {
    const { name, category_ids, ...rest } = input as CreateProductInput;
    const body = omitUndefined({
      ...rest,
      categories: toWooCategories(category_ids),
      name,
      type: input.type ?? 'simple',
      status: input.status ?? 'draft',
    }) as ProductsCreateBody;
    const product = await client.products.createProduct({ body });
    return buildToolSuccess(toProductSummary(product));
  },
});

export const updateProductTool = createWooTool({
  name: 'wc.v3.products_update',
  description:
    'Обновить товар (PUT /products/{id}). Доступны только name, status, category_ids и regular_price. Для attributes / default_attributes есть отдельные инструменты append/remove.',
  requiresApproval: true,
  schema: updateProductInputSchema,
  run: async (input, { client }) => {
    const { id, category_ids, ...rest } = input as UpdateProductInput;
    const body = omitUndefined({
      ...rest,
      categories: toWooCategories(category_ids),
    }) as ProductUpdateBody;
    const product = await client.products.updateProduct({
      path: { id },
      body,
    });
    return buildToolSuccess(toProductSummary(product));
  },
});

export const appendProductAttributeTool = createWooTool({
  name: 'wc.v3.products_append_attribute',
  description:
    'Добавить или слить атрибут на карточке товара: читает товар, добавляет строку в attributes (или объединяет options с существующей строкой с тем же id/name).',
  requiresApproval: true,
  schema: z
    .object({
      id: z.coerce.number().int().min(1).describe('ID товара.'),
      attribute: productAttributeRowSchema.describe(
        'Строка атрибута Woo; нужен id глобального атрибута или name (custom).'
      ),
      default_option: z
        .string()
        .optional()
        .describe('Если задано — обновить default_attributes для этого атрибута (имя выбранного терма).'),
    })
    .strict()
    .refine(
      (value) => value.attribute.id != null || (value.attribute.name != null && value.attribute.name.length > 0),
      {
        message: 'В attribute нужен id или непустой name.',
      }
    ),
  run: async (input, { client }) => {
    const product = (await client.products.getProduct({ path: { id: input.id } })) as Record<string, unknown>;
    const attributes: ProductAttributeRow[] = Array.isArray(product.attributes)
      ? product.attributes.map((attribute) => attribute as ProductAttributeRow)
      : [];
    const defaultAttributes: ProductDefaultAttributeRow[] | undefined = Array.isArray(product.default_attributes)
      ? (product.default_attributes as ProductDefaultAttributeRow[])
      : undefined;
    const body = omitUndefined({
      attributes: appendProductAttributeRows(attributes, input.attribute),
      default_attributes: upsertProductDefaultAttributes(defaultAttributes, input.attribute, input.default_option),
    }) as ProductUpdateBody;
    const updated = await client.products.updateProduct({
      path: { id: input.id },
      body,
    });
    return buildToolSuccess(toProductSummary(updated));
  },
});

export const removeProductAttributeTool = createWooTool({
  name: 'wc.v3.products_remove_attribute',
  description:
    'Убрать атрибут с карточки товара по id или name; также чистит соответствующую запись в default_attributes.',
  requiresApproval: true,
  schema: z
    .object({
      id: z.coerce.number().int().min(1).describe('ID товара.'),
      attribute_id: z.coerce.number().int().min(1).optional().describe('ID глобального атрибута на карточке.'),
      attribute_name: z.string().min(1).optional().describe('Имя атрибута (если нет attribute_id).'),
    })
    .strict()
    .refine((value) => value.attribute_id != null || value.attribute_name != null, {
      message: 'Нужен attribute_id или attribute_name.',
    }),
  run: async (input, { client }) => {
    const product = (await client.products.getProduct({ path: { id: input.id } })) as Record<string, unknown>;
    const attributes: ProductAttributeRow[] = Array.isArray(product.attributes)
      ? product.attributes.map((attribute) => attribute as ProductAttributeRow)
      : [];
    const defaultAttributes: ProductDefaultAttributeRow[] | undefined = Array.isArray(product.default_attributes)
      ? (product.default_attributes as ProductDefaultAttributeRow[])
      : undefined;
    const body = omitUndefined({
      attributes: removeProductAttributeRows(attributes, input),
      default_attributes: removeProductDefaultAttributes(defaultAttributes, input),
    }) as ProductUpdateBody;
    const updated = await client.products.updateProduct({
      path: { id: input.id },
      body,
    });
    return buildToolSuccess(toProductSummary(updated));
  },
});

export const duplicateProductTool = createWooTool({
  name: 'wc.v3.products_duplicate_create',
  description: 'Дублировать товар по ID.',
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
