/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * DELETE /coupons/{id} path parameters.
 */
export const couponDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CouponDeletePathParams = z.infer<
  typeof couponDeletePathParamsSchema
>;

/**
 * DELETE /coupons/{id} query parameters.
 */
export const couponDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type CouponDeleteQuery = z.infer<typeof couponDeleteQuerySchema>;

/**
 * DELETE /coupons/{id} response body.
 */
export const couponDeleteResponseSchema = z.unknown();

export type CouponDeleteResponse = z.infer<typeof couponDeleteResponseSchema>;

/**
 * GET /coupons/{id} path parameters.
 */
export const couponGetPathParamsSchema = z.object({ id: z.number() }).strict();

export type CouponGetPathParams = z.infer<typeof couponGetPathParamsSchema>;

/**
 * GET /coupons/{id} query parameters.
 */
export const couponGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type CouponGetQuery = z.infer<typeof couponGetQuerySchema>;

/**
 * GET /coupons/{id} response body.
 */
export const couponGetResponseSchema = z
  .object({
    amount: z
      .string()
      .optional()
      .describe(
        "The amount of discount. Should always be numeric, even if setting a percentage.",
      ),
    code: z.string().optional().describe("Coupon code."),
    date_created: z
      .string()
      .optional()
      .describe("The date the coupon was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the coupon was created, as GMT."),
    date_expires: z
      .string()
      .optional()
      .describe("The date the coupon expires, in the site's timezone."),
    date_expires_gmt: z
      .string()
      .optional()
      .describe("The date the coupon expires, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the coupon was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the coupon was last modified, as GMT."),
    description: z.string().optional().describe("Coupon description."),
    discount_type: z
      .enum(["percent", "fixed_cart", "fixed_product"])
      .optional()
      .describe("Determines the type of discount that will be applied."),
    email_restrictions: z
      .array(z.string())
      .optional()
      .describe("List of email addresses that can use this coupon."),
    exclude_sale_items: z
      .boolean()
      .optional()
      .describe(
        "If true, this coupon will not be applied to items that have sale prices.",
      ),
    excluded_product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon does not apply to."),
    excluded_product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon cannot be used on."),
    free_shipping: z
      .boolean()
      .optional()
      .describe(
        "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
      ),
    id: z.number().optional().describe("Unique identifier for the object."),
    individual_use: z
      .boolean()
      .optional()
      .describe(
        "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
      ),
    limit_usage_to_x_items: z
      .number()
      .optional()
      .describe(
        "Max number of items in the cart the coupon can be applied to.",
      ),
    maximum_amount: z
      .string()
      .optional()
      .describe("Maximum order amount allowed when using the coupon."),
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
    minimum_amount: z
      .string()
      .optional()
      .describe(
        "Minimum order amount that needs to be in the cart before coupon applies.",
      ),
    product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon applies to."),
    product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon can be used on."),
    status: z
      .string()
      .optional()
      .describe(
        "The status of the coupon. Should always be draft, published, or pending review",
      ),
    usage_count: z
      .number()
      .optional()
      .describe("Number of times the coupon has been used already."),
    usage_limit: z
      .number()
      .optional()
      .describe("How many times the coupon can be used in total."),
    usage_limit_per_user: z
      .number()
      .optional()
      .describe("How many times the coupon can be used per customer."),
    used_by: z
      .array(z.number())
      .optional()
      .describe(
        "List of user IDs (or guest email addresses) that have used the coupon.",
      ),
  })
  .strict();

export type CouponGetResponse = z.infer<typeof couponGetResponseSchema>;

/**
 * POST /coupons/{id} path parameters.
 */
export const couponPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CouponPostCustomPathParams = z.infer<
  typeof couponPostCustomPathParamsSchema
>;

/**
 * POST /coupons/{id} request body.
 */
