/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * DELETE /taxes/{id} path parameters.
 */
export const taxDeletePathParamsSchema = z.object({ id: z.number() }).strict();

export type TaxDeletePathParams = z.infer<typeof taxDeletePathParamsSchema>;

/**
 * DELETE /taxes/{id} query parameters.
 */
export const taxDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type TaxDeleteQuery = z.infer<typeof taxDeleteQuerySchema>;

/**
 * DELETE /taxes/{id} response body.
 */
export const taxDeleteResponseSchema = z.unknown();

export type TaxDeleteResponse = z.infer<typeof taxDeleteResponseSchema>;

/**
 * GET /taxes/{id} path parameters.
 */
export const taxGetPathParamsSchema = z.object({ id: z.number() }).strict();

export type TaxGetPathParams = z.infer<typeof taxGetPathParamsSchema>;

/**
 * GET /taxes/{id} query parameters.
 */
export const taxGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type TaxGetQuery = z.infer<typeof taxGetQuerySchema>;

/**
 * GET /taxes/{id} response body.
 */
export const taxGetResponseSchema = z
  .object({
    cities: z
      .array(z.string())
      .optional()
      .describe("List of city names. Introduced in WooCommerce 5.3."),
    city: z
      .string()
      .optional()
      .describe(
        "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
      ),
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Tax class."),
    compound: z
      .boolean()
      .optional()
      .describe("Whether or not this is a compound rate."),
    country: z.string().optional().describe("Country ISO 3166 code."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Tax rate name."),
    order: z
      .number()
      .optional()
      .describe("Indicates the order that will appear in queries."),
    postcode: z
      .string()
      .optional()
      .describe(
        "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
      ),
    postcodes: z
      .array(z.string())
      .optional()
      .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
    priority: z.number().optional().describe("Tax priority."),
    rate: z.string().optional().describe("Tax rate."),
    shipping: z
      .boolean()
      .optional()
      .describe("Whether or not this tax rate also gets applied to shipping."),
    state: z.string().optional().describe("State code."),
  })
  .strict();

export type TaxGetResponse = z.infer<typeof taxGetResponseSchema>;

/**
 * POST /taxes/{id} path parameters.
 */
export const taxPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type TaxPostCustomPathParams = z.infer<
  typeof taxPostCustomPathParamsSchema
>;

/**
 * POST /taxes/{id} request body.
 */
export const taxPostCustomBodySchema = z
  .object({
    cities: z
      .array(z.string())
      .optional()
      .describe("List of city names. Introduced in WooCommerce 5.3."),
    city: z
      .string()
      .optional()
      .describe(
        "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
      ),
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Tax class."),
    compound: z
      .boolean()
      .optional()
      .describe("Whether or not this is a compound rate."),
    country: z.string().optional().describe("Country ISO 3166 code."),
    name: z.string().optional().describe("Tax rate name."),
    order: z
      .number()
      .optional()
      .describe("Indicates the order that will appear in queries."),
    postcode: z
      .string()
      .optional()
      .describe(
        "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
      ),
    postcodes: z
      .array(z.string())
      .optional()
      .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
    priority: z.number().optional().describe("Tax priority."),
    rate: z.string().optional().describe("Tax rate."),
    shipping: z
      .boolean()
      .optional()
      .describe("Whether or not this tax rate also gets applied to shipping."),
    state: z.string().optional().describe("State code."),
  })
  .strict();

export type TaxPostCustomBody = z.infer<typeof taxPostCustomBodySchema>;

/**
 * POST /taxes/{id} response body.
 */
export const taxPostCustomResponseSchema = z.unknown();

export type TaxPostCustomResponse = z.infer<typeof taxPostCustomResponseSchema>;

/**
 * PUT /taxes/batch request body.
 */
export const taxPutBatchCustomBodySchema = z
  .object({
    cities: z
      .array(z.string())
      .optional()
      .describe("List of city names. Introduced in WooCommerce 5.3."),
    city: z
      .string()
      .optional()
      .describe(
        "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
      ),
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Tax class."),
    compound: z
      .boolean()
      .optional()
      .describe("Whether or not this is a compound rate."),
    country: z.string().optional().describe("Country ISO 3166 code."),
    name: z.string().optional().describe("Tax rate name."),
    order: z
      .number()
      .optional()
      .describe("Indicates the order that will appear in queries."),
    postcode: z
      .string()
      .optional()
      .describe(
        "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
      ),
    postcodes: z
      .array(z.string())
      .optional()
      .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
    priority: z.number().optional().describe("Tax priority."),
    rate: z.string().optional().describe("Tax rate."),
    shipping: z
      .boolean()
      .optional()
      .describe("Whether or not this tax rate also gets applied to shipping."),
    state: z.string().optional().describe("State code."),
  })
  .strict();

export type TaxPutBatchCustomBody = z.infer<typeof taxPutBatchCustomBodySchema>;

/**
 * PUT /taxes/batch response body.
 */
export const taxPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type TaxPutBatchCustomResponse = z.infer<
  typeof taxPutBatchCustomResponseSchema
>;

/**
 * PUT /taxes/{id} path parameters.
 */
export const taxUpdatePathParamsSchema = z.object({ id: z.number() }).strict();

export type TaxUpdatePathParams = z.infer<typeof taxUpdatePathParamsSchema>;

/**
 * PUT /taxes/{id} request body.
 */
export const taxUpdateBodySchema = z
  .object({
    cities: z
      .array(z.string())
      .optional()
      .describe("List of city names. Introduced in WooCommerce 5.3."),
    city: z
      .string()
      .optional()
      .describe(
        "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
      ),
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Tax class."),
    compound: z
      .boolean()
      .optional()
      .describe("Whether or not this is a compound rate."),
    country: z.string().optional().describe("Country ISO 3166 code."),
    name: z.string().optional().describe("Tax rate name."),
    order: z
      .number()
      .optional()
      .describe("Indicates the order that will appear in queries."),
    postcode: z
      .string()
      .optional()
      .describe(
        "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
      ),
    postcodes: z
      .array(z.string())
      .optional()
      .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
    priority: z.number().optional().describe("Tax priority."),
    rate: z.string().optional().describe("Tax rate."),
    shipping: z
      .boolean()
      .optional()
      .describe("Whether or not this tax rate also gets applied to shipping."),
    state: z.string().optional().describe("State code."),
  })
  .strict();

export type TaxUpdateBody = z.infer<typeof taxUpdateBodySchema>;

/**
 * PUT /taxes/{id} response body.
 */
export const taxUpdateResponseSchema = z.unknown();

export type TaxUpdateResponse = z.infer<typeof taxUpdateResponseSchema>;

/**
 * POST /taxes/batch request body.
 */
export const taxesBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            cities: z
              .array(z.string())
              .optional()
              .describe("List of city names. Introduced in WooCommerce 5.3."),
            city: z
              .string()
              .optional()
              .describe(
                "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
              ),
            class: z
              .enum(["standard", "reduced-rate", "zero-rate"])
              .optional()
              .describe("Tax class."),
            compound: z
              .boolean()
              .optional()
              .describe("Whether or not this is a compound rate."),
            country: z.string().optional().describe("Country ISO 3166 code."),
            name: z.string().optional().describe("Tax rate name."),
            order: z
              .number()
              .optional()
              .describe("Indicates the order that will appear in queries."),
            postcode: z
              .string()
              .optional()
              .describe(
                "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
              ),
            postcodes: z
              .array(z.string())
              .optional()
              .describe(
                "List of postcodes / ZIPs. Introduced in WooCommerce 5.3.",
              ),
            priority: z.number().optional().describe("Tax priority."),
            rate: z.string().optional().describe("Tax rate."),
            shipping: z
              .boolean()
              .optional()
              .describe(
                "Whether or not this tax rate also gets applied to shipping.",
              ),
            state: z.string().optional().describe("State code."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            cities: z
              .array(z.string())
              .optional()
              .describe("List of city names. Introduced in WooCommerce 5.3."),
            city: z
              .string()
              .optional()
              .describe(
                "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
              ),
            class: z
              .enum(["standard", "reduced-rate", "zero-rate"])
              .optional()
              .describe("Tax class."),
            compound: z
              .boolean()
              .optional()
              .describe("Whether or not this is a compound rate."),
            country: z.string().optional().describe("Country ISO 3166 code."),
            id: z.number(),
            name: z.string().optional().describe("Tax rate name."),
            order: z
              .number()
              .optional()
              .describe("Indicates the order that will appear in queries."),
            postcode: z
              .string()
              .optional()
              .describe(
                "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
              ),
            postcodes: z
              .array(z.string())
              .optional()
              .describe(
                "List of postcodes / ZIPs. Introduced in WooCommerce 5.3.",
              ),
            priority: z.number().optional().describe("Tax priority."),
            rate: z.string().optional().describe("Tax rate."),
            shipping: z
              .boolean()
              .optional()
              .describe(
                "Whether or not this tax rate also gets applied to shipping.",
              ),
            state: z.string().optional().describe("State code."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type TaxesBatchUpdateBody = z.infer<typeof taxesBatchUpdateBodySchema>;

/**
 * POST /taxes/batch response body.
 */
export const taxesBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type TaxesBatchUpdateResponse = z.infer<
  typeof taxesBatchUpdateResponseSchema
>;

/**
 * DELETE /taxes/classes/{slug} path parameters.
 */
export const taxesClassDeletePathParamsSchema = z
  .object({ slug: z.string() })
  .strict();

export type TaxesClassDeletePathParams = z.infer<
  typeof taxesClassDeletePathParamsSchema
>;

/**
 * DELETE /taxes/classes/{slug} query parameters.
 */
export const taxesClassDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type TaxesClassDeleteQuery = z.infer<typeof taxesClassDeleteQuerySchema>;

/**
 * DELETE /taxes/classes/{slug} response body.
 */
export const taxesClassDeleteResponseSchema = z.unknown();

export type TaxesClassDeleteResponse = z.infer<
  typeof taxesClassDeleteResponseSchema
>;

/**
 * GET /taxes/classes/{slug} path parameters.
 */
export const taxesClassGetPathParamsSchema = z
  .object({ slug: z.string() })
  .strict();

export type TaxesClassGetPathParams = z.infer<
  typeof taxesClassGetPathParamsSchema
>;

/**
 * GET /taxes/classes/{slug} response body.
 */
export const taxesClassGetResponseSchema = z
  .object({
    name: z.string().optional().describe("Tax class name."),
    slug: z.string().optional().describe("Unique identifier for the resource."),
  })
  .strict();

export type TaxesClassGetResponse = z.infer<typeof taxesClassGetResponseSchema>;

/**
 * POST /taxes/classes request body.
 */
export const taxesClassesCreateBodySchema = z
  .object({ name: z.string().describe("Tax class name.") })
  .strict();

export type TaxesClassesCreateBody = z.infer<
  typeof taxesClassesCreateBodySchema
>;

/**
 * POST /taxes/classes response body.
 */
export const taxesClassesCreateResponseSchema = z
  .object({
    name: z.string().optional().describe("Tax class name."),
    slug: z.string().optional().describe("Unique identifier for the resource."),
  })
  .strict();

export type TaxesClassesCreateResponse = z.infer<
  typeof taxesClassesCreateResponseSchema
>;

/**
 * GET /taxes/classes query parameters.
 */
export const taxesClassesListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type TaxesClassesListQuery = z.infer<typeof taxesClassesListQuerySchema>;

/**
 * GET /taxes/classes response body.
 */
export const taxesClassesListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Tax class name."),
      slug: z
        .string()
        .optional()
        .describe("Unique identifier for the resource."),
    })
    .strict(),
);

