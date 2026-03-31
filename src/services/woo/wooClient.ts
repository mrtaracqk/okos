import { createWooClient } from '../woo-sdk/src/client';
import type { WooClient } from '../woo-sdk/src/client';
import { createWooRequestExecutorWithHeaders } from '../woo-sdk/src/core/http';
import type { CreateWooClientConfig, WooRequestExecutorWithHeaders } from '../woo-sdk/src/core/types';

const baseUrl = process.env.WOOCOMMERCE_REST_BASE_URL?.trim();
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY?.trim();
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET?.trim();

function buildWooClientConfig(): CreateWooClientConfig {
  if (!baseUrl) {
    throw new Error(
      'WOOCOMMERCE_REST_BASE_URL is required for Woo SDK (e.g. https://example.com/wp-json/wc/v3).'
    );
  }
  return {
    baseUrl,
    authStrategy: consumerKey && consumerSecret ? 'query' : undefined,
    consumerKey,
    consumerSecret,
  };
}

let wooClientInstance: WooClient | null = null;
let wooExecuteWithHeadersInstance: WooRequestExecutorWithHeaders | null = null;

export function getWooClient(): WooClient {
  if (!wooClientInstance) {
    wooClientInstance = createWooClient(buildWooClientConfig());
  }
  return wooClientInstance;
}

/** For list tools that need `X-WP-Total` / `X-WP-TotalPages` without changing the generated client. */
export function getWooExecuteWithHeaders(): WooRequestExecutorWithHeaders {
  if (!wooExecuteWithHeadersInstance) {
    wooExecuteWithHeadersInstance = createWooRequestExecutorWithHeaders(buildWooClientConfig());
  }
  return wooExecuteWithHeadersInstance;
}

export function clearWooClient(): void {
  wooClientInstance = null;
  wooExecuteWithHeadersInstance = null;
}
