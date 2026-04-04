import { type CatalogSpecialistSpec } from './types';
import {
  createCategoryTool,
  deleteCategoryTool,
  getCategoryTool,
  listCategoriesTool,
  updateCategoryTool,
} from '../tools/woo/categoryTools';

export const categoryWorkerSpec = {
  id: 'category-worker',
  tools: {
    domainRead: [listCategoriesTool, getCategoryTool],
    domainMutations: [createCategoryTool, updateCategoryTool, deleteCategoryTool],
    researchRead: [],
  },
  knowledge: {
    ownershipRules: [
      'Ты работаешь только с product categories: чтение, поиск, создание, обновление, удаление и иерархия parent-child.',
      'Связь parent-child относится к самой категории и находится в твоей зоне ответственности.',
      'Ты не определяешь состав товаров внутри категории и не ищешь товары по категории через свои инструменты; для этого нужен product-worker.',
    ],
    lookupRules: [
      'Если категория задана не ID, а именем, сначала используй list; Прямого поиска по slug в текущем tool schema нет.',
      'Поиск категорий как правило возвращает большую часть полезной информации, не перепроверяй через read если нужные тебе данные уже пришли через поиск.',
    ],
    blockerRules: [
      'Если шаг на самом деле про создание или обновление товара, а не категории, верни blocker на product-worker.',
    ],
  },
  routingRules: [
    'Категории на товаре: если конечный шаг — создать товар или обновить его categories, сначала product-worker; category-worker нужен только когда lookup product-worker показал, что категорию или её parent/child prerequisite надо создать или подготовить отдельно.',
    'Иерархия parent/child у категорий — category-worker.',
  ],
} as const satisfies CatalogSpecialistSpec<'category-worker'>;
