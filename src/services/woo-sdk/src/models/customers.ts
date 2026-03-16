/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * DELETE /customers/{id} path parameters.
 */
export const customerDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CustomerDeletePathParams = z.infer<
  typeof customerDeletePathParamsSchema
>;

/**
 * DELETE /customers/{id} query parameters.
 */
export const customerDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
    reassign: z.number().optional().describe("ID to reassign posts to."),
  })
  .strict();

export type CustomerDeleteQuery = z.infer<typeof customerDeleteQuerySchema>;

/**
 * DELETE /customers/{id} response body.
 */
export const customerDeleteResponseSchema = z.unknown();

export type CustomerDeleteResponse = z.infer<
  typeof customerDeleteResponseSchema
>;

/**
 * GET /customers/{customer_id}/downloads path parameters.
 */
export const customerDownloadsListPathParamsSchema = z
  .object({ customer_id: z.number() })
  .strict();

export type CustomerDownloadsListPathParams = z.infer<
  typeof customerDownloadsListPathParamsSchema
>;

/**
 * GET /customers/{customer_id}/downloads query parameters.
 */
export const customerDownloadsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type CustomerDownloadsListQuery = z.infer<
  typeof customerDownloadsListQuerySchema
>;

/**
 * GET /customers/{customer_id}/downloads response body.
 */
export const customerDownloadsListResponseSchema = z.array(z.unknown());

export type CustomerDownloadsListResponse = z.infer<
  typeof customerDownloadsListResponseSchema
>;

/**
 * GET /customers/{id} path parameters.
 */
export const customerGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CustomerGetPathParams = z.infer<typeof customerGetPathParamsSchema>;

/**
 * GET /customers/{id} query parameters.
 */
export const customerGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type CustomerGetQuery = z.infer<typeof customerGetQuerySchema>;

/**
 * GET /customers/{id} response body.
 */
