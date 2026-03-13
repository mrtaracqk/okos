type CatalogPlaybook = {
  id: string;
  summary: string;
  workerOrder: string[];
  instructions: string;
};

const catalogPlaybooks: CatalogPlaybook[] = [
  {
    id: 'add-simple-product',
    summary: 'Create a draft simple product after resolving its category.',
    workerOrder: ['category-worker', 'product-worker'],
    instructions: `# Создание простого товара

Пошаговая процедура для создания простого (simple) товара в WooCommerce.

## Вводные

### Обязательные

- Название товара — строка, будет использовано как name

### Опциональные

- Категория — название категории; при необходимости указать родительскую. Если не указана, category-worker подберёт или создаст подходящую на основе названия товара.
- Краткое описание — текст для short_description.

### Выводимые

- Тип товара = simple.
- Статус = draft, если не указано иное.

## Шаги

### 1. Категория -> category-worker

Выполняется всегда. Товар не создаётся без категории.

Задание worker-у:
- Если категория указана в задании, найти по названию. Если не найдена, создать.
- Если категория не указана, найти наиболее подходящую существующую категорию по названию товара. Если подходящей нет, создать новую.
- Если указана родительская категория, сначала найти или создать её, затем целевую с parent.

Ожидаемый результат:
- category_id
- parent_id
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
    summary: 'Create a draft variable product with attributes and generated variations.',
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

### Выводимые

- Тип товара = variable.
- Статус = draft, если не указано иное.

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
  },
  {
    id: 'get-product-info',
    summary: 'Read a product and return only the requested fields.',
    workerOrder: ['product-worker'],
    instructions: `# Получение информации о товаре

Пошаговая процедура для получения данных о товаре из WooCommerce. Возвращает только запрошенные поля.

## Вводные

### Обязательные

- Идентификатор товара — ID или SKU.

### Опциональные

- Список полей, которые нужно вернуть.

### Выводимые

- Если список полей не указан, вернуть только name, type и status.

## Шаги

### 1. Получение товара -> product-worker

Задание worker-у:
- Прочитать товар по переданному идентификатору.

Вход:
- id, если передан ID
- sku, если передан SKU

Ожидаемый результат:
- полный объект товара

Критичность: высокая. Если товар не найден или worker завершился с ошибкой, остановить процесс.

### 2. Фильтрация полей

Выполняется catalog-agent-ом, без делегирования:
- Если поля указаны, вернуть только их.
- Если поля не указаны, вернуть id, name, type, status.

Частый маппинг:
- цена -> price, regular_price, sale_price
- описание -> description
- краткое описание -> short_description
- категории -> categories
- атрибуты -> attributes
- остатки -> stock_quantity, stock_status, manage_stock
- изображения -> images
- вес или размеры -> weight, dimensions
- ссылка -> permalink
- SKU -> sku
- вариации -> variations
- теги -> tags

## Итог

Вернуть структурированный результат, содержащий только запрошенные данные.`,
  },
];

export function renderPlaybookIndexForPrompt() {
  return catalogPlaybooks
    .map((playbook) =>
      [
        `Playbook: ${playbook.id}`,
        `Summary: ${playbook.summary}`,
        `Worker order: ${playbook.workerOrder.join(' -> ')}`,
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
    `Summary: ${playbook.summary}`,
    `Worker order: ${playbook.workerOrder.join(' -> ')}`,
    'Canonical instructions:',
    playbook.instructions.trim(),
  ].join('\n');
}
