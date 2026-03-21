type CatalogPlaybook = {
  id: string;
  summary: string;
  workerOrder: string[];
  instructions: string;
};

const catalogPlaybooks: CatalogPlaybook[] = [
  {
    id: 'add-simple-product',
    summary: 'Создать простой товар в статусе draft.',
    workerOrder: ['category-worker', 'product-worker'],
    instructions: `# Создание простого товара

Пошаговая процедура для создания простого (simple) товара в WooCommerce.

## Вводные

### Обязательные

- Название товара — строка, будет использовано как name
- Категория — название категории; при необходимости указать родительскую. Если не указана, category-worker подберёт или создаст подходящую на основе названия товара

### Опциональные

- Краткое описание — текст для short_description.

## Шаги

### 1. Категория -> category-worker

Выполняется всегда. Товар не создаётся без категории.

Задание worker-у:
- Если категория указана в задании, найти по названию. Если не найдена, создать.
- Если категория не указана, найти наиболее подходящую существующую категорию по названию товара. Если подходящей нет, создать новую.
- Если указана родительская категория, сначала найти или создать её, затем целевую с parent.

Ожидаемый результат:
- category_id
- parent_id (опционально)
- action
- name

Критичность: высокая. Если не удалось, остановить процесс.

### 2. Создание товара -> product-worker

Задание worker-у:
- Создать черновик простого товара с переданными параметрами.

Вход:
- name
- type = simple
- status = draft
- short_description, если есть
- categories = [{ id: category_id }] из шага 1

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
    summary: 'Создать вариативный товар в статусе draft',
    workerOrder: ['category-worker', 'attribute-worker', 'product-worker', 'variation-worker'],
    instructions: `# Создание вариативного товара

Пошаговая процедура для создания вариативного (variable) товара в WooCommerce с атрибутами и автогенерацией вариаций.

## Вводные

### Обязательные

- Название товара — строка, будет использовано как name.
- Атрибуты — хотя бы один атрибут с перечнем значений.

### Опциональные

- Категория — название категории; при необходимости указать родительскую. Если не указана, category-worker подберёт или создаст подходящую на основе названия товара.
- Краткое описание — текст для short_description.

## Шаги

### 1. Категория -> category-worker

Выполняется всегда. Товар не создаётся без категории.

Задание worker-у:
- Если категория указана, найти по названию. Если не найдена, создать.
- Если категория не указана, найти наиболее подходящую существующую категорию по названию товара. Если подходящей нет, создать новую.
- Если указана родительская категория, сначала найти или создать её, затем целевую с parent.

Ожидаемый результат:
- category_id
- parent_id
- action
- name

Критичность: высокая. Если не удалось, остановить процесс.

### 2. Атрибуты -> attribute-worker

Задание worker-у:
- Найти атрибут по названию.
- Проверить наличие указанных значений.
- Создать отсутствующие значения.

Вход:
- название атрибута
- список значений

Ожидаемый результат:
- attribute_id
- attribute_name
- terms

Критичность: высокая. Если хотя бы один атрибут не удалось подготовить, остановить процесс.

### 3. Создание товара -> product-worker

Задание worker-у:
- Создать черновик вариативного товара с привязанными атрибутами.

Вход:
- name
- type = variable
- status = draft
- short_description, если есть
- categories = [{ id: category_id }] из шага 1
- attributes из результатов шага 2 в формате WooCommerce product attributes

Ожидаемый результат:
- product_id
- permalink

Критичность: высокая. Если не удалось, остановить процесс.

### 4. Генерация вариаций -> variation-worker

Задание worker-у:
- Сгенерировать все вариации для товара по его атрибутам.

Вход:
- product_id из шага 3

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
