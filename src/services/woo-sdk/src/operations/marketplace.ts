/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  MarketplaceCreateOrderCreateBody,
  MarketplaceCreateOrderCreateResponse,
  MarketplaceFeaturedListResponse,
  MarketplaceRefreshCreateResponse,
  MarketplaceSubscriptionsActivateCreateBody,
  MarketplaceSubscriptionsActivateCreateResponse,
  MarketplaceSubscriptionsActivatePluginCreateBody,
  MarketplaceSubscriptionsActivatePluginCreateResponse,
  MarketplaceSubscriptionsConnectCreateBody,
  MarketplaceSubscriptionsConnectCreateResponse,
  MarketplaceSubscriptionsDisconnectCreateBody,
  MarketplaceSubscriptionsDisconnectCreateResponse,
  MarketplaceSubscriptionsInstallUrlListQuery,
  MarketplaceSubscriptionsInstallUrlListResponse,
  MarketplaceSubscriptionsListResponse,
} from "../models/marketplace";

export interface MarketplaceCreateOrderCreateRequest extends WooRequestOptions {
  body?: MarketplaceCreateOrderCreateBody;
}

export type MarketplaceFeaturedListRequest = WooRequestOptions;

export type MarketplaceRefreshCreateRequest = WooRequestOptions;

export interface MarketplaceSubscriptionsActivateCreateRequest extends WooRequestOptions {
  body?: MarketplaceSubscriptionsActivateCreateBody;
}

export interface MarketplaceSubscriptionsActivatePluginCreateRequest extends WooRequestOptions {
  body?: MarketplaceSubscriptionsActivatePluginCreateBody;
}

export interface MarketplaceSubscriptionsConnectCreateRequest extends WooRequestOptions {
  body?: MarketplaceSubscriptionsConnectCreateBody;
}

export interface MarketplaceSubscriptionsDisconnectCreateRequest extends WooRequestOptions {
  body?: MarketplaceSubscriptionsDisconnectCreateBody;
}

export interface MarketplaceSubscriptionsInstallUrlListRequest extends WooRequestOptions {
  query?: MarketplaceSubscriptionsInstallUrlListQuery;
}

export type MarketplaceSubscriptionsListRequest = WooRequestOptions;

export interface MarketplaceModule {
  createMarketplaceCreateOrder(
    request?: MarketplaceCreateOrderCreateRequest,
  ): Promise<MarketplaceCreateOrderCreateResponse>;
  listMarketplaceFeatured(
    request?: MarketplaceFeaturedListRequest,
  ): Promise<MarketplaceFeaturedListResponse>;
  createMarketplaceRefresh(
    request?: MarketplaceRefreshCreateRequest,
  ): Promise<MarketplaceRefreshCreateResponse>;
  createMarketplaceSubscriptionsActivate(
    request?: MarketplaceSubscriptionsActivateCreateRequest,
  ): Promise<MarketplaceSubscriptionsActivateCreateResponse>;
  createMarketplaceSubscriptionsActivatePlugin(
    request?: MarketplaceSubscriptionsActivatePluginCreateRequest,
  ): Promise<MarketplaceSubscriptionsActivatePluginCreateResponse>;
  createMarketplaceSubscriptionsConnect(
    request?: MarketplaceSubscriptionsConnectCreateRequest,
  ): Promise<MarketplaceSubscriptionsConnectCreateResponse>;
  createMarketplaceSubscriptionsDisconnect(
    request?: MarketplaceSubscriptionsDisconnectCreateRequest,
  ): Promise<MarketplaceSubscriptionsDisconnectCreateResponse>;
  listMarketplaceSubscriptionsInstallUrl(
    request?: MarketplaceSubscriptionsInstallUrlListRequest,
  ): Promise<MarketplaceSubscriptionsInstallUrlListResponse>;
  listMarketplaceSubscriptions(
    request?: MarketplaceSubscriptionsListRequest,
  ): Promise<MarketplaceSubscriptionsListResponse>;
}

