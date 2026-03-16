/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  ReportsCouponsTotalsListQuery,
  ReportsCouponsTotalsListResponse,
  ReportsCustomersTotalsListQuery,
  ReportsCustomersTotalsListResponse,
  ReportsListQuery,
  ReportsListResponse,
  ReportsOrdersTotalsListQuery,
  ReportsOrdersTotalsListResponse,
  ReportsProductsTotalsListQuery,
  ReportsProductsTotalsListResponse,
  ReportsReviewsTotalsListQuery,
  ReportsReviewsTotalsListResponse,
  ReportsSalesListQuery,
  ReportsSalesListResponse,
  ReportsTopSellersListQuery,
  ReportsTopSellersListResponse,
} from "../models/reports";

export interface ReportsCouponsTotalsListRequest extends WooRequestOptions {
  query?: ReportsCouponsTotalsListQuery;
}

export interface ReportsCustomersTotalsListRequest extends WooRequestOptions {
  query?: ReportsCustomersTotalsListQuery;
}

export interface ReportsListRequest extends WooRequestOptions {
  query?: ReportsListQuery;
}

export interface ReportsOrdersTotalsListRequest extends WooRequestOptions {
  query?: ReportsOrdersTotalsListQuery;
}

export interface ReportsProductsTotalsListRequest extends WooRequestOptions {
  query?: ReportsProductsTotalsListQuery;
}

export interface ReportsReviewsTotalsListRequest extends WooRequestOptions {
  query?: ReportsReviewsTotalsListQuery;
}

export interface ReportsSalesListRequest extends WooRequestOptions {
  query?: ReportsSalesListQuery;
}

export interface ReportsTopSellersListRequest extends WooRequestOptions {
  query?: ReportsTopSellersListQuery;
}

export interface ReportsModule {
  listReportsCouponsTotals(
    request?: ReportsCouponsTotalsListRequest,
  ): Promise<ReportsCouponsTotalsListResponse>;
  listReportsCustomersTotals(
    request?: ReportsCustomersTotalsListRequest,
  ): Promise<ReportsCustomersTotalsListResponse>;
  listReports(request?: ReportsListRequest): Promise<ReportsListResponse>;
  listReportsOrdersTotals(
    request?: ReportsOrdersTotalsListRequest,
  ): Promise<ReportsOrdersTotalsListResponse>;
  listReportsProductsTotals(
    request?: ReportsProductsTotalsListRequest,
  ): Promise<ReportsProductsTotalsListResponse>;
  listReportsReviewsTotals(
    request?: ReportsReviewsTotalsListRequest,
  ): Promise<ReportsReviewsTotalsListResponse>;
  listReportsSales(
    request?: ReportsSalesListRequest,
  ): Promise<ReportsSalesListResponse>;
  listReportsTopSellers(
    request?: ReportsTopSellersListRequest,
  ): Promise<ReportsTopSellersListResponse>;
}

export const listReportsCouponsTotals = (
  execute: WooRequestExecutor,
  request?: ReportsCouponsTotalsListRequest,
): Promise<ReportsCouponsTotalsListResponse> =>
  execute<ReportsCouponsTotalsListResponse>({
    method: "GET",
    routeTemplate: "/reports/coupons/totals",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReportsCustomersTotals = (
  execute: WooRequestExecutor,
  request?: ReportsCustomersTotalsListRequest,
): Promise<ReportsCustomersTotalsListResponse> =>
  execute<ReportsCustomersTotalsListResponse>({
    method: "GET",
    routeTemplate: "/reports/customers/totals",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReports = (
  execute: WooRequestExecutor,
  request?: ReportsListRequest,
): Promise<ReportsListResponse> =>
  execute<ReportsListResponse>({
    method: "GET",
    routeTemplate: "/reports",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReportsOrdersTotals = (
  execute: WooRequestExecutor,
  request?: ReportsOrdersTotalsListRequest,
): Promise<ReportsOrdersTotalsListResponse> =>
  execute<ReportsOrdersTotalsListResponse>({
    method: "GET",
    routeTemplate: "/reports/orders/totals",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReportsProductsTotals = (
  execute: WooRequestExecutor,
  request?: ReportsProductsTotalsListRequest,
): Promise<ReportsProductsTotalsListResponse> =>
  execute<ReportsProductsTotalsListResponse>({
    method: "GET",
    routeTemplate: "/reports/products/totals",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReportsReviewsTotals = (
  execute: WooRequestExecutor,
  request?: ReportsReviewsTotalsListRequest,
): Promise<ReportsReviewsTotalsListResponse> =>
  execute<ReportsReviewsTotalsListResponse>({
    method: "GET",
    routeTemplate: "/reports/reviews/totals",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReportsSales = (
  execute: WooRequestExecutor,
  request?: ReportsSalesListRequest,
): Promise<ReportsSalesListResponse> =>
  execute<ReportsSalesListResponse>({
    method: "GET",
    routeTemplate: "/reports/sales",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listReportsTopSellers = (
  execute: WooRequestExecutor,
  request?: ReportsTopSellersListRequest,
): Promise<ReportsTopSellersListResponse> =>
  execute<ReportsTopSellersListResponse>({
    method: "GET",
    routeTemplate: "/reports/top_sellers",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createReportsModule = (
  execute: WooRequestExecutor,
): ReportsModule => ({
  listReportsCouponsTotals: (request) =>
    listReportsCouponsTotals(execute, request),
  listReportsCustomersTotals: (request) =>
    listReportsCustomersTotals(execute, request),
  listReports: (request) => listReports(execute, request),
  listReportsOrdersTotals: (request) =>
    listReportsOrdersTotals(execute, request),
  listReportsProductsTotals: (request) =>
    listReportsProductsTotals(execute, request),
  listReportsReviewsTotals: (request) =>
    listReportsReviewsTotals(execute, request),
  listReportsSales: (request) => listReportsSales(execute, request),
  listReportsTopSellers: (request) => listReportsTopSellers(execute, request),
});
