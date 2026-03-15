/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  ShippingZoneDeletePathParams,
  ShippingZoneDeleteQuery,
  ShippingZoneDeleteResponse,
  ShippingZoneGetPathParams,
  ShippingZoneGetResponse,
  ShippingZoneLocationPutCustomBody,
  ShippingZoneLocationPutCustomPathParams,
  ShippingZoneLocationPutCustomResponse,
  ShippingZoneLocationsCreateBody,
  ShippingZoneLocationsCreatePathParams,
  ShippingZoneLocationsCreateResponse,
  ShippingZoneLocationsListPathParams,
  ShippingZoneLocationsListResponse,
  ShippingZoneMethodDeletePathParams,
  ShippingZoneMethodDeleteQuery,
  ShippingZoneMethodDeleteResponse,
  ShippingZoneMethodGetPathParams,
  ShippingZoneMethodGetResponse,
  ShippingZoneMethodPostCustomBody,
  ShippingZoneMethodPostCustomPathParams,
  ShippingZoneMethodPostCustomResponse,
  ShippingZoneMethodUpdateBody,
  ShippingZoneMethodUpdatePathParams,
  ShippingZoneMethodUpdateResponse,
  ShippingZoneMethodsCreateBody,
  ShippingZoneMethodsCreatePathParams,
  ShippingZoneMethodsCreateResponse,
  ShippingZoneMethodsListPathParams,
  ShippingZoneMethodsListResponse,
  ShippingZonePostCustomBody,
  ShippingZonePostCustomPathParams,
  ShippingZonePostCustomResponse,
  ShippingZoneUpdateBody,
  ShippingZoneUpdatePathParams,
  ShippingZoneUpdateResponse,
  ShippingZonesCreateBody,
  ShippingZonesCreateResponse,
  ShippingZonesListResponse,
} from "../models/shipping";

export interface ShippingZoneDeleteRequest extends WooRequestOptions {
  path: ShippingZoneDeletePathParams;
  query?: ShippingZoneDeleteQuery;
}

export interface ShippingZoneGetRequest extends WooRequestOptions {
  path: ShippingZoneGetPathParams;
}

export interface ShippingZoneLocationPutCustomRequest extends WooRequestOptions {
  path: ShippingZoneLocationPutCustomPathParams;
  body?: ShippingZoneLocationPutCustomBody;
}

export interface ShippingZoneLocationsCreateRequest extends WooRequestOptions {
  path: ShippingZoneLocationsCreatePathParams;
  body?: ShippingZoneLocationsCreateBody;
}

export interface ShippingZoneLocationsListRequest extends WooRequestOptions {
  path: ShippingZoneLocationsListPathParams;
}

export interface ShippingZoneMethodDeleteRequest extends WooRequestOptions {
  path: ShippingZoneMethodDeletePathParams;
  query?: ShippingZoneMethodDeleteQuery;
}

export interface ShippingZoneMethodGetRequest extends WooRequestOptions {
  path: ShippingZoneMethodGetPathParams;
}

export interface ShippingZoneMethodPostCustomRequest extends WooRequestOptions {
  path: ShippingZoneMethodPostCustomPathParams;
  body?: ShippingZoneMethodPostCustomBody;
}

export interface ShippingZoneMethodUpdateRequest extends WooRequestOptions {
  path: ShippingZoneMethodUpdatePathParams;
  body?: ShippingZoneMethodUpdateBody;
}

export interface ShippingZoneMethodsCreateRequest extends WooRequestOptions {
  path: ShippingZoneMethodsCreatePathParams;
  body?: ShippingZoneMethodsCreateBody;
}

export interface ShippingZoneMethodsListRequest extends WooRequestOptions {
  path: ShippingZoneMethodsListPathParams;
}

export interface ShippingZonePostCustomRequest extends WooRequestOptions {
  path: ShippingZonePostCustomPathParams;
  body?: ShippingZonePostCustomBody;
}

export interface ShippingZoneUpdateRequest extends WooRequestOptions {
  path: ShippingZoneUpdatePathParams;
  body?: ShippingZoneUpdateBody;
}

export interface ShippingZonesCreateRequest extends WooRequestOptions {
  body?: ShippingZonesCreateBody;
}