export const customerGetResponseSchema = z
  .object({
    avatar_url: z.string().optional().describe("Avatar URL."),
    billing: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        email: z.string().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of billing address data.")
      .strict()
      .optional()
      .describe("List of billing address data."),
    date_created: z
      .string()
      .optional()
      .describe("The date the customer was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the customer was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the customer was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the customer was last modified, as GMT."),
    email: z
      .string()
      .optional()
      .describe("The email address for the customer."),
    first_name: z.string().optional().describe("Customer first name."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    is_paying_customer: z
      .boolean()
      .optional()
      .describe("Is the customer a paying customer?"),
    last_name: z.string().optional().describe("Customer last name."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z.unknown().optional().describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    password: z.string().optional().describe("Customer password."),
    role: z.string().optional().describe("Customer role."),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of shipping address data.")
      .strict()
      .optional()
      .describe("List of shipping address data."),
    username: z.string().optional().describe("Customer login name."),
  })
  .strict();

export type CustomerGetResponse = z.infer<typeof customerGetResponseSchema>;

/**
 * POST /customers/{id} path parameters.
 */
export const customerPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CustomerPostCustomPathParams = z.infer<
  typeof customerPostCustomPathParamsSchema
>;

/**
 * POST /customers/{id} request body.
 */
export const customerPostCustomBodySchema = z
  .object({
    billing: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        email: z.string().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of billing address data.")
      .strict()
      .optional()
      .describe("List of billing address data."),
    email: z
      .string()
      .optional()
      .describe("The email address for the customer."),
    first_name: z.string().optional().describe("Customer first name."),
    last_name: z.string().optional().describe("Customer last name."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    password: z.string().optional().describe("Customer password."),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of shipping address data.")
      .strict()
      .optional()
      .describe("List of shipping address data."),
    username: z.string().optional().describe("Customer login name."),
  })
  .strict();

export type CustomerPostCustomBody = z.infer<
  typeof customerPostCustomBodySchema
>;

/**
 * POST /customers/{id} response body.
 */
export const customerPostCustomResponseSchema = z.unknown();

export type CustomerPostCustomResponse = z.infer<
  typeof customerPostCustomResponseSchema
>;

/**
 * PUT /customers/batch request body.
 */
export const customerPutBatchCustomBodySchema = z
  .object({
    billing: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        email: z.string().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of billing address data.")
      .strict()
      .optional()
      .describe("List of billing address data."),
    email: z
      .string()
      .optional()
      .describe("The email address for the customer."),
    first_name: z.string().optional().describe("Customer first name."),
    last_name: z.string().optional().describe("Customer last name."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    password: z.string().optional().describe("Customer password."),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of shipping address data.")
      .strict()
      .optional()
      .describe("List of shipping address data."),
    username: z.string().optional().describe("Customer login name."),
  })
  .strict();

export type CustomerPutBatchCustomBody = z.infer<
  typeof customerPutBatchCustomBodySchema
>;

/**
 * PUT /customers/batch response body.
 */
export const customerPutBatchCustomResponseSchema = z
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

export type CustomerPutBatchCustomResponse = z.infer<
  typeof customerPutBatchCustomResponseSchema
>;

/**
 * PUT /customers/{id} path parameters.
 */
export const customerUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CustomerUpdatePathParams = z.infer<
  typeof customerUpdatePathParamsSchema
>;

/**
 * PUT /customers/{id} request body.
 */
export const customerUpdateBodySchema = z
  .object({
    billing: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        email: z.string().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of billing address data.")
      .strict()
      .optional()
      .describe("List of billing address data."),
    email: z
      .string()
      .optional()
      .describe("The email address for the customer."),
    first_name: z.string().optional().describe("Customer first name."),
    last_name: z.string().optional().describe("Customer last name."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    password: z.string().optional().describe("Customer password."),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of shipping address data.")
      .strict()
      .optional()
      .describe("List of shipping address data."),
    username: z.string().optional().describe("Customer login name."),
  })
  .strict();

export type CustomerUpdateBody = z.infer<typeof customerUpdateBodySchema>;

/**
 * PUT /customers/{id} response body.
 */
export const customerUpdateResponseSchema = z.unknown();

export type CustomerUpdateResponse = z.infer<
  typeof customerUpdateResponseSchema
>;

/**
 * POST /customers/batch request body.
 */
export const customersBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            billing: z
              .object({
                address_1: z.string().optional().describe("Address line 1"),
                address_2: z.string().optional().describe("Address line 2"),
                city: z.string().optional().describe("City name."),
                company: z.string().optional().describe("Company name."),
                country: z
                  .string()
                  .optional()
                  .describe("ISO code of the country."),
                email: z.string().optional().describe("Email address."),
                first_name: z.string().optional().describe("First name."),
                last_name: z.string().optional().describe("Last name."),
                phone: z.string().optional().describe("Phone number."),
                postcode: z.string().optional().describe("Postal code."),
                state: z
                  .string()
                  .optional()
                  .describe(
                    "ISO code or name of the state, province or district.",
                  ),
              })
              .describe("List of billing address data.")
              .strict()
              .optional()
              .describe("List of billing address data."),
            email: z
              .string()
              .optional()
              .describe("The email address for the customer."),
            first_name: z.string().optional().describe("Customer first name."),
            last_name: z.string().optional().describe("Customer last name."),
            meta_data: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z
                      .union([
                        z.record(z.string(), z.unknown()),
                        z.string(),
                        z.number(),
                        z.boolean(),
                        z.number(),
                        z.array(z.unknown()),
                      ])
                      .nullable()
                      .optional()
                      .describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            password: z.string().optional().describe("Customer password."),
            shipping: z
              .object({
                address_1: z.string().optional().describe("Address line 1"),
                address_2: z.string().optional().describe("Address line 2"),
                city: z.string().optional().describe("City name."),
                company: z.string().optional().describe("Company name."),
                country: z
                  .string()
                  .optional()
                  .describe("ISO code of the country."),
                first_name: z.string().optional().describe("First name."),
                last_name: z.string().optional().describe("Last name."),
                phone: z.string().optional().describe("Phone number."),
                postcode: z.string().optional().describe("Postal code."),
                state: z
                  .string()
                  .optional()
                  .describe(
                    "ISO code or name of the state, province or district.",
                  ),
              })
              .describe("List of shipping address data.")
              .strict()
              .optional()
              .describe("List of shipping address data."),
            username: z.string().optional().describe("Customer login name."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            billing: z
              .object({
                address_1: z.string().optional().describe("Address line 1"),
                address_2: z.string().optional().describe("Address line 2"),
                city: z.string().optional().describe("City name."),
                company: z.string().optional().describe("Company name."),
                country: z
                  .string()
                  .optional()
                  .describe("ISO code of the country."),
                email: z.string().optional().describe("Email address."),
                first_name: z.string().optional().describe("First name."),
                last_name: z.string().optional().describe("Last name."),
                phone: z.string().optional().describe("Phone number."),
                postcode: z.string().optional().describe("Postal code."),
                state: z
                  .string()
                  .optional()
                  .describe(
                    "ISO code or name of the state, province or district.",
                  ),
              })
              .describe("List of billing address data.")
              .strict()
              .optional()
              .describe("List of billing address data."),
            email: z
              .string()
              .optional()
              .describe("The email address for the customer."),
            first_name: z.string().optional().describe("Customer first name."),
            id: z.number(),
            last_name: z.string().optional().describe("Customer last name."),
            meta_data: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z
                      .union([
                        z.record(z.string(), z.unknown()),
                        z.string(),
                        z.number(),
                        z.boolean(),
                        z.number(),
                        z.array(z.unknown()),
                      ])
                      .nullable()
                      .optional()
                      .describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            password: z.string().optional().describe("Customer password."),
            shipping: z
              .object({
                address_1: z.string().optional().describe("Address line 1"),
                address_2: z.string().optional().describe("Address line 2"),
                city: z.string().optional().describe("City name."),
                company: z.string().optional().describe("Company name."),
                country: z
                  .string()
                  .optional()
                  .describe("ISO code of the country."),
                first_name: z.string().optional().describe("First name."),
                last_name: z.string().optional().describe("Last name."),
                phone: z.string().optional().describe("Phone number."),
                postcode: z.string().optional().describe("Postal code."),
                state: z
                  .string()
                  .optional()
                  .describe(
                    "ISO code or name of the state, province or district.",
                  ),
              })
              .describe("List of shipping address data.")
              .strict()
              .optional()
              .describe("List of shipping address data."),
            username: z.string().optional().describe("Customer login name."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type CustomersBatchUpdateBody = z.infer<
  typeof customersBatchUpdateBodySchema
>;

/**
 * POST /customers/batch response body.
 */
export const customersBatchUpdateResponseSchema = z
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

export type CustomersBatchUpdateResponse = z.infer<
  typeof customersBatchUpdateResponseSchema
>;

/**
 * POST /customers request body.
 */
export const customersCreateBodySchema = z
  .object({
    billing: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        email: z.string().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of billing address data.")
      .strict()
      .optional()
      .describe("List of billing address data."),
    email: z.string().describe("New user email address."),
    first_name: z.string().optional().describe("Customer first name."),
    last_name: z.string().optional().describe("Customer last name."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    password: z.string().optional().describe("New user password."),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of shipping address data.")
      .strict()
      .optional()
      .describe("List of shipping address data."),
    username: z.string().optional().describe("New user username."),
  })
  .strict();

export type CustomersCreateBody = z.infer<typeof customersCreateBodySchema>;

/**
 * POST /customers response body.
 */
export const customersCreateResponseSchema = z
  .object({
    avatar_url: z.string().optional().describe("Avatar URL."),
    billing: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        email: z.string().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of billing address data.")
      .strict()
      .optional()
      .describe("List of billing address data."),
    date_created: z
      .string()
      .optional()
      .describe("The date the customer was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the customer was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the customer was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the customer was last modified, as GMT."),
    email: z
      .string()
      .optional()
      .describe("The email address for the customer."),
    first_name: z.string().optional().describe("Customer first name."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    is_paying_customer: z
      .boolean()
      .optional()
      .describe("Is the customer a paying customer?"),
    last_name: z.string().optional().describe("Customer last name."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z.unknown().optional().describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    password: z.string().optional().describe("Customer password."),
    role: z.string().optional().describe("Customer role."),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z.string().optional().describe("ISO code of the country."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("List of shipping address data.")
      .strict()
      .optional()
      .describe("List of shipping address data."),
    username: z.string().optional().describe("Customer login name."),
  })
  .strict();

export type CustomersCreateResponse = z.infer<
  typeof customersCreateResponseSchema
>;

/**
 * GET /customers query parameters.
 */
export const customersListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    email: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific email."),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific IDs."),
    offset: z
      .number()
      .optional()
      .describe("Offset the result set by a specific number of items."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum(["id", "include", "name", "registered_date"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    role: z
      .enum([
        "all",
        "administrator",
        "editor",
        "author",
        "contributor",
        "subscriber",
        "customer",
        "shop_manager",
      ])
      .optional()
      .describe("Limit result set to resources with a specific role."),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
  })
  .strict();

export type CustomersListQuery = z.infer<typeof customersListQuerySchema>;

/**
 * GET /customers response body.
 */
export const customersListResponseSchema = z.array(
  z
    .object({
      avatar_url: z.string().optional().describe("Avatar URL."),
      billing: z
        .object({
          address_1: z.string().optional().describe("Address line 1"),
          address_2: z.string().optional().describe("Address line 2"),
          city: z.string().optional().describe("City name."),
          company: z.string().optional().describe("Company name."),
          country: z.string().optional().describe("ISO code of the country."),
          email: z.string().optional().describe("Email address."),
          first_name: z.string().optional().describe("First name."),
          last_name: z.string().optional().describe("Last name."),
          phone: z.string().optional().describe("Phone number."),
          postcode: z.string().optional().describe("Postal code."),
          state: z
            .string()
            .optional()
            .describe("ISO code or name of the state, province or district."),
        })
        .describe("List of billing address data.")
        .strict()
        .optional()
        .describe("List of billing address data."),
      date_created: z
        .string()
        .optional()
        .describe("The date the customer was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the customer was created, as GMT."),
      date_modified: z
        .string()
        .optional()
        .describe(
          "The date the customer was last modified, in the site's timezone.",
        ),
      date_modified_gmt: z
        .string()
        .optional()
        .describe("The date the customer was last modified, as GMT."),
      email: z
        .string()
        .optional()
        .describe("The email address for the customer."),
      first_name: z.string().optional().describe("Customer first name."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      is_paying_customer: z
        .boolean()
        .optional()
        .describe("Is the customer a paying customer?"),
      last_name: z.string().optional().describe("Customer last name."),
      meta_data: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Meta ID."),
              key: z.string().optional().describe("Meta key."),
              value: z.unknown().optional().describe("Meta value."),
            })
            .strict(),
        )
        .optional()
        .describe("Meta data."),
      password: z.string().optional().describe("Customer password."),
      role: z.string().optional().describe("Customer role."),
      shipping: z
        .object({
          address_1: z.string().optional().describe("Address line 1"),
          address_2: z.string().optional().describe("Address line 2"),
          city: z.string().optional().describe("City name."),
          company: z.string().optional().describe("Company name."),
          country: z.string().optional().describe("ISO code of the country."),
          first_name: z.string().optional().describe("First name."),
          last_name: z.string().optional().describe("Last name."),
          phone: z.string().optional().describe("Phone number."),
          postcode: z.string().optional().describe("Postal code."),
          state: z
            .string()
            .optional()
            .describe("ISO code or name of the state, province or district."),
        })
        .describe("List of shipping address data.")
        .strict()
        .optional()
        .describe("List of shipping address data."),
      username: z.string().optional().describe("Customer login name."),
    })
    .strict(),
);

export type CustomersListResponse = z.infer<typeof customersListResponseSchema>;
