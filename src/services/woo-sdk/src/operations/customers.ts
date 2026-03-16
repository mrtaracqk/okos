/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  CustomerDeletePathParams,
  CustomerDeleteQuery,
  CustomerDeleteResponse,
  CustomerDownloadsListPathParams,
  CustomerDownloadsListQuery,
  CustomerDownloadsListResponse,
  CustomerGetPathParams,
  CustomerGetQuery,
  CustomerGetResponse,
  CustomerPostCustomBody,
  CustomerPostCustomPathParams,
  CustomerPostCustomResponse,
  CustomerPutBatchCustomBody,
  CustomerPutBatchCustomResponse,
  CustomerUpdateBody,
  CustomerUpdatePathParams,
  CustomerUpdateResponse,
  CustomersBatchUpdateBody,
  CustomersBatchUpdateResponse,
  CustomersCreateBody,
  CustomersCreateResponse,
  CustomersListQuery,
  CustomersListResponse,
} from "../models/customers";

export interface CustomerDeleteRequest extends WooRequestOptions {
  path: CustomerDeletePathParams;
  query?: CustomerDeleteQuery;
}

export interface CustomerDownloadsListRequest extends WooRequestOptions {
  path: CustomerDownloadsListPathParams;
  query?: CustomerDownloadsListQuery;
}

export interface CustomerGetRequest extends WooRequestOptions {
  path: CustomerGetPathParams;
  query?: CustomerGetQuery;
}

export interface CustomerPostCustomRequest extends WooRequestOptions {
  path: CustomerPostCustomPathParams;
  body?: CustomerPostCustomBody;
}

export interface CustomerPutBatchCustomRequest extends WooRequestOptions {
  body?: CustomerPutBatchCustomBody;
}

export interface CustomerUpdateRequest extends WooRequestOptions {
  path: CustomerUpdatePathParams;
  body?: CustomerUpdateBody;
}

export interface CustomersBatchUpdateRequest extends WooRequestOptions {
  body?: CustomersBatchUpdateBody;
}

export interface CustomersCreateRequest extends WooRequestOptions {
  body?: CustomersCreateBody;
}

export interface CustomersListRequest extends WooRequestOptions {
  query?: CustomersListQuery;
}

export interface CustomersModule {
  deleteCustomer(
    request: CustomerDeleteRequest,
  ): Promise<CustomerDeleteResponse>;
  listCustomerDownloads(
    request: CustomerDownloadsListRequest,
  ): Promise<CustomerDownloadsListResponse>;
  getCustomer(request: CustomerGetRequest): Promise<CustomerGetResponse>;
  postCustomerCustom(
    request: CustomerPostCustomRequest,
  ): Promise<CustomerPostCustomResponse>;
  putCustomerBatchCustom(
    request?: CustomerPutBatchCustomRequest,
  ): Promise<CustomerPutBatchCustomResponse>;
  updateCustomer(
    request: CustomerUpdateRequest,
  ): Promise<CustomerUpdateResponse>;
  batchUpdateCustomers(
    request?: CustomersBatchUpdateRequest,
  ): Promise<CustomersBatchUpdateResponse>;
  createCustomer(
    request?: CustomersCreateRequest,
  ): Promise<CustomersCreateResponse>;
  listCustomers(request?: CustomersListRequest): Promise<CustomersListResponse>;
}

export const deleteCustomer = (
  execute: WooRequestExecutor,
  request: CustomerDeleteRequest,
): Promise<CustomerDeleteResponse> =>
  execute<CustomerDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/customers/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const listCustomerDownloads = (
  execute: WooRequestExecutor,
  request: CustomerDownloadsListRequest,
): Promise<CustomerDownloadsListResponse> =>
  execute<CustomerDownloadsListResponse>({
    method: "GET",
    routeTemplate: "/customers/{customer_id}/downloads",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getCustomer = (
  execute: WooRequestExecutor,
  request: CustomerGetRequest,
): Promise<CustomerGetResponse> =>
  execute<CustomerGetResponse>({
    method: "GET",
    routeTemplate: "/customers/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postCustomerCustom = (
  execute: WooRequestExecutor,
  request: CustomerPostCustomRequest,
): Promise<CustomerPostCustomResponse> =>
  execute<CustomerPostCustomResponse>({
    method: "POST",
    routeTemplate: "/customers/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putCustomerBatchCustom = (
  execute: WooRequestExecutor,
  request?: CustomerPutBatchCustomRequest,
): Promise<CustomerPutBatchCustomResponse> =>
  execute<CustomerPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/customers/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const updateCustomer = (
  execute: WooRequestExecutor,
  request: CustomerUpdateRequest,
): Promise<CustomerUpdateResponse> =>
  execute<CustomerUpdateResponse>({
    method: "PUT",
    routeTemplate: "/customers/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateCustomers = (
  execute: WooRequestExecutor,
  request?: CustomersBatchUpdateRequest,
): Promise<CustomersBatchUpdateResponse> =>
  execute<CustomersBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/customers/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createCustomer = (
  execute: WooRequestExecutor,
  request?: CustomersCreateRequest,
): Promise<CustomersCreateResponse> =>
  execute<CustomersCreateResponse>({
    method: "POST",
    routeTemplate: "/customers",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listCustomers = (
  execute: WooRequestExecutor,
  request?: CustomersListRequest,
): Promise<CustomersListResponse> =>
  execute<CustomersListResponse>({
    method: "GET",
    routeTemplate: "/customers",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createCustomersModule = (
  execute: WooRequestExecutor,
): CustomersModule => ({
  deleteCustomer: (request) => deleteCustomer(execute, request),
  listCustomerDownloads: (request) => listCustomerDownloads(execute, request),
  getCustomer: (request) => getCustomer(execute, request),
  postCustomerCustom: (request) => postCustomerCustom(execute, request),
  putCustomerBatchCustom: (request) => putCustomerBatchCustom(execute, request),
  updateCustomer: (request) => updateCustomer(execute, request),
  batchUpdateCustomers: (request) => batchUpdateCustomers(execute, request),
  createCustomer: (request) => createCustomer(execute, request),
  listCustomers: (request) => listCustomers(execute, request),
});
