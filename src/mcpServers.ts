const wooCommerceMcpToken = process.env.WOOCOMMERCE_MCP_TOKEN?.trim();
const wooCommerceMcpBaseUrl =
  process.env.WOOCOMMERCE_MCP_BASE_URL?.trim() || 'http://mag-service:3000/mcp/woocommerce-mcp';

export const MCP_SERVERS = {
  'woocommerce-mcp': {
    baseUrl: wooCommerceMcpBaseUrl,
    headers: {
      ...(wooCommerceMcpToken ? { Authorization: `Bearer ${wooCommerceMcpToken}` } : {}),
    },
  },
} as const;

export type McpServerName = keyof typeof MCP_SERVERS;
