import { CATALOG_WORKER_IDS, type CatalogWorkerId } from './contracts/catalogWorkerId';

export type PlanWorkerOwner = CatalogWorkerId;

export type CatalogWorkerKnowledgeEntry = {
  id: CatalogWorkerId;
  ownershipRules: readonly string[];
  lookupRules: readonly string[];
  blockerRules: readonly string[];
};

const categoryWorkerKnowledge = {
  id: 'category-worker',
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
} as const satisfies CatalogWorkerKnowledgeEntry;

const attributeWorkerKnowledge = {
  id: 'attribute-worker',
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
} as const satisfies CatalogWorkerKnowledgeEntry;

const productWorkerKnowledge = {
  id: 'product-worker',
  ownershipRules: [
    'Ты работаешь только с родительской карточкой товара в рамках доступных tools: поиск/чтение, создание, обновление полей карточки, дублирование.',
    'При создании variable product можно сразу передать initial attributes/default_attributes в products_create, если taxonomy уже подтверждена.',
    'На уже существующем товаре attributes/default_attributes меняй только через products_append_attribute и products_remove_attribute, не через products_update.',
    'Для variable product поля attributes и default_attributes относятся к родительскому товару и не заменяют список дочерних variation.',
    'Read-only доступ к variation нужен только как lookup-контекст; variation-specific mutation по-прежнему остаётся зоной variation-worker.',
  ],
  lookupRules: [
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
} as const satisfies CatalogWorkerKnowledgeEntry;

const variationWorkerKnowledge = {
  id: 'variation-worker',
  ownershipRules: [
    'Ты работаешь только с дочерними variation существующего variable product.',
    'Чтение и изменение variation адресуются через пару product_id + variation id; если родитель не установлен во входе, сначала разреши его через доступный product lookup.',
    'Ты отвечаешь за факты и изменения конкретных variation: опции, цены, SKU, статусы и прочие поля строки вариации.',
    'Ты не меняешь поля родительского товара, его categories, общие attributes или default_attributes; это зона product-worker.',
    'Инструменты batch и generate применяй только для набора variation внутри уже определённого родительского товара.',
  ],
  lookupRules: [
    'Для подготовки variation-owned шага ты можешь делать read-only lookup родительского товара и глобальных атрибутов/term-ов, чтобы подтвердить product_id и attribute context.',
    'Lookup нужен только для подтверждения родителя, variation id и attribute context; не превращай его в самостоятельный workflow по созданию родителя или taxonomy.',
  ],
  blockerRules: [
    'Если родительский товар или нужная taxonomy отсутствуют и для продолжения их надо создать либо подготовить, верни blocker на product-worker или attribute-worker.',
    'Если после минимального lookup нельзя надёжно подтвердить product_id, variation id или attribute context, не зацикливайся: верни failed с конкретным missingData.',
    'Если конечный шаг относится к родительскому товару, а не к variation, верни blocker на product-worker.',
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
