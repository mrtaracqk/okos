/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * GET /shipping_methods/{id} path parameters.
 */
export const shippingMethodGetPathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type ShippingMethodGetPathParams = z.infer<
  typeof shippingMethodGetPathParamsSchema
>;

/**
 * GET /shipping_methods/{id} query parameters.
 */
export const shippingMethodGetQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ShippingMethodGetQuery = z.infer<
  typeof shippingMethodGetQuerySchema
>;

/**
 * GET /shipping_methods/{id} response body.
 */
export const shippingMethodGetResponseSchema = z
  .object({
    description: z.string().optional().describe("Shipping method description."),
    id: z.string().optional().describe("Method ID."),
    title: z.string().optional().describe("Shipping method title."),
  })
  .strict();

export type ShippingMethodGetResponse = z.infer<
  typeof shippingMethodGetResponseSchema
>;

/**
 * GET /shipping_methods query parameters.
 */
export const shippingMethodsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ShippingMethodsListQuery = z.infer<
  typeof shippingMethodsListQuerySchema
>;

/**
 * GET /shipping_methods response body.
 */
export const shippingMethodsListResponseSchema = z.array(
  z
    .object({
      description: z
        .string()
        .optional()
        .describe("Shipping method description."),
      id: z.string().optional().describe("Method ID."),
      title: z.string().optional().describe("Shipping method title."),
    })
    .strict(),
);

export type ShippingMethodsListResponse = z.infer<
  typeof shippingMethodsListResponseSchema
>;
