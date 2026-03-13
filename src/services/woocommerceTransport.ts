import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  generatedWooCommerceToolRegistry,
  generatedWooCommerceWorkerToolsets,
} from '../generated/woocommerceTools.generated';
import { MCP_SERVERS } from '../mcpServers';

type ToolResultContent =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image' | 'audio';
      data: string;
      mimeType: string;
    }
  | {
      type: 'resource';
      resource: Record<string, unknown>;
    }
  | {
      type: 'resource_link';
      uri: string;
      name: string;
      description?: string;
      mimeType?: string;
    };

type ToolCallResponse = {
  content?: ToolResultContent[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
  toolResult?: unknown;
};

function normalizeTextContent(content: ToolResultContent[] | undefined) {
  if (!Array.isArray(content) || content.length === 0) {
    return '';
  }

  return content
    .map((item) => {
      if (item.type === 'text') {
        return item.text;
      }

      if (item.type === 'resource_link') {
        return `${item.name}: ${item.uri}`;
      }

      if (item.type === 'resource') {
        return JSON.stringify(item.resource);
      }

      return `[${item.type}:${item.mimeType}]`;
    })
    .join('\n')
    .trim();
}

function getRequiredToolNames() {
  return Array.from(new Set(Object.values(generatedWooCommerceWorkerToolsets).flat()));
}

export class WooCommerceTransportService {
  private client?: Client;
  private transport?: StreamableHTTPClientTransport;
  private availableTools?: Set<string>;
  private connectingPromise?: Promise<Client>;

  private async connectClient(): Promise<Client> {
    if (this.client) {
      return this.client;
    }

    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    this.connectingPromise = (async () => {
      const serverConfig = MCP_SERVERS['woocommerce-mcp'];

      const transport = new StreamableHTTPClientTransport(new URL(serverConfig.baseUrl), {
        requestInit: {
          headers: serverConfig.headers,
        },
      });

      const client = new Client(
        {
          name: 'okos-woocommerce-transport-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await client.connect(transport);

      this.transport = transport;
      this.client = client;
      return client;
    })();

    try {
      return await this.connectingPromise;
    } finally {
      this.connectingPromise = undefined;
    }
  }

  async listAvailableTools() {
    const client = await this.connectClient();
    const tools = [];
    let cursor: string | undefined;

    do {
      const result = await client.listTools(cursor ? { cursor } : undefined);
      tools.push(...result.tools);
      cursor = typeof result.nextCursor === 'string' ? result.nextCursor : undefined;
    } while (cursor);

    this.availableTools = new Set(tools.map((tool) => tool.name));
    return tools;
  }

  async validateRequiredTools(requiredToolNames = getRequiredToolNames()) {
    const tools = await this.listAvailableTools();
    const availableToolNames = new Set(tools.map((tool) => tool.name));
    const missingToolNames = requiredToolNames.filter((toolName) => !availableToolNames.has(toolName));

    if (missingToolNames.length > 0) {
      throw new Error(`WooCommerce transport is missing required tools: ${missingToolNames.join(', ')}`);
    }
  }

  async callTool(name: string, args: Record<string, unknown>) {
    const client = await this.connectClient();

    if (!generatedWooCommerceToolRegistry[name as keyof typeof generatedWooCommerceToolRegistry]) {
      throw new Error(`Tool "${name}" is not part of the generated WooCommerce registry.`);
    }

    if (this.availableTools && !this.availableTools.has(name)) {
      throw new Error(`Tool "${name}" is not available on the connected WooCommerce transport server.`);
    }

    const result = (await client.callTool({
      name,
      arguments: args,
    })) as ToolCallResponse;

    if ('toolResult' in result) {
      return {
        tool: name,
        ok: true,
        text: '',
        structured: result.toolResult && typeof result.toolResult === 'object' ? (result.toolResult as Record<string, unknown>) : null,
        content: [],
      };
    }

    const normalizedResult = {
      tool: name,
      ok: !result.isError,
      text: normalizeTextContent(result.content),
      structured: result.structuredContent ?? null,
      content: result.content ?? [],
    };

    if (result.isError) {
      return {
        ...normalizedResult,
        error: normalizedResult.text || 'The tool returned an error result.',
      };
    }

    return normalizedResult;
  }

  async close() {
    await this.transport?.terminateSession().catch(() => undefined);
    await this.transport?.close();
    this.transport = undefined;
    this.client = undefined;
    this.availableTools = undefined;
  }
}

const wooCommerceTransportService = new WooCommerceTransportService();

let shutdownHookRegistered = false;

function registerShutdownHook() {
  if (shutdownHookRegistered) {
    return;
  }

  shutdownHookRegistered = true;

  const closeClient = async () => {
    try {
      await wooCommerceTransportService.close();
    } catch (error) {
      console.error('Failed to close WooCommerce transport client cleanly:', error);
    }
  };

  process.once('beforeExit', closeClient);
  process.once('SIGINT', () => {
    void closeClient().finally(() => process.exit(0));
  });
  process.once('SIGTERM', () => {
    void closeClient().finally(() => process.exit(0));
  });
}

registerShutdownHook();

export function getWooCommerceTransportService() {
  return wooCommerceTransportService;
}

export async function validateWooCommerceTransportOnStartup() {
  await wooCommerceTransportService.validateRequiredTools();
}
