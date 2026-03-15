/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  LayoutTemplateGetPathParams,
  LayoutTemplateGetResponse,
  LayoutTemplatesListQuery,
  LayoutTemplatesListResponse,
} from "../models/layoutTemplates";

export interface LayoutTemplateGetRequest extends WooRequestOptions {
  path: LayoutTemplateGetPathParams;
}

export interface LayoutTemplatesListRequest extends WooRequestOptions {
  query?: LayoutTemplatesListQuery;
}

export interface LayoutTemplatesModule {
  getLayoutTemplate(
    request: LayoutTemplateGetRequest,
  ): Promise<LayoutTemplateGetResponse>;
  listLayoutTemplates(
    request?: LayoutTemplatesListRequest,
  ): Promise<LayoutTemplatesListResponse>;
}

export const getLayoutTemplate = (
  execute: WooRequestExecutor,
  request: LayoutTemplateGetRequest,
): Promise<LayoutTemplateGetResponse> =>
  execute<LayoutTemplateGetResponse>({
    method: "GET",
    routeTemplate: "/layout-templates/{id}",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const listLayoutTemplates = (
  execute: WooRequestExecutor,
  request?: LayoutTemplatesListRequest,
): Promise<LayoutTemplatesListResponse> =>
  execute<LayoutTemplatesListResponse>({
    method: "GET",
    routeTemplate: "/layout-templates",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createLayoutTemplatesModule = (
  execute: WooRequestExecutor,
): LayoutTemplatesModule => ({
  getLayoutTemplate: (request) => getLayoutTemplate(execute, request),
  listLayoutTemplates: (request) => listLayoutTemplates(execute, request),
});
