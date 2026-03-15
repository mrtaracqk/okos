/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * GET /shipping_methods/{id} path parameters.
 */
export type ShippingMethodGetPathParams = { id: string };

/**
 * GET /shipping_methods/{id} query parameters.
 */
export type ShippingMethodGetQuery = { context?: "view" };

/**
 * GET /shipping_methods/{id} response body.
 */
export type ShippingMethodGetResponse = unknown;

/**
 * GET /shipping_methods query parameters.
 */
export type ShippingMethodsListQuery = { context?: "view" };

/**
 * GET /shipping_methods response body.
 */
export type ShippingMethodsListResponse = Array<{
  description?: string;
  id?: string;
  title?: string;
}>;
