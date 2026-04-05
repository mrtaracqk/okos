import { type CatalogSpecialistSpec } from './types';
import {
  getAttributeTermTool,
  getAttributeTool,
  listAttributeTermsTool,
  listAttributesTool,
} from '../tools/woo/attributeTools';
import { getProductTool, listProductsTool } from '../tools/woo/productTools';
import {
  batchVariationsTool,
  createVariationTool,
  deleteVariationTool,
  generateVariationsTool,
  getVariationTool,
  listVariationsTool,
  updateVariationTool,
} from '../tools/woo/variationTools';

export const variationWorkerSpec = {
  id: 'variation-worker',
  tools: {
    domainRead: [listVariationsTool, getVariationTool],
    domainMutations: [
      createVariationTool,
      updateVariationTool,
      deleteVariationTool,
      batchVariationsTool,
      generateVariationsTool,
    ],
    researchRead: [
      listProductsTool,
      getProductTool,
      listAttributesTool,
      getAttributeTool,
      listAttributeTermsTool,
      getAttributeTermTool,
    ],
  },
  worker: {
    responsibility: [
      'Ты работаешь только с дочерними variation существующего variable product.',
      'Чтение и изменение variation адресуются через пару product_id + variation id; если родитель не установлен во входе, сначала разреши его через доступный product lookup.',
      'Ты отвечаешь за факты и изменения конкретных variation: опции, цены, SKU, статусы и прочие поля строки вариации.',
      'Ты не меняешь поля родительского товара, его categories, общие attributes или default_attributes; это зона product-worker.',
    ],
    workflow: [
      'Инструменты batch и generate применяй только для набора variation внутри уже определённого родительского товара.',
    ],
    toolUsage: [
      'Для подготовки variation-owned шага ты можешь делать read-only lookup родительского товара и глобальных атрибутов/term-ов, чтобы подтвердить product_id и attribute context.',
      'Lookup нужен только для подтверждения родителя, variation id и attribute context; не превращай его в самостоятельный workflow по созданию родителя или taxonomy.',
    ],
    blockerRules: [
      'Если родительский товар или нужная taxonomy отсутствуют и для продолжения их надо создать либо подготовить, верни blocker на product-worker или attribute-worker.',
      'Если после минимального lookup нельзя надёжно подтвердить product_id, variation id или attribute context, не зацикливайся: верни failed с конкретным missingData.',
      'Если конечный шаг относится к родительскому товару, а не к variation, верни blocker на product-worker.',
    ],
  },
  foreman: {
    routingSummary: [
      'Variation-worker отвечает за чтение и изменение конкретных variation внутри уже определённого variable product.',
      'Изменения родительского товара ведёт product-worker; если для variation не хватает родителя или глобальной taxonomy, сначала вызывается product-worker или attribute-worker.',
    ],
    consultationSummary: [
      'Когда owner шага variation-worker, а когда задачу должен вести product-worker.',
      'Как variation-worker подтверждает product_id, variation id и attribute context перед mutation.',
    ],
  },
} as const satisfies CatalogSpecialistSpec<'variation-worker'>;
