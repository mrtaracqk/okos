/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * DELETE /coupons/{id} path parameters.
 */
export type CouponDeletePathParams = { id: number };

/**
 * DELETE /coupons/{id} query parameters.
 */
export type CouponDeleteQuery = { force?: boolean };

/**
 * DELETE /coupons/{id} response body.
 */
export type CouponDeleteResponse = unknown;

/**
 * GET /coupons/{id} path parameters.
 */
export type CouponGetPathParams = { id: number };

/**
 * GET /coupons/{id} query parameters.
 */
export type CouponGetQuery = { context?: "view" | "edit" };

/**
 * GET /coupons/{id} response body.
 */
export type CouponGetResponse = unknown;

/**
 * POST /coupons/{id} path parameters.
 */
export type CouponPostCustomPathParams = { id: number };

/**
 * POST /coupons/{id} request body.
 */
export type CouponPostCustomBody = {
  amount?: string;
  code?: string;
  date_expires?: null | string;
  date_expires_gmt?: null | string;
  description?: string;
  discount_type?: "percent" | "fixed_cart" | "fixed_product";
  email_restrictions?: Array<string>;
  exclude_sale_items?: boolean;
  excluded_product_categories?: Array<number>;
  excluded_product_ids?: Array<number>;
  free_shipping?: boolean;
  individual_use?: boolean;
  limit_usage_to_x_items?: number;
  maximum_amount?: string;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  minimum_amount?: string;
  product_categories?: Array<number>;
  product_ids?: Array<number>;
  status?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
};

/**
 * POST /coupons/{id} response body.
 */
export type CouponPostCustomResponse = unknown;

/**
 * PUT /coupons/batch request body.
 */
export type CouponPutBatchCustomBody = {
  amount?: string;
  code?: string;
  date_expires?: null | string;
  date_expires_gmt?: null | string;
  description?: string;
  discount_type?: "percent" | "fixed_cart" | "fixed_product";
  email_restrictions?: Array<string>;
  exclude_sale_items?: boolean;
  excluded_product_categories?: Array<number>;
  excluded_product_ids?: Array<number>;
  free_shipping?: boolean;
  individual_use?: boolean;
  limit_usage_to_x_items?: number;
  maximum_amount?: string;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  minimum_amount?: string;
  product_categories?: Array<number>;
  product_ids?: Array<number>;
  status?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
};

/**
 * PUT /coupons/batch response body.
 */
export type CouponPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * PUT /coupons/{id} path parameters.
 */
export type CouponUpdatePathParams = { id: number };

/**
 * PUT /coupons/{id} request body.
 */
export type CouponUpdateBody = {
  amount?: string;
  code?: string;
  date_expires?: null | string;
  date_expires_gmt?: null | string;
  description?: string;
  discount_type?: "percent" | "fixed_cart" | "fixed_product";
  email_restrictions?: Array<string>;
  exclude_sale_items?: boolean;
  excluded_product_categories?: Array<number>;
  excluded_product_ids?: Array<number>;
  free_shipping?: boolean;
  individual_use?: boolean;
  limit_usage_to_x_items?: number;
  maximum_amount?: string;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  minimum_amount?: string;
  product_categories?: Array<number>;
  product_ids?: Array<number>;
  status?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
};

/**
 * PUT /coupons/{id} response body.
 */
export type CouponUpdateResponse = unknown;

/**
 * POST /coupons/batch request body.
 */
