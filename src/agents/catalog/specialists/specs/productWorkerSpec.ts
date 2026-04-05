import { type CatalogSpecialistSpec } from './types';
import {
  getAttributeTermTool,
  getAttributeTool,
  listAttributeTermsTool,
  listAttributesTool,
} from '../tools/woo/attributeTools';
import { getCategoryTool, listCategoriesTool } from '../tools/woo/categoryTools';
import {
  appendProductAttributeTool,
  createProductTool,
  duplicateProductTool,
  getProductTool,
  listProductsTool,
  removeProductAttributeTool,
  updateProductTool,
} from '../tools/woo/productTools';
import { getVariationTool, listVariationsTool } from '../tools/woo/variationTools';

export const productWorkerSpec = {
  id: 'product-worker',
  tools: {
    domainRead: [listProductsTool, getProductTool],
    domainMutations: [
      createProductTool,
      updateProductTool,
      appendProductAttributeTool,
      removeProductAttributeTool,
      duplicateProductTool,
    ],
    researchRead: [
      listCategoriesTool,
      getCategoryTool,
      listAttributesTool,
      getAttributeTool,
      listAttributeTermsTool,
      getAttributeTermTool,
      listVariationsTool,
      getVariationTool,
    ],
  },
  worker: {
    responsibility: [
      'Ты работаешь только с родительской карточкой товара в рамках доступных tools: поиск/чтение, создание, обновление полей карточки, дублирование.',
      'Если итоговый факт или изменение относятся к конкретной variation, owner уже variation-worker, даже если lookup начинался рядом с товаром.',
      'Read-only доступ к variation нужен только как lookup-контекст; variation-specific mutation по-прежнему остаётся зоной variation-worker.',
    ],
    workflow: [
      'При создании variable product можно сразу передать initial attributes/default_attributes в products_create, если taxonomy уже подтверждена.',
      'На уже существующем товаре attributes/default_attributes меняй только через products_append_attribute и products_remove_attribute, не через products_update.',
      'Для variable product поля attributes и default_attributes относятся к родительскому товару и не заменяют список дочерних variation.',
    ],
    toolUsage: [
      'Для поиска товара обычно начинай с products_list, а когда нужен подтверждённый объект конкретного товара, переходи к products_read по ID.',
      'Если во входе есть permalink или URL товара, передавай url в products_list: tool сам извлечёт slug и выполнит точный lookup по slug.',
      'Если известен slug, ищи через slug; если известен SKU или строка может быть названием или SKU, предпочитай sku / search_name_or_sku; общий search оставляй для обычного текстового поиска.',
      'products_list и products_read возвращают сокращённую проекцию товара; не приписывай карточке поля, которых нет в payload конкретного tool result.',
      'Для подготовки product-owned шага ты можешь делать read-only lookup в соседних доменах: категории, глобальные атрибуты/term-ы и variation того же товара.',
      'Если запрошенный факт может различаться между variation (цена, SKU, сочетание опций и т.п.), не считай ответ завершённым на одних данных родителя.',
      'Lookup нужен только чтобы снять неопределённость перед твоим действием; не превращай его в самостоятельный workflow по созданию taxonomy, категорий или variation.',
    ],
    blockerRules: [
      'Если lookup показал, что категории, атрибута или term-а ещё нет и его нужно создать, не делай чужую mutation: верни blocker на category-worker или attribute-worker.',
      'Если после минимального lookup неоднозначность не снимается, не зацикливайся в поиске: верни failed с конкретным missingData.',
      'Если конечный шаг относится к variation, а не к родительскому товару, верни blocker на variation-worker.',
    ],
  },
  foreman: {
    routingSummary: [
      'Product-worker отвечает за создание и обновление родительской карточки товара, включая product-level categories, attributes и default_attributes.',
      'Если задача уходит в создание taxonomy, категорий или конкретных variation, ownership переходит в category-worker, attribute-worker или variation-worker; после подготовки prerequisite шаг возвращается в product-worker.',
    ],
    consultationSummary: [
      'Когда owner шага product-worker, а когда задачу должны вести category-worker, attribute-worker или variation-worker.',
      'Как product-worker использует lookup для подтверждения prerequisite-сущностей без чужой mutation.',
    ],
  },
} as const satisfies CatalogSpecialistSpec<'product-worker'>;
