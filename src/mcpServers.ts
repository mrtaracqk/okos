const wooCommerceMcpToken = process.env.WOOCOMMERCE_MCP_TOKEN?.trim();
const wooCommerceMcpBaseUrl =
  process.env.WOOCOMMERCE_MCP_BASE_URL?.trim() || 'http://woo-mcp:3000/mcp';
const validateWooCommerceMcpOnStartup =
  process.env.WOOCOMMERCE_MCP_VALIDATE_ON_STARTUP?.trim().toLowerCase() === 'true';

export const MCP_SERVERS = {
  'woocommerce-mcp': {
    baseUrl: wooCommerceMcpBaseUrl,
    headers: {
      ...(wooCommerceMcpToken ? { Authorization: `Bearer ${wooCommerceMcpToken}` } : {}),
    },
  },
} as const;

export type McpServerName = keyof typeof MCP_SERVERS;

export function shouldValidateWooCommerceMcpOnStartup() {
  return validateWooCommerceMcpOnStartup;
}
