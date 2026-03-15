/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * DELETE /customers/{id} path parameters.
 */
export type CustomerDeletePathParams = { id: number };

/**
 * DELETE /customers/{id} query parameters.
 */
export type CustomerDeleteQuery = { force?: boolean; reassign?: number };

/**
 * DELETE /customers/{id} response body.
 */
export type CustomerDeleteResponse = unknown;

/**
 * GET /customers/{customer_id}/downloads path parameters.
 */
export type CustomerDownloadsListPathParams = { customer_id: number };

/**
 * GET /customers/{customer_id}/downloads query parameters.
 */
export type CustomerDownloadsListQuery = { context?: "view" };

/**
 * GET /customers/{customer_id}/downloads response body.
 */
export type CustomerDownloadsListResponse = Array<unknown>;

/**
 * GET /customers/{id} path parameters.
 */
export type CustomerGetPathParams = { id: number };

/**
 * GET /customers/{id} query parameters.
 */
export type CustomerGetQuery = { context?: "view" | "edit" };

/**
 * GET /customers/{id} response body.
 */
export type CustomerGetResponse = unknown;

/**
 * POST /customers/{id} path parameters.
 */
export type CustomerPostCustomPathParams = { id: number };

/**
 * POST /customers/{id} request body.
 */
export type CustomerPostCustomBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  email?: string;
  first_name?: string;
  last_name?: string;
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
  password?: string;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  username?: string;
};

/**
 * POST /customers/{id} response body.
 */
export type CustomerPostCustomResponse = unknown;

/**
 * PUT /customers/batch request body.
 */
export type CustomerPutBatchCustomBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  email?: string;
  first_name?: string;
  last_name?: string;
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
  password?: string;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  username?: string;
};

/**
 * PUT /customers/batch response body.
 */
export type CustomerPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * PUT /customers/{id} path parameters.
 */
export type CustomerUpdatePathParams = { id: number };

/**
 * PUT /customers/{id} request body.
 */
export type CustomerUpdateBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  email?: string;
  first_name?: string;
  last_name?: string;
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
  password?: string;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  username?: string;
};

/**
 * PUT /customers/{id} response body.
 */
export type CustomerUpdateResponse = unknown;

/**
 * POST /customers/batch request body.
 */
export type CustomersBatchUpdateBody = {
  create?: Array<{
    billing?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      postcode?: string;
      state?: string;
    };
    email?: string;
    first_name?: string;
    last_name?: string;
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
    password?: string;
    shipping?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      postcode?: string;
      state?: string;
    };
    username?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    billing?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      postcode?: string;
      state?: string;
    };
    email?: string;
    first_name?: string;
    id: number;
    last_name?: string;
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
    password?: string;
    shipping?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
      postcode?: string;
      state?: string;
    };
    username?: string;
  }>;
};

/**
 * POST /customers/batch response body.
 */
export type CustomersBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /customers request body.
 */
export type CustomersCreateBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  email: string;
  first_name?: string;
  last_name?: string;
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
  password?: string;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  username?: string;
};

/**
 * POST /customers response body.
 */
export type CustomersCreateResponse = {
  avatar_url?: string;
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  email?: string;
  first_name?: string;
  id?: number;
  is_paying_customer?: boolean;
  last_name?: string;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  password?: string;
  role?: string;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  username?: string;
};

/**
 * GET /customers query parameters.
 */
export type CustomersListQuery = {
  context?: "view" | "edit";
  email?: string;
  exclude?: Array<number>;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?: "id" | "include" | "name" | "registered_date";
  page?: number;
  per_page?: number;
  role?:
    | "all"
    | "administrator"
    | "editor"
    | "author"
    | "contributor"
    | "subscriber"
    | "customer"
    | "shop_manager";
  search?: string;
};

/**
 * GET /customers response body.
 */
export type CustomersListResponse = Array<{
  avatar_url?: string;
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  email?: string;
  first_name?: string;
  id?: number;
  is_paying_customer?: boolean;
  last_name?: string;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  password?: string;
  role?: string;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  username?: string;
}>;