export const couponPostCustomBodySchema = z
  .object({
    amount: z
      .string()
      .optional()
      .describe(
        "The amount of discount. Should always be numeric, even if setting a percentage.",
      ),
    code: z.string().optional().describe("Coupon code."),
    date_expires: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, in the site's timezone."),
    date_expires_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, as GMT."),
    description: z.string().optional().describe("Coupon description."),
    discount_type: z
      .enum(["percent", "fixed_cart", "fixed_product"])
      .optional()
      .describe("Determines the type of discount that will be applied."),
    email_restrictions: z
      .array(z.string())
      .optional()
      .describe("List of email addresses that can use this coupon."),
    exclude_sale_items: z
      .boolean()
      .optional()
      .describe(
        "If true, this coupon will not be applied to items that have sale prices.",
      ),
    excluded_product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon does not apply to."),
    excluded_product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon cannot be used on."),
    free_shipping: z
      .boolean()
      .optional()
      .describe(
        "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
      ),
    individual_use: z
      .boolean()
      .optional()
      .describe(
        "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
      ),
    limit_usage_to_x_items: z
      .number()
      .optional()
      .describe(
        "Max number of items in the cart the coupon can be applied to.",
      ),
    maximum_amount: z
      .string()
      .optional()
      .describe("Maximum order amount allowed when using the coupon."),
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
    minimum_amount: z
      .string()
      .optional()
      .describe(
        "Minimum order amount that needs to be in the cart before coupon applies.",
      ),
    product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon applies to."),
    product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon can be used on."),
    status: z
      .string()
      .optional()
      .describe(
        "The status of the coupon. Should always be draft, published, or pending review",
      ),
    usage_limit: z
      .number()
      .optional()
      .describe("How many times the coupon can be used in total."),
    usage_limit_per_user: z
      .number()
      .optional()
      .describe("How many times the coupon can be used per customer."),
  })
  .strict();

export type CouponPostCustomBody = z.infer<typeof couponPostCustomBodySchema>;

/**
 * POST /coupons/{id} response body.
 */
export const couponPostCustomResponseSchema = z.unknown();

export type CouponPostCustomResponse = z.infer<
  typeof couponPostCustomResponseSchema
>;

/**
 * PUT /coupons/batch request body.
 */
export const couponPutBatchCustomBodySchema = z
  .object({
    amount: z
      .string()
      .optional()
      .describe(
        "The amount of discount. Should always be numeric, even if setting a percentage.",
      ),
    code: z.string().optional().describe("Coupon code."),
    date_expires: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, in the site's timezone."),
    date_expires_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, as GMT."),
    description: z.string().optional().describe("Coupon description."),
    discount_type: z
      .enum(["percent", "fixed_cart", "fixed_product"])
      .optional()
      .describe("Determines the type of discount that will be applied."),
    email_restrictions: z
      .array(z.string())
      .optional()
      .describe("List of email addresses that can use this coupon."),
    exclude_sale_items: z
      .boolean()
      .optional()
      .describe(
        "If true, this coupon will not be applied to items that have sale prices.",
      ),
    excluded_product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon does not apply to."),
    excluded_product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon cannot be used on."),
    free_shipping: z
      .boolean()
      .optional()
      .describe(
        "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
      ),
    individual_use: z
      .boolean()
      .optional()
      .describe(
        "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
      ),
    limit_usage_to_x_items: z
      .number()
      .optional()
      .describe(
        "Max number of items in the cart the coupon can be applied to.",
      ),
    maximum_amount: z
      .string()
      .optional()
      .describe("Maximum order amount allowed when using the coupon."),
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
    minimum_amount: z
      .string()
      .optional()
      .describe(
        "Minimum order amount that needs to be in the cart before coupon applies.",
      ),
    product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon applies to."),
    product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon can be used on."),
    status: z
      .string()
      .optional()
      .describe(
        "The status of the coupon. Should always be draft, published, or pending review",
      ),
    usage_limit: z
      .number()
      .optional()
      .describe("How many times the coupon can be used in total."),
    usage_limit_per_user: z
      .number()
      .optional()
      .describe("How many times the coupon can be used per customer."),
  })
  .strict();

export type CouponPutBatchCustomBody = z.infer<
  typeof couponPutBatchCustomBodySchema
>;

/**
 * PUT /coupons/batch response body.
 */
export const couponPutBatchCustomResponseSchema = z
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

