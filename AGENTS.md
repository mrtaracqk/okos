# AGENTS.md

## Purpose
Okos is a Telegram AI assistant built on Bun + TypeScript. The important part for changes is not setup, but the runtime flow: Telegram update -> queue -> handlers -> LangGraph agent -> Redis-backed chat state -> Telegram response.

## Project Map
- `src/app.ts`: process entrypoint, Elysia HTTP server, Telegram bot bootstrap, auth guard, command handlers, media-group collection.
- `src/handlers.ts`: thin orchestration for text/photo flows and history clearing.
- `src/agents/main/graphs/main.graph.ts`: main LangGraph pipeline. Tools are registered here via `mainTools`.
- `src/agents/main/nodes/*`: response, summary, and memory nodes.
- `src/agents/main/tools/*`: search, weather, and reminder tools.
- `src/services/redis.ts`: persisted chat messages, summary, memory, and authorized users.
- `src/services/messageQueue.ts`: per-chat BullMQ queues; preserves sequential handling per user.
- `src/services/reminderQueue.ts`: global delayed reminder queue.
- `src/config.ts`: provider selection, model instances, queue/chat limits, env-driven defaults.

## Working Rules
- Keep `src/app.ts` and `src/handlers.ts` as orchestration layers. Put business logic into services, tools, or graph nodes.
- Preserve queue semantics. User messages are intentionally serialized per `chatId`; do not bypass `MessageQueueService` for normal inbound message handling.
- Treat Redis keys and stored message format as compatibility-sensitive. If you change storage shape or key names, document migration impact.
- When adding a new tool, register it in `mainTools` and verify the response agent can bind it without changing the graph flow accidentally.
- Keep the split between chat, utility, and vision models unless there is a strong reason to collapse it.
- Authentication is handled in `src/app.ts` and depends on Telegram usernames plus `OKOS_TOKEN`. Do not loosen this by accident.
- Photo handling is intentionally capped (`CHAT_CONFIG.maxPhotosInMessage`) and multi-photo messages are buffered briefly by `media_group_id`.

## Change Guidance
- For Telegram delivery behavior, inspect both `src/app.ts` and `src/services/telegram.ts`.
- For memory/summary bugs, inspect `src/handlers.ts`, `src/services/redis.ts`, and `src/agents/main/nodes/*` together.
- For reminder work, keep tool schema, BullMQ payload, and user-facing time formatting in sync.
- For provider-specific changes, check `src/config.ts` and `src/services/ai.ts` together; vision support differs by provider.

## Commands
- `bun dev`: local development with watch mode.
- `bun run build`: required minimum verification after code changes.
- `bun start`: run compiled app.

## Verification
- There is no automated test suite in the repository at the moment.
- After non-trivial changes, at minimum run `bun run build`.
- If you touched bot behavior, also smoke-test the relevant Telegram flow manually instead of relying on static inspection alone.

## Reference
Use `README.md` for environment variables, deployment modes, and Docker usage. Avoid duplicating that material here unless a code change depends on it.
