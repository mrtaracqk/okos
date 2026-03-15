/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  ShippingMethodGetPathParams,
  ShippingMethodGetQuery,
  ShippingMethodGetResponse,
  ShippingMethodsListQuery,
  ShippingMethodsListResponse,
} from "../models/shippingMethods";

export interface ShippingMethodGetRequest extends WooRequestOptions {
  path: ShippingMethodGetPathParams;
  query?: ShippingMethodGetQuery;
}

export interface ShippingMethodsListRequest extends WooRequestOptions {
  query?: ShippingMethodsListQuery;
}

export interface ShippingMethodsModule {
  getShippingMethod(
    request: ShippingMethodGetRequest,
  ): Promise<ShippingMethodGetResponse>;
  listShippingMethods(
    request?: ShippingMethodsListRequest,
  ): Promise<ShippingMethodsListResponse>;
}

export const getShippingMethod = (
  execute: WooRequestExecutor,
  request: ShippingMethodGetRequest,
): Promise<ShippingMethodGetResponse> =>
  execute<ShippingMethodGetResponse>({
    method: "GET",
    routeTemplate: "/shipping_methods/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const listShippingMethods = (
  execute: WooRequestExecutor,
  request?: ShippingMethodsListRequest,
): Promise<ShippingMethodsListResponse> =>
  execute<ShippingMethodsListResponse>({
    method: "GET",
    routeTemplate: "/shipping_methods",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createShippingMethodsModule = (
  execute: WooRequestExecutor,
): ShippingMethodsModule => ({
  getShippingMethod: (request) => getShippingMethod(execute, request),
  listShippingMethods: (request) => listShippingMethods(execute, request),
});
