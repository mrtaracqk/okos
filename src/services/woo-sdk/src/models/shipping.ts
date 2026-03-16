/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * DELETE /shipping/zones/{id} path parameters.
 */
export const shippingZoneDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZoneDeletePathParams = z.infer<
  typeof shippingZoneDeletePathParamsSchema
>;

/**
 * DELETE /shipping/zones/{id} query parameters.
 */
export const shippingZoneDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type ShippingZoneDeleteQuery = z.infer<
  typeof shippingZoneDeleteQuerySchema
>;

/**
 * DELETE /shipping/zones/{id} response body.
 */
export const shippingZoneDeleteResponseSchema = z.unknown();

export type ShippingZoneDeleteResponse = z.infer<
  typeof shippingZoneDeleteResponseSchema
>;

/**
 * GET /shipping/zones/{id} path parameters.
 */
export const shippingZoneGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZoneGetPathParams = z.infer<
  typeof shippingZoneGetPathParamsSchema
>;

/**
 * GET /shipping/zones/{id} response body.
 */
export const shippingZoneGetResponseSchema = z
  .object({
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Shipping zone name."),
    order: z.number().optional().describe("Shipping zone order."),
  })
  .strict();

export type ShippingZoneGetResponse = z.infer<
  typeof shippingZoneGetResponseSchema
>;

/**
 * PUT /shipping/zones/{id}/locations path parameters.
 */
export const shippingZoneLocationPutCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZoneLocationPutCustomPathParams = z.infer<
  typeof shippingZoneLocationPutCustomPathParamsSchema
>;

/**
 * PUT /shipping/zones/{id}/locations request body.
 */
export const shippingZoneLocationPutCustomBodySchema = z
  .object({
    code: z.string().optional().describe("Shipping zone location code."),
    type: z
      .enum(["postcode", "state", "country", "continent"])
      .optional()
      .describe("Shipping zone location type."),
  })
  .strict();

export type ShippingZoneLocationPutCustomBody = z.infer<
  typeof shippingZoneLocationPutCustomBodySchema
>;

/**
 * PUT /shipping/zones/{id}/locations response body.
 */
export const shippingZoneLocationPutCustomResponseSchema = z.unknown();

export type ShippingZoneLocationPutCustomResponse = z.infer<
  typeof shippingZoneLocationPutCustomResponseSchema
>;

/**
 * POST /shipping/zones/{id}/locations path parameters.
 */
export const shippingZoneLocationsCreatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZoneLocationsCreatePathParams = z.infer<
  typeof shippingZoneLocationsCreatePathParamsSchema
>;

/**
 * POST /shipping/zones/{id}/locations request body.
 */
export const shippingZoneLocationsCreateBodySchema = z
  .object({
    code: z.string().optional().describe("Shipping zone location code."),
    type: z
      .enum(["postcode", "state", "country", "continent"])
      .optional()
      .describe("Shipping zone location type."),
  })
  .strict();

export type ShippingZoneLocationsCreateBody = z.infer<
  typeof shippingZoneLocationsCreateBodySchema
>;

/**
 * POST /shipping/zones/{id}/locations response body.
 */
export const shippingZoneLocationsCreateResponseSchema = z.unknown();

export type ShippingZoneLocationsCreateResponse = z.infer<
  typeof shippingZoneLocationsCreateResponseSchema
>;

/**
 * GET /shipping/zones/{id}/locations path parameters.
 */
export const shippingZoneLocationsListPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZoneLocationsListPathParams = z.infer<
  typeof shippingZoneLocationsListPathParamsSchema
>;

/**
 * GET /shipping/zones/{id}/locations response body.
 */
export const shippingZoneLocationsListResponseSchema = z.array(z.unknown());

export type ShippingZoneLocationsListResponse = z.infer<
  typeof shippingZoneLocationsListResponseSchema
>;

/**
 * DELETE /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export const shippingZoneMethodDeletePathParamsSchema = z
  .object({ instance_id: z.number(), zone_id: z.number() })
  .strict();

export type ShippingZoneMethodDeletePathParams = z.infer<
  typeof shippingZoneMethodDeletePathParamsSchema
>;

/**
 * DELETE /shipping/zones/{zone_id}/methods/{instance_id} query parameters.
 */
export const shippingZoneMethodDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type ShippingZoneMethodDeleteQuery = z.infer<
  typeof shippingZoneMethodDeleteQuerySchema
>;

