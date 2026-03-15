import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  generatedWooCommerceToolRegistry,
  generatedWooCommerceWorkerToolsets,
} from '../generated/woocommerceTools.generated';
import { DISABLE_RESPONSE_TRUNCATION_METADATA_KEY } from '../agents/shared/toolResponsePostprocess';
import { isApprovalGateError } from '../runtime-plugins/approval';
import { MCP_SERVERS, shouldValidateWooCommerceMcpOnStartup } from '../mcpServers';
import {
  buildTraceAttributes,
  buildTraceInputAttributes,
  buildTraceOutputAttributes,
  formatTraceValue,
  runToolSpan,
} from '../observability/traceContext';
import { runWooCommerceToolWithApproval } from './toolApproval';

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

type ToolErrorSource = 'approval-gate' | 'woo-mcp' | 'woocommerce-transport';

type NormalizedToolError = {
  source: ToolErrorSource;
  message: string;
  code?: string;
  type?: string;
  retryable: boolean;
};

type NormalizedToolSuccess = {
  tool: string;
  ok: true;
  text: string;
  structured: Record<string, unknown> | null;
  content: ToolResultContent[];
};

type NormalizedToolFailure = {
  tool: string;
  ok: false;
  text: string;
  structured: Record<string, unknown> | null;
  content: ToolResultContent[];
  error: NormalizedToolError;
};

type NormalizedToolResult = NormalizedToolSuccess | NormalizedToolFailure;

type CallToolOptions = {
  truncateResponse?: boolean;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readNestedError(structuredContent: Record<string, unknown> | null | undefined) {
  if (!isRecord(structuredContent)) {
    return null;
  }

  const error = structuredContent.error;
  return isRecord(error) ? error : null;
}

function inferToolErrorSource(input: { code?: string; type?: string; message: string }): ToolErrorSource {
  if (input.code?.startsWith('WOO_')) {
    return 'woo-mcp';
  }

  if (input.type?.startsWith('approval_')) {
    return 'approval-gate';
  }

  return 'woocommerce-transport';
}

function isRetryableToolError(input: { source: ToolErrorSource; code?: string; type?: string; message: string }) {
  const normalizedMessage = input.message.toLowerCase();
  return (
    input.type === 'approval_timeout' ||
    input.code === 'WOO_NETWORK_ERROR' ||
    input.code === 'WOO_RATE_LIMITED' ||
    normalizedMessage.includes('timeout') ||
    normalizedMessage.includes('timed out') ||
    normalizedMessage.includes('network') ||
    normalizedMessage.includes('temporar')
  );
}

function normalizeToolFailure(
  name: string,
  input: {
    text: string;
    structured: Record<string, unknown> | null;
    content?: ToolResultContent[];
    fallbackSource?: ToolErrorSource;
  }
): NormalizedToolFailure {
  const nestedError = readNestedError(input.structured);
  const code = typeof nestedError?.code === 'string' ? nestedError.code : undefined;
  const type = typeof nestedError?.type === 'string' ? nestedError.type : undefined;
  const nestedMessage = typeof nestedError?.message === 'string' ? nestedError.message.trim() : '';
  const message = nestedMessage || input.text || 'Инструмент вернул результат с ошибкой.';
  const source = input.fallbackSource ?? inferToolErrorSource({ code, type, message });

  return {
    tool: name,
    ok: false,
    text: input.text,
    structured: input.structured,
    content: input.content ?? [],
    error: {
      source,
      message,
      code,
      type,
      retryable: isRetryableToolError({ source, code, type, message }),
    },
  };
}

function withResponseTruncationPreference<T extends NormalizedToolResult>(
  result: T,
  options?: CallToolOptions
): T {
  if (options?.truncateResponse !== false) {
    return result;
  }

  Object.defineProperty(result, DISABLE_RESPONSE_TRUNCATION_METADATA_KEY, {
    value: true,
    enumerable: false,
    configurable: true,
  });

  return result;
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

  async callTool(
    name: string,
    args: Record<string, unknown>,
    options?: CallToolOptions
  ): Promise<NormalizedToolResult> {
    return runToolSpan(
      'woocommerce_transport.call_tool',
      async () => {
        try {
          const result = await runWooCommerceToolWithApproval({
            actionName: name,
            args,
            execute: () => this.callToolRaw(name, args),
          });
          return withResponseTruncationPreference(result, options);
        } catch (error) {
          if (isApprovalGateError(error)) {
            return withResponseTruncationPreference(
              normalizeToolFailure(name, {
                text: error.message,
                structured: {
                  error: {
                    type: error.type,
                    message: error.message,
                  },
                },
                fallbackSource: 'approval-gate',
              }),
              options
            );
          }

          throw error;
        }
      },
      {
        attributes: {
          ...buildTraceAttributes({
            'tool.name': name,
            'tool.args': formatTraceValue(args, 1200),
          }),
          ...buildTraceInputAttributes(args, 1200),
        },
        mapResultAttributes: (result) =>
          ({
            ...buildTraceAttributes({
              'tool.status': result.ok ? 'completed' : 'failed',
              'error.source': result.ok ? undefined : result.error.source,
              'error.type': result.ok ? undefined : result.error.type,
              'error.code': result.ok ? undefined : result.error.code,
              'error.retryable': result.ok ? undefined : result.error.retryable,
            }),
            ...buildTraceOutputAttributes(result.text, 1200),
          }),
        statusMessage: (result) => (result.ok ? undefined : result.error.message),
      }
    );
  }

  private async callToolRaw(name: string, args: Record<string, unknown>): Promise<NormalizedToolResult> {
    const client = await this.connectClient();

    if (!generatedWooCommerceToolRegistry[name as keyof typeof generatedWooCommerceToolRegistry]) {
      throw new Error(`Инструмент "${name}" отсутствует в сгенерированном реестре WooCommerce.`);
    }

    if (this.availableTools && !this.availableTools.has(name)) {
      throw new Error(`Инструмент "${name}" недоступен на подключённом WooCommerce transport-сервере.`);
    }

    let result: ToolCallResponse;
    try {
      result = (await client.callTool({
        name,
        arguments: args,
      })) as ToolCallResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка выполнения WooCommerce transport.';
      return normalizeToolFailure(name, {
        text: message,
        structured: null,
        fallbackSource: 'woocommerce-transport',
      });
    }

    if ('toolResult' in result) {
      return {
        tool: name,
        ok: true,
        text: '',
        structured: result.toolResult && typeof result.toolResult === 'object' ? (result.toolResult as Record<string, unknown>) : null,
        content: [],
      };
    }

    const normalizedResult: NormalizedToolSuccess = {
      tool: name,
      ok: true,
      text: normalizeTextContent(result.content),
      structured: result.structuredContent ?? null,
      content: result.content ?? [],
    };

    if (result.isError) {
      return normalizeToolFailure(name, {
        text: normalizedResult.text,
        structured: normalizedResult.structured,
        content: normalizedResult.content,
      });
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
  if (!shouldValidateWooCommerceMcpOnStartup()) {
    console.log('Проверка WooCommerce MCP при старте отключена; assistant использует ленивую инициализацию transport.');
    return;
  }

  await wooCommerceTransportService.validateRequiredTools();
}