export type TaxesClassesListResponse = z.infer<
  typeof taxesClassesListResponseSchema
>;

/**
 * POST /taxes request body.
 */
export const taxesCreateBodySchema = z
  .object({
    cities: z
      .array(z.string())
      .optional()
      .describe("List of city names. Introduced in WooCommerce 5.3."),
    city: z
      .string()
      .optional()
      .describe(
        "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
      ),
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Tax class."),
    compound: z
      .boolean()
      .optional()
      .describe("Whether or not this is a compound rate."),
    country: z.string().optional().describe("Country ISO 3166 code."),
    name: z.string().optional().describe("Tax rate name."),
    order: z
      .number()
      .optional()
      .describe("Indicates the order that will appear in queries."),
    postcode: z
      .string()
      .optional()
      .describe(
        "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
      ),
    postcodes: z
      .array(z.string())
      .optional()
      .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
    priority: z.number().optional().describe("Tax priority."),
    rate: z.string().optional().describe("Tax rate."),
    shipping: z
      .boolean()
      .optional()
      .describe("Whether or not this tax rate also gets applied to shipping."),
    state: z.string().optional().describe("State code."),
  })
  .strict();

export type TaxesCreateBody = z.infer<typeof taxesCreateBodySchema>;

/**
 * POST /taxes response body.
 */
