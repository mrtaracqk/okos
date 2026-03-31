import { CATALOG_WORKER_IDS, type CatalogWorkerId } from './contracts/catalogWorkerId';

/** Re-export for plan task schema (`responsible` / `executableTaskInputSchema`). */
export const PLAN_WORKER_OWNERS = CATALOG_WORKER_IDS;

export type PlanWorkerOwner = CatalogWorkerId;

export type CatalogWorkerKnowledgeEntry = {
  id: CatalogWorkerId;
  domainRules: readonly string[];
};

const categoryWorkerKnowledge = {
  id: 'category-worker',
  domainRules: [
    'Ты работаешь только с product categories: чтение, поиск, создание, обновление, удаление и иерархия parent-child.',
    'Если категория задана не ID, а именем, сначала используй list; когда нужен точный подтверждённый объект — read по ID. Прямого поиска по slug в текущем tool schema нет.',
    'Связь parent-child относится к самой категории и находится в твоей зоне ответственности.',
    'Ты можешь посмотреть категории конкретного товара, только если уже известен product_id и это помогает понять назначенные категории.',
    'Ты не определяешь состав товаров внутри категории и не ищешь товары по категории через свои инструменты; для этого нужен product-worker.',
    'Поиск категорий как правило возвращает большую часть полезной информации, не перепроверяй через read если нужные тебе данные уже пришли через поиск.',
  ],
} as const satisfies CatalogWorkerKnowledgeEntry;

const attributeWorkerKnowledge = {
  id: 'attribute-worker',
  domainRules: [
    'Ты управляешь только глобальными product attributes и их term-ами, а не полями конкретной карточки товара.',
    'Любая операция с term-ами привязана к конкретному attribute_id; прямого поиска term-а без attribute_id нет, поэтому если attribute ещё не установлен, сначала найди или прочитай сам атрибут.',
    'Перед созданием attribute или term-а сначала проверяй существующие сущности, чтобы не плодить дубликаты с тем же смыслом.',
    'Ты можешь подготовить taxonomy для вариативного товара, но не назначаешь атрибуты родительскому товару и не управляешь дочерними variation.',
    'Если задача про значения атрибутов у конкретного товара или variation, это уже зона product-worker или variation-worker.',
  ],
} as const satisfies CatalogWorkerKnowledgeEntry;

const productWorkerKnowledge = {
  id: 'product-worker',
  domainRules: [
    'Ты работаешь только с родительской карточкой товара в рамках доступных tools: поиск/чтение, создание, обновление полей карточки без attributes/default_attributes (name, regular_price, sku, status, описания и т.д.), дублирование.',
    'Атрибуты на товаре (и default при необходимости) меняй только через products_append_attribute и products_remove_attribute, не через products_update.',
    'Для поиска товара обычно начинай с products_list по search/status, а когда нужен подтверждённый объект конкретного товара, переходи к products_read по ID.',
    'products_list и products_read возвращают сокращённую проекцию товара; не приписывай карточке поля, которых нет в payload конкретного tool result.',
    'Для подготовки product-owned шага ты можешь делать read-only lookup в соседних доменах: категории, глобальные атрибуты/term-ы и variation того же товара.',
    'Если lookup показал, что категории, атрибута или term-а ещё нет и его нужно создать, не делай чужую mutation: верни blocker на category-worker или attribute-worker.',
    'Для variable product поля attributes и default_attributes относятся к родительскому товару и не заменяют список дочерних variation.',
    'Если запрошенный факт может различаться между variation (цена, SKU, сочетание опций и т.п.), не считай ответ завершённым на одних данных родителя.',
    'Read-only доступ к variation нужен только как lookup-контекст; variation-specific mutation по-прежнему остаётся зоной variation-worker.',
  ],
} as const satisfies CatalogWorkerKnowledgeEntry;

const variationWorkerKnowledge = {
  id: 'variation-worker',
  domainRules: [
    'Ты работаешь только с дочерними variation существующего variable product.',
    'Чтение и изменение variation адресуются через пару product_id + variation id; если родитель не установлен во входе, сначала разреши его через доступный product lookup.',
    'Ты отвечаешь за факты и изменения конкретных variation: опции, цены, SKU, статусы и прочие поля строки вариации.',
    'Для подготовки variation-owned шага ты можешь делать read-only lookup родительского товара и глобальных атрибутов/term-ов, чтобы подтвердить product_id и attribute context.',
    'Ты не меняешь поля родительского товара, его categories, общие attributes или default_attributes; это зона product-worker.',
    'Если родительский товар или нужная taxonomy отсутствуют и для продолжения их надо создать либо подготовить, верни blocker на product-worker или attribute-worker.',
    'Инструменты batch и generate применяй только для набора variation внутри уже определённого родительского товара.',
  ],
} as const satisfies CatalogWorkerKnowledgeEntry;

export const CATALOG_WORKER_ENTRIES: readonly CatalogWorkerKnowledgeEntry[] = [
  categoryWorkerKnowledge,
  attributeWorkerKnowledge,
  productWorkerKnowledge,
  variationWorkerKnowledge,
];

export const CATALOG_WORKER_KNOWLEDGE = {
  'category-worker': categoryWorkerKnowledge,
  'attribute-worker': attributeWorkerKnowledge,
  'product-worker': productWorkerKnowledge,
  'variation-worker': variationWorkerKnowledge,
} as const satisfies Record<CatalogWorkerId, CatalogWorkerKnowledgeEntry>;
