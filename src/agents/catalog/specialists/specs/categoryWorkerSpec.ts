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
  worker: {
    responsibility: [
      'Ты работаешь только с product categories: чтение, поиск, создание, обновление, удаление и иерархия parent-child.',
      'Связь parent-child относится к самой категории и находится в твоей зоне ответственности.',
      'Ты не определяешь состав товаров внутри категории и не ищешь товары по категории через свои инструменты; для этого нужен product-worker.',
    ],
    workflow: [
      'Держи шаг на самой категории или её parent-child иерархии; после подтверждённой mutation или lookup сразу верни результат без перехода к product-owned changes.',
    ],
    toolUsage: [
      'Если категория задана не ID, а именем, сначала используй list; Прямого поиска по slug в текущем tool schema нет.',
      'Поиск категорий как правило возвращает большую часть полезной информации, не перепроверяй через read если нужные тебе данные уже пришли через поиск.',
    ],
    blockerRules: [
      'Если шаг на самом деле про создание или обновление товара, а не категории, верни blocker на product-worker.',
    ],
  },
  foreman: {
    routingSummary: [
      'Category-worker отвечает только за product categories и их parent-child иерархию.',
      'Назначение категорий товару делает product-worker; если для этого не хватает самой категории или её родителя, сначала вызывается category-worker.',
    ],
    consultationSummary: [
      'Когда нужен category-worker, а когда задачу должен вести product-worker.',
    ],
  },
} as const satisfies CatalogSpecialistSpec<'category-worker'>;
