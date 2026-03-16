/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * POST /marketplace/create-order request body.
 */
export const marketplaceCreateOrderCreateBodySchema = z
  .object({ product_id: z.unknown() })
  .strict();

export type MarketplaceCreateOrderCreateBody = z.infer<
  typeof marketplaceCreateOrderCreateBodySchema
>;

/**
 * POST /marketplace/create-order response body.
 */
export const marketplaceCreateOrderCreateResponseSchema = z.unknown();

export type MarketplaceCreateOrderCreateResponse = z.infer<
  typeof marketplaceCreateOrderCreateResponseSchema
>;

/**
 * GET /marketplace/featured response body.
 */
export const marketplaceFeaturedListResponseSchema = z.array(z.unknown());

export type MarketplaceFeaturedListResponse = z.infer<
  typeof marketplaceFeaturedListResponseSchema
>;

/**
 * POST /marketplace/refresh response body.
 */
export const marketplaceRefreshCreateResponseSchema = z.unknown();

export type MarketplaceRefreshCreateResponse = z.infer<
  typeof marketplaceRefreshCreateResponseSchema
>;

/**
 * POST /marketplace/subscriptions/activate request body.
 */
export const marketplaceSubscriptionsActivateCreateBodySchema = z
  .object({ product_key: z.string() })
  .strict();

export type MarketplaceSubscriptionsActivateCreateBody = z.infer<
  typeof marketplaceSubscriptionsActivateCreateBodySchema
>;

/**
 * POST /marketplace/subscriptions/activate response body.
 */
export const marketplaceSubscriptionsActivateCreateResponseSchema = z.unknown();

export type MarketplaceSubscriptionsActivateCreateResponse = z.infer<
  typeof marketplaceSubscriptionsActivateCreateResponseSchema
>;

/**
 * POST /marketplace/subscriptions/activate-plugin request body.
 */
export const marketplaceSubscriptionsActivatePluginCreateBodySchema = z
  .object({ product_key: z.string() })
  .strict();

export type MarketplaceSubscriptionsActivatePluginCreateBody = z.infer<
  typeof marketplaceSubscriptionsActivatePluginCreateBodySchema
>;

/**
 * POST /marketplace/subscriptions/activate-plugin response body.
 */
export const marketplaceSubscriptionsActivatePluginCreateResponseSchema =
  z.unknown();

export type MarketplaceSubscriptionsActivatePluginCreateResponse = z.infer<
  typeof marketplaceSubscriptionsActivatePluginCreateResponseSchema
>;

/**
 * POST /marketplace/subscriptions/connect request body.
 */
export const marketplaceSubscriptionsConnectCreateBodySchema = z
  .object({ product_key: z.string() })
  .strict();

export type MarketplaceSubscriptionsConnectCreateBody = z.infer<
  typeof marketplaceSubscriptionsConnectCreateBodySchema
>;

/**
 * POST /marketplace/subscriptions/connect response body.
 */
export const marketplaceSubscriptionsConnectCreateResponseSchema = z.unknown();

export type MarketplaceSubscriptionsConnectCreateResponse = z.infer<
  typeof marketplaceSubscriptionsConnectCreateResponseSchema
>;

/**
 * POST /marketplace/subscriptions/disconnect request body.
 */
export const marketplaceSubscriptionsDisconnectCreateBodySchema = z
  .object({ product_key: z.string() })
  .strict();

export type MarketplaceSubscriptionsDisconnectCreateBody = z.infer<
  typeof marketplaceSubscriptionsDisconnectCreateBodySchema
>;

/**
 * POST /marketplace/subscriptions/disconnect response body.
 */
export const marketplaceSubscriptionsDisconnectCreateResponseSchema =
  z.unknown();

export type MarketplaceSubscriptionsDisconnectCreateResponse = z.infer<
  typeof marketplaceSubscriptionsDisconnectCreateResponseSchema
>;

/**
 * GET /marketplace/subscriptions/install-url query parameters.
 */
export const marketplaceSubscriptionsInstallUrlListQuerySchema = z
  .object({ product_key: z.string() })
  .strict();

export type MarketplaceSubscriptionsInstallUrlListQuery = z.infer<
  typeof marketplaceSubscriptionsInstallUrlListQuerySchema
>;

/**
 * GET /marketplace/subscriptions/install-url response body.
 */
export const marketplaceSubscriptionsInstallUrlListResponseSchema = z.array(
  z.unknown(),
);

export type MarketplaceSubscriptionsInstallUrlListResponse = z.infer<
  typeof marketplaceSubscriptionsInstallUrlListResponseSchema
>;

/**
 * GET /marketplace/subscriptions response body.
 */
export const marketplaceSubscriptionsListResponseSchema = z.array(z.unknown());

export type MarketplaceSubscriptionsListResponse = z.infer<
  typeof marketplaceSubscriptionsListResponseSchema
>;
