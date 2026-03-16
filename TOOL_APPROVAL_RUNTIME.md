# Runtime Approval Gate

## Цель

Добавить в `op-assistant` обязательный runtime-аппрув перед выполнением выбранных tool actions.

Решение должно:

- работать без MAG
- не требовать новых контейнеров и отдельных процессов
- не тащить approval flow в историю агента
- не зависеть концептуально от WooCommerce
- быть пригодным для выноса в другой проект или в будущий npm-пакет

## Что именно строим

Не "Woo-specific approval", а маленький переиспользуемый approval gate:

`run action -> check policy -> ask human -> wait -> run action`

Это не отдельный сервис. Это библиотечный слой внутри проекта, который потом можно вынести почти без переписывания.

## Граница решения

Нужно разделить код на три уровня.

### 1. Approval Core

Переиспользуемое ядро, не знающее ни про Woo, ни про Telegram, ни про LangGraph.

Оно отвечает за:

- решение, нужен ли аппрув
- запуск процесса ожидания
- timeout
- in-memory pending requests
- единый `approve-then-run` flow

### 2. Approval Channel Adapter

Тонкий адаптер конкретного канала общения с человеком.

Для первого этапа это Telegram adapter.

Он отвечает за:

- отправку approval message
- кнопки approve/reject
- разбор callback payload
- передачу решения обратно в core

### 3. Project Integration

Тонкая интеграция в `op-assistant`.

Она отвечает за:

- получение request context из Telegram update
- вызов approval gate перед фактическим выполнением action
- wiring Telegram callback handler

## Главный принцип

Центр архитектуры должен быть не в transport-слое Woo, а в generic approval gate.

То есть не:

`woocommerce transport owns approval`

а:

`woocommerce transport uses approval gate`

Это позволит потом:

- навесить аппрув на другие actions в этом же боте
- вынести логику в другой бот
- позже оформить core и adapters как npm-пакет

## Минимальный целевой API

### Approval policy

```ts
requiresApproval(actionName: string): boolean
```

Пока источник правил простой:

- локальная константа `Set<string>`

Никаких внешних policy engines.

### Approval gate

```ts
runWithApproval({
  actionName,
  args,
  context,
  execute,
}): Promise<Result>
```

Где:

- `actionName` — строковый идентификатор действия
- `args` — сериализуемые аргументы
- `context` — runtime-контекст текущего запроса
- `execute` — callback реального выполнения действия

Поведение:

- если аппрув не нужен, сразу вызывает `execute`
- если нужен, создаёт pending approval, ждёт решение и только после approve вызывает `execute`
- при reject/timeout/unavailable возвращает runtime error без вызова `execute`

### Approval adapter

```ts
sendApprovalRequest(...)
acknowledgeDecision(...)
parseDecisionPayload(...)
```

Это достаточно для первого этапа. Не нужно строить более абстрактную платформу.

## Runtime context

Нужен тонкий request-scoped context, доступный во время выполнения action.

Минимум:

- `chatId`
- `telegramUserId`
- `telegramUsername` при наличии

Он нужен не потому, что approval зависит от Telegram навсегда, а потому что текущий human approval channel у нас Telegram.

Контекст должен жить отдельно от graph state и prompts.

## Approval Core: что внутри

Внутри core достаточно следующих частей.

### 1. Policy

Константный набор action names, для которых нужен аппрув.

### 2. Pending store

In-memory `Map<approvalId, PendingApproval>`.

Храним только runtime-данные текущего процесса:

- approval id
- action name
- args
- context
- deadline
- resolve/reject hooks
- служебные metadata канала, если нужны

### 3. Timeout handling

На каждый pending approval ставится локальный timeout.

После timeout:

- pending request завершается
- `execute` не вызывается
- наружу возвращается runtime error

### 4. Error model

Нужны только простые типы ошибок:

- `approval_rejected`
- `approval_timeout`
- `approval_unavailable`

Этого достаточно для нормального поведения агента и логов.

## Telegram Adapter: что внутри

Telegram adapter должен быть отдельным модулем, а не частью core.

