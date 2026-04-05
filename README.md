# Okos - AI Telegram Assistant

[![Build](https://github.com/johnnybui/okos/actions/workflows/build.yml/badge.svg)](https://github.com/johnnybui/okos/actions/workflows/build.yml)

Okos is a Telegram AI Assistant built with TypeScript, LangGraph, and cloud AI model providers. It maintains conversation context and user memory. Version 2 (current) uses native tool capabilities of modern LLMs for enhanced performance.

## Features

- Multiple AI model support (OpenAI, Google Gemini, Groq)
- Native tool use for enhanced performance and reliability
- Catalog orchestration with `main -> catalog-agent -> worker-agents`
- WooCommerce catalog workers backed by in-app Woo REST SDK; tools defined in code with per-tool approval for mutating actions
- Phoenix tracing for runtime inspection of assistant turns and agent orchestration
- Conversation context management
- Message queuing system with BullMQ to prevent overlapping workflows
- Redis for state persistence and job queuing
- User authentication system with token-based access control
- Docker support for both local and cloud deployments

## Prerequisites

- Bun 1.2 (for development only)
- Docker and Docker Compose (for containerized deployment)
- Telegram Bot Token from [BotFather](https://t.me/botfather)
- API keys for chosen AI providers
- Redis server
- **Important:** For chat models, you must use models with native tool-calling capabilities (e.g., GPT-4-class, Gemini with tools)

## Prebuilt Docker Image

```
ghcr.io/johnnybui/okos
```

Platforms: `amd64` and `arm64`

## Setup

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Copy the example environment file:

```bash
# For local development
cp .env.example .env

# For Docker deployment
cp .env.docker.example .env.docker
```

4. Configure environment variables in `.env` or `.env.docker`:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `OKOS_TOKEN`: Access token for user authentication
- `OKOS_ADMIN_USERNAME`: Telegram username of the admin user
- `MODEL_PROVIDER`: Choose from 'openai', 'google', or 'groq'
- Provider-specific API keys and model names
- `OPENAI_BASE_URL` for OpenAI-compatible endpoints (optional)
- Redis URL
- WooCommerce REST API URL and optional consumer key/secret for catalog tools
- Phoenix tracing endpoint
- (Optional) LangSmith credentials for monitoring

## Running Locally

Development mode with hot reload:

```bash
cp .env.example .env
# set MODEL_PROVIDER to openai, google, or groq
# set REDIS_URL=redis://localhost:6379
bun up:dev
bun dev
```

For local development, `docker-compose.dev.yml` starts only Redis. The bot runs on your host via `bun dev`, so you keep hot reload and use cloud providers directly.

If you use the WooCommerce catalog flow, set the WooCommerce REST API in `.env`:

```bash
WOOCOMMERCE_REST_BASE_URL=https://your-store.com/wp-json/wc/v3
# optional for authenticated requests
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
```

Mutating WooCommerce actions (create/update) are guarded by a runtime Telegram approval step; only tools that declare `requiresApproval: true` go through the gate. By default the assistant waits up to 5 minutes for approval before failing the action. Override this with `WOOCOMMERCE_APPROVAL_TIMEOUT_MS` if needed.

If you want runtime traces in Phoenix, also set:

```bash
PHOENIX_ENABLED=true
PHOENIX_PROJECT_NAME=op-bot-local
PHOENIX_COLLECTOR_ENDPOINT=http://localhost:6006
```

In the local Docker stack the collector is available as `http://phoenix:6006` from inside the `op-assistant` container, and the Phoenix UI is exposed on `http://127.0.0.1:6006`.

Because `op-assistant` runs on Bun, LangChain auto-instrumentation is currently skipped there. Phoenix still receives the manual runtime spans emitted by the app (`assistant.turn`, catalog/worker spans, Woo tool execution spans).

Production mode:

```bash
bun run build
bun start
```

## Docker Deployment

Cloud deployment:

1. **Build Containers** (optional):  
   Replace `build: .` in `docker-compose-cloud.yml` with the prebuilt image if desired:
   ```yaml
   image: ghcr.io/johnnybui/okos
   ```
   Run build:
   ```bash
   bun build:cloud
   ```
2. **Start Services**:
   ```bash
   bun up:cloud
   ```

## Environment Variables

### Required

- `TELEGRAM_BOT_TOKEN`: Telegram Bot token
- `OKOS_TOKEN`: Access token for user authentication
- `OKOS_ADMIN_USERNAME`: Telegram username of the admin user
- `MODEL_PROVIDER`: AI model provider ('openai', 'google', or 'groq')
- `REDIS_URL`: Redis connection URL
- `WOOCOMMERCE_REST_BASE_URL`: WooCommerce REST API base URL (e.g. `https://your-store.com/wp-json/wc/v3`)
- `WOOCOMMERCE_CONSUMER_KEY`: Optional consumer key for authenticated Woo REST requests
- `WOOCOMMERCE_CONSUMER_SECRET`: Optional consumer secret for authenticated Woo REST requests

### Provider-Specific

- OpenAI:
  - `OPENAI_API_KEY`
  - `OPENAI_BASE_URL` (optional, example: `https://polza.ai/api/v1`) - For OpenAI-compatible providers
  - `OPENAI_MODEL_NAME` (required) - Must support native tool use; `.env.example` suggests `gpt-4o`
  - `OPENAI_UTILITY_MODEL_NAME` (required) - For utility tasks; `.env.example` suggests `gpt-4o-mini`
- Google:
  - `GOOGLE_API_KEY`
  - `GOOGLE_MODEL_NAME` - Chat model; if unset, defaults to `gemini-1.5-pro` in code
  - `GOOGLE_UTILITY_MODEL_NAME` - If unset, defaults to `gemini-1.5-flash` in code
- Groq:
  - `GROQ_API_KEY`
  - `GROQ_MODEL_NAME` - Chat model; if unset, defaults to `gemma2-9b-it` in code
  - `GROQ_UTILITY_MODEL_NAME` - If unset, defaults to `llama-3.1-8b-instant` in code
### Optional

- `OPENAI_VISION_MODEL_NAME`, `GOOGLE_VISION_MODEL_NAME`, `GROQ_VISION_MODEL_NAME` — listed in `.env.example` only; **not read** by `src/config.ts`. Telegram photo messages are rejected.

- `LANGCHAIN_TRACING_V2`: Enable LangSmith tracing
- `LANGCHAIN_ENDPOINT`: LangSmith endpoint
- `LANGCHAIN_API_KEY`: LangSmith API key
- `LANGCHAIN_PROJECT`: LangSmith project name
- `PHOENIX_ENABLED`: Enable Phoenix/OpenTelemetry tracing for runtime graph execution
- `PHOENIX_PROJECT_NAME`: Phoenix project name shown in the UI
- `PHOENIX_COLLECTOR_ENDPOINT`: Base Phoenix collector URL, for local stack use `http://phoenix:6006`
- `WOOCOMMERCE_APPROVAL_TIMEOUT_MS`: Runtime approval timeout in milliseconds for mutating WooCommerce actions (default: `300000`)

## Catalog Orchestration

Catalog work is handled by a dedicated orchestration layer:

- `main` delegates catalog-domain requests to `catalog-agent`
- `catalog-agent` selects a playbook, optionally inspects full playbook instructions, and delegates to workers
- workers are narrow specialists for categories, attributes, products, and variations
- workers only see their own assigned tools (from `wooTools`); execution is via in-app Woo REST SDK

Canonical playbooks live in code under `src/agents/catalog/playbooks/` (entry `index.ts`).

## Runtime Tracing

Phoenix is the primary runtime tracing backend for `op-assistant`.

- One Telegram user turn maps to root span `assistant.turn`
- Main orchestration is traced through spans like `main_graph.invoke`, `main_graph.response_agent`, and `main_graph.catalog_agent_handoff`
- Catalog planning and execution are traced through `catalog_agent.invoke` (inside `main_graph.catalog_agent_handoff`), `catalog_agent.planner_iteration`, `catalog_agent.new_execution_plan`, `catalog_agent.approve_step`, `catalog_agent.finish_catalog_turn`, `catalog_agent.worker_handoff`, `worker.tool_loop.agent`, and `worker.tool_call`

Technical execution logs are no longer sent back to Telegram as `SYSTEM LOG`. For debugging orchestration, inspect Phoenix first.
On Bun, these traces currently come from the app's manual spans; LangChain auto-instrumentation is not enabled there.

## WooCommerce catalog tools

Catalog workers use Woo tools defined in code under `src/agents/catalog/specialists/shared/wooTools/` (product, category, attribute, variation). Each tool is created via `createWooTool(spec)`; execution goes through `wooToolExecutor` and the Woo REST client (`wooClient`). Set `WOOCOMMERCE_REST_BASE_URL` (and optionally consumer key/secret) for live API access. Tools that mutate data can set `requiresApproval: true` so the runtime asks for Telegram approval before running.

## Message Queue System

Okos uses BullMQ to implement robust message processing that ensures:

- Messages from the same user are processed sequentially
- Multiple users can be served concurrently
- The system can handle high loads without crashing
- Failed jobs are properly retried and logged

The system implements one specialized queue:

1. **Message Queue** - Handles incoming user messages and ensures sequential processing

Queue behavior is implemented in `src/services/messageQueue.ts` (BullMQ, sequential processing per chat).

## Available Tools

Okos provides WooCommerce catalog tools for catalog operations:
   - Categories, attributes, products, and variations are handled by separate worker agents
   - Tool definitions live in `src/agents/catalog/specialists/shared/wooTools/`
   - Runtime execution uses the in-app Woo REST SDK (`WOOCOMMERCE_REST_BASE_URL` and optional credentials)

## Authentication System

Okos includes a robust authentication system to control who can access and use the bot:

1. **Token-based Authentication**
   - New users must provide the correct access token (`OKOS_TOKEN`) to use the bot
   - Once authenticated, usernames are stored in Redis for persistent access
   - Unauthorized users receive a prompt to enter the token

2. **Admin Controls**
   - Admin user (defined by `OKOS_ADMIN_USERNAME`) has special privileges
   - Admin commands:
     - `/list_users` - View all authorized users
     - `/remove_user <username>` - Remove a user's access
     - `/set_model` - Choose chat model preset (inline buttons); applies until process restart

3. **Command Access**
   - Basic commands like `/clear_messages` and `/clear_all` are available to all users
   - Admin commands are restricted to the designated admin user
   - All other bot features require authentication

This system ensures that only authorized users can interact with your bot while providing administrative tools to manage access.

## Model Configuration

Okos uses two model tiers for chat and utility work:

1. **Chat Model** - The primary model for user interactions

   - **Must support native tool use** (e.g., GPT-4o, Gemini with tools)
   - Handles the main conversation flow and tool invocation
   - For the OpenAI provider, the default comes from `OPENAI_MODEL_NAME`; the admin can override it at runtime with `/set_model` (inline presets, e.g. `gpt-5.3-chat` / `gpt-5.4-mini` / `gpt-5.4`)

2. **Utility Model** - For internal utility tasks

   - Used for memory management and other lightweight internal tasks
   - Can be smaller/cheaper models as they don't require tool use

Telegram photo messages are not processed by the assistant (users get a short notice). Legacy `*_VISION_MODEL_NAME` entries in `.env.example` are unused by the current code.

## Archive Version

An older version of Okos (v1) is available that supports all LLM models for chat functionality, as it used a classifier-based approach instead of native tool use. This version is no longer maintained but may be useful for those using models without native tool capabilities.

- Archive repository: [https://github.com/johnnybui/okos/tree/okos-v1](https://github.com/johnnybui/okos/tree/okos-v1)
- Note: The v1 version has fewer features compared to the current version.

## License

MIT
