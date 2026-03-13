# LangGraph Orchestration

Этот файл описывает текущую оркестрацию агентов простыми словами.

## Модель

В системе есть три роли:

1. `main` агент
2. `catalog-agent`
3. worker-агенты:
   - `category-worker`
   - `attribute-worker`
   - `product-worker`
   - `variation-worker`

Смысл ролей:

- `main` это входная точка и финальный собеседник пользователя;
- `catalog-agent` это прораб;
- worker-ы это самостоятельные специалисты;
- WooCommerce backend это внешний transport layer, скрытый за tools.

## Главный принцип

Каждый worker остается самостоятельным агентом.

Это значит:

- у него свой prompt;
- у него свои tools;
- он может быть вызван отдельно;
- он не координирует других worker-ов.

Координация бригады живет только в `catalog-agent`.

## Полный flow

```text
Telegram update
-> authGuard / media-group buffering
-> MessageQueueService
-> handleMessage() или handlePhoto()
-> mainGraph
-> responseAgent
-> либо сразу финальный ответ
-> либо делегирование в catalog-agent
-> catalog-agent
-> при необходимости inspect_catalog_playbook
-> последовательные вызовы worker-агентов
-> worker tool loop вызывает только свои WooCommerce tools
-> catalog-agent собирает результат
-> mainGraph получает результат
-> responseAgent формирует финальный ответ пользователю
```

## Уровень 1: Main Graph

Файл: `src/agents/main/graphs/main.graph.ts`

`mainGraph` сейчас очень простой.

У него по сути две рабочие ноды:

- `responseAgent`
- `catalogAgent`

### `responseAgent`

Файл: `src/agents/main/nodes/responseAgent.node.ts`

Что делает:

- собирает system prompt главного агента;
- добавляет `chatId`, `summary`, `memory`;
- решает: ответить самому или делегировать в `catalog-agent`.

Для этого он умеет вызвать только один tool:

- `delegate_to_catalog_agent`

Важно:

- внутри основного `mainGraph` этот tool используется как сигнал для маршрутизации в ноду `catalogAgent`;
- сам tool при прямом вызове тоже исполняемый и умеет вызвать `runCatalogAgent()` напрямую;
- то есть в runtime Telegram-бота основная оркестрация идет через graph routing, а не через прямое выполнение tool-а моделью.

### `catalogAgent`

Это обычная нода верхнего графа.

Что делает:

- читает tool call `delegate_to_catalog_agent`;
- достает `userRequest`;
- показывает progress в Telegram runtime;
- вызывает `catalogAgentGraph`;
- получает от него итог;
- возвращает этот итог как `ToolMessage` обратно в `messages`.

После этого управление снова идет в `responseAgent`, и тот уже делает финальный user-facing ответ.

То есть сверху orchestration выглядит так:

```text
responseAgent
-> если нужен catalog work -> catalogAgent
-> responseAgent
-> end
```

## Уровень 2: Catalog Agent

Файл: `src/agents/catalog/catalog.agent.ts`

`catalog-agent` это прораб.

Он:

- анализирует задачу;
- выбирает подходящий playbook по краткому индексу;
- если нужно, читает полную инструкцию playbook-а через отдельный tool;
- решает, каких worker-ов вызывать;
- вызывает их по очереди;
- собирает их результаты;
- формирует итоговый каталоговый результат.

Важно:

- здесь больше нет graph-очереди делегаций;
- здесь нет отдельной state machine для каждого handoff;
- это обычный координирующий цикл внутри одного агента.

То есть `catalog-agent` работает так:

1. вызывает свою модель;
2. при необходимости вызывает `inspect_catalog_playbook`;
3. получает tool calls на worker-ов;
4. по очереди вызывает нужных worker-агентов;
5. добавляет их результаты обратно в диалог;
6. снова вызывает свою модель;
7. повторяет цикл, пока не получит финальный ответ.

По смыслу это именно прораб:

- сам не делает низкоуровневую работу;
- решает, кого позвать;
- следит за порядком шагов;
- собирает общий результат.

## Уровень 3: Worker-Агенты

Файлы:

- `src/agents/catalog/workers/category.worker.ts`
- `src/agents/catalog/workers/attribute.worker.ts`
- `src/agents/catalog/workers/product.worker.ts`
- `src/agents/catalog/workers/variation.worker.ts`

Каждый worker это самостоятельный mini-agent.

У каждого worker-а:

- свой prompt;
- свой набор доменных transport tools;
- свой внутренний agent/tool loop.

Общий шаблон лежит в:

- `src/agents/shared/toolLoopGraph.ts`

Шаблон одинаковый для всех:

```text
agent
-> если есть tool calls -> tools
-> tools -> agent
-> если tool calls закончились -> end
```