export type CouponsBatchUpdateBody = {
  create?: Array<{
    amount?: string;
    code?: string;
    date_expires?: null | string;
    date_expires_gmt?: null | string;
    description?: string;
    discount_type?: "percent" | "fixed_cart" | "fixed_product";
    email_restrictions?: Array<string>;
    exclude_sale_items?: boolean;
    excluded_product_categories?: Array<number>;
    excluded_product_ids?: Array<number>;
    free_shipping?: boolean;
    individual_use?: boolean;
    limit_usage_to_x_items?: number;
    maximum_amount?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    minimum_amount?: string;
    product_categories?: Array<number>;
    product_ids?: Array<number>;
    status?: string;
    usage_limit?: number;
    usage_limit_per_user?: number;
  }>;
  delete?: Array<number>;
  update?: Array<{
    amount?: string;
    code?: string;
    date_expires?: null | string;
    date_expires_gmt?: null | string;
    description?: string;
    discount_type?: "percent" | "fixed_cart" | "fixed_product";
    email_restrictions?: Array<string>;
    exclude_sale_items?: boolean;
    excluded_product_categories?: Array<number>;
    excluded_product_ids?: Array<number>;
    free_shipping?: boolean;
    id: number;
    individual_use?: boolean;
    limit_usage_to_x_items?: number;
    maximum_amount?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    minimum_amount?: string;
    product_categories?: Array<number>;
    product_ids?: Array<number>;
    status?: string;
    usage_limit?: number;
    usage_limit_per_user?: number;
  }>;
};

/**
 * POST /coupons/batch response body.
 */
export type CouponsBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /coupons request body.
 */
export type CouponsCreateBody = {
  amount?: string;
  code: string;
  date_expires?: null | string;
  date_expires_gmt?: null | string;
  description?: string;
  discount_type?: "percent" | "fixed_cart" | "fixed_product";
  email_restrictions?: Array<string>;
  exclude_sale_items?: boolean;
  excluded_product_categories?: Array<number>;
  excluded_product_ids?: Array<number>;
  free_shipping?: boolean;
  individual_use?: boolean;
  limit_usage_to_x_items?: number;
  maximum_amount?: string;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  minimum_amount?: string;
  product_categories?: Array<number>;
  product_ids?: Array<number>;
  status?: string;
  usage_limit?: number;
  usage_limit_per_user?: number;
};

/**
 * POST /coupons response body.
 */
export type CouponsCreateResponse = {
  amount?: string;
  code?: string;
  date_created?: string;
  date_created_gmt?: string;
  date_expires?: string;
  date_expires_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  description?: string;
  discount_type?: "percent" | "fixed_cart" | "fixed_product";
  email_restrictions?: Array<string>;
  exclude_sale_items?: boolean;
  excluded_product_categories?: Array<number>;
  excluded_product_ids?: Array<number>;
  free_shipping?: boolean;
  id?: number;
  individual_use?: boolean;
  limit_usage_to_x_items?: number;
  maximum_amount?: string;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  minimum_amount?: string;
  product_categories?: Array<number>;
  product_ids?: Array<number>;
  status?: string;
  usage_count?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  used_by?: Array<number>;
};

/**
 * GET /coupons query parameters.
 */
export type CouponsListQuery = {
  after?: string;
  before?: string;
  code?: string;
  context?: "view" | "edit";
  dates_are_gmt?: boolean;
  exclude?: Array<number>;
  include?: Array<number>;
  modified_after?: string;
  modified_before?: string;
  offset?: number;
  order?: "asc" | "desc";
  orderby?: "date" | "id" | "include" | "title" | "slug" | "modified";
  page?: number;
  per_page?: number;
  search?: string;
};

/**
 * GET /coupons response body.
 */
export type CouponsListResponse = Array<{
  amount?: string;
  code?: string;
  date_created?: string;
  date_created_gmt?: string;
  date_expires?: string;
  date_expires_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  description?: string;
  discount_type?: "percent" | "fixed_cart" | "fixed_product";
  email_restrictions?: Array<string>;
  exclude_sale_items?: boolean;
  excluded_product_categories?: Array<number>;
  excluded_product_ids?: Array<number>;
  free_shipping?: boolean;
  id?: number;
  individual_use?: boolean;
  limit_usage_to_x_items?: number;
  maximum_amount?: string;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  minimum_amount?: string;
  product_categories?: Array<number>;
  product_ids?: Array<number>;
  status?: string;
  usage_count?: number;
  usage_limit?: number;
  usage_limit_per_user?: number;
  used_by?: Array<number>;
}>;