Он знает только про Telegram API и формат approval message.

Первый этап:

- одно сообщение
- inline buttons `Approve` / `Reject`
- callback data с минимальным payload для поиска pending approval

Пример текста:

```text
Подтверждаешь?
Действие: wc.v3.products_read
Аргументы: {"path":{"id":4335}}
```

Важно:

- сообщение отправляет тот же бот
- callback query обрабатывается отдельно от обычных входящих сообщений
- approval event не записывается в chat history агента

## Интеграция в `op-assistant`

### 1. Доступ к WooCommerce

`op-assistant` вызывает WooCommerce через in-app REST SDK (`wooClient`), без внешнего MCP или MAG. Настройка через `WOOCOMMERCE_REST_BASE_URL` и при необходимости consumer key/secret.

### 2. Approval gate вызывается перед фактическим action execution

Для текущего стека это значит:

- Woo tool (из `createWooTool`) при вызове попадает в `wooToolExecutor`
- `wooToolExecutor` вызывает `runToolWithApprovalWhenRequested(requiresApproval, …)` из `toolApproval`
- в gate передаются `actionName`, `args`, `context`, `execute`
- реальный вызов Woo API (через SDK) происходит только внутри `execute`

### 3. Жёсткая runtime-гарантия

Должен остаться один допустимый путь выполнения Woo action:

`tool -> wooToolExecutor -> approval gate (если requiresApproval) -> SDK execution`

Нельзя оставлять публичных обходных путей к реальному execution method.

### 4. Callback handler отдельно от агентного потока

Нужен отдельный Telegram callback handler, который:

- принимает approve/reject
- передаёт решение в approval core
- отвечает Telegram callback acknowledgment

Он не должен:

- идти в обычный message queue
- вызывать `handleMessage`
- попадать в историю графа

## Что делает решение переносимым

Переносимость достигается не "полной абстракцией всего", а правильным центром архитектуры.

Решение будет удобно вынести, если:

- core не зависит от Woo
- core не зависит от Telegram
- integration layer тонкий
- канал подтверждения заменяемый
- список approve-actions определяется снаружи

Тогда переиспользование выглядит просто:

- в другом боте подключается тот же core
- пишется другой adapter, если канал не Telegram
- вызывается тот же `runWithApproval(...)` вокруг нужных actions

## Что специально не делаем

Чтобы не усложнять внедрение, не делаем:

- отдельный сервис approval
- отдельный контейнер
- Redis/DB persistence
- recovery после restart
- многоуровневые policy rules
- универсальную plugin-platform
- сложную status model
- audit platform

Это сознательное ограничение первого решения.

## Негативные сценарии

Нужно корректно обработать:

- пользователь нажал reject
- пользователь не ответил вовремя
- callback пришёл на уже закрытый approval
- runtime context отсутствует
- процесс рестартовал, пока approval pending

Ожидаемое поведение:

- action не выполняется
- наружу возвращается простой runtime error
- потерянные pending approvals после рестарта не восстанавливаются

## Критерии качества

Решение считается удачным, если одновременно выполняется следующее:

- внедрение короткое и понятное
- approval обязателен на уровне runtime execution path
- Telegram approval flow изолирован от graph history
- можно навесить этот же gate на другие actions без переписывания core
- core потом можно вынести из проекта почти без изменений

## Практический рецепт внедрения

1. Использовать в `op-assistant` вызовы Woo через REST SDK (`wooClient`), без MCP.
2. Добавить request execution context для Telegram update scope.
3. Создать generic approval core внутри проекта.
4. Создать простой Telegram approval adapter.
5. Подключить callback handler отдельно от agent message flow.
6. Обернуть фактический Woo action execution в `runWithApproval(...)`.
7. Убедиться, что прямого обхода approval gate не осталось.

## Результат первого этапа

После внедрения у нас будет не "одноразовый Woo-хак", а компактный reusable слой:

- достаточно простой, чтобы быстро запустить
- достаточно качественный, чтобы не стыдно было вынести позже
- без лишней платформенной сложности