export type CouponPutBatchCustomResponse = z.infer<
  typeof couponPutBatchCustomResponseSchema
>;

/**
 * PUT /coupons/{id} path parameters.
 */
export const couponUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type CouponUpdatePathParams = z.infer<
  typeof couponUpdatePathParamsSchema
>;

/**
 * PUT /coupons/{id} request body.
 */
export const couponUpdateBodySchema = z
  .object({
    amount: z
      .string()
      .optional()
      .describe(
        "The amount of discount. Should always be numeric, even if setting a percentage.",
      ),
    code: z.string().optional().describe("Coupon code."),
    date_expires: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, in the site's timezone."),
    date_expires_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, as GMT."),
    description: z.string().optional().describe("Coupon description."),
    discount_type: z
      .enum(["percent", "fixed_cart", "fixed_product"])
      .optional()
      .describe("Determines the type of discount that will be applied."),
    email_restrictions: z
      .array(z.string())
      .optional()
      .describe("List of email addresses that can use this coupon."),
    exclude_sale_items: z
      .boolean()
      .optional()
      .describe(
        "If true, this coupon will not be applied to items that have sale prices.",
      ),
    excluded_product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon does not apply to."),
    excluded_product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon cannot be used on."),
    free_shipping: z
      .boolean()
      .optional()
      .describe(
        "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
      ),
    individual_use: z
      .boolean()
      .optional()
      .describe(
        "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
      ),
    limit_usage_to_x_items: z
      .number()
      .optional()
      .describe(
        "Max number of items in the cart the coupon can be applied to.",
      ),
    maximum_amount: z
      .string()
      .optional()
      .describe("Maximum order amount allowed when using the coupon."),
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
    minimum_amount: z
      .string()
      .optional()
      .describe(
        "Minimum order amount that needs to be in the cart before coupon applies.",
      ),
    product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon applies to."),
    product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon can be used on."),
    status: z
      .string()
      .optional()
      .describe(
        "The status of the coupon. Should always be draft, published, or pending review",
      ),
    usage_limit: z
      .number()
      .optional()
      .describe("How many times the coupon can be used in total."),
    usage_limit_per_user: z
      .number()
      .optional()
      .describe("How many times the coupon can be used per customer."),
  })
  .strict();

export type CouponUpdateBody = z.infer<typeof couponUpdateBodySchema>;

/**
 * PUT /coupons/{id} response body.
 */
export const couponUpdateResponseSchema = z.unknown();

export type CouponUpdateResponse = z.infer<typeof couponUpdateResponseSchema>;

/**
 * POST /coupons/batch request body.
 */
