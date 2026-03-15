/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * GET /data/continents/{location} path parameters.
 */
export type DataContinentGetPathParams = { location: string };

/**
 * GET /data/continents/{location} query parameters.
 */
export type DataContinentGetQuery = { continent?: string };

/**
 * GET /data/continents/{location} response body.
 */
export type DataContinentGetResponse = unknown;

/**
 * GET /data/continents response body.
 */
export type DataContinentsListResponse = Array<{
  code?: string;
  countries?: Array<{
    code?: string;
    currency_code?: string;
    currency_pos?: string;
    decimal_sep?: string;
    dimension_unit?: string;
    name?: string;
    num_decimals?: number;
    states?: Array<{ code?: string; name?: string }>;
    thousand_sep?: string;
    weight_unit?: string;
  }>;
  name?: string;
}>;

/**
 * GET /data/countries response body.
 */
export type DataCountriesListResponse = Array<{
  code?: string;
  name?: string;
  states?: Array<{ code?: string; name?: string }>;
}>;

/**
 * GET /data/countries/{location} path parameters.
 */
export type DataCountryGetPathParams = { location: string };

/**
 * GET /data/countries/{location} response body.
 */
export type DataCountryGetResponse = unknown;

/**
 * GET /data/currencies/current response body.
 */
export type DataCurrenciesCurrentListResponse = Array<{
  code?: string;
  name?: string;
  symbol?: string;
}>;

/**
 * GET /data/currencies response body.
 */
export type DataCurrenciesListResponse = Array<{
  code?: string;
  name?: string;
  symbol?: string;
}>;

/**
 * GET /data/currencies/{currency} path parameters.
 */
export type DataCurrencyGetPathParams = { currency: string };

/**
 * GET /data/currencies/{currency} query parameters.
 */
export type DataCurrencyGetQuery = { location?: string };

/**
 * GET /data/currencies/{currency} response body.
 */
export type DataCurrencyGetResponse = unknown;

/**
 * GET /data response body.
 */
export type DataListResponse = Array<{ description?: string; slug?: string }>;
