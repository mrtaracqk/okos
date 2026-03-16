/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * GET /layout-templates/{id} path parameters.
 */
export const layoutTemplateGetPathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type LayoutTemplateGetPathParams = z.infer<
  typeof layoutTemplateGetPathParamsSchema
>;

/**
 * GET /layout-templates/{id} response body.
 */
export const layoutTemplateGetResponseSchema = z.unknown();

export type LayoutTemplateGetResponse = z.infer<
  typeof layoutTemplateGetResponseSchema
>;

/**
 * GET /layout-templates query parameters.
 */
export const layoutTemplatesListQuerySchema = z
  .object({
    area: z.string().optional().describe("Area to get templates for."),
  })
  .strict();

export type LayoutTemplatesListQuery = z.infer<
  typeof layoutTemplatesListQuerySchema
>;

/**
 * GET /layout-templates response body.
 */
export const layoutTemplatesListResponseSchema = z.array(z.unknown());

export type LayoutTemplatesListResponse = z.infer<
  typeof layoutTemplatesListResponseSchema
>;
