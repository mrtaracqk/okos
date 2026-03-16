/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * GET /payment_gateways/{id} path parameters.
 */
export const paymentGatewayGetPathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type PaymentGatewayGetPathParams = z.infer<
  typeof paymentGatewayGetPathParamsSchema
>;

/**
 * GET /payment_gateways/{id} query parameters.
 */
export const paymentGatewayGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type PaymentGatewayGetQuery = z.infer<
  typeof paymentGatewayGetQuerySchema
>;

/**
 * GET /payment_gateways/{id} response body.
 */
export const paymentGatewayGetResponseSchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("Payment gateway description on checkout."),
    enabled: z.boolean().optional().describe("Payment gateway enabled status."),
    id: z.string().optional().describe("Payment gateway ID."),
    method_description: z
      .string()
      .optional()
      .describe("Payment gateway method description."),
    method_supports: z
      .array(z.string())
      .optional()
      .describe("Supported features for this payment gateway."),
    method_title: z
      .string()
      .optional()
      .describe("Payment gateway method title."),
    order: z.number().optional().describe("Payment gateway sort order."),
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
          ])
          .optional()
          .describe("Type of setting."),
        value: z.string().optional().describe("Setting value."),
      })
      .describe("Payment gateway settings.")
      .strict()
      .optional()
      .describe("Payment gateway settings."),
    title: z.string().optional().describe("Payment gateway title on checkout."),
  })
  .strict();

export type PaymentGatewayGetResponse = z.infer<
  typeof paymentGatewayGetResponseSchema
>;

/**
 * POST /payment_gateways/{id} path parameters.
 */
export const paymentGatewayPostCustomPathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type PaymentGatewayPostCustomPathParams = z.infer<
  typeof paymentGatewayPostCustomPathParamsSchema
>;

/**
 * POST /payment_gateways/{id} request body.
 */
export const paymentGatewayPostCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("Payment gateway description on checkout."),
    enabled: z.boolean().optional().describe("Payment gateway enabled status."),
    order: z.number().optional().describe("Payment gateway sort order."),
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
          ])
          .optional()
          .describe("Type of setting."),
        value: z.string().optional().describe("Setting value."),
      })
      .describe("Payment gateway settings.")
      .strict()
      .optional()
      .describe("Payment gateway settings."),
    title: z.string().optional().describe("Payment gateway title on checkout."),
  })
  .strict();

export type PaymentGatewayPostCustomBody = z.infer<
  typeof paymentGatewayPostCustomBodySchema
>;

/**
 * POST /payment_gateways/{id} response body.
 */
export const paymentGatewayPostCustomResponseSchema = z.unknown();

export type PaymentGatewayPostCustomResponse = z.infer<
  typeof paymentGatewayPostCustomResponseSchema
>;

/**
 * PUT /payment_gateways/{id} path parameters.
 */
export const paymentGatewayUpdatePathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type PaymentGatewayUpdatePathParams = z.infer<
  typeof paymentGatewayUpdatePathParamsSchema
>;

/**
 * PUT /payment_gateways/{id} request body.
 */
export const paymentGatewayUpdateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("Payment gateway description on checkout."),
    enabled: z.boolean().optional().describe("Payment gateway enabled status."),
    order: z.number().optional().describe("Payment gateway sort order."),
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
          ])
          .optional()
          .describe("Type of setting."),
        value: z.string().optional().describe("Setting value."),
      })
      .describe("Payment gateway settings.")
      .strict()
      .optional()
      .describe("Payment gateway settings."),
    title: z.string().optional().describe("Payment gateway title on checkout."),
  })
  .strict();

export type PaymentGatewayUpdateBody = z.infer<
  typeof paymentGatewayUpdateBodySchema
>;

/**
 * PUT /payment_gateways/{id} response body.
 */
export const paymentGatewayUpdateResponseSchema = z.unknown();

export type PaymentGatewayUpdateResponse = z.infer<
  typeof paymentGatewayUpdateResponseSchema
>;

/**
 * GET /payment_gateways query parameters.
 */
export const paymentGatewaysListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type PaymentGatewaysListQuery = z.infer<
  typeof paymentGatewaysListQuerySchema
>;

/**
 * GET /payment_gateways response body.
 */
export const paymentGatewaysListResponseSchema = z.array(
  z
    .object({
      description: z
        .string()
        .optional()
        .describe("Payment gateway description on checkout."),
      enabled: z
        .boolean()
        .optional()
        .describe("Payment gateway enabled status."),
      id: z.string().optional().describe("Payment gateway ID."),
      method_description: z
        .string()
        .optional()
        .describe("Payment gateway method description."),
      method_supports: z
        .array(z.string())
        .optional()
        .describe("Supported features for this payment gateway."),
      method_title: z
        .string()
        .optional()
        .describe("Payment gateway method title."),
      order: z.number().optional().describe("Payment gateway sort order."),
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
            ])
            .optional()
            .describe("Type of setting."),
          value: z.string().optional().describe("Setting value."),
        })
        .describe("Payment gateway settings.")
        .strict()
        .optional()
        .describe("Payment gateway settings."),
      title: z
        .string()
        .optional()
        .describe("Payment gateway title on checkout."),
    })
    .strict(),
);

export type PaymentGatewaysListResponse = z.infer<
  typeof paymentGatewaysListResponseSchema
>;
