# AGENTS.md

## Purpose
Okos is a Telegram AI assistant built on Bun + TypeScript. The important part for changes is not setup, but the runtime flow: Telegram update -> queue -> handlers -> LangGraph agent -> Redis-backed chat state -> Telegram response.
Runtime observability now goes to Phoenix spans, not Telegram `SYSTEM LOG` messages.

## Project Map
- `src/app.ts`: process entrypoint, Elysia HTTP server, Telegram bot bootstrap, auth guard, command handlers; photo updates get a “not supported” reply.
- `src/handlers.ts`: thin orchestration for text message flow and history clearing.
- `src/observability/phoenix.ts`: Phoenix/OpenTelemetry bootstrap. Must initialize before LangChain runtime starts doing work.
- `src/observability/traceContext.ts`: tracing helpers for root turn spans, graph spans, worker spans, and shared trace attributes.
- `src/agents/main/graphs/main.graph.ts`: main LangGraph pipeline. Tools are registered here via `mainTools`.
- `src/agents/catalog/`: catalog foreman, playbooks, and worker specialists (product, category, attribute, variation).
- `src/agents/catalog/playbooks/`: canonical catalog playbook index and full playbook instructions stored in code.
- `src/agents/catalog/specialists/shared/wooTools/`: Woo tool factory (`createWooTool`), product/category/attribute/variation tool sets; workers use these directly.
- `src/agents/main/nodes/*`: response and memory nodes.
- `src/services/woo/wooClient.ts`: Woo REST client from env (`WOOCOMMERCE_REST_BASE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`).
- `src/services/wooToolExecutor.ts`: runs Woo tools (approval when `requiresApproval`), normalizes results, tracing.
- `src/services/wooToolResult.ts`: shared types and helpers for tool results (`NormalizedToolResult`, `buildToolSuccess`, `normalizeToolFailure`, etc.).
- `src/services/toolApproval.ts`: approval gate for mutating tools; used only when a tool declares `requiresApproval: true`.
- `src/services/redis.ts`: persisted chat messages, memory, and authorized users.
- `src/services/messageQueue.ts`: per-chat BullMQ queues; preserves sequential handling per user.
- `src/config.ts`: provider selection, model instances, queue/chat limits, env-driven defaults.

## Working Rules
- Keep `src/app.ts` and `src/handlers.ts` as orchestration layers. Put business logic into services, tools, or graph nodes.
- Preserve Phoenix bootstrap order. If tracing is enabled, `src/observability/phoenix.ts` must load before model creation and graph execution.
- Preserve queue semantics. User messages are intentionally serialized per `chatId`; do not bypass `MessageQueueService` for normal inbound message handling.
- Treat Redis keys and stored message format as compatibility-sensitive. If you change storage shape or key names, document migration impact.
- When adding a new tool, register it in `mainTools` and verify the response agent can bind it without changing the graph flow accidentally.
- Catalog workers are transport-agnostic. They know only their assigned tools (from `wooTools/*`); do not leak transport or protocol details into worker prompts.
- Keep catalog playbooks in `src/agents/catalog/playbooks/`; playbook content lives in code, not in external dumps.
- WooCommerce catalog tools are defined in `src/agents/catalog/specialists/shared/wooTools/` (productTools, categoryTools, attributeTools, variationTools). Add or change tools there; approval is per-tool via `requiresApproval` in `createWooTool`.
- Keep the split between chat and utility models unless there is a strong reason to collapse it.
- Authentication is handled in `src/app.ts` and depends on Telegram usernames plus `OKOS_TOKEN`. Do not loosen this by accident.
- Photo messages are not passed into the graph; `bot.on('photo')` replies that images are unsupported.
- Do not reintroduce technical Telegram `SYSTEM LOG` messages for orchestration debugging. Prefer Phoenix spans and structured span attributes.

## Tracing Minimum
- Root span for one inbound Telegram turn: `assistant.turn`
- Main graph spans: `main_graph.invoke`, `main_graph.response_agent`, `main_graph.catalog_agent_handoff`, `main_graph.final_response`
- Catalog spans (subgraph under `main_graph.catalog_agent_handoff`): `catalog_agent.invoke`, `catalog_agent.planner`, `catalog_agent.planner_iteration`, `catalog_agent.dispatch_tools`, `catalog_agent.new_execution_plan`, `catalog_agent.approve_step`, `catalog_agent.finish_execution_plan`, `catalog_agent.worker_handoff`, `catalog_agent.inspect_playbook`, optional legacy `catalog_agent.manage_execution_plan`
- Worker spans: `worker.tool_loop.agent`, `worker.tool_call`

If a change affects orchestration, preserve trace continuity and useful attributes such as `session.id`, `user.id`, `run.thread_id`, worker/tool names, and failure metadata.

## Change Guidance
- For Telegram delivery behavior, inspect both `src/app.ts` and `src/services/telegram.ts`.
- For memory bugs, inspect `src/handlers.ts`, `src/services/redis.ts`, and `src/agents/main/nodes/*` together.
- For provider-specific changes, check `src/config.ts` and `src/services/openAIChatModelConfig.ts` (OpenAI chat model name / `/set_model`).
- For catalog orchestration changes, inspect `src/agents/catalog/foreman/` (graph, `toolDispatcher`, `state`), `src/agents/catalog/playbooks/`, and the relevant worker file together.
- For WooCommerce tool execution, inspect `src/services/woo/wooClient.ts`, `src/services/wooToolExecutor.ts`, `src/services/toolApproval.ts`, and the relevant `src/agents/catalog/specialists/shared/wooTools/*.ts` together.
- For observability or missing-trace issues, inspect `src/observability/phoenix.ts`, `src/observability/traceContext.ts`, `src/handlers.ts`, and the affected graph/service together.

## Commands
- `bun dev`: local development with watch mode.
- `bun run typecheck`: run TypeScript without emitting files.
- `bun run build`: required minimum verification after code changes.
- `bun start`: run compiled app.

## Verification
- There is a Bun test suite in the repository.
- After non-trivial changes, at minimum run `bun run typecheck`, `bun run build`, and `bun test`.
- If you touched bot behavior or tracing, also smoke-test the relevant Telegram flow manually and verify the trace tree in Phoenix.

## Reference
Use `README.md` for environment variables, deployment modes, and Docker usage. Avoid duplicating that material here unless a code change depends on it.