export const createMarketplaceCreateOrder = (
  execute: WooRequestExecutor,
  request?: MarketplaceCreateOrderCreateRequest,
): Promise<MarketplaceCreateOrderCreateResponse> =>
  execute<MarketplaceCreateOrderCreateResponse>({
    method: "POST",
    routeTemplate: "/marketplace/create-order",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listMarketplaceFeatured = (
  execute: WooRequestExecutor,
  request?: MarketplaceFeaturedListRequest,
): Promise<MarketplaceFeaturedListResponse> =>
  execute<MarketplaceFeaturedListResponse>({
    method: "GET",
    routeTemplate: "/marketplace/featured",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createMarketplaceRefresh = (
  execute: WooRequestExecutor,
  request?: MarketplaceRefreshCreateRequest,
): Promise<MarketplaceRefreshCreateResponse> =>
  execute<MarketplaceRefreshCreateResponse>({
    method: "POST",
    routeTemplate: "/marketplace/refresh",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createMarketplaceSubscriptionsActivate = (
  execute: WooRequestExecutor,
  request?: MarketplaceSubscriptionsActivateCreateRequest,
): Promise<MarketplaceSubscriptionsActivateCreateResponse> =>
  execute<MarketplaceSubscriptionsActivateCreateResponse>({
    method: "POST",
    routeTemplate: "/marketplace/subscriptions/activate",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createMarketplaceSubscriptionsActivatePlugin = (
  execute: WooRequestExecutor,
  request?: MarketplaceSubscriptionsActivatePluginCreateRequest,
): Promise<MarketplaceSubscriptionsActivatePluginCreateResponse> =>
  execute<MarketplaceSubscriptionsActivatePluginCreateResponse>({
    method: "POST",
    routeTemplate: "/marketplace/subscriptions/activate-plugin",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createMarketplaceSubscriptionsConnect = (
  execute: WooRequestExecutor,
  request?: MarketplaceSubscriptionsConnectCreateRequest,
): Promise<MarketplaceSubscriptionsConnectCreateResponse> =>
  execute<MarketplaceSubscriptionsConnectCreateResponse>({
    method: "POST",
    routeTemplate: "/marketplace/subscriptions/connect",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createMarketplaceSubscriptionsDisconnect = (
  execute: WooRequestExecutor,
  request?: MarketplaceSubscriptionsDisconnectCreateRequest,
): Promise<MarketplaceSubscriptionsDisconnectCreateResponse> =>
  execute<MarketplaceSubscriptionsDisconnectCreateResponse>({
    method: "POST",
    routeTemplate: "/marketplace/subscriptions/disconnect",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listMarketplaceSubscriptionsInstallUrl = (
  execute: WooRequestExecutor,
  request?: MarketplaceSubscriptionsInstallUrlListRequest,
): Promise<MarketplaceSubscriptionsInstallUrlListResponse> =>
  execute<MarketplaceSubscriptionsInstallUrlListResponse>({
    method: "GET",
    routeTemplate: "/marketplace/subscriptions/install-url",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listMarketplaceSubscriptions = (
  execute: WooRequestExecutor,
  request?: MarketplaceSubscriptionsListRequest,
): Promise<MarketplaceSubscriptionsListResponse> =>
  execute<MarketplaceSubscriptionsListResponse>({
    method: "GET",
    routeTemplate: "/marketplace/subscriptions",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createMarketplaceModule = (
  execute: WooRequestExecutor,
): MarketplaceModule => ({
  createMarketplaceCreateOrder: (request) =>
    createMarketplaceCreateOrder(execute, request),
  listMarketplaceFeatured: (request) =>
    listMarketplaceFeatured(execute, request),
  createMarketplaceRefresh: (request) =>
    createMarketplaceRefresh(execute, request),
  createMarketplaceSubscriptionsActivate: (request) =>
    createMarketplaceSubscriptionsActivate(execute, request),
  createMarketplaceSubscriptionsActivatePlugin: (request) =>
    createMarketplaceSubscriptionsActivatePlugin(execute, request),
  createMarketplaceSubscriptionsConnect: (request) =>
    createMarketplaceSubscriptionsConnect(execute, request),
  createMarketplaceSubscriptionsDisconnect: (request) =>
    createMarketplaceSubscriptionsDisconnect(execute, request),
  listMarketplaceSubscriptionsInstallUrl: (request) =>
    listMarketplaceSubscriptionsInstallUrl(execute, request),
  listMarketplaceSubscriptions: (request) =>
    listMarketplaceSubscriptions(execute, request),
});