export const couponsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            amount: z
              .string()
              .optional()
              .describe(
                "The amount of discount. Should always be numeric, even if setting a percentage.",
              ),
            code: z.string().optional().describe("Coupon code."),
            date_expires: z
              .string()
              .nullable()
              .optional()
              .describe("The date the coupon expires, in the site's timezone."),
            date_expires_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the coupon expires, as GMT."),
            description: z.string().optional().describe("Coupon description."),
            discount_type: z
              .enum(["percent", "fixed_cart", "fixed_product"])
              .optional()
              .describe(
                "Determines the type of discount that will be applied.",
              ),
            email_restrictions: z
              .array(z.string())
              .optional()
              .describe("List of email addresses that can use this coupon."),
            exclude_sale_items: z
              .boolean()
              .optional()
              .describe(
                "If true, this coupon will not be applied to items that have sale prices.",
              ),
            excluded_product_categories: z
              .array(z.number())
              .optional()
              .describe("List of category IDs the coupon does not apply to."),
            excluded_product_ids: z
              .array(z.number())
              .optional()
              .describe("List of product IDs the coupon cannot be used on."),
            free_shipping: z
              .boolean()
              .optional()
              .describe(
                "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
              ),
            individual_use: z
              .boolean()
              .optional()
              .describe(
                "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
              ),
            limit_usage_to_x_items: z
              .number()
              .optional()
              .describe(
                "Max number of items in the cart the coupon can be applied to.",
              ),
            maximum_amount: z
              .string()
              .optional()
              .describe("Maximum order amount allowed when using the coupon."),
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
            minimum_amount: z
              .string()
              .optional()
              .describe(
                "Minimum order amount that needs to be in the cart before coupon applies.",
              ),
            product_categories: z
              .array(z.number())
              .optional()
              .describe("List of category IDs the coupon applies to."),
            product_ids: z
              .array(z.number())
              .optional()
              .describe("List of product IDs the coupon can be used on."),
            status: z
              .string()
              .optional()
              .describe(
                "The status of the coupon. Should always be draft, published, or pending review",
              ),
            usage_limit: z
              .number()
              .optional()
              .describe("How many times the coupon can be used in total."),
            usage_limit_per_user: z
              .number()
              .optional()
              .describe("How many times the coupon can be used per customer."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            amount: z
              .string()
              .optional()
              .describe(
                "The amount of discount. Should always be numeric, even if setting a percentage.",
              ),
            code: z.string().optional().describe("Coupon code."),
            date_expires: z
              .string()
              .nullable()
              .optional()
              .describe("The date the coupon expires, in the site's timezone."),
            date_expires_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the coupon expires, as GMT."),
            description: z.string().optional().describe("Coupon description."),
            discount_type: z
              .enum(["percent", "fixed_cart", "fixed_product"])
              .optional()
              .describe(
                "Determines the type of discount that will be applied.",
              ),
            email_restrictions: z
              .array(z.string())
              .optional()
              .describe("List of email addresses that can use this coupon."),
            exclude_sale_items: z
              .boolean()
              .optional()
              .describe(
                "If true, this coupon will not be applied to items that have sale prices.",
              ),
            excluded_product_categories: z
              .array(z.number())
              .optional()
              .describe("List of category IDs the coupon does not apply to."),
            excluded_product_ids: z
              .array(z.number())
              .optional()
              .describe("List of product IDs the coupon cannot be used on."),
            free_shipping: z
              .boolean()
              .optional()
              .describe(
                "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
              ),
            id: z.number(),
            individual_use: z
              .boolean()
              .optional()
              .describe(
                "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
              ),
            limit_usage_to_x_items: z
              .number()
              .optional()
              .describe(
                "Max number of items in the cart the coupon can be applied to.",
              ),
            maximum_amount: z
              .string()
              .optional()
              .describe("Maximum order amount allowed when using the coupon."),
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
            minimum_amount: z
              .string()
              .optional()
              .describe(
                "Minimum order amount that needs to be in the cart before coupon applies.",
              ),
            product_categories: z
              .array(z.number())
              .optional()
              .describe("List of category IDs the coupon applies to."),
            product_ids: z
              .array(z.number())
              .optional()
              .describe("List of product IDs the coupon can be used on."),
            status: z
              .string()
              .optional()
              .describe(
                "The status of the coupon. Should always be draft, published, or pending review",
              ),
            usage_limit: z
              .number()
              .optional()
              .describe("How many times the coupon can be used in total."),
            usage_limit_per_user: z
              .number()
              .optional()
              .describe("How many times the coupon can be used per customer."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type CouponsBatchUpdateBody = z.infer<
  typeof couponsBatchUpdateBodySchema
>;

/**
 * POST /coupons/batch response body.
 */
export const couponsBatchUpdateResponseSchema = z
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

export type CouponsBatchUpdateResponse = z.infer<
  typeof couponsBatchUpdateResponseSchema
>;

/**
 * POST /coupons request body.
 */
export const couponsCreateBodySchema = z
  .object({
    amount: z
      .string()
      .optional()
      .describe(
        "The amount of discount. Should always be numeric, even if setting a percentage.",
      ),
    code: z.string().describe("Coupon code."),
    date_expires: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, in the site's timezone."),
    date_expires_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the coupon expires, as GMT."),
    description: z.string().optional().describe("Coupon description."),
    discount_type: z
      .enum(["percent", "fixed_cart", "fixed_product"])
      .optional()
      .describe("Determines the type of discount that will be applied."),
    email_restrictions: z
      .array(z.string())
      .optional()
      .describe("List of email addresses that can use this coupon."),
    exclude_sale_items: z
      .boolean()
      .optional()
      .describe(
        "If true, this coupon will not be applied to items that have sale prices.",
      ),
    excluded_product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon does not apply to."),
    excluded_product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon cannot be used on."),
    free_shipping: z
      .boolean()
      .optional()
      .describe(
        "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
      ),
    individual_use: z
      .boolean()
      .optional()
      .describe(
        "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
      ),
    limit_usage_to_x_items: z
      .number()
      .optional()
      .describe(
        "Max number of items in the cart the coupon can be applied to.",
      ),
    maximum_amount: z
      .string()
      .optional()
      .describe("Maximum order amount allowed when using the coupon."),
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
    minimum_amount: z
      .string()
      .optional()
      .describe(
        "Minimum order amount that needs to be in the cart before coupon applies.",
      ),
    product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon applies to."),
    product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon can be used on."),
    status: z
      .string()
      .optional()
      .describe(
        "The status of the coupon. Should always be draft, published, or pending review",
      ),
    usage_limit: z
      .number()
      .optional()
      .describe("How many times the coupon can be used in total."),
    usage_limit_per_user: z
      .number()
      .optional()
      .describe("How many times the coupon can be used per customer."),
  })
  .strict();

export type CouponsCreateBody = z.infer<typeof couponsCreateBodySchema>;

/**
 * POST /coupons response body.
 */
export const couponsCreateResponseSchema = z
  .object({
    amount: z
      .string()
      .optional()
      .describe(
        "The amount of discount. Should always be numeric, even if setting a percentage.",
      ),
    code: z.string().optional().describe("Coupon code."),
    date_created: z
      .string()
      .optional()
      .describe("The date the coupon was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the coupon was created, as GMT."),
    date_expires: z
      .string()
      .optional()
      .describe("The date the coupon expires, in the site's timezone."),
    date_expires_gmt: z
      .string()
      .optional()
      .describe("The date the coupon expires, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the coupon was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the coupon was last modified, as GMT."),
    description: z.string().optional().describe("Coupon description."),
    discount_type: z
      .enum(["percent", "fixed_cart", "fixed_product"])
      .optional()
      .describe("Determines the type of discount that will be applied."),
    email_restrictions: z
      .array(z.string())
      .optional()
      .describe("List of email addresses that can use this coupon."),
    exclude_sale_items: z
      .boolean()
      .optional()
      .describe(
        "If true, this coupon will not be applied to items that have sale prices.",
      ),
    excluded_product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon does not apply to."),
    excluded_product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon cannot be used on."),
    free_shipping: z
      .boolean()
      .optional()
      .describe(
        "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
      ),
    id: z.number().optional().describe("Unique identifier for the object."),
    individual_use: z
      .boolean()
      .optional()
      .describe(
        "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
      ),
    limit_usage_to_x_items: z
      .number()
      .optional()
      .describe(
        "Max number of items in the cart the coupon can be applied to.",
      ),
    maximum_amount: z
      .string()
      .optional()
      .describe("Maximum order amount allowed when using the coupon."),
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
    minimum_amount: z
      .string()
      .optional()
      .describe(
        "Minimum order amount that needs to be in the cart before coupon applies.",
      ),
    product_categories: z
      .array(z.number())
      .optional()
      .describe("List of category IDs the coupon applies to."),
    product_ids: z
      .array(z.number())
      .optional()
      .describe("List of product IDs the coupon can be used on."),
    status: z
      .string()
      .optional()
      .describe(
        "The status of the coupon. Should always be draft, published, or pending review",
      ),
    usage_count: z
      .number()
      .optional()
      .describe("Number of times the coupon has been used already."),
    usage_limit: z
      .number()
      .optional()
      .describe("How many times the coupon can be used in total."),
    usage_limit_per_user: z
      .number()
      .optional()
      .describe("How many times the coupon can be used per customer."),
    used_by: z
      .array(z.number())
      .optional()
      .describe(
        "List of user IDs (or guest email addresses) that have used the coupon.",
      ),
  })
  .strict();

export type CouponsCreateResponse = z.infer<typeof couponsCreateResponseSchema>;

/**
 * GET /coupons query parameters.
 */
export const couponsListQuerySchema = z
  .object({
    after: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published after a given ISO8601 compliant date.",
      ),
    before: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published before a given ISO8601 compliant date.",
      ),
    code: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific code."),
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    dates_are_gmt: z
      .boolean()
      .optional()
      .describe(
        "Whether to consider GMT post dates when limiting response by published or modified date.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    modified_after: z
      .string()
      .optional()
      .describe(
        "Limit response to resources modified after a given ISO8601 compliant date.",
      ),
    modified_before: z
      .string()
      .optional()
      .describe(
        "Limit response to resources modified before a given ISO8601 compliant date.",
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
      .enum(["date", "id", "include", "title", "slug", "modified"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
  })
  .strict();

export type CouponsListQuery = z.infer<typeof couponsListQuerySchema>;

/**
 * GET /coupons response body.
 */
export const couponsListResponseSchema = z.array(
  z
    .object({
      amount: z
        .string()
        .optional()
        .describe(
          "The amount of discount. Should always be numeric, even if setting a percentage.",
        ),
      code: z.string().optional().describe("Coupon code."),
      date_created: z
        .string()
        .optional()
        .describe("The date the coupon was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the coupon was created, as GMT."),
      date_expires: z
        .string()
        .optional()
        .describe("The date the coupon expires, in the site's timezone."),
      date_expires_gmt: z
        .string()
        .optional()
        .describe("The date the coupon expires, as GMT."),
      date_modified: z
        .string()
        .optional()
        .describe(
          "The date the coupon was last modified, in the site's timezone.",
        ),
      date_modified_gmt: z
        .string()
        .optional()
        .describe("The date the coupon was last modified, as GMT."),
      description: z.string().optional().describe("Coupon description."),
      discount_type: z
        .enum(["percent", "fixed_cart", "fixed_product"])
        .optional()
        .describe("Determines the type of discount that will be applied."),
      email_restrictions: z
        .array(z.string())
        .optional()
        .describe("List of email addresses that can use this coupon."),
      exclude_sale_items: z
        .boolean()
        .optional()
        .describe(
          "If true, this coupon will not be applied to items that have sale prices.",
        ),
      excluded_product_categories: z
        .array(z.number())
        .optional()
        .describe("List of category IDs the coupon does not apply to."),
      excluded_product_ids: z
        .array(z.number())
        .optional()
        .describe("List of product IDs the coupon cannot be used on."),
      free_shipping: z
        .boolean()
        .optional()
        .describe(
          "If true and if the free shipping method requires a coupon, this coupon will enable free shipping.",
        ),
      id: z.number().optional().describe("Unique identifier for the object."),
      individual_use: z
        .boolean()
        .optional()
        .describe(
          "If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.",
        ),
      limit_usage_to_x_items: z
        .number()
        .optional()
        .describe(
          "Max number of items in the cart the coupon can be applied to.",
        ),
      maximum_amount: z
        .string()
        .optional()
        .describe("Maximum order amount allowed when using the coupon."),
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
      minimum_amount: z
        .string()
        .optional()
        .describe(
          "Minimum order amount that needs to be in the cart before coupon applies.",
        ),
      product_categories: z
        .array(z.number())
        .optional()
        .describe("List of category IDs the coupon applies to."),
      product_ids: z
        .array(z.number())
        .optional()
        .describe("List of product IDs the coupon can be used on."),
      status: z
        .string()
        .optional()
        .describe(
          "The status of the coupon. Should always be draft, published, or pending review",
        ),
      usage_count: z
        .number()
        .optional()
        .describe("Number of times the coupon has been used already."),
      usage_limit: z
        .number()
        .optional()
        .describe("How many times the coupon can be used in total."),
      usage_limit_per_user: z
        .number()
        .optional()
        .describe("How many times the coupon can be used per customer."),
      used_by: z
        .array(z.number())
        .optional()
        .describe(
          "List of user IDs (or guest email addresses) that have used the coupon.",
        ),
    })
    .strict(),
);

export type CouponsListResponse = z.infer<typeof couponsListResponseSchema>;
