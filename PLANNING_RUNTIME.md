# Planning Runtime Plugin

## Цель

Добавить в `op-assistant` planning tool для бригадира каталога так, чтобы:

- план создавался в начале каталоговой работы;
- подзадачи были структурированными;
- прогресс показывался отдельным Telegram message с авто-edit;
- отметки о выполнении ставил сам бригадир;
- завершение плана было обязательной частью lifecycle;
- решение выглядело как отдельный runtime plugin, рядом с approval plugin.

## Обновленные требования

Планирование должно работать по следующим правилам:

- источник правды по статусам шагов: `catalog-agent`, а не автоматическая логика по `workerRuns`;
- каждый шаг плана имеет минимум:
  - `title`
  - `owner`
  - `status`
- `owner` должен быть одним из:
  - `category-worker`
  - `attribute-worker`
  - `product-worker`
  - `variation-worker`
  - `catalog-agent`
- шаги можно обновлять и уточнять по ходу работы, если реальность ушла от исходного плана;
- Telegram message с планом удаляется только если план завершен успешно;
- если run оборвался, message остается последним известным состоянием.

## Главный принцип

План не должен жить в истории агента и не должен быть частью chat memory.

То есть не:

`messages/history owns plan`

а:

`runtime planning plugin owns plan`

Агент только управляет этим планом через tool calls.

Это дает:

- чистую историю диалога без служебной шелухи;
- дешевое обновление одного Telegram message;
- явный lifecycle;
- единый паттерн с approval runtime.

## Почему не надо автоматически отмечать шаги по worker completion

Автоматическая синхронизация по циклу вызовов выглядит удобно, но не является достаточно строгой.

Проблемы:

- worker мог сделать не то, что ожидалось исходным шагом;
- бригадир мог сознательно изменить порядок работ;
- один worker call может закрывать несколько логических шагов;
- возможны отклонения от playbook и частичные результаты.

Поэтому:

- runtime не должен сам проставлять `completed`;
- статусы шагов меняет только `catalog-agent` через planning tool;
- runtime отвечает за lifecycle, валидацию и Telegram projection.

## Общая форма решения

Решение строится как отдельный runtime plugin, по тому же паттерну, что и approval.

### Целевой plugin layout

```text
src/runtime-plugins/
  approval/
    core.ts
    telegram-adapter.ts
    request-context.ts
    index.ts
  planning/
    core.ts
    telegram-adapter.ts
    types.ts
    tool.ts
    index.ts
  shared/
    runtime-plugin.types.ts
```

### Что сделать с текущим approval кодом

Текущий approval код уже структурно похож на plugin, но разложен по папкам:

- `src/approval/*`
- `src/services/toolApproval.ts`

Рецепт:

1. Перенести approval в `src/runtime-plugins/approval/*`.
2. Оставить тонкий compatibility layer, если нужно, чтобы не ломать импорт сразу.
3. Planning оформить по той же схеме именования.

Так по коду сразу будет видно:

- где runtime plugins;
- где у plugin core;
- где Telegram adapter;
- где project integration.

## Граница planning plugin

Planning plugin делится на три слоя.

### 1. Planning Core

Не знает про Telegram, LangGraph и WooCommerce.

Отвечает за:

- создание плана;
- обновление шагов;
- завершение плана;
- хранение runtime-снимка плана;
- строгий lifecycle;
- валидацию статусов и структуры.

### 2. Planning Telegram Adapter

Знает только про Telegram rendering.

Отвечает за:

- отправку plan message;
- edit существующего message;
- delete по успешному завершению;
- formatting checklist-style представления.

### 3. Project Integration

Тонкий слой интеграции в `op-assistant`.

Отвечает за:

- регистрацию planning tool для `catalog-agent`;
- binding текущего `chatId/runId`;
- обязательное создание плана перед worker delegation;
- обязательное закрытие плана в конце run.

## Runtime identity

План должен быть привязан не к чату и не к graph state, а к конкретному запуску.

Минимальный ключ:

- `runId = configurable.thread_id`

Источник:

- `createGraphRunConfig()` в `src/agents/shared/checkpointing.ts`

Дополнительные поля контекста:

- `chatId`
- `startedAt`
- `requestText`

Это позволяет:

- не смешивать параллельные прогоны;
- хранить план вне state graph;
- безопасно обновлять одно Telegram message на один run.

## Структура плана

Минимальная форма:

```ts
type PlanStepOwner =
  | 'catalog-agent'
  | 'category-worker'
  | 'attribute-worker'
  | 'product-worker'
  | 'variation-worker';

type PlanStepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'failed'
  | 'skipped';

type RuntimePlanStep = {
  stepId: string;
  title: string;
  owner: PlanStepOwner;
  status: PlanStepStatus;
  notes?: string;
};

type RuntimePlan = {
  runId: string;
  chatId: number;
  goal: string;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  steps: RuntimePlanStep[];
  telegramMessageId?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};
```

Важно:

- `stepId` генерируется runtime-слоем или передается бригадиром, но должен быть стабильным для последующих updates;
- `title` короткий, user-facing;
- `owner` обязателен;
- `notes` опциональны и короткие.

## Telegram rendering

План должен быть читаемым и дешевым в поддержке.

Пример:

```text
План выполнения
Цель: Создать вариативный товар iPhone 17

◻️ Определить или создать категорию
Ответственный: category-worker

✅ Подготовить атрибуты Color и Storage
Ответственный: attribute-worker

🔄 Создать draft variable product
Ответственный: product-worker

◻️ Сгенерировать вариации
Ответственный: variation-worker
```

Рекомендуемое отображение статусов:

- `pending` -> `◻️`
- `in_progress` -> `🔄`
- `completed` -> `✅`
- `blocked` -> `⛔`
- `failed` -> `❌`
- `skipped` -> `⏭️`

Правила:

- одно сообщение на один run;
- при `create` отправить message;
- при `update` делать `editMessageText`;
- при `completed` удалить message;
- при `failed` или `abandoned` оставить message как есть.

## Tool contract для бригадира

Нужен один tool для управления планом.

Например:

`manage_execution_plan`

### Операции tool-а

```ts
action: 'create' | 'update' | 'complete' | 'fail'
```

### `create`

Бригадир вызывает один раз после изучения задачи и playbook, но до первого worker handoff.

Аргументы:

- `goal`
- `steps[]`

Где каждый шаг содержит:

- `stepId`
- `title`
- `owner`
- `status`

Ограничения:

- хотя бы один шаг;
- `owner` только из разрешенного enum.

### `update`

Бригадир вызывает каждый раз, когда хочет:

- отметить шаг выполненным;
- поменять `in_progress`;
- пометить шаг `blocked/failed/skipped`;
- скорректировать состав плана.

Аргументы:

- `steps[]`
- `summaryNote?`

`steps[]` здесь должен передаваться целиком, а не patch-операциями.

Причина:

- меньше хрупкости;
- легче валидировать;
- Telegram rendering всегда получает полный снимок;
- проще объяснить агенту.

То есть tool работает как:

- `create plan snapshot`
- `replace plan snapshot`

а не как низкоуровневый diff-редактор.

### `complete`

Бригадир вызывает перед финальным ответом, если задача считается закрытой.

Поведение:

- plugin проверяет, что нет шага со статусом `in_progress`;
- меняет общий статус плана на `completed`;
- удаляет Telegram message.

### `fail`

Бригадир вызывает, если задача остановлена и нужна явная фиксация незавершенного плана.

Поведение:

- общий статус плана становится `failed`;
- Telegram message остается в чате;
- message можно один раз перерендерить с финальным статусом.

## Runtime enforcement

Planning plugin не должен быть только "soft convention" в prompt.

Нужны простые, но жесткие guardrails в коде.

### Правило 1. Нельзя звать worker до создания плана

Когда `catalog-agent` пытается вызвать:

- `run_category_worker`
- `run_attribute_worker`
- `run_product_worker`
- `run_variation_worker`

runtime сначала проверяет, что для текущего `runId` есть активный план.

Если плана нет:

- worker handoff не исполняется;
- агент получает `ToolMessage` с ошибкой вида `Create the execution plan first.`

### Правило 2. Run нельзя закончить с активным планом молча

В конце `catalog-agent` нужен `finally`, который делает одно из:

- подтверждает `completed`, если бригадир успел корректно завершить план;
- ставит `failed` или `abandoned`, если run вышел с незакрытым планом.

То есть незакрытый план не может быть просто потерян.

### Правило 3. Planning tool не пишет в history

Сообщение о плане:

- не сохраняется в Redis history;
- не попадает в `messages`;
- не становится частью prompt chain.

## Точка интеграции в текущем коде

Главная точка интеграции:

- `src/agents/catalog/catalog.agent.ts`

Именно там живет цикл бригадира, и именно там есть нужный контроль:

- после выбора playbook;
- до первого worker delegation;
- при завершении run;
- при ошибке.

### Что менять в `catalog.agent.ts`

