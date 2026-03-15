/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * DELETE /webhooks/{id} path parameters.
 */
export type WebhookDeletePathParams = { id: number };

/**
 * DELETE /webhooks/{id} query parameters.
 */
export type WebhookDeleteQuery = { force?: boolean };

/**
 * DELETE /webhooks/{id} response body.
 */
export type WebhookDeleteResponse = unknown;

/**
 * GET /webhooks/{id} path parameters.
 */
export type WebhookGetPathParams = { id: number };

/**
 * GET /webhooks/{id} query parameters.
 */
export type WebhookGetQuery = { context?: "view" | "edit" };

/**
 * GET /webhooks/{id} response body.
 */
export type WebhookGetResponse = unknown;

/**
 * POST /webhooks/{id} path parameters.
 */
export type WebhookPostCustomPathParams = { id: number };

/**
 * POST /webhooks/{id} request body.
 */
export type WebhookPostCustomBody = {
  name?: string;
  secret?: string;
  status?: "active" | "paused" | "disabled";
  topic?: string;
};

/**
 * POST /webhooks/{id} response body.
 */
export type WebhookPostCustomResponse = unknown;

/**
 * PUT /webhooks/batch request body.
 */
export type WebhookPutBatchCustomBody = {
  name?: string;
  secret?: string;
  status?: "active" | "paused" | "disabled";
  topic?: string;
};

/**
 * PUT /webhooks/batch response body.
 */
export type WebhookPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * PUT /webhooks/{id} path parameters.
 */
export type WebhookUpdatePathParams = { id: number };

/**
 * PUT /webhooks/{id} request body.
 */
export type WebhookUpdateBody = {
  name?: string;
  secret?: string;
  status?: "active" | "paused" | "disabled";
  topic?: string;
};

/**
 * PUT /webhooks/{id} response body.
 */
export type WebhookUpdateResponse = unknown;

/**
 * POST /webhooks/batch request body.
 */
export type WebhooksBatchUpdateBody = {
  create?: Array<{
    name?: string;
    secret?: string;
    status?: "active" | "paused" | "disabled";
    topic?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    id: number;
    name?: string;
    secret?: string;
    status?: "active" | "paused" | "disabled";
    topic?: string;
  }>;
};

/**
 * POST /webhooks/batch response body.
 */
export type WebhooksBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /webhooks request body.
 */
export type WebhooksCreateBody = {
  delivery_url: string;
  name?: string;
  secret?: string;
  status?: "active" | "paused" | "disabled";
  topic: string;
};

/**
 * POST /webhooks response body.
 */
export type WebhooksCreateResponse = {
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  delivery_url?: string;
  event?: string;
  hooks?: Array<string>;
  id?: number;
  name?: string;
  resource?: string;
  secret?: string;
  status?: "active" | "paused" | "disabled";
  topic?: string;
};

/**
 * GET /webhooks query parameters.
 */
export type WebhooksListQuery = {
  after?: string;
  before?: string;
  context?: "view" | "edit";
  exclude?: Array<number>;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?: "date" | "id" | "title";
  page?: number;
  per_page?: number;
  search?: string;
  status?: "all" | "active" | "paused" | "disabled";
};

/**
 * GET /webhooks response body.
 */
export type WebhooksListResponse = Array<{
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  delivery_url?: string;
  event?: string;
  hooks?: Array<string>;
  id?: number;
  name?: string;
  resource?: string;
  secret?: string;
  status?: "active" | "paused" | "disabled";
  topic?: string;
}>;