/**
 * DELETE /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export const shippingZoneMethodDeleteResponseSchema = z.unknown();

export type ShippingZoneMethodDeleteResponse = z.infer<
  typeof shippingZoneMethodDeleteResponseSchema
>;

/**
 * GET /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export const shippingZoneMethodGetPathParamsSchema = z
  .object({ instance_id: z.number(), zone_id: z.number() })
  .strict();

export type ShippingZoneMethodGetPathParams = z.infer<
  typeof shippingZoneMethodGetPathParamsSchema
>;

/**
 * GET /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export const shippingZoneMethodGetResponseSchema = z.unknown();

export type ShippingZoneMethodGetResponse = z.infer<
  typeof shippingZoneMethodGetResponseSchema
>;

/**
 * POST /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export const shippingZoneMethodPostCustomPathParamsSchema = z
  .object({ instance_id: z.number(), zone_id: z.number() })
  .strict();

export type ShippingZoneMethodPostCustomPathParams = z.infer<
  typeof shippingZoneMethodPostCustomPathParamsSchema
>;

/**
 * POST /shipping/zones/{zone_id}/methods/{instance_id} request body.
 */
export const shippingZoneMethodPostCustomBodySchema = z
  .object({
    enabled: z.boolean().optional().describe("Shipping method enabled status."),
    order: z.number().optional().describe("Shipping method sort order."),
    settings: z
      .object({
        default: z
          .string()
          .optional()
          .describe("Default value for the setting."),
        description: z
          .string()
          .optional()
          .describe(
            "A human readable description for the setting used in interfaces.",
          ),
        id: z
          .string()
          .optional()
          .describe("A unique identifier for the setting."),
        label: z
          .string()
          .optional()
          .describe(
            "A human readable label for the setting used in interfaces.",
          ),
        placeholder: z
          .string()
          .optional()
          .describe("Placeholder text to be displayed in text inputs."),
        tip: z
          .string()
          .optional()
          .describe(
            "Additional help text shown to the user about the setting.",
          ),
        type: z
          .enum([
            "text",
            "email",
            "number",
            "color",
            "password",
            "textarea",
            "select",
            "multiselect",
            "radio",
            "image_width",
            "checkbox",
            "class",
            "order",
          ])
          .optional()
          .describe("Type of setting."),
        value: z.string().optional().describe("Setting value."),
      })
      .describe("Shipping method settings.")
      .strict()
      .optional()
      .describe("Shipping method settings."),
  })
  .strict();

export type ShippingZoneMethodPostCustomBody = z.infer<
  typeof shippingZoneMethodPostCustomBodySchema
>;

/**
 * POST /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export const shippingZoneMethodPostCustomResponseSchema = z.unknown();

export type ShippingZoneMethodPostCustomResponse = z.infer<
  typeof shippingZoneMethodPostCustomResponseSchema
>;

/**
 * PUT /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export const shippingZoneMethodUpdatePathParamsSchema = z
  .object({ instance_id: z.number(), zone_id: z.number() })
  .strict();

export type ShippingZoneMethodUpdatePathParams = z.infer<
  typeof shippingZoneMethodUpdatePathParamsSchema
>;

/**
 * PUT /shipping/zones/{zone_id}/methods/{instance_id} request body.
 */
export const shippingZoneMethodUpdateBodySchema = z
  .object({
    enabled: z.boolean().optional().describe("Shipping method enabled status."),
    order: z.number().optional().describe("Shipping method sort order."),
    settings: z
      .object({
        default: z
          .string()
          .optional()
          .describe("Default value for the setting."),
        description: z
          .string()
          .optional()
          .describe(
            "A human readable description for the setting used in interfaces.",
          ),
        id: z
          .string()
          .optional()
          .describe("A unique identifier for the setting."),
        label: z
          .string()
          .optional()
          .describe(
            "A human readable label for the setting used in interfaces.",
          ),
        placeholder: z
          .string()
          .optional()
          .describe("Placeholder text to be displayed in text inputs."),
        tip: z
          .string()
          .optional()
          .describe(
            "Additional help text shown to the user about the setting.",
          ),
        type: z
          .enum([
            "text",
            "email",
            "number",
            "color",
            "password",
            "textarea",
            "select",
            "multiselect",
            "radio",
            "image_width",
            "checkbox",
            "class",
            "order",
          ])
          .optional()
          .describe("Type of setting."),
        value: z.string().optional().describe("Setting value."),
      })
      .describe("Shipping method settings.")
      .strict()
      .optional()
      .describe("Shipping method settings."),
  })
  .strict();

export type ShippingZoneMethodUpdateBody = z.infer<
  typeof shippingZoneMethodUpdateBodySchema
>;

/**
 * PUT /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export const shippingZoneMethodUpdateResponseSchema = z.unknown();

export type ShippingZoneMethodUpdateResponse = z.infer<
  typeof shippingZoneMethodUpdateResponseSchema
>;

/**
 * POST /shipping/zones/{zone_id}/methods path parameters.
 */
export const shippingZoneMethodsCreatePathParamsSchema = z
  .object({ zone_id: z.number() })
  .strict();

export type ShippingZoneMethodsCreatePathParams = z.infer<
  typeof shippingZoneMethodsCreatePathParamsSchema
>;

/**
 * POST /shipping/zones/{zone_id}/methods request body.
 */
