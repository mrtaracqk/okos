# Okos - AI Telegram Assistant

[![Build](https://github.com/johnnybui/okos/actions/workflows/build.yml/badge.svg)](https://github.com/johnnybui/okos/actions/workflows/build.yml)

Okos is a Telegram AI Assistant built with TypeScript, LangGraph, and cloud AI model providers. It maintains conversation context and user memory. Version 2 (current) uses native tool capabilities of modern LLMs for enhanced performance.

## Features

- Multiple AI model support (OpenAI, Google Gemini, Groq)
- Native tool use for enhanced performance and reliability
- Catalog orchestration with `main -> catalog-agent -> worker-agents`
- WooCommerce catalog workers backed by an MCP server over HTTP
- Build-time generated WooCommerce tool registry with worker-specific allowlists
- Conversation context management
- Multiple Images input support
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
- **Important:** For chat models, you must use models with native tool-calling capabilities (e.g., GPT-4o, Gemini-2.0-flash)

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
- WooCommerce MCP endpoint and token
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

If you use the WooCommerce catalog flow, make sure the WooCommerce MCP server is reachable from the app and that `.env` includes:

```bash
WOOCOMMERCE_MCP_BASE_URL=http://woo-mcp:3000/mcp
# optional when the MCP endpoint is protected
WOOCOMMERCE_MCP_TOKEN=your_token
```

Mutating WooCommerce actions are guarded by a runtime Telegram approval step. By default the assistant waits up to 5 minutes for approval before failing the action. Override this with `WOOCOMMERCE_APPROVAL_TIMEOUT_MS` if needed.

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
- `WOOCOMMERCE_MCP_BASE_URL`: Full URL of the WooCommerce MCP endpoint
- `WOOCOMMERCE_MCP_TOKEN`: Optional bearer token for the WooCommerce MCP endpoint

### Provider-Specific

- OpenAI:
  - `OPENAI_API_KEY`
  - `OPENAI_BASE_URL` (optional, example: `https://polza.ai/api/v1`) - For OpenAI-compatible providers
  - `OPENAI_MODEL_NAME` (default: gpt-4o) - Must support native tool use
  - `OPENAI_UTILITY_MODEL_NAME` (default: gpt-4o-mini) - For utility tasks
  - `OPENAI_VISION_MODEL_NAME` (default: gpt-4o) - For vision tasks
- Google:
  - `GOOGLE_API_KEY`
  - `GOOGLE_MODEL_NAME` (default: gemini-2.0-flash) - Must support native tool use
  - `GOOGLE_UTILITY_MODEL_NAME` (default: gemini-1.5-flash-8b) - For utility tasks
  - `GOOGLE_VISION_MODEL_NAME` (default: gemini-2.0-flash) - For vision tasks
- Groq:
  - `GROQ_API_KEY`
  - `GROQ_MODEL_NAME` (default: llama-3.3-70b-versatile) - Must support native tool use
  - `GROQ_UTILITY_MODEL_NAME` (default: llama-3.1-8b-instant) - For utility tasks
  - `GROQ_VISION_MODEL_NAME` (default: llama-3.2-90b-vision-preview) - For vision tasks
### Optional

- `LANGCHAIN_TRACING_V2`: Enable LangSmith tracing
- `LANGCHAIN_ENDPOINT`: LangSmith endpoint
- `LANGCHAIN_API_KEY`: LangSmith API key
- `LANGCHAIN_PROJECT`: LangSmith project name
- `WOOCOMMERCE_APPROVAL_TIMEOUT_MS`: Runtime approval timeout in milliseconds for mutating WooCommerce actions (default: `300000`)

## Catalog Orchestration

Catalog work is handled by a dedicated orchestration layer:

- `main` delegates catalog-domain requests to `catalog-agent`
- `catalog-agent` selects a playbook, optionally inspects full playbook instructions, and delegates to workers
- workers are narrow specialists for categories, attributes, products, and variations
- workers only see their own assigned tools and do not know about the MCP transport layer

Canonical playbooks live in code in `src/agents/catalog/playbooks.ts`.

## WooCommerce Tool Generation

WooCommerce worker tools are generated from a committed `tools/list` snapshot:

- snapshot source: `tools/woocommerce/woocommerce-tools.snapshot.json`
- worker allowlists: `tools/woocommerce/woocommerce-worker-toolsets.json`
- generated output: `src/generated/woocommerceTools.generated.ts`

Regenerate after snapshot changes:

```bash
bun run generate:woocommerce-tools
bun run typecheck
```

## Message Queue System

Okos uses BullMQ to implement robust message processing that ensures:

- Messages from the same user are processed sequentially
- Multiple users can be served concurrently
- The system can handle high loads without crashing
- Failed jobs are properly retried and logged

The system implements one specialized queue:

1. **Message Queue** - Handles incoming user messages and ensures sequential processing

Detailed documentation about the queue system is available in the [Queue System Documentation](./docs/queue-system.md).

## Available Tools

Okos provides WooCommerce catalog tools for catalog operations:
   - Categories, attributes, products, and variations are handled by separate worker agents
   - Tool schemas come from the generated WooCommerce registry
   - Runtime execution goes through the configured WooCommerce MCP endpoint

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

3. **Command Access**
   - Basic commands like `/clear_messages` and `/clear_all` are available to all users
   - Admin commands are restricted to the designated admin user
   - All other bot features require authentication

This system ensures that only authorized users can interact with your bot while providing administrative tools to manage access.

## Model Configuration

Okos uses three different model configurations for specialized tasks:

1. **Chat Model** - The primary model for user interactions

   - **Must support native tool use** (e.g., GPT-4o, Gemini-1.5-flash)
   - Handles the main conversation flow and tool invocation

2. **Utility Model** - For internal utility tasks

   - Used for memory management and other lightweight internal tasks
   - Can be smaller/cheaper models as they don't require tool use

3. **Vision Model** - For processing image inputs
   - Used when users send photos
   - Should have vision capabilities

## Archive Version

An older version of Okos (v1) is available that supports all LLM models for chat functionality, as it used a classifier-based approach instead of native tool use. This version is no longer maintained but may be useful for those using models without native tool capabilities.

- Archive repository: [https://github.com/johnnybui/okos/tree/okos-v1](https://github.com/johnnybui/okos/tree/okos-v1)
- Note: The v1 version has fewer features compared to the current version.

## License

MIT
