import { attributeWorkerWooTools } from '../specialists/shared/wooTools/attributeTools';
import { categoryWorkerWooTools } from '../specialists/shared/wooTools/categoryTools';
import { productWorkerWooTools } from '../specialists/shared/wooTools/productTools';
import { variationWorkerWooTools } from '../specialists/shared/wooTools/variationTools';

const t = (tool: { name: string }) => `\`${tool.name}\``;

/**
 * Краткий справочник инструментов воркеров для промпта catalog-agent (имена — как у модели: wc_v3_…).
 */
export function renderCatalogForemanWorkerCapabilities(): string {
  const [catList, catRead, catCreate, catUpdate, catDelete] = categoryWorkerWooTools;

  const [attrList, attrRead, attrCreate, attrUpdate, attrDelete, termList, termRead, termCreate, termUpdate, termDelete] =
    attributeWorkerWooTools;

  const [prodList, prodRead, prodCreate, prodUpdate, prodAppendAttr, prodRemoveAttr, prodDup] =
    productWorkerWooTools;

  const [varList, varRead, varCreate, varUpdate, varDelete, varBatch, varGen] = variationWorkerWooTools;

  return `## Возможности воркеров (инструменты)

### category-worker
- **Список и поиск категорий:** ${t(catList)} (search, parent), ${t(catRead)} (id)
- **Создание / изменение / удаление:** ${t(catCreate)}, ${t(catUpdate)}, ${t(catDelete)}

### attribute-worker
- **Глобальные атрибуты — список и чтение:** ${t(attrList)}, ${t(attrRead)} (id)
- **Атрибуты — создание / изменение / удаление:** ${t(attrCreate)}, ${t(attrUpdate)}, ${t(attrDelete)}
- **Термы атрибута — список и чтение:** ${t(termList)} (attribute_id), ${t(termRead)} (attribute_id, id)
- **Термы — создание / изменение / удаление:** ${t(termCreate)}, ${t(termUpdate)}, ${t(termDelete)}

### product-worker
- **Список и поиск товаров:** ${t(prodList)} (search, category, page, per_page), ${t(prodRead)} (id)
- **Создание / правка / дублирование:** ${t(prodCreate)}, ${t(prodUpdate)}, ${t(prodDup)}
- **Атрибуты на карточке (variable и др.):** ${t(prodAppendAttr)}, ${t(prodRemoveAttr)} — не через ${t(prodUpdate)}

### variation-worker
- **Список и чтение вариаций:** ${t(varList)} (product_id, …), ${t(varRead)} (product_id, id)
- **Создание / изменение / удаление вариации:** ${t(varCreate)}, ${t(varUpdate)}, ${t(varDelete)}
- **Пакет и генерация:** ${t(varBatch)} (product_id, body), ${t(varGen)} (product_id)`;
}
