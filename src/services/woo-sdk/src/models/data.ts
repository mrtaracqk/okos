/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * GET /data/continents/{location} path parameters.
 */
export const dataContinentGetPathParamsSchema = z
  .object({ location: z.string() })
  .strict();

export type DataContinentGetPathParams = z.infer<
  typeof dataContinentGetPathParamsSchema
>;

/**
 * GET /data/continents/{location} query parameters.
 */
export const dataContinentGetQuerySchema = z
  .object({
    continent: z.string().optional().describe("2 character continent code."),
  })
  .strict();

export type DataContinentGetQuery = z.infer<typeof dataContinentGetQuerySchema>;

/**
 * GET /data/continents/{location} response body.
 */
export const dataContinentGetResponseSchema = z
  .object({
    code: z.string().optional().describe("2 character continent code."),
    countries: z
      .array(
        z
          .object({
            code: z
              .string()
              .optional()
              .describe("ISO3166 alpha-2 country code."),
            currency_code: z
              .string()
              .optional()
              .describe(
                "Default ISO4127 alpha-3 currency code for the country.",
              ),
            currency_pos: z
              .string()
              .optional()
              .describe("Currency symbol position for this country."),
            decimal_sep: z
              .string()
              .optional()
              .describe(
                "Decimal separator for displayed prices for this country.",
              ),
            dimension_unit: z
              .string()
              .optional()
              .describe("The unit lengths are defined in for this country."),
            name: z.string().optional().describe("Full name of country."),
            num_decimals: z
              .number()
              .optional()
              .describe(
                "Number of decimal points shown in displayed prices for this country.",
              ),
            states: z
              .array(
                z
                  .object({
                    code: z.string().optional().describe("State code."),
                    name: z.string().optional().describe("Full name of state."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of states in this country."),
            thousand_sep: z
              .string()
              .optional()
              .describe(
                "Thousands separator for displayed prices in this country.",
              ),
            weight_unit: z
              .string()
              .optional()
              .describe("The unit weights are defined in for this country."),
          })
          .strict(),
      )
      .optional()
      .describe("List of countries on this continent."),
    name: z.string().optional().describe("Full name of continent."),
  })
  .strict();

export type DataContinentGetResponse = z.infer<
  typeof dataContinentGetResponseSchema
>;

/**
 * GET /data/continents response body.
 */
export const dataContinentsListResponseSchema = z.array(
  z
    .object({
      code: z.string().optional().describe("2 character continent code."),
      countries: z
        .array(
          z
            .object({
              code: z
                .string()
                .optional()
                .describe("ISO3166 alpha-2 country code."),
              currency_code: z
                .string()
                .optional()
                .describe(
                  "Default ISO4127 alpha-3 currency code for the country.",
                ),
              currency_pos: z
                .string()
                .optional()
                .describe("Currency symbol position for this country."),
              decimal_sep: z
                .string()
                .optional()
                .describe(
                  "Decimal separator for displayed prices for this country.",
                ),
              dimension_unit: z
                .string()
                .optional()
                .describe("The unit lengths are defined in for this country."),
              name: z.string().optional().describe("Full name of country."),
              num_decimals: z
                .number()
                .optional()
                .describe(
                  "Number of decimal points shown in displayed prices for this country.",
                ),
              states: z
                .array(
                  z
                    .object({
                      code: z.string().optional().describe("State code."),
                      name: z
                        .string()
                        .optional()
                        .describe("Full name of state."),
                    })
                    .strict(),
                )
                .optional()
                .describe("List of states in this country."),
              thousand_sep: z
                .string()
                .optional()
                .describe(
                  "Thousands separator for displayed prices in this country.",
                ),
              weight_unit: z
                .string()
                .optional()
                .describe("The unit weights are defined in for this country."),
            })
            .strict(),
        )
        .optional()
        .describe("List of countries on this continent."),
      name: z.string().optional().describe("Full name of continent."),
    })
    .strict(),
);

export type DataContinentsListResponse = z.infer<
  typeof dataContinentsListResponseSchema
>;

/**
 * GET /data/countries response body.
 */
export const dataCountriesListResponseSchema = z.array(
  z
    .object({
      code: z.string().optional().describe("ISO3166 alpha-2 country code."),
      name: z.string().optional().describe("Full name of country."),
      states: z
        .array(
          z
            .object({
              code: z.string().optional().describe("State code."),
              name: z.string().optional().describe("Full name of state."),
            })
            .strict(),
        )
        .optional()
        .describe("List of states in this country."),
    })
    .strict(),
);

export type DataCountriesListResponse = z.infer<
  typeof dataCountriesListResponseSchema
>;

/**
 * GET /data/countries/{location} path parameters.
 */
export const dataCountryGetPathParamsSchema = z
  .object({ location: z.string() })
  .strict();

export type DataCountryGetPathParams = z.infer<
  typeof dataCountryGetPathParamsSchema
>;

/**
 * GET /data/countries/{location} response body.
 */
export const dataCountryGetResponseSchema = z
  .object({
    code: z.string().optional().describe("ISO3166 alpha-2 country code."),
    name: z.string().optional().describe("Full name of country."),
    states: z
      .array(
        z
          .object({
            code: z.string().optional().describe("State code."),
            name: z.string().optional().describe("Full name of state."),
          })
          .strict(),
      )
      .optional()
      .describe("List of states in this country."),
  })
  .strict();

export type DataCountryGetResponse = z.infer<
  typeof dataCountryGetResponseSchema
>;

/**
 * GET /data/currencies/current response body.
 */
export const dataCurrenciesCurrentListResponseSchema = z.array(
  z
    .object({
      code: z.string().optional().describe("ISO4217 currency code."),
      name: z.string().optional().describe("Full name of currency."),
      symbol: z.string().optional().describe("Currency symbol."),
    })
    .strict(),
);

export type DataCurrenciesCurrentListResponse = z.infer<
  typeof dataCurrenciesCurrentListResponseSchema
>;

/**
 * GET /data/currencies response body.
 */
export const dataCurrenciesListResponseSchema = z.array(
  z
    .object({
      code: z.string().optional().describe("ISO4217 currency code."),
      name: z.string().optional().describe("Full name of currency."),
      symbol: z.string().optional().describe("Currency symbol."),
    })
    .strict(),
);

export type DataCurrenciesListResponse = z.infer<
  typeof dataCurrenciesListResponseSchema
>;

/**
 * GET /data/currencies/{currency} path parameters.
 */
export const dataCurrencyGetPathParamsSchema = z
  .object({ currency: z.string() })
  .strict();

export type DataCurrencyGetPathParams = z.infer<
  typeof dataCurrencyGetPathParamsSchema
>;

/**
 * GET /data/currencies/{currency} query parameters.
 */
export const dataCurrencyGetQuerySchema = z
  .object({
    location: z.string().optional().describe("ISO4217 currency code."),
  })
  .strict();

export type DataCurrencyGetQuery = z.infer<typeof dataCurrencyGetQuerySchema>;

/**
 * GET /data/currencies/{currency} response body.
 */
export const dataCurrencyGetResponseSchema = z
  .object({
    code: z.string().optional().describe("ISO4217 currency code."),
    name: z.string().optional().describe("Full name of currency."),
    symbol: z.string().optional().describe("Currency symbol."),
  })
  .strict();

export type DataCurrencyGetResponse = z.infer<
  typeof dataCurrencyGetResponseSchema
>;

/**
 * GET /data response body.
 */
export const dataListResponseSchema = z.array(
  z
    .object({
      description: z.string().optional().describe("Data resource description."),
      slug: z.string().optional().describe("Data resource ID."),
    })
    .strict(),
);

export type DataListResponse = z.infer<typeof dataListResponseSchema>;
