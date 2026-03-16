/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type { RefundsListQuery, RefundsListResponse } from "../models/refunds";

export interface RefundsListRequest extends WooRequestOptions {
  query?: RefundsListQuery;
}

export interface RefundsModule {
  listRefunds(request?: RefundsListRequest): Promise<RefundsListResponse>;
}

export const listRefunds = (
  execute: WooRequestExecutor,
  request?: RefundsListRequest,
): Promise<RefundsListResponse> =>
  execute<RefundsListResponse>({
    method: "GET",
    routeTemplate: "/refunds",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createRefundsModule = (
  execute: WooRequestExecutor,
): RefundsModule => ({
  listRefunds: (request) => listRefunds(execute, request),
});
