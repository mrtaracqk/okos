/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  SettingBatchUpdateBody,
  SettingBatchUpdatePathParams,
  SettingBatchUpdateResponse,
  SettingGetGroupIdIdPathParams,
  SettingGetGroupIdIdQuery,
  SettingGetGroupIdIdResponse,
  SettingGetGroupIdPathParams,
  SettingGetGroupIdQuery,
  SettingGetGroupIdResponse,
  SettingPostCustomBody,
  SettingPostCustomPathParams,
  SettingPostCustomResponse,
  SettingPutBatchCustomBatchResponse,
  SettingPutBatchCustomGroupIdBatchBody,
  SettingPutBatchCustomGroupIdBatchPathParams,
  SettingPutBatchCustomGroupIdBatchResponse,
  SettingUpdateBody,
  SettingUpdatePathParams,
  SettingUpdateResponse,
  SettingsBatchUpdateBody,
  SettingsBatchUpdateResponse,
  SettingsListResponse,
} from "../models/settings";

export interface SettingBatchUpdateRequest extends WooRequestOptions {
  path: SettingBatchUpdatePathParams;
  body?: SettingBatchUpdateBody;
}

export interface SettingGetGroupIdRequest extends WooRequestOptions {
  path: SettingGetGroupIdPathParams;
  query?: SettingGetGroupIdQuery;
}

export interface SettingGetGroupIdIdRequest extends WooRequestOptions {
  path: SettingGetGroupIdIdPathParams;
  query?: SettingGetGroupIdIdQuery;
}

export interface SettingPostCustomRequest extends WooRequestOptions {
  path: SettingPostCustomPathParams;
  body?: SettingPostCustomBody;
}

export type SettingPutBatchCustomBatchRequest = WooRequestOptions;

export interface SettingPutBatchCustomGroupIdBatchRequest extends WooRequestOptions {
  path: SettingPutBatchCustomGroupIdBatchPathParams;
  body?: SettingPutBatchCustomGroupIdBatchBody;
}

export interface SettingUpdateRequest extends WooRequestOptions {
  path: SettingUpdatePathParams;
  body?: SettingUpdateBody;
}

export interface SettingsBatchUpdateRequest extends WooRequestOptions {
  body?: SettingsBatchUpdateBody;
}

export type SettingsListRequest = WooRequestOptions;

export interface SettingsModule {
  batchUpdateSetting(
    request: SettingBatchUpdateRequest,
  ): Promise<SettingBatchUpdateResponse>;
  getSettingGroupId(
    request: SettingGetGroupIdRequest,
  ): Promise<SettingGetGroupIdResponse>;
  getSettingGroupIdId(
    request: SettingGetGroupIdIdRequest,
  ): Promise<SettingGetGroupIdIdResponse>;
  postSettingCustom(
    request: SettingPostCustomRequest,
  ): Promise<SettingPostCustomResponse>;
  putSettingBatchCustomBatch(
    request?: SettingPutBatchCustomBatchRequest,
  ): Promise<SettingPutBatchCustomBatchResponse>;
  putSettingBatchCustomGroupIdBatch(
    request: SettingPutBatchCustomGroupIdBatchRequest,
  ): Promise<SettingPutBatchCustomGroupIdBatchResponse>;
  updateSetting(request: SettingUpdateRequest): Promise<SettingUpdateResponse>;
  batchUpdateSettings(
    request?: SettingsBatchUpdateRequest,
  ): Promise<SettingsBatchUpdateResponse>;
  listSettings(request?: SettingsListRequest): Promise<SettingsListResponse>;
}

export const batchUpdateSetting = (
  execute: WooRequestExecutor,
  request: SettingBatchUpdateRequest,
): Promise<SettingBatchUpdateResponse> =>
  execute<SettingBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/settings/{group_id}/batch",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const getSettingGroupId = (
  execute: WooRequestExecutor,
  request: SettingGetGroupIdRequest,
): Promise<SettingGetGroupIdResponse> =>
  execute<SettingGetGroupIdResponse>({
    method: "GET",
    routeTemplate: "/settings/{group_id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getSettingGroupIdId = (
  execute: WooRequestExecutor,
  request: SettingGetGroupIdIdRequest,
): Promise<SettingGetGroupIdIdResponse> =>
  execute<SettingGetGroupIdIdResponse>({
    method: "GET",
    routeTemplate: "/settings/{group_id}/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postSettingCustom = (
  execute: WooRequestExecutor,
  request: SettingPostCustomRequest,
): Promise<SettingPostCustomResponse> =>
  execute<SettingPostCustomResponse>({
    method: "POST",
    routeTemplate: "/settings/{group_id}/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putSettingBatchCustomBatch = (
  execute: WooRequestExecutor,
  request?: SettingPutBatchCustomBatchRequest,
): Promise<SettingPutBatchCustomBatchResponse> =>
  execute<SettingPutBatchCustomBatchResponse>({
    method: "PUT",
    routeTemplate: "/settings/batch",
    headers: request?.headers,
    signal: request?.signal,
  });

export const putSettingBatchCustomGroupIdBatch = (
  execute: WooRequestExecutor,
  request: SettingPutBatchCustomGroupIdBatchRequest,
): Promise<SettingPutBatchCustomGroupIdBatchResponse> =>
  execute<SettingPutBatchCustomGroupIdBatchResponse>({
    method: "PUT",
    routeTemplate: "/settings/{group_id}/batch",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const updateSetting = (
  execute: WooRequestExecutor,
  request: SettingUpdateRequest,
): Promise<SettingUpdateResponse> =>
  execute<SettingUpdateResponse>({
    method: "PUT",
    routeTemplate: "/settings/{group_id}/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateSettings = (
  execute: WooRequestExecutor,
  request?: SettingsBatchUpdateRequest,
): Promise<SettingsBatchUpdateResponse> =>
  execute<SettingsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/settings/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listSettings = (
  execute: WooRequestExecutor,
  request?: SettingsListRequest,
): Promise<SettingsListResponse> =>
  execute<SettingsListResponse>({
    method: "GET",
    routeTemplate: "/settings",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createSettingsModule = (
  execute: WooRequestExecutor,
): SettingsModule => ({
  batchUpdateSetting: (request) => batchUpdateSetting(execute, request),
  getSettingGroupId: (request) => getSettingGroupId(execute, request),
  getSettingGroupIdId: (request) => getSettingGroupIdId(execute, request),
  postSettingCustom: (request) => postSettingCustom(execute, request),
  putSettingBatchCustomBatch: (request) =>
    putSettingBatchCustomBatch(execute, request),
  putSettingBatchCustomGroupIdBatch: (request) =>
    putSettingBatchCustomGroupIdBatch(execute, request),
  updateSetting: (request) => updateSetting(execute, request),
  batchUpdateSettings: (request) => batchUpdateSettings(execute, request),
  listSettings: (request) => listSettings(execute, request),
});