export const taxesCreateResponseSchema = z
  .object({
    cities: z
      .array(z.string())
      .optional()
      .describe("List of city names. Introduced in WooCommerce 5.3."),
    city: z
      .string()
      .optional()
      .describe(
        "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
      ),
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Tax class."),
    compound: z
      .boolean()
      .optional()
      .describe("Whether or not this is a compound rate."),
    country: z.string().optional().describe("Country ISO 3166 code."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Tax rate name."),
    order: z
      .number()
      .optional()
      .describe("Indicates the order that will appear in queries."),
    postcode: z
      .string()
      .optional()
      .describe(
        "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
      ),
    postcodes: z
      .array(z.string())
      .optional()
      .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
    priority: z.number().optional().describe("Tax priority."),
    rate: z.string().optional().describe("Tax rate."),
    shipping: z
      .boolean()
      .optional()
      .describe("Whether or not this tax rate also gets applied to shipping."),
    state: z.string().optional().describe("State code."),
  })
  .strict();

export type TaxesCreateResponse = z.infer<typeof taxesCreateResponseSchema>;

/**
 * GET /taxes query parameters.
 */
export const taxesListQuerySchema = z
  .object({
    class: z
      .enum(["standard", "reduced-rate", "zero-rate"])
      .optional()
      .describe("Sort by tax class."),
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    offset: z
      .number()
      .optional()
      .describe("Offset the result set by a specific number of items."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum(["id", "order", "priority"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
  })
  .strict();

export type TaxesListQuery = z.infer<typeof taxesListQuerySchema>;

/**
 * GET /taxes response body.
 */
export const taxesListResponseSchema = z.array(
  z
    .object({
      cities: z
        .array(z.string())
        .optional()
        .describe("List of city names. Introduced in WooCommerce 5.3."),
      city: z
        .string()
        .optional()
        .describe(
          "City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead.",
        ),
      class: z
        .enum(["standard", "reduced-rate", "zero-rate"])
        .optional()
        .describe("Tax class."),
      compound: z
        .boolean()
        .optional()
        .describe("Whether or not this is a compound rate."),
      country: z.string().optional().describe("Country ISO 3166 code."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("Tax rate name."),
      order: z
        .number()
        .optional()
        .describe("Indicates the order that will appear in queries."),
      postcode: z
        .string()
        .optional()
        .describe(
          "Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead.",
        ),
      postcodes: z
        .array(z.string())
        .optional()
        .describe("List of postcodes / ZIPs. Introduced in WooCommerce 5.3."),
      priority: z.number().optional().describe("Tax priority."),
      rate: z.string().optional().describe("Tax rate."),
      shipping: z
        .boolean()
        .optional()
        .describe(
          "Whether or not this tax rate also gets applied to shipping.",
        ),
      state: z.string().optional().describe("State code."),
    })
    .strict(),
);

export type TaxesListResponse = z.infer<typeof taxesListResponseSchema>;
