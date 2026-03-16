/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  TaxDeletePathParams,
  TaxDeleteQuery,
  TaxDeleteResponse,
  TaxGetPathParams,
  TaxGetQuery,
  TaxGetResponse,
  TaxPostCustomBody,
  TaxPostCustomPathParams,
  TaxPostCustomResponse,
  TaxPutBatchCustomBody,
  TaxPutBatchCustomResponse,
  TaxUpdateBody,
  TaxUpdatePathParams,
  TaxUpdateResponse,
  TaxesBatchUpdateBody,
  TaxesBatchUpdateResponse,
  TaxesClassDeletePathParams,
  TaxesClassDeleteQuery,
  TaxesClassDeleteResponse,
  TaxesClassGetPathParams,
  TaxesClassGetResponse,
  TaxesClassesCreateBody,
  TaxesClassesCreateResponse,
  TaxesClassesListQuery,
  TaxesClassesListResponse,
  TaxesCreateBody,
  TaxesCreateResponse,
  TaxesListQuery,
  TaxesListResponse,
} from "../models/taxes";

export interface TaxDeleteRequest extends WooRequestOptions {
  path: TaxDeletePathParams;
  query?: TaxDeleteQuery;
}

export interface TaxGetRequest extends WooRequestOptions {
  path: TaxGetPathParams;
  query?: TaxGetQuery;
}

export interface TaxPostCustomRequest extends WooRequestOptions {
  path: TaxPostCustomPathParams;
  body?: TaxPostCustomBody;
}

export interface TaxPutBatchCustomRequest extends WooRequestOptions {
  body?: TaxPutBatchCustomBody;
}

export interface TaxUpdateRequest extends WooRequestOptions {
  path: TaxUpdatePathParams;
  body?: TaxUpdateBody;
}

export interface TaxesBatchUpdateRequest extends WooRequestOptions {
  body?: TaxesBatchUpdateBody;
}

export interface TaxesClassDeleteRequest extends WooRequestOptions {
  path: TaxesClassDeletePathParams;
  query?: TaxesClassDeleteQuery;
}

export interface TaxesClassGetRequest extends WooRequestOptions {
  path: TaxesClassGetPathParams;
}

export interface TaxesClassesCreateRequest extends WooRequestOptions {
  body?: TaxesClassesCreateBody;
}

export interface TaxesClassesListRequest extends WooRequestOptions {
  query?: TaxesClassesListQuery;
}

export interface TaxesCreateRequest extends WooRequestOptions {
  body?: TaxesCreateBody;
}

export interface TaxesListRequest extends WooRequestOptions {
  query?: TaxesListQuery;
}

export interface TaxesModule {
  deleteTax(request: TaxDeleteRequest): Promise<TaxDeleteResponse>;
  getTax(request: TaxGetRequest): Promise<TaxGetResponse>;
  postTaxCustom(request: TaxPostCustomRequest): Promise<TaxPostCustomResponse>;
  putTaxBatchCustom(
    request?: TaxPutBatchCustomRequest,
  ): Promise<TaxPutBatchCustomResponse>;
  updateTax(request: TaxUpdateRequest): Promise<TaxUpdateResponse>;
  batchUpdateTaxes(
    request?: TaxesBatchUpdateRequest,
  ): Promise<TaxesBatchUpdateResponse>;
  deleteTaxesClass(
    request: TaxesClassDeleteRequest,
  ): Promise<TaxesClassDeleteResponse>;
  getTaxesClass(request: TaxesClassGetRequest): Promise<TaxesClassGetResponse>;
  createTaxesClass(
    request?: TaxesClassesCreateRequest,
  ): Promise<TaxesClassesCreateResponse>;
  listTaxesClasses(
    request?: TaxesClassesListRequest,
  ): Promise<TaxesClassesListResponse>;
  createTax(request?: TaxesCreateRequest): Promise<TaxesCreateResponse>;
  listTaxes(request?: TaxesListRequest): Promise<TaxesListResponse>;
}

export const deleteTax = (
  execute: WooRequestExecutor,
  request: TaxDeleteRequest,
): Promise<TaxDeleteResponse> =>
  execute<TaxDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/taxes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getTax = (
  execute: WooRequestExecutor,
  request: TaxGetRequest,
): Promise<TaxGetResponse> =>
  execute<TaxGetResponse>({
    method: "GET",
    routeTemplate: "/taxes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postTaxCustom = (
  execute: WooRequestExecutor,
  request: TaxPostCustomRequest,
): Promise<TaxPostCustomResponse> =>
  execute<TaxPostCustomResponse>({
    method: "POST",
    routeTemplate: "/taxes/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putTaxBatchCustom = (
  execute: WooRequestExecutor,
  request?: TaxPutBatchCustomRequest,
): Promise<TaxPutBatchCustomResponse> =>
  execute<TaxPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/taxes/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const updateTax = (
  execute: WooRequestExecutor,
  request: TaxUpdateRequest,
): Promise<TaxUpdateResponse> =>
  execute<TaxUpdateResponse>({
    method: "PUT",
    routeTemplate: "/taxes/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateTaxes = (
  execute: WooRequestExecutor,
  request?: TaxesBatchUpdateRequest,
): Promise<TaxesBatchUpdateResponse> =>
  execute<TaxesBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/taxes/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteTaxesClass = (
  execute: WooRequestExecutor,
  request: TaxesClassDeleteRequest,
): Promise<TaxesClassDeleteResponse> =>
  execute<TaxesClassDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/taxes/classes/{slug}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getTaxesClass = (
  execute: WooRequestExecutor,
  request: TaxesClassGetRequest,
): Promise<TaxesClassGetResponse> =>
  execute<TaxesClassGetResponse>({
    method: "GET",
    routeTemplate: "/taxes/classes/{slug}",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const createTaxesClass = (
  execute: WooRequestExecutor,
  request?: TaxesClassesCreateRequest,
): Promise<TaxesClassesCreateResponse> =>
  execute<TaxesClassesCreateResponse>({
    method: "POST",
    routeTemplate: "/taxes/classes",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listTaxesClasses = (
  execute: WooRequestExecutor,
  request?: TaxesClassesListRequest,
): Promise<TaxesClassesListResponse> =>
  execute<TaxesClassesListResponse>({
    method: "GET",
    routeTemplate: "/taxes/classes",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createTax = (
  execute: WooRequestExecutor,
  request?: TaxesCreateRequest,
): Promise<TaxesCreateResponse> =>
  execute<TaxesCreateResponse>({
    method: "POST",
    routeTemplate: "/taxes",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listTaxes = (
  execute: WooRequestExecutor,
  request?: TaxesListRequest,
): Promise<TaxesListResponse> =>
  execute<TaxesListResponse>({
    method: "GET",
    routeTemplate: "/taxes",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createTaxesModule = (
  execute: WooRequestExecutor,
): TaxesModule => ({
  deleteTax: (request) => deleteTax(execute, request),
  getTax: (request) => getTax(execute, request),
  postTaxCustom: (request) => postTaxCustom(execute, request),
  putTaxBatchCustom: (request) => putTaxBatchCustom(execute, request),
  updateTax: (request) => updateTax(execute, request),
  batchUpdateTaxes: (request) => batchUpdateTaxes(execute, request),
  deleteTaxesClass: (request) => deleteTaxesClass(execute, request),
  getTaxesClass: (request) => getTaxesClass(execute, request),
  createTaxesClass: (request) => createTaxesClass(execute, request),
  listTaxesClasses: (request) => listTaxesClasses(execute, request),
  createTax: (request) => createTax(execute, request),
  listTaxes: (request) => listTaxes(execute, request),
});
