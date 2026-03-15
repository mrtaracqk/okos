/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * POST /settings/{group_id}/batch path parameters.
 */
export type SettingBatchUpdatePathParams = { group_id: string };

/**
 * POST /settings/{group_id}/batch request body.
 */
export type SettingBatchUpdateBody = {
  create?: Array<{
    group?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  delete?: Array<number>;
  update?: Array<{
    group?: string;
    id: number;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
};

/**
 * POST /settings/{group_id}/batch response body.
 */
export type SettingBatchUpdateResponse = unknown;

/**
 * GET /settings/{group_id} path parameters.
 */
export type SettingGetGroupIdPathParams = { group_id: string };

/**
 * GET /settings/{group_id} query parameters.
 */
export type SettingGetGroupIdQuery = { group?: string };

/**
 * GET /settings/{group_id} response body.
 */
export type SettingGetGroupIdResponse = unknown;

/**
 * GET /settings/{group_id}/{id} path parameters.
 */
export type SettingGetGroupIdIdPathParams = { group_id: string; id: string };

/**
 * GET /settings/{group_id}/{id} query parameters.
 */
export type SettingGetGroupIdIdQuery = { group?: string };

/**
 * GET /settings/{group_id}/{id} response body.
 */
export type SettingGetGroupIdIdResponse = unknown;

/**
 * POST /settings/{group_id}/{id} path parameters.
 */
export type SettingPostCustomPathParams = { group_id: string; id: string };

/**
 * POST /settings/{group_id}/{id} request body.
 */
export type SettingPostCustomBody = {
  group?: string;
  value?:
    | null
    | Record<string, unknown>
    | string
    | number
    | boolean
    | Array<unknown>;
};

/**
 * POST /settings/{group_id}/{id} response body.
 */
export type SettingPostCustomResponse = unknown;

/**
 * PUT /settings/batch response body.
 */
export type SettingPutBatchCustomBatchResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * PUT /settings/{group_id}/batch path parameters.
 */
export type SettingPutBatchCustomGroupIdBatchPathParams = { group_id: string };

/**
 * PUT /settings/{group_id}/batch request body.
 */
export type SettingPutBatchCustomGroupIdBatchBody = {
  group?: string;
  value?:
    | null
    | Record<string, unknown>
    | string
    | number
    | boolean
    | Array<unknown>;
};

/**
 * PUT /settings/{group_id}/batch response body.
 */
export type SettingPutBatchCustomGroupIdBatchResponse = unknown;

/**
 * PUT /settings/{group_id}/{id} path parameters.
 */
export type SettingUpdatePathParams = { group_id: string; id: string };

/**
 * PUT /settings/{group_id}/{id} request body.
 */
export type SettingUpdateBody = {
  group?: string;
  value?:
    | null
    | Record<string, unknown>
    | string
    | number
    | boolean
    | Array<unknown>;
};

/**
 * PUT /settings/{group_id}/{id} response body.
 */
export type SettingUpdateResponse = unknown;

/**
 * POST /settings/batch request body.
 */
export type SettingsBatchUpdateBody = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<{ id: number }>;
};

/**
 * POST /settings/batch response body.
 */
export type SettingsBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * GET /settings response body.
 */
export type SettingsListResponse = Array<{
  description?: string;
  id?: string;
  label?: string;
  parent_id?: string;
  sub_groups?: string;
}>;
