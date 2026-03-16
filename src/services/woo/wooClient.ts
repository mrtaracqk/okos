import { createWooClient } from '../woo-sdk/src/client';
import type { CreateWooClientConfig } from '../woo-sdk/src/core/types';
import type { WooClient } from '../woo-sdk/src/client';

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

export function getWooClient(): WooClient {
  if (!wooClientInstance) {
    wooClientInstance = createWooClient(buildWooClientConfig());
  }
  return wooClientInstance;
}

export function clearWooClient(): void {
  wooClientInstance = null;
}
