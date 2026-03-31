type CatalogPlaybook = {
  id: string;
  summary: string;
  workerOrder: string[];
  instructions: string;
};

const catalogPlaybooks: CatalogPlaybook[] = [
  {
    id: 'add-simple-product',
    summary: 'Создать простой товар в статусе draft по owner-first схеме.',
    workerOrder: ['product-worker', 'category-worker (fallback)', 'product-worker (retry)'],
    instructions: `# Создание простого товара

Пошаговая процедура для создания простого (simple) товара в WooCommerce по owner-first схеме.

## Вводные

### Обязательные

- Название товара — строка, будет использовано как name
- Категория — название категории; при необходимости указать родительскую. Если не указана, category-worker подберёт или создаст подходящую на основе названия товара

### Опциональные

- Краткое описание — текст для short_description.

## Принцип routing

- Owner конечного действия — product-worker: именно он создаёт товар.
- product-worker сам пытается разрешить category_id по имени или частичному контексту через свои research tools.
- category-worker подключается только если lookup product-worker показал, что нужной категории ещё нет или её иерархию надо подготовить отдельной mutation.

## Шаги

### 1. Создание товара и lookup категории -> product-worker

Выполняется первым.

Задание worker-у:
- Создать черновик простого товара с переданными параметрами.
- Если категория дана именем или частичным контекстом, самому найти и подтвердить category_id через research tools.
- Если категория уже существует, использовать её без отдельного handoff в category-worker.
- Если lookup показал, что категории нет или сначала нужно создать parent/child prerequisite, вернуть blocker на category-worker, а не выполнять чужую mutation.

Вход:
- name
- type = simple
- status = draft
- short_description, если есть
- category name и parent category name, если даны

Ожидаемый результат при успехе:
- product_id
- permalink
- category_id

Ожидаемый результат при blocker:
- blocker.owner = category-worker
- blocker.kind = external_mutation_required
- причина, какая категория или parent prerequisite отсутствует

Критичность: высокая. Если не удалось, остановить процесс.

### 2. Подготовка категории -> category-worker

Выполняется только если шаг 1 вернул blocker на category-worker.

Задание worker-у:
- Найти или создать нужную категорию.
- Если указан родитель, подготовить корректную parent-child иерархию.

Ожидаемый результат:
- category_id
- parent_id (опционально)
- action
- name

Критичность: высокая. Если не удалось, остановить процесс.

### 3. Повторное создание товара -> product-worker

Выполняется только после успешного шага 2.

Задание worker-у:
- Повторить создание черновика простого товара уже с подтверждённым category_id.

Вход:
- name
- type = simple
- status = draft
- short_description, если есть
- categories = [{ id: category_id }] из шага 2

Ожидаемый результат:
- product_id
- permalink

Критичность: высокая. Если не удалось, остановить процесс целиком.

## Итог

Вернуть структурированный результат:
- product_id
- category_id
- что создано
- что не удалось при частичном результате`,
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
    instructions: `# Создание вариативного товара

Пошаговая процедура для создания вариативного (variable) товара в WooCommerce с атрибутами и автогенерацией вариаций по owner-first схеме.

## Вводные

### Обязательные

- Название товара — строка, будет использовано как name.
- Атрибуты — хотя бы один атрибут с перечнем значений.

### Опциональные

- Категория — название категории; при необходимости указать родительскую. Если не указана, category-worker подберёт или создаст подходящую на основе названия товара.
- Краткое описание — текст для short_description.

## Принцип routing

- Owner шага создания родительского variable product — product-worker.
- product-worker сам делает lookup категории, глобального attribute и term-ов, если они уже существуют.
- category-worker и attribute-worker подключаются только по blocker, когда prerequisite надо создать отдельной mutation.
- variation-worker нужен после создания родителя для генерации дочерних variation.

## Шаги

### 1. Создание родительского товара -> product-worker

Выполняется первым.

Задание worker-у:
- Создать черновик вариативного товара с привязанными атрибутами.
- Если категория дана именем, самому разрешить category_id через research tools, когда категория уже существует.
- Если атрибуты и их term-ы уже существуют глобально, самому разрешить attribute_id и term context через research tools.
- Если lookup показал, что категории нет и её нужно создать, вернуть blocker на category-worker.
- Если lookup показал, что глобального attribute или term-а нет и его нужно создать, вернуть blocker на attribute-worker.

Вход:
- name
- type = variable
- status = draft
- short_description, если есть
- category name и parent category name, если даны
- название атрибута
- список значений

Ожидаемый результат при успехе:
- product_id
- permalink
- category_id (если использовалась)
- attributes в product-level контексте родителя

Ожидаемый результат при blocker:
- blocker.owner = category-worker или attribute-worker
- blocker.kind = external_mutation_required
- причина, какой prerequisite отсутствует

Критичность: высокая. Если хотя бы один атрибут не удалось подготовить, остановить процесс.

### 2. Подготовка внешнего prerequisite -> category-worker или attribute-worker

Выполняется только если шаг 1 вернул blocker.

Задание worker-у:
- Если blocker.owner = category-worker, найти или создать нужную категорию и при необходимости её parent.
- Если blocker.owner = attribute-worker, найти глобальный атрибут, проверить значения и создать отсутствующие term-ы или сам атрибут.
- Если после первого fallback всё ещё нужен второй внешний prerequisite, перестрой план ещё раз и добавь только реально нужный шаг, не заставляй product-worker делать чужую mutation.

Вход:
- blocker.reason из шага 1
- category name / parent name или attribute name / values, смотря какой owner нужен

Ожидаемый результат:
- category_id или
- attribute_id
- attribute_name
- terms

Критичность: высокая. Если prerequisite не удалось подготовить, остановить процесс.

### 3. Повторное создание родительского товара -> product-worker

Выполняется только после успешной подготовки всех prerequisite-сущностей.

Задание worker-у:
- Повторить создание черновика вариативного товара уже с подтверждёнными category_id и taxonomy context.

Вход:
- name
- type = variable
- status = draft
- short_description, если есть
- categories = [{ id: category_id }] если категория была подготовлена отдельно
- attributes в формате WooCommerce product attributes на основе подготовленных attribute_id и term-ов

Ожидаемый результат:
- product_id
- permalink

Критичность: высокая. Если не удалось, остановить процесс.

### 4. Генерация вариаций -> variation-worker

Задание worker-у:
- Сгенерировать все вариации для товара по его атрибутам.

Вход:
- product_id из шага 1 или шага 3, смотря где был создан родитель

Ожидаемый результат:
- variation_ids
- count

Критичность: средняя. Если не удалось, вернуть частичный результат: товар создан, но вариации нужно добавить отдельно.

## Итог

Вернуть структурированный результат:
- product_id
- category_id
- список атрибутов с термами
- variation_ids и count
- что создано
- что не удалось`,
  }
];

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

export function getCatalogPlaybookInstructions(playbookId: string) {
  const playbook = catalogPlaybooks.find((candidate) => candidate.id === playbookId);
  if (!playbook) {
    return undefined;
  }

  return [
    `Playbook: ${playbook.id}`,
    `Сводка: ${playbook.summary}`,
    `Порядок воркеров: ${playbook.workerOrder.join(' -> ')}`,
    'Канонические инструкции:',
    playbook.instructions.trim(),
  ].join('\n');
}