export type ShippingZonesListRequest = WooRequestOptions;

export interface ShippingModule {
  deleteShippingZone(
    request: ShippingZoneDeleteRequest,
  ): Promise<ShippingZoneDeleteResponse>;
  getShippingZone(
    request: ShippingZoneGetRequest,
  ): Promise<ShippingZoneGetResponse>;
  putShippingZoneLocationCustom(
    request: ShippingZoneLocationPutCustomRequest,
  ): Promise<ShippingZoneLocationPutCustomResponse>;
  createShippingZoneLocation(
    request: ShippingZoneLocationsCreateRequest,
  ): Promise<ShippingZoneLocationsCreateResponse>;
  listShippingZoneLocations(
    request: ShippingZoneLocationsListRequest,
  ): Promise<ShippingZoneLocationsListResponse>;
  deleteShippingZoneMethod(
    request: ShippingZoneMethodDeleteRequest,
  ): Promise<ShippingZoneMethodDeleteResponse>;
  getShippingZoneMethod(
    request: ShippingZoneMethodGetRequest,
  ): Promise<ShippingZoneMethodGetResponse>;
  postShippingZoneMethodCustom(
    request: ShippingZoneMethodPostCustomRequest,
  ): Promise<ShippingZoneMethodPostCustomResponse>;
  updateShippingZoneMethod(
    request: ShippingZoneMethodUpdateRequest,
  ): Promise<ShippingZoneMethodUpdateResponse>;
  createShippingZoneMethod(
    request: ShippingZoneMethodsCreateRequest,
  ): Promise<ShippingZoneMethodsCreateResponse>;
  listShippingZoneMethods(
    request: ShippingZoneMethodsListRequest,
  ): Promise<ShippingZoneMethodsListResponse>;
  postShippingZoneCustom(
    request: ShippingZonePostCustomRequest,
  ): Promise<ShippingZonePostCustomResponse>;
  updateShippingZone(
    request: ShippingZoneUpdateRequest,
  ): Promise<ShippingZoneUpdateResponse>;
  createShippingZone(
    request?: ShippingZonesCreateRequest,
  ): Promise<ShippingZonesCreateResponse>;
  listShippingZones(
    request?: ShippingZonesListRequest,
  ): Promise<ShippingZonesListResponse>;
}

