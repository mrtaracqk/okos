import { z } from 'zod';
import { createWooTool } from '../../../../../services/woo/createWooTool';
import { buildToolSuccess } from '../../../../../services/woo/wooToolResult';
import type {
  ProductsAttributesCreateBody,
  ProductsAttributeUpdateBody,
  ProductsAttributeTermsCreateBody,
  ProductsAttributeTermUpdateBody,
} from '../../../../../services/woo-sdk/src/models/products';

const listAttributesTool = createWooTool({
  name: 'wc.v3.products_attributes_list',
  description: 'Получить список глобальных атрибутов товаров.',
  requiresApproval: false,
  schema: z.object({}),
  run: async (_input, { client }) => {
    const response = await client.products.listProductsAttributes();
    const list = Array.isArray(response) ? response : [];
    return buildToolSuccess(list);
  },
});

const getAttributeTool = createWooTool({
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

const createAttributeTool = createWooTool({
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

const updateAttributeTool = createWooTool({
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

const deleteAttributeTool = createWooTool({
  name: 'wc.v3.products_attributes_delete',
  description: 'Удалить глобальный атрибут по ID.',
  requiresApproval: true,
  schema: z.object({
    id: z.coerce.number().int().min(1),
    force: z.boolean().optional(),
  }),
  run: async (input, { client }) => {
    await client.products.deleteProductsAttribute({
      path: { id: input.id },
      query: input.force != null ? { force: input.force } : undefined,
    });
    return buildToolSuccess(null);
  },
});

const listAttributeTermsTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_list',
  description: 'Получить список значений (терминов) атрибута по attribute_id.',
  requiresApproval: false,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1).describe('ID атрибута.'),
  }),
  run: async (input, { client }) => {
    const response = await client.products.listProductsAttributeTerms({
      path: { attribute_id: input.attribute_id },
      query: {},
    });
    const list = Array.isArray(response) ? response : [];
    return buildToolSuccess(list);
  },
});

const getAttributeTermTool = createWooTool({
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

const createAttributeTermTool = createWooTool({
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

const updateAttributeTermTool = createWooTool({
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

const deleteAttributeTermTool = createWooTool({
  name: 'wc.v3.products_attributes_terms_delete',
  description: 'Удалить термин атрибута по attribute_id и id.',
  requiresApproval: true,
  schema: z.object({
    attribute_id: z.coerce.number().int().min(1),
    id: z.coerce.number().int().min(1),
    force: z.boolean().optional(),
  }),
  run: async (input, { client }) => {
    await client.products.deleteProductsAttributeTerm({
      path: { attribute_id: input.attribute_id, id: input.id },
      query: input.force != null ? { force: input.force } : undefined,
    });
    return buildToolSuccess(null);
  },
});

export const attributeWorkerWooTools = [
  listAttributesTool,
  getAttributeTool,
  createAttributeTool,
  updateAttributeTool,
  deleteAttributeTool,
  listAttributeTermsTool,
  getAttributeTermTool,
  createAttributeTermTool,
  updateAttributeTermTool,
  deleteAttributeTermTool,
];
