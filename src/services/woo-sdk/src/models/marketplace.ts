/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * POST /marketplace/create-order request body.
 */
export type MarketplaceCreateOrderCreateBody = { product_id: unknown };

/**
 * POST /marketplace/create-order response body.
 */
export type MarketplaceCreateOrderCreateResponse = unknown;

/**
 * GET /marketplace/featured response body.
 */
export type MarketplaceFeaturedListResponse = Array<unknown>;

/**
 * POST /marketplace/refresh response body.
 */
export type MarketplaceRefreshCreateResponse = unknown;

/**
 * POST /marketplace/subscriptions/activate request body.
 */
export type MarketplaceSubscriptionsActivateCreateBody = {
  product_key: string;
};

/**
 * POST /marketplace/subscriptions/activate response body.
 */
export type MarketplaceSubscriptionsActivateCreateResponse = unknown;

/**
 * POST /marketplace/subscriptions/activate-plugin request body.
 */
export type MarketplaceSubscriptionsActivatePluginCreateBody = {
  product_key: string;
};

/**
 * POST /marketplace/subscriptions/activate-plugin response body.
 */
export type MarketplaceSubscriptionsActivatePluginCreateResponse = unknown;

/**
 * POST /marketplace/subscriptions/connect request body.
 */
export type MarketplaceSubscriptionsConnectCreateBody = { product_key: string };

/**
 * POST /marketplace/subscriptions/connect response body.
 */
export type MarketplaceSubscriptionsConnectCreateResponse = unknown;

/**
 * POST /marketplace/subscriptions/disconnect request body.
 */
export type MarketplaceSubscriptionsDisconnectCreateBody = {
  product_key: string;
};

/**
 * POST /marketplace/subscriptions/disconnect response body.
 */
export type MarketplaceSubscriptionsDisconnectCreateResponse = unknown;

/**
 * GET /marketplace/subscriptions/install-url query parameters.
 */
export type MarketplaceSubscriptionsInstallUrlListQuery = {
  product_key: string;
};

/**
 * GET /marketplace/subscriptions/install-url response body.
 */
export type MarketplaceSubscriptionsInstallUrlListResponse = Array<unknown>;

/**
 * GET /marketplace/subscriptions response body.
 */
export type MarketplaceSubscriptionsListResponse = Array<unknown>;
