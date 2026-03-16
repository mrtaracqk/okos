/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  PaymentGatewayGetPathParams,
  PaymentGatewayGetQuery,
  PaymentGatewayGetResponse,
  PaymentGatewayPostCustomBody,
  PaymentGatewayPostCustomPathParams,
  PaymentGatewayPostCustomResponse,
  PaymentGatewayUpdateBody,
  PaymentGatewayUpdatePathParams,
  PaymentGatewayUpdateResponse,
  PaymentGatewaysListQuery,
  PaymentGatewaysListResponse,
} from "../models/paymentGateways";

export interface PaymentGatewayGetRequest extends WooRequestOptions {
  path: PaymentGatewayGetPathParams;
  query?: PaymentGatewayGetQuery;
}

export interface PaymentGatewayPostCustomRequest extends WooRequestOptions {
  path: PaymentGatewayPostCustomPathParams;
  body?: PaymentGatewayPostCustomBody;
}

export interface PaymentGatewayUpdateRequest extends WooRequestOptions {
  path: PaymentGatewayUpdatePathParams;
  body?: PaymentGatewayUpdateBody;
}

export interface PaymentGatewaysListRequest extends WooRequestOptions {
  query?: PaymentGatewaysListQuery;
}

export interface PaymentGatewaysModule {
  getPaymentGateway(
    request: PaymentGatewayGetRequest,
  ): Promise<PaymentGatewayGetResponse>;
  postPaymentGatewayCustom(
    request: PaymentGatewayPostCustomRequest,
  ): Promise<PaymentGatewayPostCustomResponse>;
  updatePaymentGateway(
    request: PaymentGatewayUpdateRequest,
  ): Promise<PaymentGatewayUpdateResponse>;
  listPaymentGateways(
    request?: PaymentGatewaysListRequest,
  ): Promise<PaymentGatewaysListResponse>;
}

export const getPaymentGateway = (
  execute: WooRequestExecutor,
  request: PaymentGatewayGetRequest,
): Promise<PaymentGatewayGetResponse> =>
  execute<PaymentGatewayGetResponse>({
    method: "GET",
    routeTemplate: "/payment_gateways/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postPaymentGatewayCustom = (
  execute: WooRequestExecutor,
  request: PaymentGatewayPostCustomRequest,
): Promise<PaymentGatewayPostCustomResponse> =>
  execute<PaymentGatewayPostCustomResponse>({
    method: "POST",
    routeTemplate: "/payment_gateways/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const updatePaymentGateway = (
  execute: WooRequestExecutor,
  request: PaymentGatewayUpdateRequest,
): Promise<PaymentGatewayUpdateResponse> =>
  execute<PaymentGatewayUpdateResponse>({
    method: "PUT",
    routeTemplate: "/payment_gateways/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listPaymentGateways = (
  execute: WooRequestExecutor,
  request?: PaymentGatewaysListRequest,
): Promise<PaymentGatewaysListResponse> =>
  execute<PaymentGatewaysListResponse>({
    method: "GET",
    routeTemplate: "/payment_gateways",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createPaymentGatewaysModule = (
  execute: WooRequestExecutor,
): PaymentGatewaysModule => ({
  getPaymentGateway: (request) => getPaymentGateway(execute, request),
  postPaymentGatewayCustom: (request) =>
    postPaymentGatewayCustom(execute, request),
  updatePaymentGateway: (request) => updatePaymentGateway(execute, request),
  listPaymentGateways: (request) => listPaymentGateways(execute, request),
});