Что важно по полномочиям:

- `category-worker` работает только с категориями;
- `attribute-worker` работает только с attributes и terms;
- `product-worker` работает только с products;
- `variation-worker` работает только с variations.

Worker не вызывает других worker-ов. Он решает только свою узкую задачу.

Важно:

- worker не знает про MCP как концепцию;
- для worker-а существуют только tool names, schema и tool results;
- runtime transport слой живет отдельно в `src/services/woocommerceTransport.ts`.

## Playbooks

Файл:

- `src/agents/catalog/playbooks.ts`

Playbook-ы теперь хранятся в коде.

Как это работает:

- в system prompt `catalog-agent` попадает только краткий индекс playbook-ов;
- полная инструкция не закидывается в prompt целиком;
- если агенту нужны детали конкретного сценария, он вызывает tool:
  - `inspect_catalog_playbook`

Это позволяет:

- не раздувать system prompt;
- держать канонические сценарии рядом с кодом;
- оставлять lazy loading инструкций внутри agent loop.

## WooCommerce Tools

Worker tools теперь не mock и не hand-written per operation.

Источник:

- `tools/woocommerce/woocommerce-tools.snapshot.json`
- `tools/woocommerce/woocommerce-worker-toolsets.json`

Генерация:

- `tools/woocommerce/export-mcporter-tools.mjs`
- `src/generated/woocommerceTools.generated.ts`

Runtime:

- `src/services/woocommerceTransport.ts`
- `src/mcpServers.ts`

Смысл такой:

- snapshot фиксирует ожидаемый `tools/list`;
- generator строит локальный typed registry и allowlists;
- каждый worker получает только свой allowlist;
- runtime client через MCP SDK валидирует наличие нужных tool names и вызывает backend.

## Базовая визуализация

Цель визуализации сейчас не "показать идеальный граф каждого handoff".

Цель проще:

- видеть, был ли вызван `catalog-agent`;
- видеть, какие worker-агенты реально участвовали;
- видеть порядок их вызовов;
- видеть, чем закончился каждый вызов.

Для этого `catalog-agent` ведет `workerRuns`.

Каждый элемент в `workerRuns` это краткая запись:

- какой агент вызывался;
- с какой задачей;
- чем завершился:
  - `completed`
  - `failed`
  - `invalid`

Этого достаточно для базового понимания:

- “какие субагенты работали над задачей”
- “в каком порядке”
- “кто упал”

## Почему так проще

У предыдущего варианта была отдельная очередь делегаций в graph state.

Это давало более детальную graph-визуализацию, но делало систему тяжелее:

- больше технических нод;
- больше маршрутизации;
- больше edge cases;
- сложнее reasoning о сбоях.

Текущий вариант проще, потому что:

- сверху есть ясный `main -> catalog-agent`;
- внутри `catalog-agent` обычная последовательная координация;
- полные инструкции playbook-а подгружаются только по запросу;
- worker-ы остаются отдельными агентами;
- базовая наблюдаемость остается.

## Checkpoints

Файл: `src/agents/shared/checkpointing.ts`

Сейчас используется `MemorySaver`.

Как это устроено:

- основной `mainGraph` компилируется с `graphCheckpointer`;
- `catalog-agent` и worker-графы, которые вызываются как subgraph-и внутри основного run, компилируются с `checkpointer: true`;
- поэтому в основном Telegram runtime они наследуют checkpointing родительского run;
- отдельно есть root-варианты `catalog-agent` и worker-ов без checkpointer-а для прямого запуска вне родительского графа.

## Thread Model

`thread_id` формируется так:

```text
telegram-chat:<chatId>:run:<uuid>
```

Это значит:

- каждый входящий Telegram запрос создает отдельный LangGraph thread;
- checkpoints живут на уровне одного run;
- conversation history между сообщениями по-прежнему в основном хранится в Redis.
- последовательность пользовательских сообщений между run-ами обеспечивается очередью BullMQ, а не общим LangGraph thread на весь чат.

## Telegram и Studio

Есть два режима progress reporting:

- `telegramMainGraphProgressReporter`
- `noopMainGraphProgressReporter`

Идея такая:

- в обычном runtime можно отправлять промежуточный progress в Telegram;
- в Studio side effects отключаются.

Studio export лежит в:

- `src/studio/okos.graph.ts`
- `langgraph.json`

## Практическое резюме

Если совсем коротко:

- `main` это вход и финальный ответ;
- `catalog-agent` это прораб с lazy loading playbook-инструкций;
- worker-ы это самостоятельные специалисты со своими generated WooCommerce tools;
- MCP backend спрятан в runtime transport layer и не торчит в prompts;
- визуализация базовая, а не идеальная;
- архитектура упрощена так, чтобы было легче развивать систему дальше.
