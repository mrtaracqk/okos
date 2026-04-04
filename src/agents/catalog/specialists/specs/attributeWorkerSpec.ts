import { type CatalogSpecialistSpec } from './types';
import {
  createAttributeTermTool,
  createAttributeTool,
  deleteAttributeTermTool,
  deleteAttributeTool,
  getAttributeTermTool,
  getAttributeTool,
  listAttributeTermsTool,
  listAttributesTool,
  updateAttributeTermTool,
  updateAttributeTool,
} from '../tools/woo/attributeTools';

export const attributeWorkerSpec = {
  id: 'attribute-worker',
  tools: {
    domainRead: [listAttributesTool, getAttributeTool, listAttributeTermsTool, getAttributeTermTool],
    domainMutations: [
      createAttributeTool,
      updateAttributeTool,
      deleteAttributeTool,
      createAttributeTermTool,
      updateAttributeTermTool,
      deleteAttributeTermTool,
    ],
    researchRead: [],
  },
  knowledge: {
    ownershipRules: [
      'Ты управляешь только глобальными product attributes и их term-ами, а не полями конкретной карточки товара.',
      'Ты можешь подготовить taxonomy для вариативного товара, но не назначаешь атрибуты родительскому товару и не управляешь дочерними variation.',
      'Если задача про значения атрибутов у конкретного товара или variation, это уже зона product-worker или variation-worker.',
    ],
    lookupRules: [
      'Любая операция с term-ами привязана к конкретному attribute_id; прямого поиска term-а без attribute_id нет, поэтому если attribute ещё не установлен, сначала найди или прочитай сам атрибут.',
      'Перед созданием attribute или term-а сначала проверяй существующие сущности, чтобы не плодить дубликаты с тем же смыслом.',
    ],
    blockerRules: [
      'Если после lookup видно, что конечный шаг относится к карточке товара или к конкретной variation, верни blocker на product-worker или variation-worker.',
    ],
  },
  routingRules: [
    'Атрибуты на родителе variable: если конечный шаг — создать или обновить родительский товар либо его product-level attributes, сначала product-worker; attribute-worker нужен только когда lookup показал, что глобального attribute / term ещё нет и его надо создать.',
    'Глобальные атрибуты/термины — attribute-worker; родитель variable получает `attributes` через product-worker; сочетание опций на SKU — variation-worker.',
  ],
} as const satisfies CatalogSpecialistSpec<'attribute-worker'>;