export const shippingZoneMethodsCreateBodySchema = z
  .object({
    enabled: z.boolean().optional().describe("Shipping method enabled status."),
    method_id: z.unknown().describe("Shipping method ID."),
    order: z.number().optional().describe("Shipping method sort order."),
    settings: z
      .object({
        default: z
          .string()
          .optional()
          .describe("Default value for the setting."),
        description: z
          .string()
          .optional()
          .describe(
            "A human readable description for the setting used in interfaces.",
          ),
        id: z
          .string()
          .optional()
          .describe("A unique identifier for the setting."),
        label: z
          .string()
          .optional()
          .describe(
            "A human readable label for the setting used in interfaces.",
          ),
        placeholder: z
          .string()
          .optional()
          .describe("Placeholder text to be displayed in text inputs."),
        tip: z
          .string()
          .optional()
          .describe(
            "Additional help text shown to the user about the setting.",
          ),
        type: z
          .enum([
            "text",
            "email",
            "number",
            "color",
            "password",
            "textarea",
            "select",
            "multiselect",
            "radio",
            "image_width",
            "checkbox",
            "class",
            "order",
          ])
          .optional()
          .describe("Type of setting."),
        value: z.string().optional().describe("Setting value."),
      })
      .describe("Shipping method settings.")
      .strict()
      .optional()
      .describe("Shipping method settings."),
  })
  .strict();

export type ShippingZoneMethodsCreateBody = z.infer<
  typeof shippingZoneMethodsCreateBodySchema
>;

/**
 * POST /shipping/zones/{zone_id}/methods response body.
 */
export const shippingZoneMethodsCreateResponseSchema = z.unknown();

export type ShippingZoneMethodsCreateResponse = z.infer<
  typeof shippingZoneMethodsCreateResponseSchema
>;

/**
 * GET /shipping/zones/{zone_id}/methods path parameters.
 */
export const shippingZoneMethodsListPathParamsSchema = z
  .object({ zone_id: z.number() })
  .strict();

export type ShippingZoneMethodsListPathParams = z.infer<
  typeof shippingZoneMethodsListPathParamsSchema
>;

/**
 * GET /shipping/zones/{zone_id}/methods response body.
 */
export const shippingZoneMethodsListResponseSchema = z.array(z.unknown());

export type ShippingZoneMethodsListResponse = z.infer<
  typeof shippingZoneMethodsListResponseSchema
>;

/**
 * POST /shipping/zones/{id} path parameters.
 */
export const shippingZonePostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZonePostCustomPathParams = z.infer<
  typeof shippingZonePostCustomPathParamsSchema
>;

/**
 * POST /shipping/zones/{id} request body.
 */
export const shippingZonePostCustomBodySchema = z
  .object({
    name: z.string().optional().describe("Shipping zone name."),
    order: z.number().optional().describe("Shipping zone order."),
  })
  .strict();

export type ShippingZonePostCustomBody = z.infer<
  typeof shippingZonePostCustomBodySchema
>;

/**
 * POST /shipping/zones/{id} response body.
 */
export const shippingZonePostCustomResponseSchema = z.unknown();

export type ShippingZonePostCustomResponse = z.infer<
  typeof shippingZonePostCustomResponseSchema
>;

/**
 * PUT /shipping/zones/{id} path parameters.
 */
export const shippingZoneUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ShippingZoneUpdatePathParams = z.infer<
  typeof shippingZoneUpdatePathParamsSchema
>;

/**
 * PUT /shipping/zones/{id} request body.
 */
export const shippingZoneUpdateBodySchema = z
  .object({
    name: z.string().optional().describe("Shipping zone name."),
    order: z.number().optional().describe("Shipping zone order."),
  })
  .strict();

export type ShippingZoneUpdateBody = z.infer<
  typeof shippingZoneUpdateBodySchema
>;

/**
 * PUT /shipping/zones/{id} response body.
 */
export const shippingZoneUpdateResponseSchema = z.unknown();

export type ShippingZoneUpdateResponse = z.infer<
  typeof shippingZoneUpdateResponseSchema
>;

/**
 * POST /shipping/zones request body.
 */
export const shippingZonesCreateBodySchema = z
  .object({
    name: z.string().describe("Shipping zone name."),
    order: z.number().optional().describe("Shipping zone order."),
  })
  .strict();

export type ShippingZonesCreateBody = z.infer<
  typeof shippingZonesCreateBodySchema
>;

/**
 * POST /shipping/zones response body.
 */
export const shippingZonesCreateResponseSchema = z
  .object({
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Shipping zone name."),
    order: z.number().optional().describe("Shipping zone order."),
  })
  .strict();

export type ShippingZonesCreateResponse = z.infer<
  typeof shippingZonesCreateResponseSchema
>;

/**
 * GET /shipping/zones response body.
 */
export const shippingZonesListResponseSchema = z.array(
  z
    .object({
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("Shipping zone name."),
      order: z.number().optional().describe("Shipping zone order."),
    })
    .strict(),
);

export type ShippingZonesListResponse = z.infer<
  typeof shippingZonesListResponseSchema
>;
