/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  CouponDeletePathParams,
  CouponDeleteQuery,
  CouponDeleteResponse,
  CouponGetPathParams,
  CouponGetQuery,
  CouponGetResponse,
  CouponPostCustomBody,
  CouponPostCustomPathParams,
  CouponPostCustomResponse,
  CouponPutBatchCustomBody,
  CouponPutBatchCustomResponse,
  CouponUpdateBody,
  CouponUpdatePathParams,
  CouponUpdateResponse,
  CouponsBatchUpdateBody,
  CouponsBatchUpdateResponse,
  CouponsCreateBody,
  CouponsCreateResponse,
  CouponsListQuery,
  CouponsListResponse,
} from "../models/coupons";

export interface CouponDeleteRequest extends WooRequestOptions {
  path: CouponDeletePathParams;
  query?: CouponDeleteQuery;
}

export interface CouponGetRequest extends WooRequestOptions {
  path: CouponGetPathParams;
  query?: CouponGetQuery;
}

export interface CouponPostCustomRequest extends WooRequestOptions {
  path: CouponPostCustomPathParams;
  body?: CouponPostCustomBody;
}

export interface CouponPutBatchCustomRequest extends WooRequestOptions {
  body?: CouponPutBatchCustomBody;
}

export interface CouponUpdateRequest extends WooRequestOptions {
  path: CouponUpdatePathParams;
  body?: CouponUpdateBody;
}

export interface CouponsBatchUpdateRequest extends WooRequestOptions {
  body?: CouponsBatchUpdateBody;
}

export interface CouponsCreateRequest extends WooRequestOptions {
  body?: CouponsCreateBody;
}

export interface CouponsListRequest extends WooRequestOptions {
  query?: CouponsListQuery;
}

export interface CouponsModule {
  deleteCoupon(request: CouponDeleteRequest): Promise<CouponDeleteResponse>;
  getCoupon(request: CouponGetRequest): Promise<CouponGetResponse>;
  postCouponCustom(
    request: CouponPostCustomRequest,
  ): Promise<CouponPostCustomResponse>;
  putCouponBatchCustom(
    request?: CouponPutBatchCustomRequest,
  ): Promise<CouponPutBatchCustomResponse>;
  updateCoupon(request: CouponUpdateRequest): Promise<CouponUpdateResponse>;
  batchUpdateCoupons(
    request?: CouponsBatchUpdateRequest,
  ): Promise<CouponsBatchUpdateResponse>;
  createCoupon(request?: CouponsCreateRequest): Promise<CouponsCreateResponse>;
  listCoupons(request?: CouponsListRequest): Promise<CouponsListResponse>;
}

export const deleteCoupon = (
  execute: WooRequestExecutor,
  request: CouponDeleteRequest,
): Promise<CouponDeleteResponse> =>
  execute<CouponDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/coupons/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getCoupon = (
  execute: WooRequestExecutor,
  request: CouponGetRequest,
): Promise<CouponGetResponse> =>
  execute<CouponGetResponse>({
    method: "GET",
    routeTemplate: "/coupons/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postCouponCustom = (
  execute: WooRequestExecutor,
  request: CouponPostCustomRequest,
): Promise<CouponPostCustomResponse> =>
  execute<CouponPostCustomResponse>({
    method: "POST",
    routeTemplate: "/coupons/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putCouponBatchCustom = (
  execute: WooRequestExecutor,
  request?: CouponPutBatchCustomRequest,
): Promise<CouponPutBatchCustomResponse> =>
  execute<CouponPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/coupons/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const updateCoupon = (
  execute: WooRequestExecutor,
  request: CouponUpdateRequest,
): Promise<CouponUpdateResponse> =>
  execute<CouponUpdateResponse>({
    method: "PUT",
    routeTemplate: "/coupons/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateCoupons = (
  execute: WooRequestExecutor,
  request?: CouponsBatchUpdateRequest,
): Promise<CouponsBatchUpdateResponse> =>
  execute<CouponsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/coupons/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createCoupon = (
  execute: WooRequestExecutor,
  request?: CouponsCreateRequest,
): Promise<CouponsCreateResponse> =>
  execute<CouponsCreateResponse>({
    method: "POST",
    routeTemplate: "/coupons",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listCoupons = (
  execute: WooRequestExecutor,
  request?: CouponsListRequest,
): Promise<CouponsListResponse> =>
  execute<CouponsListResponse>({
    method: "GET",
    routeTemplate: "/coupons",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createCouponsModule = (
  execute: WooRequestExecutor,
): CouponsModule => ({
  deleteCoupon: (request) => deleteCoupon(execute, request),
  getCoupon: (request) => getCoupon(execute, request),
  postCouponCustom: (request) => postCouponCustom(execute, request),
  putCouponBatchCustom: (request) => putCouponBatchCustom(execute, request),
  updateCoupon: (request) => updateCoupon(execute, request),
  batchUpdateCoupons: (request) => batchUpdateCoupons(execute, request),
  createCoupon: (request) => createCoupon(execute, request),
  listCoupons: (request) => listCoupons(execute, request),
});
