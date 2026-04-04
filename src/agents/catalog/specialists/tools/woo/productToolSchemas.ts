import { z } from 'zod';

export const productAttributeRowSchema = z
  .object({
    id: z.number().optional().describe('ID глобального атрибута (taxonomy).'),
    name: z.string().optional().describe('Имя атрибута (в т.ч. custom).'),
    options: z.array(z.string()).optional().describe('Доступные значения (имена термов).'),
    position: z.number().optional(),
    variation: z.boolean().optional().describe('Участвует в вариациях.'),
    visible: z.boolean().optional().describe('Видимость на вкладке «Дополнительная информация».'),
  })
  .strict();

export type ProductAttributeRow = z.infer<typeof productAttributeRowSchema>;

export type ProductDefaultAttributeRow = {
  id?: number;
  name?: string;
  option?: string;
};

export const productStatusSchema = z.enum(['draft', 'pending', 'private', 'publish']);

export const productTypeSchema = z.enum(['simple', 'variable']);

export const productCategoryIdsSchema = z
  .array(z.coerce.number().int().min(1))
  .describe('Список ID категорий WooCommerce.');

const createProductAttributeSchema = z
  .object({
    id: z.coerce.number().int().min(1).describe('ID глобального атрибута Woo taxonomy.'),
    options: z
      .array(z.string().min(1))
      .min(1)
      .describe('Список значений/term names для родительского товара.'),
    variation: z.boolean().optional().describe('Участвует в вариациях.'),
    visible: z.boolean().optional().describe('Видимость на вкладке «Дополнительная информация».'),
  })
  .strict();

const createProductDefaultAttributeSchema = z
  .object({
    id: z.coerce.number().int().min(1).describe('ID глобального атрибута Woo taxonomy.'),
    option: z.string().min(1).describe('Значение по умолчанию.'),
  })
  .strict();

export const createProductInputSchema = z
  .object({
    name: z.string().min(1).describe('Название товара.'),
    type: productTypeSchema.optional().describe('Тип товара. По умолчанию simple.'),
    status: productStatusSchema.optional().describe('Статус товара. По умолчанию draft.'),
    category_ids: productCategoryIdsSchema.optional(),
    regular_price: z.string().min(1).optional().describe('Обычная цена товара в формате WooCommerce string.'),
    attributes: z
      .array(createProductAttributeSchema)
      .optional()
      .describe('Product-level attributes для parent product.'),
    default_attributes: z
      .array(createProductDefaultAttributeSchema)
      .optional()
      .describe('Значения по умолчанию для variable parent.'),
  })
  .strict();

export const updateProductInputSchema = z
  .object({
    id: z.coerce.number().int().min(1),
    name: z.string().min(1).optional().describe('Новое название товара.'),
    status: productStatusSchema.optional().describe('Новый статус товара.'),
    category_ids: productCategoryIdsSchema.optional(),
    regular_price: z.string().min(1).optional().describe('Новая обычная цена товара.'),
  })
  .strict();

export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

export const omitUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out as Partial<T>;
};

export const truncateField = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.length > maxLength ? value.slice(0, maxLength) : value;
};

export const toWooCategories = (categoryIds: number[] | undefined) => categoryIds?.map((id) => ({ id }));
