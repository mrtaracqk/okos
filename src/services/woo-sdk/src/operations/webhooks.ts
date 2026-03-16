/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  WebhookDeletePathParams,
  WebhookDeleteQuery,
  WebhookDeleteResponse,
  WebhookGetPathParams,
  WebhookGetQuery,
  WebhookGetResponse,
  WebhookPostCustomBody,
  WebhookPostCustomPathParams,
  WebhookPostCustomResponse,
  WebhookPutBatchCustomBody,
  WebhookPutBatchCustomResponse,
  WebhookUpdateBody,
  WebhookUpdatePathParams,
  WebhookUpdateResponse,
  WebhooksBatchUpdateBody,
  WebhooksBatchUpdateResponse,
  WebhooksCreateBody,
  WebhooksCreateResponse,
  WebhooksListQuery,
  WebhooksListResponse,
} from "../models/webhooks";

export interface WebhookDeleteRequest extends WooRequestOptions {
  path: WebhookDeletePathParams;
  query?: WebhookDeleteQuery;
}

export interface WebhookGetRequest extends WooRequestOptions {
  path: WebhookGetPathParams;
  query?: WebhookGetQuery;
}

export interface WebhookPostCustomRequest extends WooRequestOptions {
  path: WebhookPostCustomPathParams;
  body?: WebhookPostCustomBody;
}

export interface WebhookPutBatchCustomRequest extends WooRequestOptions {
  body?: WebhookPutBatchCustomBody;
}

export interface WebhookUpdateRequest extends WooRequestOptions {
  path: WebhookUpdatePathParams;
  body?: WebhookUpdateBody;
}

export interface WebhooksBatchUpdateRequest extends WooRequestOptions {
  body?: WebhooksBatchUpdateBody;
}

export interface WebhooksCreateRequest extends WooRequestOptions {
  body?: WebhooksCreateBody;
}

export interface WebhooksListRequest extends WooRequestOptions {
  query?: WebhooksListQuery;
}

export interface WebhooksModule {
  deleteWebhook(request: WebhookDeleteRequest): Promise<WebhookDeleteResponse>;
  getWebhook(request: WebhookGetRequest): Promise<WebhookGetResponse>;
  postWebhookCustom(
    request: WebhookPostCustomRequest,
  ): Promise<WebhookPostCustomResponse>;
  putWebhookBatchCustom(
    request?: WebhookPutBatchCustomRequest,
  ): Promise<WebhookPutBatchCustomResponse>;
  updateWebhook(request: WebhookUpdateRequest): Promise<WebhookUpdateResponse>;
  batchUpdateWebhooks(
    request?: WebhooksBatchUpdateRequest,
  ): Promise<WebhooksBatchUpdateResponse>;
  createWebhook(
    request?: WebhooksCreateRequest,
  ): Promise<WebhooksCreateResponse>;
  listWebhooks(request?: WebhooksListRequest): Promise<WebhooksListResponse>;
}

export const deleteWebhook = (
  execute: WooRequestExecutor,
  request: WebhookDeleteRequest,
): Promise<WebhookDeleteResponse> =>
  execute<WebhookDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/webhooks/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getWebhook = (
  execute: WooRequestExecutor,
  request: WebhookGetRequest,
): Promise<WebhookGetResponse> =>
  execute<WebhookGetResponse>({
    method: "GET",
    routeTemplate: "/webhooks/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postWebhookCustom = (
  execute: WooRequestExecutor,
  request: WebhookPostCustomRequest,
): Promise<WebhookPostCustomResponse> =>
  execute<WebhookPostCustomResponse>({
    method: "POST",
    routeTemplate: "/webhooks/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putWebhookBatchCustom = (
  execute: WooRequestExecutor,
  request?: WebhookPutBatchCustomRequest,
): Promise<WebhookPutBatchCustomResponse> =>
  execute<WebhookPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/webhooks/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const updateWebhook = (
  execute: WooRequestExecutor,
  request: WebhookUpdateRequest,
): Promise<WebhookUpdateResponse> =>
  execute<WebhookUpdateResponse>({
    method: "PUT",
    routeTemplate: "/webhooks/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateWebhooks = (
  execute: WooRequestExecutor,
  request?: WebhooksBatchUpdateRequest,
): Promise<WebhooksBatchUpdateResponse> =>
  execute<WebhooksBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/webhooks/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createWebhook = (
  execute: WooRequestExecutor,
  request?: WebhooksCreateRequest,
): Promise<WebhooksCreateResponse> =>
  execute<WebhooksCreateResponse>({
    method: "POST",
    routeTemplate: "/webhooks",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listWebhooks = (
  execute: WooRequestExecutor,
  request?: WebhooksListRequest,
): Promise<WebhooksListResponse> =>
  execute<WebhooksListResponse>({
    method: "GET",
    routeTemplate: "/webhooks",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createWebhooksModule = (
  execute: WooRequestExecutor,
): WebhooksModule => ({
  deleteWebhook: (request) => deleteWebhook(execute, request),
  getWebhook: (request) => getWebhook(execute, request),
  postWebhookCustom: (request) => postWebhookCustom(execute, request),
  putWebhookBatchCustom: (request) => putWebhookBatchCustom(execute, request),
  updateWebhook: (request) => updateWebhook(execute, request),
  batchUpdateWebhooks: (request) => batchUpdateWebhooks(execute, request),
  createWebhook: (request) => createWebhook(execute, request),
  listWebhooks: (request) => listWebhooks(execute, request),
});
