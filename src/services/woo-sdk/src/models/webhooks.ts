/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * DELETE /webhooks/{id} path parameters.
 */
export const webhookDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type WebhookDeletePathParams = z.infer<
  typeof webhookDeletePathParamsSchema
>;

/**
 * DELETE /webhooks/{id} query parameters.
 */
export const webhookDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type WebhookDeleteQuery = z.infer<typeof webhookDeleteQuerySchema>;

/**
 * DELETE /webhooks/{id} response body.
 */
export const webhookDeleteResponseSchema = z.unknown();

export type WebhookDeleteResponse = z.infer<typeof webhookDeleteResponseSchema>;

/**
 * GET /webhooks/{id} path parameters.
 */
export const webhookGetPathParamsSchema = z.object({ id: z.number() }).strict();

export type WebhookGetPathParams = z.infer<typeof webhookGetPathParamsSchema>;

/**
 * GET /webhooks/{id} query parameters.
 */
export const webhookGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type WebhookGetQuery = z.infer<typeof webhookGetQuerySchema>;

/**
 * GET /webhooks/{id} response body.
 */
export const webhookGetResponseSchema = z
  .object({
    date_created: z
      .string()
      .optional()
      .describe("The date the webhook was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the webhook was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the webhook was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the webhook was last modified, as GMT."),
    delivery_url: z
      .string()
      .optional()
      .describe("The URL where the webhook payload is delivered."),
    event: z.string().optional().describe("Webhook event."),
    hooks: z
      .array(z.string())
      .optional()
      .describe("WooCommerce action names associated with the webhook."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("A friendly name for the webhook."),
    resource: z.string().optional().describe("Webhook resource."),
    secret: z
      .string()
      .optional()
      .describe(
        "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
      ),
    status: z
      .enum(["active", "paused", "disabled"])
      .optional()
      .describe("Webhook status."),
    topic: z.string().optional().describe("Webhook topic."),
  })
  .strict();

export type WebhookGetResponse = z.infer<typeof webhookGetResponseSchema>;

/**
 * POST /webhooks/{id} path parameters.
 */
export const webhookPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type WebhookPostCustomPathParams = z.infer<
  typeof webhookPostCustomPathParamsSchema
>;

/**
 * POST /webhooks/{id} request body.
 */
export const webhookPostCustomBodySchema = z
  .object({
    name: z.string().optional().describe("A friendly name for the webhook."),
    secret: z
      .string()
      .optional()
      .describe(
        "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
      ),
    status: z
      .enum(["active", "paused", "disabled"])
      .optional()
      .describe("Webhook status."),
    topic: z.string().optional().describe("Webhook topic."),
  })
  .strict();

export type WebhookPostCustomBody = z.infer<typeof webhookPostCustomBodySchema>;

/**
 * POST /webhooks/{id} response body.
 */
export const webhookPostCustomResponseSchema = z.unknown();

export type WebhookPostCustomResponse = z.infer<
  typeof webhookPostCustomResponseSchema
>;

/**
 * PUT /webhooks/batch request body.
 */
export const webhookPutBatchCustomBodySchema = z
  .object({
    name: z.string().optional().describe("A friendly name for the webhook."),
    secret: z
      .string()
      .optional()
      .describe(
        "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
      ),
    status: z
      .enum(["active", "paused", "disabled"])
      .optional()
      .describe("Webhook status."),
    topic: z.string().optional().describe("Webhook topic."),
  })
  .strict();

export type WebhookPutBatchCustomBody = z.infer<
  typeof webhookPutBatchCustomBodySchema
>;

/**
 * PUT /webhooks/batch response body.
 */
export const webhookPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type WebhookPutBatchCustomResponse = z.infer<
  typeof webhookPutBatchCustomResponseSchema
>;

/**
 * PUT /webhooks/{id} path parameters.
 */
export const webhookUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type WebhookUpdatePathParams = z.infer<
  typeof webhookUpdatePathParamsSchema
>;

/**
 * PUT /webhooks/{id} request body.
 */
export const webhookUpdateBodySchema = z
  .object({
    name: z.string().optional().describe("A friendly name for the webhook."),
    secret: z
      .string()
      .optional()
      .describe(
        "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
      ),
    status: z
      .enum(["active", "paused", "disabled"])
      .optional()
      .describe("Webhook status."),
    topic: z.string().optional().describe("Webhook topic."),
  })
  .strict();

export type WebhookUpdateBody = z.infer<typeof webhookUpdateBodySchema>;

/**
 * PUT /webhooks/{id} response body.
 */
export const webhookUpdateResponseSchema = z.unknown();

export type WebhookUpdateResponse = z.infer<typeof webhookUpdateResponseSchema>;

/**
 * POST /webhooks/batch request body.
 */
export const webhooksBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            name: z
              .string()
              .optional()
              .describe("A friendly name for the webhook."),
            secret: z
              .string()
              .optional()
              .describe(
                "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
              ),
            status: z
              .enum(["active", "paused", "disabled"])
              .optional()
              .describe("Webhook status."),
            topic: z.string().optional().describe("Webhook topic."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            id: z.number(),
            name: z
              .string()
              .optional()
              .describe("A friendly name for the webhook."),
            secret: z
              .string()
              .optional()
              .describe(
                "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
              ),
            status: z
              .enum(["active", "paused", "disabled"])
              .optional()
              .describe("Webhook status."),
            topic: z.string().optional().describe("Webhook topic."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type WebhooksBatchUpdateBody = z.infer<
  typeof webhooksBatchUpdateBodySchema
>;

/**
 * POST /webhooks/batch response body.
 */
export const webhooksBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type WebhooksBatchUpdateResponse = z.infer<
  typeof webhooksBatchUpdateResponseSchema
>;

/**
 * POST /webhooks request body.
 */
export const webhooksCreateBodySchema = z
  .object({
    delivery_url: z.string().describe("Webhook delivery URL."),
    name: z.string().optional().describe("A friendly name for the webhook."),
    secret: z
      .string()
      .optional()
      .describe(
        "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
      ),
    status: z
      .enum(["active", "paused", "disabled"])
      .optional()
      .describe("Webhook status."),
    topic: z.string().describe("Webhook topic."),
  })
  .strict();

export type WebhooksCreateBody = z.infer<typeof webhooksCreateBodySchema>;

/**
 * POST /webhooks response body.
 */
export const webhooksCreateResponseSchema = z
  .object({
    date_created: z
      .string()
      .optional()
      .describe("The date the webhook was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the webhook was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the webhook was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the webhook was last modified, as GMT."),
    delivery_url: z
      .string()
      .optional()
      .describe("The URL where the webhook payload is delivered."),
    event: z.string().optional().describe("Webhook event."),
    hooks: z
      .array(z.string())
      .optional()
      .describe("WooCommerce action names associated with the webhook."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("A friendly name for the webhook."),
    resource: z.string().optional().describe("Webhook resource."),
    secret: z
      .string()
      .optional()
      .describe(
        "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
      ),
    status: z
      .enum(["active", "paused", "disabled"])
      .optional()
      .describe("Webhook status."),
    topic: z.string().optional().describe("Webhook topic."),
  })
  .strict();

export type WebhooksCreateResponse = z.infer<
  typeof webhooksCreateResponseSchema
>;

/**
 * GET /webhooks query parameters.
 */
export const webhooksListQuerySchema = z
  .object({
    after: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published after a given ISO8601 compliant date.",
      ),
    before: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published before a given ISO8601 compliant date.",
      ),
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    offset: z
      .number()
      .optional()
      .describe("Offset the result set by a specific number of items."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum(["date", "id", "title"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    status: z
      .enum(["all", "active", "paused", "disabled"])
      .optional()
      .describe("Limit result set to webhooks assigned a specific status."),
  })
  .strict();

export type WebhooksListQuery = z.infer<typeof webhooksListQuerySchema>;

/**
 * GET /webhooks response body.
 */
export const webhooksListResponseSchema = z.array(
  z
    .object({
      date_created: z
        .string()
        .optional()
        .describe("The date the webhook was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the webhook was created, as GMT."),
      date_modified: z
        .string()
        .optional()
        .describe(
          "The date the webhook was last modified, in the site's timezone.",
        ),
      date_modified_gmt: z
        .string()
        .optional()
        .describe("The date the webhook was last modified, as GMT."),
      delivery_url: z
        .string()
        .optional()
        .describe("The URL where the webhook payload is delivered."),
      event: z.string().optional().describe("Webhook event."),
      hooks: z
        .array(z.string())
        .optional()
        .describe("WooCommerce action names associated with the webhook."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("A friendly name for the webhook."),
      resource: z.string().optional().describe("Webhook resource."),
      secret: z
        .string()
        .optional()
        .describe(
          "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided.",
        ),
      status: z
        .enum(["active", "paused", "disabled"])
        .optional()
        .describe("Webhook status."),
      topic: z.string().optional().describe("Webhook topic."),
    })
    .strict(),
);

export type WebhooksListResponse = z.infer<typeof webhooksListResponseSchema>;
