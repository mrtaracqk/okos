import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { getWooExecuteWithHeaders } from '../../../../../services/woo/wooClient';
import { parseWpCollectionHeaders } from '../../../../../services/woo/wpCollectionHeaders';
import { buildPagedListSuccess, buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type { ProductUpdateBody, ProductsCreateBody } from '../../../../../services/woo-sdk/src/models/products';
import {
  productUpdateBodySchema,
  productsCreateBodySchema,
} from '../../../../../services/woo-sdk/src/models/products';

const productAttributeRowSchema = z
  .object({
    id: z.number().optional().describe('ID глобального атрибута (taxonomy).'),
    name: z.string().optional().describe('Имя атрибута (в т.ч. custom).'),
    options: z.array(z.string()).optional().describe('Доступные значения (имена термов).'),
    position: z.number().optional(),
    variation: z.boolean().optional().describe('Участвует в вариациях.'),
    visible: z.boolean().optional().describe('Видимость на вкладке «Дополнительная информация».'),
  })
  .strict();

type ProductAttributeRow = z.infer<typeof productAttributeRowSchema>;

const updateProductInputSchema = productUpdateBodySchema
  .omit({ attributes: true, default_attributes: true })
  .partial()
  .extend({
    id: z.coerce.number().int().min(1),
  });

function sameAttributeRow(a: ProductAttributeRow, b: ProductAttributeRow): boolean {
  if (a.id != null && b.id != null && a.id === b.id) {
    return true;
  }
  const na = a.name?.trim().toLowerCase();
  const nb = b.name?.trim().toLowerCase();
  if (na && nb && na === nb) {
    return true;
  }
  return false;
}

function mergeAttributeOptions(existing: string[] | undefined, incoming: string[] | undefined): string[] | undefined {
  if (!incoming?.length) {
    return existing;
  }
  if (!existing?.length) {
    return [...incoming];
  }
  const set = new Set([...existing, ...incoming]);
  return [...set];
}

function mergeAttributeRows(
  existing: ProductAttributeRow,
  incoming: ProductAttributeRow,
): ProductAttributeRow {
  return {
    ...existing,
    ...incoming,
    options: mergeAttributeOptions(existing.options, incoming.options),
  };
}

const omitUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as Partial<T>;
};

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
  description: 'Список товаров (пагинация, поиск, фильтр по category id).',
  requiresApproval: false,
  schema: z.object({
    page: z.coerce.number().int().min(1).max(5).optional(),
    per_page: z.coerce.number().int().min(1).max(20).optional(),
    search: z.string().optional(),
    category: z.coerce
      .number()
      .int()
      .min(1)
      .optional()
      .describe('ID категории WooCommerce: только товары, назначенные в эту категорию (REST query category).'),
  }),
  run: async (input) => {
    const page = input.page ?? 1;
    const per_page = input.per_page ?? 10;
    const { data, headers } = await getWooExecuteWithHeaders()({
      method: 'GET',
      routeTemplate: '/products',
      query: {
        page,
        per_page,
        search: input.search,
        status: 'any',
        ...(input.category != null ? { category: String(input.category) } : {}),
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
  description:
    'Прочитать один товар по ID.',
  requiresApproval: false,
  schema: z.object({
    id: z.coerce.number().int().min(1),
  }),
  run: async (input, { client }) => {
    const product = await client.products.getProduct({ path: { id: input.id } });
    return buildToolSuccess(toProductSummary(product));
  },
});

const createProductInputSchema = productsCreateBodySchema.partial().extend({
  name: z.string().min(1).describe('Название товара.'),
});

export const createProductTool = createWooTool({
  name: 'wc.v3.products_create',
  description: 'Создать товар (POST /products).',
  requiresApproval: true,
  schema: createProductInputSchema,
  run: async (input, { client }) => {
    const { name, ...rest } = input;
    const body = omitUndefined({
      ...rest,
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
    'Обновить товар (PUT /products/{id}). Без полей attributes / default_attributes — для них отдельные инструменты append/remove.',
  requiresApproval: true,
  schema: updateProductInputSchema,
  run: async (input, { client }) => {
    const { id, ...rest } = input;
    const body = omitUndefined(rest) as ProductUpdateBody;
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
        'Строка атрибута Woo; нужен id глобального атрибута или name (custom).',
      ),
      default_option: z
        .string()
        .optional()
        .describe(
          'Если задано — обновить default_attributes для этого атрибута (имя выбранного терма).',
        ),
    })
    .strict()
    .refine((v) => v.attribute.id != null || (v.attribute.name != null && v.attribute.name.length > 0), {
      message: 'В attribute нужен id или непустой name.',
    }),
  run: async (input, { client }) => {
    const product = (await client.products.getProduct({ path: { id: input.id } })) as Record<string, unknown>;
    const rawAttrs = product.attributes;
    const attrs: ProductAttributeRow[] = Array.isArray(rawAttrs)
      ? rawAttrs.map((a) => a as ProductAttributeRow)
      : [];
    const incoming = input.attribute;
    const idx = attrs.findIndex((row) => sameAttributeRow(row, incoming));
    let nextAttrs: ProductAttributeRow[];
    if (idx >= 0) {
      nextAttrs = [...attrs];
      nextAttrs[idx] = mergeAttributeRows(attrs[idx], incoming);
    } else {
      nextAttrs = [...attrs, incoming];
    }

    const rawDefaults = product.default_attributes;
    let default_attributes: Array<{ id?: number; name?: string; option?: string }> | undefined;
    if (input.default_option != null && input.default_option.length > 0) {
      const base: Array<{ id?: number; name?: string; option?: string }> = Array.isArray(rawDefaults)
        ? [...(rawDefaults as Array<{ id?: number; name?: string; option?: string }>)]
        : [];
      const matchIdx = base.findIndex((d) => {
        if (incoming.id != null) {
          return d.id === incoming.id;
        }
        if (incoming.name != null) {
          return d.name != null && d.name === incoming.name;
        }
        return false;
      });
      const row = {
        ...(incoming.id != null ? { id: incoming.id } : {}),
        ...(incoming.name != null ? { name: incoming.name } : {}),
        option: input.default_option,
      };
      if (matchIdx >= 0) {
        base[matchIdx] = row;
        default_attributes = base;
      } else {
        default_attributes = [...base, row];
      }
    }

    const body = omitUndefined({
      attributes: nextAttrs,
      ...(default_attributes != null ? { default_attributes } : {}),
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
    .refine((v) => v.attribute_id != null || v.attribute_name != null, {
      message: 'Нужен attribute_id или attribute_name.',
    }),
  run: async (input, { client }) => {
    const product = (await client.products.getProduct({ path: { id: input.id } })) as Record<string, unknown>;
    const rawAttrs = product.attributes;
    const attrs: ProductAttributeRow[] = Array.isArray(rawAttrs)
      ? rawAttrs.map((a) => a as ProductAttributeRow)
      : [];

    const matches = (row: ProductAttributeRow) => {
      if (input.attribute_id != null && row.id === input.attribute_id) {
        return true;
      }
      if (input.attribute_name != null && row.name != null) {
        return row.name.trim().toLowerCase() === input.attribute_name.trim().toLowerCase();
      }
      return false;
    };

    const nextAttrs = attrs.filter((row) => !matches(row));

    const rawDefaults = product.default_attributes;
    let default_attributes: Array<{ id?: number; name?: string; option?: string }> | undefined;
    if (Array.isArray(rawDefaults)) {
      default_attributes = (rawDefaults as Array<{ id?: number; name?: string; option?: string }>).filter(
        (d) => {
          if (input.attribute_id != null && d.id === input.attribute_id) {
            return false;
          }
          if (input.attribute_name != null && d.name != null) {
            return d.name.trim().toLowerCase() !== input.attribute_name.trim().toLowerCase();
          }
          return true;
        },
      );
    }

    const body = omitUndefined({
      attributes: nextAttrs,
      ...(default_attributes != null ? { default_attributes } : {}),
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

export const productWorkerWooTools = [
  listProductsTool,
  getProductTool,
  createProductTool,
  updateProductTool,
  appendProductAttributeTool,
  removeProductAttributeTool,
  duplicateProductTool,
] as const;
