/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * DELETE /taxes/{id} path parameters.
 */
export type TaxDeletePathParams = { id: number };

/**
 * DELETE /taxes/{id} query parameters.
 */
export type TaxDeleteQuery = { force?: boolean };

/**
 * DELETE /taxes/{id} response body.
 */
export type TaxDeleteResponse = unknown;

/**
 * GET /taxes/{id} path parameters.
 */
export type TaxGetPathParams = { id: number };

/**
 * GET /taxes/{id} query parameters.
 */
export type TaxGetQuery = { context?: "view" | "edit" };

/**
 * GET /taxes/{id} response body.
 */
export type TaxGetResponse = unknown;

/**
 * POST /taxes/{id} path parameters.
 */
export type TaxPostCustomPathParams = { id: number };

/**
 * POST /taxes/{id} request body.
 */
export type TaxPostCustomBody = {
  cities?: Array<string>;
  city?: string;
  class?: "standard" | "reduced-rate" | "zero-rate";
  compound?: boolean;
  country?: string;
  name?: string;
  order?: number;
  postcode?: string;
  postcodes?: Array<string>;
  priority?: number;
  rate?: string;
  shipping?: boolean;
  state?: string;
};

/**
 * POST /taxes/{id} response body.
 */
export type TaxPostCustomResponse = unknown;

/**
 * PUT /taxes/batch request body.
 */
export type TaxPutBatchCustomBody = {
  cities?: Array<string>;
  city?: string;
  class?: "standard" | "reduced-rate" | "zero-rate";
  compound?: boolean;
  country?: string;
  name?: string;
  order?: number;
  postcode?: string;
  postcodes?: Array<string>;
  priority?: number;
  rate?: string;
  shipping?: boolean;
  state?: string;
};

/**
 * PUT /taxes/batch response body.
 */
export type TaxPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * PUT /taxes/{id} path parameters.
 */
export type TaxUpdatePathParams = { id: number };

/**
 * PUT /taxes/{id} request body.
 */
export type TaxUpdateBody = {
  cities?: Array<string>;
  city?: string;
  class?: "standard" | "reduced-rate" | "zero-rate";
  compound?: boolean;
  country?: string;
  name?: string;
  order?: number;
  postcode?: string;
  postcodes?: Array<string>;
  priority?: number;
  rate?: string;
  shipping?: boolean;
  state?: string;
};

/**
 * PUT /taxes/{id} response body.
 */
export type TaxUpdateResponse = unknown;

/**
 * POST /taxes/batch request body.
 */
export type TaxesBatchUpdateBody = {
  create?: Array<{
    cities?: Array<string>;
    city?: string;
    class?: "standard" | "reduced-rate" | "zero-rate";
    compound?: boolean;
    country?: string;
    name?: string;
    order?: number;
    postcode?: string;
    postcodes?: Array<string>;
    priority?: number;
    rate?: string;
    shipping?: boolean;
    state?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    cities?: Array<string>;
    city?: string;
    class?: "standard" | "reduced-rate" | "zero-rate";
    compound?: boolean;
    country?: string;
    id: number;
    name?: string;
    order?: number;
    postcode?: string;
    postcodes?: Array<string>;
    priority?: number;
    rate?: string;
    shipping?: boolean;
    state?: string;
  }>;
};

/**
 * POST /taxes/batch response body.
 */
export type TaxesBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * DELETE /taxes/classes/{slug} path parameters.
 */
export type TaxesClassDeletePathParams = { slug: string };

/**
 * DELETE /taxes/classes/{slug} query parameters.
 */
export type TaxesClassDeleteQuery = { force?: boolean };

/**
 * DELETE /taxes/classes/{slug} response body.
 */
export type TaxesClassDeleteResponse = unknown;

/**
 * GET /taxes/classes/{slug} path parameters.
 */
export type TaxesClassGetPathParams = { slug: string };

/**
 * GET /taxes/classes/{slug} response body.
 */
export type TaxesClassGetResponse = unknown;

/**
 * POST /taxes/classes request body.
 */
export type TaxesClassesCreateBody = { name: string };

/**
 * POST /taxes/classes response body.
 */
export type TaxesClassesCreateResponse = { name?: string; slug?: string };

/**
 * GET /taxes/classes query parameters.
 */
export type TaxesClassesListQuery = { context?: "view" | "edit" };

/**
 * GET /taxes/classes response body.
 */
export type TaxesClassesListResponse = Array<{ name?: string; slug?: string }>;

/**
 * POST /taxes request body.
 */
export type TaxesCreateBody = {
  cities?: Array<string>;
  city?: string;
  class?: "standard" | "reduced-rate" | "zero-rate";
  compound?: boolean;
  country?: string;
  name?: string;
  order?: number;
  postcode?: string;
  postcodes?: Array<string>;
  priority?: number;
  rate?: string;
  shipping?: boolean;
  state?: string;
};

/**
 * POST /taxes response body.
 */
export type TaxesCreateResponse = {
  cities?: Array<string>;
  city?: string;
  class?: "standard" | "reduced-rate" | "zero-rate";
  compound?: boolean;
  country?: string;
  id?: number;
  name?: string;
  order?: number;
  postcode?: string;
  postcodes?: Array<string>;
  priority?: number;
  rate?: string;
  shipping?: boolean;
  state?: string;
};

/**
 * GET /taxes query parameters.
 */
export type TaxesListQuery = {
  class?: "standard" | "reduced-rate" | "zero-rate";
  context?: "view" | "edit";
  offset?: number;
  order?: "asc" | "desc";
  orderby?: "id" | "order" | "priority";
  page?: number;
  per_page?: number;
};

/**
 * GET /taxes response body.
 */
export type TaxesListResponse = Array<{
  cities?: Array<string>;
  city?: string;
  class?: "standard" | "reduced-rate" | "zero-rate";
  compound?: boolean;
  country?: string;
  id?: number;
  name?: string;
  order?: number;
  postcode?: string;
  postcodes?: Array<string>;
  priority?: number;
  rate?: string;
  shipping?: boolean;
  state?: string;
}>;
