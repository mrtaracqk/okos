# AGENTS.md

## Purpose
Okos is a Telegram AI assistant built on Bun + TypeScript. The important part for changes is not setup, but the runtime flow: Telegram update -> queue -> handlers -> LangGraph agent -> Redis-backed chat state -> Telegram response.

## Project Map
- `src/app.ts`: process entrypoint, Elysia HTTP server, Telegram bot bootstrap, auth guard, command handlers, media-group collection.
- `src/handlers.ts`: thin orchestration for text/photo flows and history clearing.
- `src/agents/main/graphs/main.graph.ts`: main LangGraph pipeline. Tools are registered here via `mainTools`.
- `src/agents/catalog/catalog.agent.ts`: catalog foreman that chooses playbooks, optionally inspects them, and delegates to workers.
- `src/agents/catalog/playbooks.ts`: canonical catalog playbook index and full playbook instructions stored in code.
- `src/agents/catalog/tools/generatedTransportTools.ts`: worker tool factories built from the generated WooCommerce registry.
- `src/generated/woocommerceTools.generated.ts`: generated WooCommerce tool registry plus worker allowlists from the committed snapshot.
- `src/agents/main/nodes/*`: response and memory nodes.
- `src/services/woocommerceTransport.ts`: runtime WooCommerce MCP client using the SDK over HTTP.
- `src/services/redis.ts`: persisted chat messages, memory, and authorized users.
- `src/services/messageQueue.ts`: per-chat BullMQ queues; preserves sequential handling per user.
- `src/config.ts`: provider selection, model instances, queue/chat limits, env-driven defaults.
- `src/mcpServers.ts`: MCP server registry and env-driven WooCommerce endpoint configuration.
- `tools/woocommerce/woocommerce-tools.snapshot.json`: committed `tools/list` snapshot used for generation.
- `tools/woocommerce/woocommerce-worker-toolsets.json`: worker-to-tool allowlist source used for generation.

## Working Rules
- Keep `src/app.ts` and `src/handlers.ts` as orchestration layers. Put business logic into services, tools, or graph nodes.
- Preserve queue semantics. User messages are intentionally serialized per `chatId`; do not bypass `MessageQueueService` for normal inbound message handling.
- Treat Redis keys and stored message format as compatibility-sensitive. If you change storage shape or key names, document migration impact.
- When adding a new tool, register it in `mainTools` and verify the response agent can bind it without changing the graph flow accidentally.
- Catalog workers are transport-agnostic. They know only their assigned tools; do not leak MCP protocol concepts into worker prompts.
- Keep catalog playbooks in `src/agents/catalog/playbooks.ts`, not in ad hoc temp folders or external prompt dumps.
- WooCommerce worker tools are generated from the committed snapshot. If the backend tool surface changes, update the snapshot, regenerate, and keep worker allowlists in sync.
- Keep the split between chat, utility, and vision models unless there is a strong reason to collapse it.
- Authentication is handled in `src/app.ts` and depends on Telegram usernames plus `OKOS_TOKEN`. Do not loosen this by accident.
- Photo handling is intentionally capped (`CHAT_CONFIG.maxPhotosInMessage`) and multi-photo messages are buffered briefly by `media_group_id`.

## Change Guidance
- For Telegram delivery behavior, inspect both `src/app.ts` and `src/services/telegram.ts`.
- For memory bugs, inspect `src/handlers.ts`, `src/services/redis.ts`, and `src/agents/main/nodes/*` together.
- For provider-specific changes, check `src/config.ts` and `src/services/ai.ts` together; vision support differs by provider.
- For catalog orchestration changes, inspect `src/agents/catalog/catalog.agent.ts`, `src/agents/catalog/playbooks.ts`, and the relevant worker file together.
- For WooCommerce transport issues, inspect `src/services/woocommerceTransport.ts`, `src/mcpServers.ts`, `tools/woocommerce/woocommerce-tools.snapshot.json`, and `src/generated/woocommerceTools.generated.ts` together.

## Commands
- `bun dev`: local development with watch mode.
- `bun run generate:woocommerce-tools`: regenerate the checked-in WooCommerce tool registry from the committed snapshot.
- `bun run typecheck`: run TypeScript without emitting files.
- `bun run build`: required minimum verification after code changes.
- `bun start`: run compiled app.

## Verification
- There is no automated test suite in the repository at the moment.
- After non-trivial changes, at minimum run `bun run build`.
- If you touched generated WooCommerce tools or transport integration, also run `bun run generate:woocommerce-tools` and `bun run typecheck`.
- If you touched bot behavior, also smoke-test the relevant Telegram flow manually instead of relying on static inspection alone.

## Reference
Use `README.md` for environment variables, deployment modes, and Docker usage. Avoid duplicating that material here unless a code change depends on it.