export const deleteShippingZone = (
  execute: WooRequestExecutor,
  request: ShippingZoneDeleteRequest,
): Promise<ShippingZoneDeleteResponse> =>
  execute<ShippingZoneDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/shipping/zones/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getShippingZone = (
  execute: WooRequestExecutor,
  request: ShippingZoneGetRequest,
): Promise<ShippingZoneGetResponse> =>
  execute<ShippingZoneGetResponse>({
    method: "GET",
    routeTemplate: "/shipping/zones/{id}",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const putShippingZoneLocationCustom = (
  execute: WooRequestExecutor,
  request: ShippingZoneLocationPutCustomRequest,
): Promise<ShippingZoneLocationPutCustomResponse> =>
  execute<ShippingZoneLocationPutCustomResponse>({
    method: "PUT",
    routeTemplate: "/shipping/zones/{id}/locations",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createShippingZoneLocation = (
  execute: WooRequestExecutor,
  request: ShippingZoneLocationsCreateRequest,
): Promise<ShippingZoneLocationsCreateResponse> =>
  execute<ShippingZoneLocationsCreateResponse>({
    method: "POST",
    routeTemplate: "/shipping/zones/{id}/locations",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listShippingZoneLocations = (
  execute: WooRequestExecutor,
  request: ShippingZoneLocationsListRequest,
): Promise<ShippingZoneLocationsListResponse> =>
  execute<ShippingZoneLocationsListResponse>({
    method: "GET",
    routeTemplate: "/shipping/zones/{id}/locations",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const deleteShippingZoneMethod = (
  execute: WooRequestExecutor,
  request: ShippingZoneMethodDeleteRequest,
): Promise<ShippingZoneMethodDeleteResponse> =>
  execute<ShippingZoneMethodDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/shipping/zones/{zone_id}/methods/{instance_id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getShippingZoneMethod = (
  execute: WooRequestExecutor,
  request: ShippingZoneMethodGetRequest,
): Promise<ShippingZoneMethodGetResponse> =>
  execute<ShippingZoneMethodGetResponse>({
    method: "GET",
    routeTemplate: "/shipping/zones/{zone_id}/methods/{instance_id}",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const postShippingZoneMethodCustom = (
  execute: WooRequestExecutor,
  request: ShippingZoneMethodPostCustomRequest,
): Promise<ShippingZoneMethodPostCustomResponse> =>
  execute<ShippingZoneMethodPostCustomResponse>({
    method: "POST",
    routeTemplate: "/shipping/zones/{zone_id}/methods/{instance_id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const updateShippingZoneMethod = (
  execute: WooRequestExecutor,
  request: ShippingZoneMethodUpdateRequest,
): Promise<ShippingZoneMethodUpdateResponse> =>
  execute<ShippingZoneMethodUpdateResponse>({
    method: "PUT",
    routeTemplate: "/shipping/zones/{zone_id}/methods/{instance_id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createShippingZoneMethod = (
  execute: WooRequestExecutor,
  request: ShippingZoneMethodsCreateRequest,
): Promise<ShippingZoneMethodsCreateResponse> =>
  execute<ShippingZoneMethodsCreateResponse>({
    method: "POST",
    routeTemplate: "/shipping/zones/{zone_id}/methods",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listShippingZoneMethods = (
  execute: WooRequestExecutor,
  request: ShippingZoneMethodsListRequest,
): Promise<ShippingZoneMethodsListResponse> =>
  execute<ShippingZoneMethodsListResponse>({
    method: "GET",
    routeTemplate: "/shipping/zones/{zone_id}/methods",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const postShippingZoneCustom = (
  execute: WooRequestExecutor,
  request: ShippingZonePostCustomRequest,
): Promise<ShippingZonePostCustomResponse> =>
  execute<ShippingZonePostCustomResponse>({
    method: "POST",
    routeTemplate: "/shipping/zones/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const updateShippingZone = (
  execute: WooRequestExecutor,
  request: ShippingZoneUpdateRequest,
): Promise<ShippingZoneUpdateResponse> =>
  execute<ShippingZoneUpdateResponse>({
    method: "PUT",
    routeTemplate: "/shipping/zones/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createShippingZone = (
  execute: WooRequestExecutor,
  request?: ShippingZonesCreateRequest,
): Promise<ShippingZonesCreateResponse> =>
  execute<ShippingZonesCreateResponse>({
    method: "POST",
    routeTemplate: "/shipping/zones",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listShippingZones = (
  execute: WooRequestExecutor,
  request?: ShippingZonesListRequest,
): Promise<ShippingZonesListResponse> =>
  execute<ShippingZonesListResponse>({
    method: "GET",
    routeTemplate: "/shipping/zones",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createShippingModule = (
  execute: WooRequestExecutor,
): ShippingModule => ({
  deleteShippingZone: (request) => deleteShippingZone(execute, request),
  getShippingZone: (request) => getShippingZone(execute, request),
  putShippingZoneLocationCustom: (request) =>
    putShippingZoneLocationCustom(execute, request),
  createShippingZoneLocation: (request) =>
    createShippingZoneLocation(execute, request),
  listShippingZoneLocations: (request) =>
    listShippingZoneLocations(execute, request),
  deleteShippingZoneMethod: (request) =>
    deleteShippingZoneMethod(execute, request),
  getShippingZoneMethod: (request) => getShippingZoneMethod(execute, request),
  postShippingZoneMethodCustom: (request) =>
    postShippingZoneMethodCustom(execute, request),
  updateShippingZoneMethod: (request) =>
    updateShippingZoneMethod(execute, request),
  createShippingZoneMethod: (request) =>
    createShippingZoneMethod(execute, request),
  listShippingZoneMethods: (request) =>
    listShippingZoneMethods(execute, request),
  postShippingZoneCustom: (request) => postShippingZoneCustom(execute, request),
  updateShippingZone: (request) => updateShippingZone(execute, request),
  createShippingZone: (request) => createShippingZone(execute, request),
  listShippingZones: (request) => listShippingZones(execute, request),
});