1. Добавить planning tool в `catalogAgentTools`.
2. Дать бригадиру явную инструкцию:
   - сначала понять задачу;
   - при необходимости прочитать playbook;
   - создать structured plan;
   - только потом вызывать worker-ов;
   - по ходу работы обновлять план;
   - перед финальным ответом обязательно вызвать `complete` или `fail`.
3. Перед `executeWorkerHandoff()` проверять наличие активного плана.
4. Обернуть основной planner loop в `try/finally`.
5. В `finally` вызывать auto-finalization, если агент не закрыл план сам.

## Изменения в prompt

Prompt бригадира в `src/prompts.ts` должен быть усилен.

Новые обязательства:

- перед первым worker call создай execution plan;
- каждый шаг должен иметь `title` и `owner`;
- статусы шагов обновляй сам;
- если план изменился по ходу работы, обнови его целиком;
- до возврата финального ответа обязательно закрой план через planning tool.

Важно:

- prompt нужен как инструкция модели;
- enforcement все равно должен оставаться в runtime.

## Planning Core API

Минимальный API:

```ts
createPlan(input): Promise<RuntimePlan>
updatePlan(input): Promise<RuntimePlan>
completePlan(runId: string): Promise<RuntimePlan>
failPlan(runId: string, reason?: string): Promise<RuntimePlan>
getActivePlan(runId: string): RuntimePlan | null
finalizeDanglingPlan(runId: string): Promise<void>
```

`createPlan` и `updatePlan` должны:

- валидировать структуру шагов;
- запрещать несколько `in_progress`;
- обновлять Telegram projection через adapter.

## In-memory store: достаточно ли этого

Для текущего режима `op-assistant` in-memory store достаточен, как и в approval runtime.

Плюсы:

- быстро;
- дешево;
- не требует миграций Redis schema;
- хорошо подходит для ephemeral progress artifacts.

Ограничение:

- после рестарта активные планы теряются.

Это приемлемо для V1, если:

- незавершенный run после рестарта не обязан восстанавливаться;
- пользовательский финальный ответ все равно не был отправлен.

Если потом понадобится durability, тот же core можно перевести на Redis-backed store без смены внешнего tool contract.

## Поэтапный рецепт внедрения

### Этап 1. Выделить runtime plugins папку

Сделать новую структуру:

```text
src/runtime-plugins/
  approval/
  planning/
```

Перенести approval code в plugin-style layout.

### Этап 2. Собрать planning core

Добавить:

- `types.ts`
- `core.ts`
- `telegram-adapter.ts`
- `index.ts`

Сначала без tool integration, только lifecycle и rendering.

### Этап 3. Подключить planning tool к catalog-agent

В `catalog.agent.ts`:

- зарегистрировать `manage_execution_plan`;
- добавить runtime guard перед worker handoff;
- добавить strict finalization.

### Этап 4. Обновить prompt

В `src/prompts.ts`:

- описать обязательный порядок `playbook -> plan -> workers -> finalize`.

### Этап 5. Убрать конфликтующий progress UI

Сейчас верхний progress живет в:

- `src/agents/main/progress.ts`

Там используется sticker + typing.

Рецепт:

- sticker можно оставить только на короткий pre-plan этап;
- после создания plan message основной source of progress должен быть именно planning message.

### Этап 6. Smoke test

Проверить вручную:

1. каталоговый запрос стартует;
2. бригадир создает план;
3. сообщение появляется в Telegram;
4. после каждого `update` сообщение редактируется;
5. при успехе сообщение удаляется;
6. при fail остается;
7. worker call без плана блокируется;
8. выход из бригадира без `complete/fail` приводит к auto-finalization.

## Минимальный V1 scope

Чтобы не раздувать задачу, в первую версию стоит включить только это:

- один planning tool;
- полный snapshot update вместо patch API;
- in-memory store;
- один Telegram message;
- delete only on success;
- strict runtime guard;
- auto-finalization в `finally`.

Не включать в V1:

- nested plans;
- зависимости между шагами на уровне схемы;
- manual user callbacks на план;
- Redis persistence;
- отдельный UI для истории планов.

## Итоговая архитектурная формула

Planning и approval должны выглядеть как два соседних runtime plugin-а:

- approval plugin: `ask human -> wait decision -> continue`
- planning plugin: `create plan -> update plan -> close plan`

Общий подход одинаковый:

- runtime artifact вне agent history;
- Telegram adapter как projection layer;
- строгий lifecycle в коде;
- тонкая интеграция в `op-assistant`.

Это дает понятную кодовую базу и минимальную стоимость сопровождения.
