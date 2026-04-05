type CatalogPlaybook = {
  id: string;
  summary: string;
  workerOrder: string[];
  whenToUse: string[];
  entrySignals: string[];
  planSkeleton: string[];
  fallbacks: string[];
  doneWhen: string[];
};

const catalogPlaybooks: CatalogPlaybook[] = [
  {
    id: 'add-simple-product',
    summary: 'Создать простой товар в статусе draft по owner-first схеме.',
    workerOrder: ['product-worker', 'category-worker (fallback)', 'product-worker (retry)'],
    whenToUse: [
      'Нужно создать новый simple product в статусе draft.',
      'Категория может быть дана именем или иерархическим контекстом, но не обязательно готовым `category_id`.',
    ],
    entrySignals: [
      'Есть `name` для товара.',
      'Нужно сохранить owner-first поток: сначала product-owner, затем fallback только при внешнем prerequisite.',
    ],
    planSkeleton: [
      'product-worker: попытаться создать draft simple product и самому подтвердить существующую категорию через lookup.',
      'category-worker: подключать только если product-worker вернул blocker на подготовку категории или parent-child иерархии.',
      'product-worker (retry): повторить создание товара с уже подтверждённым `category_id`.',
    ],
    fallbacks: [
      'Если категория остаётся неоднозначной после минимального lookup, остановиться и запросить уточнение category context.',
      'Если fallback создал только часть иерархии, перепланировать только недостающий шаг, а не весь сценарий заново.',
    ],
    doneWhen: [
      'Есть `product_id` созданного draft simple product.',
      'Если категория входила в задачу, в результате подтверждён её `category_id`.',
    ],
  },
  {
    id: 'add-variable-product',
    summary: 'Создать вариативный товар в статусе draft по owner-first схеме.',
    workerOrder: [
      'product-worker',
      'category-worker / attribute-worker (fallback)',
      'product-worker (retry)',
      'variation-worker',
    ],
    whenToUse: [
      'Нужно создать новый variable product в статусе draft и затем сгенерировать вариации.',
      'Во входе есть набор атрибутов и значений, но taxonomy context может потребовать lookup или внешнюю подготовку.',
    ],
    entrySignals: [
      'Есть `name` товара.',
      'Есть хотя бы один атрибут со списком значений.',
      'Категория может быть опциональной и задаваться не через готовый id.',
    ],
    planSkeleton: [
      'product-worker: попытаться создать родительский variable product, самостоятельно подтвердив существующие category/attribute/term сущности через lookup.',
      'category-worker или attribute-worker: подключать только по blocker, если нужно создать внешний prerequisite.',
      'product-worker (retry): повторить создание родителя с уже подтверждёнными category/taxonomy данными.',
      'variation-worker: сгенерировать вариации после того, как родитель и product-level attributes подтверждены.',
    ],
    fallbacks: [
      'Если после первого fallback нужен ещё один внешний prerequisite, перестроить план только под реально недостающую сущность.',
      'Если category или taxonomy context остаётся неоднозначным после минимального lookup, остановиться и запросить уточнение, а не продолжать вслепую.',
      'Если вариации не сгенерировались, вернуть частичный результат: родитель создан, но variation-step остался незавершённым.',
    ],
    doneWhen: [
      'Есть `product_id` родительского variable product.',
      'Подтверждены использованные category/attribute/term сущности.',
      'Если шаг генерации выполнялся успешно, есть `variation_ids` или подтверждённый `count`.',
    ],
  },
  {
    id: 'add-product-variation',
    summary: 'Создать конкретную variation у существующего variable товара по owner-first схеме.',
    workerOrder: ['variation-worker', 'product-worker / attribute-worker (fallback)', 'variation-worker (retry)'],
    whenToUse: [
      'Нужно создать одну variation у уже существующего variable product.',
      'У variation есть конкретные attribute values, но parent или taxonomy context могут быть заданы только частично.',
    ],
    entrySignals: [
      'Есть `product_id` или текстовый контекст родительского товара.',
      'Есть хотя бы один variation attribute с конкретным значением `option`.',
      'Могут присутствовать SKU, цены, статус или описание variation.',
    ],
    planSkeleton: [
      'variation-worker: подтвердить parent product и attribute context через lookup, затем создать variation, если все prerequisites уже на месте.',
      'product-worker или attribute-worker: подключать только если variation-worker вернул blocker на parent-level preparation или создание taxonomy.',
      'variation-worker (retry): повторить создание variation после подготовки недостающих сущностей.',
    ],
    fallbacks: [
      'Если родитель найден, но не готов для variation-owned шага, перепланировать подготовку только parent-level состояния.',
      'Если отсутствует глобальный attribute или term, передать подготовку attribute-worker, а не пытаться продолжать variation-step.',
      'Если parent или attribute context остаётся неоднозначным после минимального lookup, остановиться и запросить уточнение.',
    ],
    doneWhen: [
      'Есть `variation_id` и подтверждённый `product_id` родителя.',
      'Variation создана с подтверждённым attribute context.',
    ],
  }
];

function renderBulletSection(title: string, items: string[]) {
  return [title, ...items.map((item) => `- ${item}`)].join('\n');
}

function renderNumberedSection(title: string, items: string[]) {
  return [title, ...items.map((item, index) => `${index + 1}. ${item}`)].join('\n');
}

export function renderPlaybookIndexForPrompt() {
  return catalogPlaybooks
    .map((playbook) =>
      [
        `Playbook: ${playbook.id}`,
        `Сводка: ${playbook.summary}`,
        `Порядок воркеров: ${playbook.workerOrder.join(' -> ')}`,
      ].join('\n')
    )
    .join('\n\n---\n\n');
}

export function getCatalogPlaybookIds() {
  return catalogPlaybooks.map((playbook) => playbook.id);
}

export function getCatalogPlaybookTemplate(playbookId: string) {
  const playbook = catalogPlaybooks.find((candidate) => candidate.id === playbookId);
  if (!playbook) {
    return undefined;
  }

  return [
    `Playbook: ${playbook.id}`,
    `Сводка: ${playbook.summary}`,
    `Порядок воркеров: ${playbook.workerOrder.join(' -> ')}`,
    renderBulletSection('Когда использовать:', playbook.whenToUse),
    renderBulletSection('Сигналы входа:', playbook.entrySignals),
    renderNumberedSection('Скелет плана:', playbook.planSkeleton),
    renderBulletSection('Fallbacks:', playbook.fallbacks),
    renderBulletSection('Готово когда:', playbook.doneWhen),
  ].join('\n');
}
