/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  SystemStatuToolPostCustomBody,
  SystemStatuToolPostCustomPathParams,
  SystemStatuToolPostCustomResponse,
  SystemStatusListQuery,
  SystemStatusListResponse,
  SystemStatusToolGetPathParams,
  SystemStatusToolGetResponse,
  SystemStatusToolUpdateBody,
  SystemStatusToolUpdatePathParams,
  SystemStatusToolUpdateResponse,
  SystemStatusToolsListQuery,
  SystemStatusToolsListResponse,
} from "../models/systemStatus";

export interface SystemStatuToolPostCustomRequest extends WooRequestOptions {
  path: SystemStatuToolPostCustomPathParams;
  body?: SystemStatuToolPostCustomBody;
}

export interface SystemStatusListRequest extends WooRequestOptions {
  query?: SystemStatusListQuery;
}

export interface SystemStatusToolGetRequest extends WooRequestOptions {
  path: SystemStatusToolGetPathParams;
}

export interface SystemStatusToolUpdateRequest extends WooRequestOptions {
  path: SystemStatusToolUpdatePathParams;
  body?: SystemStatusToolUpdateBody;
}

export interface SystemStatusToolsListRequest extends WooRequestOptions {
  query?: SystemStatusToolsListQuery;
}

export interface SystemStatusModule {
  postSystemStatuToolCustom(
    request: SystemStatuToolPostCustomRequest,
  ): Promise<SystemStatuToolPostCustomResponse>;
  listSystemStatus(
    request?: SystemStatusListRequest,
  ): Promise<SystemStatusListResponse>;
  getSystemStatusTool(
    request: SystemStatusToolGetRequest,
  ): Promise<SystemStatusToolGetResponse>;
  updateSystemStatusTool(
    request: SystemStatusToolUpdateRequest,
  ): Promise<SystemStatusToolUpdateResponse>;
  listSystemStatusTools(
    request?: SystemStatusToolsListRequest,
  ): Promise<SystemStatusToolsListResponse>;
}

export const postSystemStatuToolCustom = (
  execute: WooRequestExecutor,
  request: SystemStatuToolPostCustomRequest,
): Promise<SystemStatuToolPostCustomResponse> =>
  execute<SystemStatuToolPostCustomResponse>({
    method: "POST",
    routeTemplate: "/system_status/tools/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listSystemStatus = (
  execute: WooRequestExecutor,
  request?: SystemStatusListRequest,
): Promise<SystemStatusListResponse> =>
  execute<SystemStatusListResponse>({
    method: "GET",
    routeTemplate: "/system_status",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const getSystemStatusTool = (
  execute: WooRequestExecutor,
  request: SystemStatusToolGetRequest,
): Promise<SystemStatusToolGetResponse> =>
  execute<SystemStatusToolGetResponse>({
    method: "GET",
    routeTemplate: "/system_status/tools/{id}",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const updateSystemStatusTool = (
  execute: WooRequestExecutor,
  request: SystemStatusToolUpdateRequest,
): Promise<SystemStatusToolUpdateResponse> =>
  execute<SystemStatusToolUpdateResponse>({
    method: "PUT",
    routeTemplate: "/system_status/tools/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listSystemStatusTools = (
  execute: WooRequestExecutor,
  request?: SystemStatusToolsListRequest,
): Promise<SystemStatusToolsListResponse> =>
  execute<SystemStatusToolsListResponse>({
    method: "GET",
    routeTemplate: "/system_status/tools",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createSystemStatusModule = (
  execute: WooRequestExecutor,
): SystemStatusModule => ({
  postSystemStatuToolCustom: (request) =>
    postSystemStatuToolCustom(execute, request),
  listSystemStatus: (request) => listSystemStatus(execute, request),
  getSystemStatusTool: (request) => getSystemStatusTool(execute, request),
  updateSystemStatusTool: (request) => updateSystemStatusTool(execute, request),
  listSystemStatusTools: (request) => listSystemStatusTools(execute, request),
});
