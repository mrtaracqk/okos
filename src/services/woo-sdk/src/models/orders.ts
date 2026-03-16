/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * DELETE /orders/{id} path parameters.
 */
export const orderDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderDeletePathParams = z.infer<typeof orderDeletePathParamsSchema>;

/**
 * DELETE /orders/{id} query parameters.
 */
export const orderDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type OrderDeleteQuery = z.infer<typeof orderDeleteQuerySchema>;

/**
 * DELETE /orders/{id} response body.
 */
export const orderDeleteResponseSchema = z.unknown();

export type OrderDeleteResponse = z.infer<typeof orderDeleteResponseSchema>;

/**
 * GET /orders/{id}/actions/email_templates path parameters.
 */
export const orderEmailTemplatesPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderEmailTemplatesPathParams = z.infer<
  typeof orderEmailTemplatesPathParamsSchema
>;

/**
 * GET /orders/{id}/actions/email_templates response body.
 */
export const orderEmailTemplatesResponseSchema = z.unknown();

export type OrderEmailTemplatesResponse = z.infer<
  typeof orderEmailTemplatesResponseSchema
>;

/**
 * GET /orders/{id} path parameters.
 */
export const orderGetPathParamsSchema = z.object({ id: z.number() }).strict();

export type OrderGetPathParams = z.infer<typeof orderGetPathParamsSchema>;

/**
 * GET /orders/{id} query parameters.
 */
export const orderGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type OrderGetQuery = z.infer<typeof orderGetQuerySchema>;

/**
 * GET /orders/{id} response body.
 */
export const orderGetResponseSchema = z
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
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        email: z.string().nullable().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Billing address.")
      .strict()
      .optional()
      .describe("Billing address."),
    cart_hash: z
      .string()
      .optional()
      .describe("MD5 hash of cart items to ensure orders are not modified."),
    cart_tax: z.string().optional().describe("Sum of line item taxes only."),
    coupon_lines: z
      .array(
        z
          .object({
            code: z.unknown().optional().describe("Coupon code."),
            discount: z.string().optional().describe("Discount total."),
            discount_tax: z.string().optional().describe("Discount total tax."),
            discount_type: z.string().optional().describe("Discount type."),
            free_shipping: z
              .boolean()
              .optional()
              .describe("Whether the coupon grants free shipping or not."),
            id: z.number().optional().describe("Item ID."),
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
            nominal_amount: z
              .number()
              .optional()
              .describe(
                "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
              ),
          })
          .strict(),
      )
      .optional()
      .describe("Coupons line data."),
    created_via: z
      .string()
      .optional()
      .describe("Shows where the order was created."),
    currency: z
      .enum([
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYR",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "IRT",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PRB",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "SSP",
        "STN",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VES",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
      ])
      .optional()
      .describe("Currency the order was created with, in ISO format."),
    customer_id: z
      .number()
      .optional()
      .describe("User ID who owns the order. 0 for guests."),
    customer_ip_address: z
      .string()
      .optional()
      .describe("Customer's IP address."),
    customer_note: z
      .string()
      .optional()
      .describe("Note left by customer during checkout."),
    customer_user_agent: z
      .string()
      .optional()
      .describe("User agent of the customer."),
    date_completed: z
      .string()
      .optional()
      .describe("The date the order was completed, in the site's timezone."),
    date_completed_gmt: z
      .string()
      .optional()
      .describe("The date the order was completed, as GMT."),
    date_created: z
      .string()
      .optional()
      .describe("The date the order was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the order was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the order was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the order was last modified, as GMT."),
    date_paid: z
      .string()
      .optional()
      .describe("The date the order was paid, in the site's timezone."),
    date_paid_gmt: z
      .string()
      .optional()
      .describe("The date the order was paid, as GMT."),
    discount_tax: z
      .string()
      .optional()
      .describe("Total discount tax amount for the order."),
    discount_total: z
      .string()
      .optional()
      .describe("Total discount amount for the order."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z.unknown().optional().describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    is_editable: z
      .boolean()
      .optional()
      .describe("Whether an order can be edited."),
    line_items: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            image: z
              .object({
                id: z.number().optional().describe("Image ID."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Properties of the main product image.")
              .strict()
              .optional()
              .describe("Properties of the main product image."),
            meta_data: z
              .array(
                z
                  .object({
                    display_key: z
                      .string()
                      .optional()
                      .describe("Meta key for UI display."),
                    display_value: z
                      .string()
                      .optional()
                      .describe("Meta value for UI display."),
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z.unknown().optional().describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            name: z.unknown().optional().describe("Product name."),
            parent_name: z
              .string()
              .optional()
              .describe("Parent product name if the product is a variation."),
            price: z.number().optional().describe("Product price."),
            product_id: z.unknown().optional().describe("Product ID."),
            quantity: z.number().optional().describe("Quantity ordered."),
            sku: z.string().optional().describe("Product SKU."),
            subtotal: z
              .string()
              .optional()
              .describe("Line subtotal (before discounts)."),
            subtotal_tax: z
              .string()
              .optional()
              .describe("Line subtotal tax (before discounts)."),
            tax_class: z.string().optional().describe("Tax class of product."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
            variation_id: z
              .number()
              .optional()
              .describe("Variation ID, if applicable."),
          })
          .strict(),
      )
      .optional()
      .describe("Line items data."),
    manual_update: z
      .boolean()
      .optional()
      .describe(
        'Set the action as manual so that the order note registers as "added by user".',
      ),
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
    needs_payment: z
      .boolean()
      .optional()
      .describe(
        "Whether an order needs payment, based on status and order total.",
      ),
    needs_processing: z
      .boolean()
      .optional()
      .describe(
        "Whether an order needs processing before it can be completed.",
      ),
    number: z.string().optional().describe("Order number."),
    order_key: z.string().optional().describe("Order key."),
    parent_id: z.number().optional().describe("Parent order ID."),
    payment_method: z.string().optional().describe("Payment method ID."),
    payment_method_title: z
      .string()
      .optional()
      .describe("Payment method title."),
    payment_url: z.string().optional().describe("Order payment URL."),
    prices_include_tax: z
      .boolean()
      .optional()
      .describe("True the prices included tax during checkout."),
    refunds: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Refund ID."),
            reason: z.string().optional().describe("Refund reason."),
            total: z.string().optional().describe("Refund total."),
          })
          .strict(),
      )
      .optional()
      .describe("List of refunds."),
    set_paid: z
      .boolean()
      .optional()
      .describe(
        "Define if the order is paid. It will set the status to processing and reduce stock items.",
      ),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z
          .string()
          .optional()
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Shipping address.")
      .strict()
      .optional()
      .describe("Shipping address."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z.unknown().optional().describe("Shipping method ID."),
            method_title: z
              .unknown()
              .optional()
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
    shipping_tax: z
      .string()
      .optional()
      .describe("Total shipping tax amount for the order."),
    shipping_total: z
      .string()
      .optional()
      .describe("Total shipping amount for the order."),
    status: z
      .enum([
        "auto-draft",
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ])
      .optional()
      .describe("Order status."),
    tax_lines: z
      .array(
        z
          .object({
            compound: z
              .boolean()
              .optional()
              .describe("Show if is a compound tax rate."),
            id: z.number().optional().describe("Item ID."),
            label: z.string().optional().describe("Tax rate label."),
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
            rate_code: z.string().optional().describe("Tax rate code."),
            rate_id: z.number().optional().describe("Tax rate ID."),
            shipping_tax_total: z
              .string()
              .optional()
              .describe("Shipping tax total."),
            tax_total: z
              .string()
              .optional()
              .describe("Tax total (not including shipping taxes)."),
          })
          .strict(),
      )
      .optional()
      .describe("Tax lines data."),
    total: z.string().optional().describe("Grand total."),
    total_tax: z.string().optional().describe("Sum of all taxes."),
    transaction_id: z.string().optional().describe("Unique transaction ID."),
    version: z
      .string()
      .optional()
      .describe("Version of WooCommerce which last updated the order."),
  })
  .strict();

export type OrderGetResponse = z.infer<typeof orderGetResponseSchema>;

/**
 * DELETE /orders/{order_id}/notes/{id} path parameters.
 */
export const orderNoteDeletePathParamsSchema = z
  .object({ id: z.number(), order_id: z.number() })
  .strict();

export type OrderNoteDeletePathParams = z.infer<
  typeof orderNoteDeletePathParamsSchema
>;

/**
 * DELETE /orders/{order_id}/notes/{id} query parameters.
 */
export const orderNoteDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type OrderNoteDeleteQuery = z.infer<typeof orderNoteDeleteQuerySchema>;

/**
 * DELETE /orders/{order_id}/notes/{id} response body.
 */
export const orderNoteDeleteResponseSchema = z.unknown();

export type OrderNoteDeleteResponse = z.infer<
  typeof orderNoteDeleteResponseSchema
>;

/**
 * GET /orders/{order_id}/notes/{id} path parameters.
 */
export const orderNoteGetPathParamsSchema = z
  .object({ id: z.number(), order_id: z.number() })
  .strict();

export type OrderNoteGetPathParams = z.infer<
  typeof orderNoteGetPathParamsSchema
>;

/**
 * GET /orders/{order_id}/notes/{id} query parameters.
 */
export const orderNoteGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type OrderNoteGetQuery = z.infer<typeof orderNoteGetQuerySchema>;

/**
 * GET /orders/{order_id}/notes/{id} response body.
 */
export const orderNoteGetResponseSchema = z.unknown();

export type OrderNoteGetResponse = z.infer<typeof orderNoteGetResponseSchema>;

/**
 * POST /orders/{order_id}/notes path parameters.
 */
export const orderNotesCreatePathParamsSchema = z
  .object({ order_id: z.number() })
  .strict();

export type OrderNotesCreatePathParams = z.infer<
  typeof orderNotesCreatePathParamsSchema
>;

/**
 * POST /orders/{order_id}/notes request body.
 */
export const orderNotesCreateBodySchema = z
  .object({
    added_by_user: z
      .boolean()
      .optional()
      .describe(
        "If true, this note will be attributed to the current user. If false, the note will be attributed to the system.",
      ),
    customer_note: z
      .boolean()
      .optional()
      .describe(
        "If true, the note will be shown to customers and they will be notified. If false, the note will be for admin reference only.",
      ),
    note: z.string().describe("Order note content."),
  })
  .strict();

export type OrderNotesCreateBody = z.infer<typeof orderNotesCreateBodySchema>;

/**
 * POST /orders/{order_id}/notes response body.
 */
export const orderNotesCreateResponseSchema = z.unknown();

export type OrderNotesCreateResponse = z.infer<
  typeof orderNotesCreateResponseSchema
>;

/**
 * GET /orders/{order_id}/notes path parameters.
 */
export const orderNotesListPathParamsSchema = z
  .object({ order_id: z.number() })
  .strict();

export type OrderNotesListPathParams = z.infer<
  typeof orderNotesListPathParamsSchema
>;

/**
 * GET /orders/{order_id}/notes query parameters.
 */
export const orderNotesListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    type: z
      .enum(["any", "customer", "internal"])
      .optional()
      .describe("Limit result to customers or internal notes."),
  })
  .strict();

export type OrderNotesListQuery = z.infer<typeof orderNotesListQuerySchema>;

/**
 * GET /orders/{order_id}/notes response body.
 */
export const orderNotesListResponseSchema = z.array(z.unknown());

export type OrderNotesListResponse = z.infer<
  typeof orderNotesListResponseSchema
>;

/**
 * POST /orders/{id} path parameters.
 */
export const orderPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderPostCustomPathParams = z.infer<
  typeof orderPostCustomPathParamsSchema
>;

/**
 * POST /orders/{id} request body.
 */
export const orderPostCustomBodySchema = z
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
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        email: z.string().nullable().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Billing address.")
      .strict()
      .optional()
      .describe("Billing address."),
    coupon_lines: z
      .array(
        z
          .object({
            code: z
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
              .describe("Coupon code."),
            discount: z.string().optional().describe("Discount total."),
            discount_tax: z.string().optional().describe("Discount total tax."),
            discount_type: z.string().optional().describe("Discount type."),
            free_shipping: z
              .boolean()
              .optional()
              .describe("Whether the coupon grants free shipping or not."),
            id: z.number().optional().describe("Item ID."),
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
            nominal_amount: z
              .number()
              .optional()
              .describe(
                "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
              ),
          })
          .strict(),
      )
      .optional()
      .describe("Coupons line data."),
    created_via: z
      .string()
      .optional()
      .describe("Shows where the order was created."),
    currency: z
      .enum([
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYR",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "IRT",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PRB",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "SSP",
        "STN",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VES",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
      ])
      .optional()
      .describe("Currency the order was created with, in ISO format."),
    customer_id: z
      .number()
      .optional()
      .describe("User ID who owns the order. 0 for guests."),
    customer_note: z
      .string()
      .optional()
      .describe("Note left by customer during checkout."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z
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
              .describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
    line_items: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            image: z
              .object({
                id: z.number().optional().describe("Image ID."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Properties of the main product image.")
              .strict()
              .optional()
              .describe("Properties of the main product image."),
            meta_data: z
              .array(
                z
                  .object({
                    display_key: z
                      .string()
                      .optional()
                      .describe("Meta key for UI display."),
                    display_value: z
                      .string()
                      .optional()
                      .describe("Meta value for UI display."),
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
            name: z
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
              .describe("Product name."),
            parent_name: z
              .string()
              .optional()
              .describe("Parent product name if the product is a variation."),
            price: z.number().optional().describe("Product price."),
            product_id: z
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
              .describe("Product ID."),
            quantity: z.number().optional().describe("Quantity ordered."),
            sku: z.string().optional().describe("Product SKU."),
            subtotal: z
              .string()
              .optional()
              .describe("Line subtotal (before discounts)."),
            subtotal_tax: z
              .string()
              .optional()
              .describe("Line subtotal tax (before discounts)."),
            tax_class: z.string().optional().describe("Tax class of product."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
            variation_id: z
              .number()
              .optional()
              .describe("Variation ID, if applicable."),
          })
          .strict(),
      )
      .optional()
      .describe("Line items data."),
    manual_update: z
      .boolean()
      .optional()
      .describe(
        'Set the action as manual so that the order note registers as "added by user".',
      ),
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
    parent_id: z.number().optional().describe("Parent order ID."),
    payment_method: z.string().optional().describe("Payment method ID."),
    payment_method_title: z
      .string()
      .optional()
      .describe("Payment method title."),
    set_paid: z
      .boolean()
      .optional()
      .describe(
        "Define if the order is paid. It will set the status to processing and reduce stock items.",
      ),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z
          .string()
          .optional()
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Shipping address.")
      .strict()
      .optional()
      .describe("Shipping address."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z
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
              .describe("Shipping method ID."),
            method_title: z
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
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
    status: z
      .enum([
        "auto-draft",
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ])
      .optional()
      .describe("Order status."),
    transaction_id: z.string().optional().describe("Unique transaction ID."),
  })
  .strict();

export type OrderPostCustomBody = z.infer<typeof orderPostCustomBodySchema>;

/**
 * POST /orders/{id} response body.
 */
export const orderPostCustomResponseSchema = z.unknown();

export type OrderPostCustomResponse = z.infer<
  typeof orderPostCustomResponseSchema
>;

/**
 * PUT /orders/batch request body.
 */
export const orderPutBatchCustomBodySchema = z
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
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        email: z.string().nullable().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Billing address.")
      .strict()
      .optional()
      .describe("Billing address."),
    coupon_lines: z
      .array(
        z
          .object({
            code: z
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
              .describe("Coupon code."),
            discount: z.string().optional().describe("Discount total."),
            discount_tax: z.string().optional().describe("Discount total tax."),
            discount_type: z.string().optional().describe("Discount type."),
            free_shipping: z
              .boolean()
              .optional()
              .describe("Whether the coupon grants free shipping or not."),
            id: z.number().optional().describe("Item ID."),
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
            nominal_amount: z
              .number()
              .optional()
              .describe(
                "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
              ),
          })
          .strict(),
      )
      .optional()
      .describe("Coupons line data."),
    created_via: z
      .string()
      .optional()
      .describe("Shows where the order was created."),
    currency: z
      .enum([
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYR",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "IRT",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PRB",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "SSP",
        "STN",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VES",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
      ])
      .optional()
      .describe("Currency the order was created with, in ISO format."),
    customer_id: z
      .number()
      .optional()
      .describe("User ID who owns the order. 0 for guests."),
    customer_note: z
      .string()
      .optional()
      .describe("Note left by customer during checkout."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z
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
              .describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
    line_items: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            image: z
              .object({
                id: z.number().optional().describe("Image ID."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Properties of the main product image.")
              .strict()
              .optional()
              .describe("Properties of the main product image."),
            meta_data: z
              .array(
                z
                  .object({
                    display_key: z
                      .string()
                      .optional()
                      .describe("Meta key for UI display."),
                    display_value: z
                      .string()
                      .optional()
                      .describe("Meta value for UI display."),
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
            name: z
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
              .describe("Product name."),
            parent_name: z
              .string()
              .optional()
              .describe("Parent product name if the product is a variation."),
            price: z.number().optional().describe("Product price."),
            product_id: z
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
              .describe("Product ID."),
            quantity: z.number().optional().describe("Quantity ordered."),
            sku: z.string().optional().describe("Product SKU."),
            subtotal: z
              .string()
              .optional()
              .describe("Line subtotal (before discounts)."),
            subtotal_tax: z
              .string()
              .optional()
              .describe("Line subtotal tax (before discounts)."),
            tax_class: z.string().optional().describe("Tax class of product."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
            variation_id: z
              .number()
              .optional()
              .describe("Variation ID, if applicable."),
          })
          .strict(),
      )
      .optional()
      .describe("Line items data."),
    manual_update: z
      .boolean()
      .optional()
      .describe(
        'Set the action as manual so that the order note registers as "added by user".',
      ),
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
    parent_id: z.number().optional().describe("Parent order ID."),
    payment_method: z.string().optional().describe("Payment method ID."),
    payment_method_title: z
      .string()
      .optional()
      .describe("Payment method title."),
    set_paid: z
      .boolean()
      .optional()
      .describe(
        "Define if the order is paid. It will set the status to processing and reduce stock items.",
      ),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z
          .string()
          .optional()
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Shipping address.")
      .strict()
      .optional()
      .describe("Shipping address."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z
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
              .describe("Shipping method ID."),
            method_title: z
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
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
    status: z
      .enum([
        "auto-draft",
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ])
      .optional()
      .describe("Order status."),
    transaction_id: z.string().optional().describe("Unique transaction ID."),
  })
  .strict();

export type OrderPutBatchCustomBody = z.infer<
  typeof orderPutBatchCustomBodySchema
>;

/**
 * PUT /orders/batch response body.
 */
export const orderPutBatchCustomResponseSchema = z
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

export type OrderPutBatchCustomResponse = z.infer<
  typeof orderPutBatchCustomResponseSchema
>;

/**
 * POST /orders/{id}/receipt path parameters.
 */
export const orderReceiptCreatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderReceiptCreatePathParams = z.infer<
  typeof orderReceiptCreatePathParamsSchema
>;

/**
 * POST /orders/{id}/receipt request body.
 */
export const orderReceiptCreateBodySchema = z
  .object({
    expiration_date: z
      .string()
      .optional()
      .describe("Expiration date formatted as yyyy-mm-dd."),
    expiration_days: z
      .number()
      .optional()
      .describe(
        "Number of days to be added to the current date to get the expiration date.",
      ),
    force_new: z
      .boolean()
      .optional()
      .describe(
        "True to force the creation of a new receipt even if one already exists and has not expired yet.",
      ),
  })
  .strict();

export type OrderReceiptCreateBody = z.infer<
  typeof orderReceiptCreateBodySchema
>;

/**
 * POST /orders/{id}/receipt response body.
 */
export const orderReceiptCreateResponseSchema = z.unknown();

export type OrderReceiptCreateResponse = z.infer<
  typeof orderReceiptCreateResponseSchema
>;

/**
 * GET /orders/{id}/receipt path parameters.
 */
export const orderReceiptListPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderReceiptListPathParams = z.infer<
  typeof orderReceiptListPathParamsSchema
>;

/**
 * GET /orders/{id}/receipt response body.
 */
export const orderReceiptListResponseSchema = z.array(z.unknown());

export type OrderReceiptListResponse = z.infer<
  typeof orderReceiptListResponseSchema
>;

/**
 * DELETE /orders/{order_id}/refunds/{id} path parameters.
 */
export const orderRefundDeletePathParamsSchema = z
  .object({ id: z.number(), order_id: z.number() })
  .strict();

export type OrderRefundDeletePathParams = z.infer<
  typeof orderRefundDeletePathParamsSchema
>;

/**
 * DELETE /orders/{order_id}/refunds/{id} query parameters.
 */
export const orderRefundDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type OrderRefundDeleteQuery = z.infer<
  typeof orderRefundDeleteQuerySchema
>;

/**
 * DELETE /orders/{order_id}/refunds/{id} response body.
 */
export const orderRefundDeleteResponseSchema = z.unknown();

export type OrderRefundDeleteResponse = z.infer<
  typeof orderRefundDeleteResponseSchema
>;

/**
 * GET /orders/{order_id}/refunds/{id} path parameters.
 */
export const orderRefundGetPathParamsSchema = z
  .object({ id: z.number(), order_id: z.number() })
  .strict();

export type OrderRefundGetPathParams = z.infer<
  typeof orderRefundGetPathParamsSchema
>;

/**
 * GET /orders/{order_id}/refunds/{id} query parameters.
 */
export const orderRefundGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type OrderRefundGetQuery = z.infer<typeof orderRefundGetQuerySchema>;

/**
 * GET /orders/{order_id}/refunds/{id} response body.
 */
export const orderRefundGetResponseSchema = z.unknown();

export type OrderRefundGetResponse = z.infer<
  typeof orderRefundGetResponseSchema
>;

/**
 * POST /orders/{order_id}/refunds path parameters.
 */
export const orderRefundsCreatePathParamsSchema = z
  .object({ order_id: z.number() })
  .strict();

export type OrderRefundsCreatePathParams = z.infer<
  typeof orderRefundsCreatePathParamsSchema
>;

/**
 * POST /orders/{order_id}/refunds request body.
 */
export const orderRefundsCreateBodySchema = z
  .object({
    amount: z.string().optional().describe("Refund amount."),
    api_refund: z
      .boolean()
      .optional()
      .describe(
        "When true, the payment gateway API is used to generate the refund.",
      ),
    api_restock: z
      .boolean()
      .optional()
      .describe("When true, refunded items are restocked."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z
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
              .describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
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
    reason: z.string().optional().describe("Reason for refund."),
    refunded_by: z
      .number()
      .optional()
      .describe("User ID of user who created the refund."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z
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
              .describe("Shipping method ID."),
            method_title: z
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
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
  })
  .strict();

export type OrderRefundsCreateBody = z.infer<
  typeof orderRefundsCreateBodySchema
>;

/**
 * POST /orders/{order_id}/refunds response body.
 */
export const orderRefundsCreateResponseSchema = z.unknown();

export type OrderRefundsCreateResponse = z.infer<
  typeof orderRefundsCreateResponseSchema
>;

/**
 * GET /orders/{order_id}/refunds path parameters.
 */
export const orderRefundsListPathParamsSchema = z
  .object({ order_id: z.number() })
  .strict();

export type OrderRefundsListPathParams = z.infer<
  typeof orderRefundsListPathParamsSchema
>;

/**
 * GET /orders/{order_id}/refunds query parameters.
 */
export const orderRefundsListQuerySchema = z
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
    dp: z
      .number()
      .optional()
      .describe("Number of decimal points to use in each resource."),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    exclude_meta: z
      .array(z.string())
      .optional()
      .describe("Ensure meta_data excludes specific keys."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    include_meta: z
      .array(z.string())
      .optional()
      .describe("Limit meta_data to specific keys."),
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
    order_item_display_meta: z
      .boolean()
      .optional()
      .describe("Only show meta which is meant to be displayed for an order."),
    orderby: z
      .enum(["date", "id", "include", "title", "slug", "modified"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .array(z.number())
      .optional()
      .describe("Limit result set to those of particular parent IDs."),
    parent_exclude: z
      .array(z.number())
      .optional()
      .describe(
        "Limit result set to all items except those of a particular parent ID.",
      ),
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

export type OrderRefundsListQuery = z.infer<typeof orderRefundsListQuerySchema>;

/**
 * GET /orders/{order_id}/refunds response body.
 */
export const orderRefundsListResponseSchema = z.array(z.unknown());

export type OrderRefundsListResponse = z.infer<
  typeof orderRefundsListResponseSchema
>;

/**
 * POST /orders/{id}/actions/send_email path parameters.
 */
export const orderSendEmailPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderSendEmailPathParams = z.infer<
  typeof orderSendEmailPathParamsSchema
>;

/**
 * POST /orders/{id}/actions/send_email request body.
 */
export const orderSendEmailBodySchema = z
  .object({
    email: z
      .string()
      .optional()
      .describe("Email address to send the order details to."),
    force_email_update: z
      .boolean()
      .optional()
      .describe(
        "Whether to update the billing email of the order, even if it already has one.",
      ),
    template_id: z
      .enum([
        "new_order",
        "cancelled_order",
        "failed_order",
        "customer_failed_order",
        "customer_on_hold_order",
        "customer_processing_order",
        "customer_completed_order",
        "customer_refunded_order",
        "customer_invoice",
        "customer_note",
        "customer_reset_password",
        "customer_new_account",
      ])
      .describe("The ID of the template to use for sending the email."),
  })
  .strict();

export type OrderSendEmailBody = z.infer<typeof orderSendEmailBodySchema>;

/**
 * POST /orders/{id}/actions/send_email response body.
 */
export const orderSendEmailResponseSchema = z.unknown();

export type OrderSendEmailResponse = z.infer<
  typeof orderSendEmailResponseSchema
>;

/**
 * POST /orders/{id}/actions/send_order_details path parameters.
 */
export const orderSendOrderDetailsPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderSendOrderDetailsPathParams = z.infer<
  typeof orderSendOrderDetailsPathParamsSchema
>;

/**
 * POST /orders/{id}/actions/send_order_details request body.
 */
export const orderSendOrderDetailsBodySchema = z
  .object({
    email: z
      .string()
      .optional()
      .describe("Email address to send the order details to."),
    force_email_update: z
      .boolean()
      .optional()
      .describe(
        "Whether to update the billing email of the order, even if it already has one.",
      ),
  })
  .strict();

export type OrderSendOrderDetailsBody = z.infer<
  typeof orderSendOrderDetailsBodySchema
>;

/**
 * POST /orders/{id}/actions/send_order_details response body.
 */
export const orderSendOrderDetailsResponseSchema = z.unknown();

export type OrderSendOrderDetailsResponse = z.infer<
  typeof orderSendOrderDetailsResponseSchema
>;

/**
 * PUT /orders/{id} path parameters.
 */
export const orderUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type OrderUpdatePathParams = z.infer<typeof orderUpdatePathParamsSchema>;

/**
 * PUT /orders/{id} request body.
 */
export const orderUpdateBodySchema = z
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
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        email: z.string().nullable().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Billing address.")
      .strict()
      .optional()
      .describe("Billing address."),
    coupon_lines: z
      .array(
        z
          .object({
            code: z
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
              .describe("Coupon code."),
            discount: z.string().optional().describe("Discount total."),
            discount_tax: z.string().optional().describe("Discount total tax."),
            discount_type: z.string().optional().describe("Discount type."),
            free_shipping: z
              .boolean()
              .optional()
              .describe("Whether the coupon grants free shipping or not."),
            id: z.number().optional().describe("Item ID."),
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
            nominal_amount: z
              .number()
              .optional()
              .describe(
                "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
              ),
          })
          .strict(),
      )
      .optional()
      .describe("Coupons line data."),
    created_via: z
      .string()
      .optional()
      .describe("Shows where the order was created."),
    currency: z
      .enum([
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYR",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "IRT",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PRB",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "SSP",
        "STN",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VES",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
      ])
      .optional()
      .describe("Currency the order was created with, in ISO format."),
    customer_id: z
      .number()
      .optional()
      .describe("User ID who owns the order. 0 for guests."),
    customer_note: z
      .string()
      .optional()
      .describe("Note left by customer during checkout."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z
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
              .describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
    line_items: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            image: z
              .object({
                id: z.number().optional().describe("Image ID."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Properties of the main product image.")
              .strict()
              .optional()
              .describe("Properties of the main product image."),
            meta_data: z
              .array(
                z
                  .object({
                    display_key: z
                      .string()
                      .optional()
                      .describe("Meta key for UI display."),
                    display_value: z
                      .string()
                      .optional()
                      .describe("Meta value for UI display."),
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
            name: z
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
              .describe("Product name."),
            parent_name: z
              .string()
              .optional()
              .describe("Parent product name if the product is a variation."),
            price: z.number().optional().describe("Product price."),
            product_id: z
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
              .describe("Product ID."),
            quantity: z.number().optional().describe("Quantity ordered."),
            sku: z.string().optional().describe("Product SKU."),
            subtotal: z
              .string()
              .optional()
              .describe("Line subtotal (before discounts)."),
            subtotal_tax: z
              .string()
              .optional()
              .describe("Line subtotal tax (before discounts)."),
            tax_class: z.string().optional().describe("Tax class of product."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
            variation_id: z
              .number()
              .optional()
              .describe("Variation ID, if applicable."),
          })
          .strict(),
      )
      .optional()
      .describe("Line items data."),
    manual_update: z
      .boolean()
      .optional()
      .describe(
        'Set the action as manual so that the order note registers as "added by user".',
      ),
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
    parent_id: z.number().optional().describe("Parent order ID."),
    payment_method: z.string().optional().describe("Payment method ID."),
    payment_method_title: z
      .string()
      .optional()
      .describe("Payment method title."),
    set_paid: z
      .boolean()
      .optional()
      .describe(
        "Define if the order is paid. It will set the status to processing and reduce stock items.",
      ),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z
          .string()
          .optional()
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Shipping address.")
      .strict()
      .optional()
      .describe("Shipping address."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z
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
              .describe("Shipping method ID."),
            method_title: z
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
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
    status: z
      .enum([
        "auto-draft",
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ])
      .optional()
      .describe("Order status."),
    transaction_id: z.string().optional().describe("Unique transaction ID."),
  })
  .strict();

export type OrderUpdateBody = z.infer<typeof orderUpdateBodySchema>;

/**
 * PUT /orders/{id} response body.
 */
export const orderUpdateResponseSchema = z.unknown();

export type OrderUpdateResponse = z.infer<typeof orderUpdateResponseSchema>;

/**
 * POST /orders/batch request body.
 */
export const ordersBatchUpdateBodySchema = z
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
                  .describe("Country code in ISO 3166-1 alpha-2 format."),
                email: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("Email address."),
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
              .describe("Billing address.")
              .strict()
              .optional()
              .describe("Billing address."),
            coupon_lines: z
              .array(
                z
                  .object({
                    code: z
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
                      .describe("Coupon code."),
                    discount: z.string().optional().describe("Discount total."),
                    discount_tax: z
                      .string()
                      .optional()
                      .describe("Discount total tax."),
                    discount_type: z
                      .string()
                      .optional()
                      .describe("Discount type."),
                    free_shipping: z
                      .boolean()
                      .optional()
                      .describe(
                        "Whether the coupon grants free shipping or not.",
                      ),
                    id: z.number().optional().describe("Item ID."),
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
                    nominal_amount: z
                      .number()
                      .optional()
                      .describe(
                        "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
                      ),
                  })
                  .strict(),
              )
              .optional()
              .describe("Coupons line data."),
            created_via: z
              .string()
              .optional()
              .describe("Shows where the order was created."),
            currency: z
              .enum([
                "AED",
                "AFN",
                "ALL",
                "AMD",
                "ANG",
                "AOA",
                "ARS",
                "AUD",
                "AWG",
                "AZN",
                "BAM",
                "BBD",
                "BDT",
                "BGN",
                "BHD",
                "BIF",
                "BMD",
                "BND",
                "BOB",
                "BRL",
                "BSD",
                "BTC",
                "BTN",
                "BWP",
                "BYR",
                "BYN",
                "BZD",
                "CAD",
                "CDF",
                "CHF",
                "CLP",
                "CNY",
                "COP",
                "CRC",
                "CUC",
                "CUP",
                "CVE",
                "CZK",
                "DJF",
                "DKK",
                "DOP",
                "DZD",
                "EGP",
                "ERN",
                "ETB",
                "EUR",
                "FJD",
                "FKP",
                "GBP",
                "GEL",
                "GGP",
                "GHS",
                "GIP",
                "GMD",
                "GNF",
                "GTQ",
                "GYD",
                "HKD",
                "HNL",
                "HRK",
                "HTG",
                "HUF",
                "IDR",
                "ILS",
                "IMP",
                "INR",
                "IQD",
                "IRR",
                "IRT",
                "ISK",
                "JEP",
                "JMD",
                "JOD",
                "JPY",
                "KES",
                "KGS",
                "KHR",
                "KMF",
                "KPW",
                "KRW",
                "KWD",
                "KYD",
                "KZT",
                "LAK",
                "LBP",
                "LKR",
                "LRD",
                "LSL",
                "LYD",
                "MAD",
                "MDL",
                "MGA",
                "MKD",
                "MMK",
                "MNT",
                "MOP",
                "MRU",
                "MUR",
                "MVR",
                "MWK",
                "MXN",
                "MYR",
                "MZN",
                "NAD",
                "NGN",
                "NIO",
                "NOK",
                "NPR",
                "NZD",
                "OMR",
                "PAB",
                "PEN",
                "PGK",
                "PHP",
                "PKR",
                "PLN",
                "PRB",
                "PYG",
                "QAR",
                "RON",
                "RSD",
                "RUB",
                "RWF",
                "SAR",
                "SBD",
                "SCR",
                "SDG",
                "SEK",
                "SGD",
                "SHP",
                "SLL",
                "SOS",
                "SRD",
                "SSP",
                "STN",
                "SYP",
                "SZL",
                "THB",
                "TJS",
                "TMT",
                "TND",
                "TOP",
                "TRY",
                "TTD",
                "TWD",
                "TZS",
                "UAH",
                "UGX",
                "USD",
                "UYU",
                "UZS",
                "VEF",
                "VES",
                "VND",
                "VUV",
                "WST",
                "XAF",
                "XCD",
                "XOF",
                "XPF",
                "YER",
                "ZAR",
                "ZMW",
              ])
              .optional()
              .describe("Currency the order was created with, in ISO format."),
            customer_id: z
              .number()
              .optional()
              .describe("User ID who owns the order. 0 for guests."),
            customer_note: z
              .string()
              .optional()
              .describe("Note left by customer during checkout."),
            fee_lines: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Item ID."),
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
                    name: z
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
                      .describe("Fee name."),
                    tax_class: z
                      .string()
                      .optional()
                      .describe("Tax class of fee."),
                    tax_status: z
                      .enum(["taxable", "none"])
                      .optional()
                      .describe("Tax status of fee."),
                    taxes: z
                      .array(
                        z
                          .object({
                            id: z.number().optional().describe("Tax rate ID."),
                            subtotal: z
                              .string()
                              .optional()
                              .describe("Tax subtotal."),
                            total: z.string().optional().describe("Tax total."),
                          })
                          .strict(),
                      )
                      .optional()
                      .describe("Line taxes."),
                    total: z
                      .string()
                      .optional()
                      .describe("Line total (after discounts)."),
                    total_tax: z
                      .string()
                      .optional()
                      .describe("Line total tax (after discounts)."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Fee lines data."),
            line_items: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Item ID."),
                    image: z
                      .object({
                        id: z.number().optional().describe("Image ID."),
                        src: z.string().optional().describe("Image URL."),
                      })
                      .describe("Properties of the main product image.")
                      .strict()
                      .optional()
                      .describe("Properties of the main product image."),
                    meta_data: z
                      .array(
                        z
                          .object({
                            display_key: z
                              .string()
                              .optional()
                              .describe("Meta key for UI display."),
                            display_value: z
                              .string()
                              .optional()
                              .describe("Meta value for UI display."),
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
                    name: z
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
                      .describe("Product name."),
                    parent_name: z
                      .string()
                      .optional()
                      .describe(
                        "Parent product name if the product is a variation.",
                      ),
                    price: z.number().optional().describe("Product price."),
                    product_id: z
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
                      .describe("Product ID."),
                    quantity: z
                      .number()
                      .optional()
                      .describe("Quantity ordered."),
                    sku: z.string().optional().describe("Product SKU."),
                    subtotal: z
                      .string()
                      .optional()
                      .describe("Line subtotal (before discounts)."),
                    subtotal_tax: z
                      .string()
                      .optional()
                      .describe("Line subtotal tax (before discounts)."),
                    tax_class: z
                      .string()
                      .optional()
                      .describe("Tax class of product."),
                    taxes: z
                      .array(
                        z
                          .object({
                            id: z.number().optional().describe("Tax rate ID."),
                            subtotal: z
                              .string()
                              .optional()
                              .describe("Tax subtotal."),
                            total: z.string().optional().describe("Tax total."),
                          })
                          .strict(),
                      )
                      .optional()
                      .describe("Line taxes."),
                    total: z
                      .string()
                      .optional()
                      .describe("Line total (after discounts)."),
                    total_tax: z
                      .string()
                      .optional()
                      .describe("Line total tax (after discounts)."),
                    variation_id: z
                      .number()
                      .optional()
                      .describe("Variation ID, if applicable."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line items data."),
            manual_update: z
              .boolean()
              .optional()
              .describe(
                'Set the action as manual so that the order note registers as "added by user".',
              ),
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
            parent_id: z.number().optional().describe("Parent order ID."),
            payment_method: z
              .string()
              .optional()
              .describe("Payment method ID."),
            payment_method_title: z
              .string()
              .optional()
              .describe("Payment method title."),
            set_paid: z
              .boolean()
              .optional()
              .describe(
                "Define if the order is paid. It will set the status to processing and reduce stock items.",
              ),
            shipping: z
              .object({
                address_1: z.string().optional().describe("Address line 1"),
                address_2: z.string().optional().describe("Address line 2"),
                city: z.string().optional().describe("City name."),
                company: z.string().optional().describe("Company name."),
                country: z
                  .string()
                  .optional()
                  .describe("Country code in ISO 3166-1 alpha-2 format."),
                first_name: z.string().optional().describe("First name."),
                last_name: z.string().optional().describe("Last name."),
                postcode: z.string().optional().describe("Postal code."),
                state: z
                  .string()
                  .optional()
                  .describe(
                    "ISO code or name of the state, province or district.",
                  ),
              })
              .describe("Shipping address.")
              .strict()
              .optional()
              .describe("Shipping address."),
            shipping_lines: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Item ID."),
                    instance_id: z
                      .string()
                      .optional()
                      .describe("Shipping instance ID."),
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
                    method_id: z
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
                      .describe("Shipping method ID."),
                    method_title: z
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
                      .describe("Shipping method name."),
                    taxes: z
                      .array(
                        z
                          .object({
                            id: z.number().optional().describe("Tax rate ID."),
                            total: z.string().optional().describe("Tax total."),
                          })
                          .strict(),
                      )
                      .optional()
                      .describe("Line taxes."),
                    total: z
                      .string()
                      .optional()
                      .describe("Line total (after discounts)."),
                    total_tax: z
                      .string()
                      .optional()
                      .describe("Line total tax (after discounts)."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Shipping lines data."),
            status: z
              .enum([
                "auto-draft",
                "pending",
                "processing",
                "on-hold",
                "completed",
                "cancelled",
                "refunded",
                "failed",
                "checkout-draft",
              ])
              .optional()
              .describe("Order status."),
            transaction_id: z
              .string()
              .optional()
              .describe("Unique transaction ID."),
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
                  .describe("Country code in ISO 3166-1 alpha-2 format."),
                email: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("Email address."),
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
              .describe("Billing address.")
              .strict()
              .optional()
              .describe("Billing address."),
            coupon_lines: z
              .array(
                z
                  .object({
                    code: z
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
                      .describe("Coupon code."),
                    discount: z.string().optional().describe("Discount total."),
                    discount_tax: z
                      .string()
                      .optional()
                      .describe("Discount total tax."),
                    discount_type: z
                      .string()
                      .optional()
                      .describe("Discount type."),
                    free_shipping: z
                      .boolean()
                      .optional()
                      .describe(
                        "Whether the coupon grants free shipping or not.",
                      ),
                    id: z.number().optional().describe("Item ID."),
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
                    nominal_amount: z
                      .number()
                      .optional()
                      .describe(
                        "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
                      ),
                  })
                  .strict(),
              )
              .optional()
              .describe("Coupons line data."),
            created_via: z
              .string()
              .optional()
              .describe("Shows where the order was created."),
            currency: z
              .enum([
                "AED",
                "AFN",
                "ALL",
                "AMD",
                "ANG",
                "AOA",
                "ARS",
                "AUD",
                "AWG",
                "AZN",
                "BAM",
                "BBD",
                "BDT",
                "BGN",
                "BHD",
                "BIF",
                "BMD",
                "BND",
                "BOB",
                "BRL",
                "BSD",
                "BTC",
                "BTN",
                "BWP",
                "BYR",
                "BYN",
                "BZD",
                "CAD",
                "CDF",
                "CHF",
                "CLP",
                "CNY",
                "COP",
                "CRC",
                "CUC",
                "CUP",
                "CVE",
                "CZK",
                "DJF",
                "DKK",
                "DOP",
                "DZD",
                "EGP",
                "ERN",
                "ETB",
                "EUR",
                "FJD",
                "FKP",
                "GBP",
                "GEL",
                "GGP",
                "GHS",
                "GIP",
                "GMD",
                "GNF",
                "GTQ",
                "GYD",
                "HKD",
                "HNL",
                "HRK",
                "HTG",
                "HUF",
                "IDR",
                "ILS",
                "IMP",
                "INR",
                "IQD",
                "IRR",
                "IRT",
                "ISK",
                "JEP",
                "JMD",
                "JOD",
                "JPY",
                "KES",
                "KGS",
                "KHR",
                "KMF",
                "KPW",
                "KRW",
                "KWD",
                "KYD",
                "KZT",
                "LAK",
                "LBP",
                "LKR",
                "LRD",
                "LSL",
                "LYD",
                "MAD",
                "MDL",
                "MGA",
                "MKD",
                "MMK",
                "MNT",
                "MOP",
                "MRU",
                "MUR",
                "MVR",
                "MWK",
                "MXN",
                "MYR",
                "MZN",
                "NAD",
                "NGN",
                "NIO",
                "NOK",
                "NPR",
                "NZD",
                "OMR",
                "PAB",
                "PEN",
                "PGK",
                "PHP",
                "PKR",
                "PLN",
                "PRB",
                "PYG",
                "QAR",
                "RON",
                "RSD",
                "RUB",
                "RWF",
                "SAR",
                "SBD",
                "SCR",
                "SDG",
                "SEK",
                "SGD",
                "SHP",
                "SLL",
                "SOS",
                "SRD",
                "SSP",
                "STN",
                "SYP",
                "SZL",
                "THB",
                "TJS",
                "TMT",
                "TND",
                "TOP",
                "TRY",
                "TTD",
                "TWD",
                "TZS",
                "UAH",
                "UGX",
                "USD",
                "UYU",
                "UZS",
                "VEF",
                "VES",
                "VND",
                "VUV",
                "WST",
                "XAF",
                "XCD",
                "XOF",
                "XPF",
                "YER",
                "ZAR",
                "ZMW",
              ])
              .optional()
              .describe("Currency the order was created with, in ISO format."),
            customer_id: z
              .number()
              .optional()
              .describe("User ID who owns the order. 0 for guests."),
            customer_note: z
              .string()
              .optional()
              .describe("Note left by customer during checkout."),
            fee_lines: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Item ID."),
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
                    name: z
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
                      .describe("Fee name."),
                    tax_class: z
                      .string()
                      .optional()
                      .describe("Tax class of fee."),
                    tax_status: z
                      .enum(["taxable", "none"])
                      .optional()
                      .describe("Tax status of fee."),
                    taxes: z
                      .array(
                        z
                          .object({
                            id: z.number().optional().describe("Tax rate ID."),
                            subtotal: z
                              .string()
                              .optional()
                              .describe("Tax subtotal."),
                            total: z.string().optional().describe("Tax total."),
                          })
                          .strict(),
                      )
                      .optional()
                      .describe("Line taxes."),
                    total: z
                      .string()
                      .optional()
                      .describe("Line total (after discounts)."),
                    total_tax: z
                      .string()
                      .optional()
                      .describe("Line total tax (after discounts)."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Fee lines data."),
            id: z.number(),
            line_items: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Item ID."),
                    image: z
                      .object({
                        id: z.number().optional().describe("Image ID."),
                        src: z.string().optional().describe("Image URL."),
                      })
                      .describe("Properties of the main product image.")
                      .strict()
                      .optional()
                      .describe("Properties of the main product image."),
                    meta_data: z
                      .array(
                        z
                          .object({
                            display_key: z
                              .string()
                              .optional()
                              .describe("Meta key for UI display."),
                            display_value: z
                              .string()
                              .optional()
                              .describe("Meta value for UI display."),
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
                    name: z
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
                      .describe("Product name."),
                    parent_name: z
                      .string()
                      .optional()
                      .describe(
                        "Parent product name if the product is a variation.",
                      ),
                    price: z.number().optional().describe("Product price."),
                    product_id: z
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
                      .describe("Product ID."),
                    quantity: z
                      .number()
                      .optional()
                      .describe("Quantity ordered."),
                    sku: z.string().optional().describe("Product SKU."),
                    subtotal: z
                      .string()
                      .optional()
                      .describe("Line subtotal (before discounts)."),
                    subtotal_tax: z
                      .string()
                      .optional()
                      .describe("Line subtotal tax (before discounts)."),
                    tax_class: z
                      .string()
                      .optional()
                      .describe("Tax class of product."),
                    taxes: z
                      .array(
                        z
                          .object({
                            id: z.number().optional().describe("Tax rate ID."),
                            subtotal: z
                              .string()
                              .optional()
                              .describe("Tax subtotal."),
                            total: z.string().optional().describe("Tax total."),
                          })
                          .strict(),
                      )
                      .optional()
                      .describe("Line taxes."),
                    total: z
                      .string()
                      .optional()
                      .describe("Line total (after discounts)."),
                    total_tax: z
                      .string()
                      .optional()
                      .describe("Line total tax (after discounts)."),
                    variation_id: z
                      .number()
                      .optional()
                      .describe("Variation ID, if applicable."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line items data."),
            manual_update: z
              .boolean()
              .optional()
              .describe(
                'Set the action as manual so that the order note registers as "added by user".',
              ),
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
            parent_id: z.number().optional().describe("Parent order ID."),
            payment_method: z
              .string()
              .optional()
              .describe("Payment method ID."),
            payment_method_title: z
              .string()
              .optional()
              .describe("Payment method title."),
            set_paid: z
              .boolean()
              .optional()
              .describe(
                "Define if the order is paid. It will set the status to processing and reduce stock items.",
              ),
            shipping: z
              .object({
                address_1: z.string().optional().describe("Address line 1"),
                address_2: z.string().optional().describe("Address line 2"),
                city: z.string().optional().describe("City name."),
                company: z.string().optional().describe("Company name."),
                country: z
                  .string()
                  .optional()
                  .describe("Country code in ISO 3166-1 alpha-2 format."),
                first_name: z.string().optional().describe("First name."),
                last_name: z.string().optional().describe("Last name."),
                postcode: z.string().optional().describe("Postal code."),
                state: z
                  .string()
                  .optional()
                  .describe(
                    "ISO code or name of the state, province or district.",
                  ),
              })
              .describe("Shipping address.")
              .strict()
              .optional()
              .describe("Shipping address."),
            shipping_lines: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Item ID."),
                    instance_id: z
                      .string()
                      .optional()
                      .describe("Shipping instance ID."),
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
                    method_id: z
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
                      .describe("Shipping method ID."),
                    method_title: z
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
                      .describe("Shipping method name."),
                    taxes: z
                      .array(
                        z
                          .object({
                            id: z.number().optional().describe("Tax rate ID."),
                            total: z.string().optional().describe("Tax total."),
                          })
                          .strict(),
                      )
                      .optional()
                      .describe("Line taxes."),
                    total: z
                      .string()
                      .optional()
                      .describe("Line total (after discounts)."),
                    total_tax: z
                      .string()
                      .optional()
                      .describe("Line total tax (after discounts)."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Shipping lines data."),
            status: z
              .enum([
                "auto-draft",
                "pending",
                "processing",
                "on-hold",
                "completed",
                "cancelled",
                "refunded",
                "failed",
                "checkout-draft",
              ])
              .optional()
              .describe("Order status."),
            transaction_id: z
              .string()
              .optional()
              .describe("Unique transaction ID."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type OrdersBatchUpdateBody = z.infer<typeof ordersBatchUpdateBodySchema>;

/**
 * POST /orders/batch response body.
 */
export const ordersBatchUpdateResponseSchema = z
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

export type OrdersBatchUpdateResponse = z.infer<
  typeof ordersBatchUpdateResponseSchema
>;

/**
 * POST /orders request body.
 */
export const ordersCreateBodySchema = z
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
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        email: z.string().nullable().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Billing address.")
      .strict()
      .optional()
      .describe("Billing address."),
    coupon_lines: z
      .array(
        z
          .object({
            code: z
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
              .describe("Coupon code."),
            discount: z.string().optional().describe("Discount total."),
            discount_tax: z.string().optional().describe("Discount total tax."),
            discount_type: z.string().optional().describe("Discount type."),
            free_shipping: z
              .boolean()
              .optional()
              .describe("Whether the coupon grants free shipping or not."),
            id: z.number().optional().describe("Item ID."),
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
            nominal_amount: z
              .number()
              .optional()
              .describe(
                "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
              ),
          })
          .strict(),
      )
      .optional()
      .describe("Coupons line data."),
    created_via: z
      .string()
      .optional()
      .describe("Shows where the order was created."),
    currency: z
      .enum([
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYR",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "IRT",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PRB",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "SSP",
        "STN",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VES",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
      ])
      .optional()
      .describe("Currency the order was created with, in ISO format."),
    customer_id: z
      .number()
      .optional()
      .describe("User ID who owns the order. 0 for guests."),
    customer_note: z
      .string()
      .optional()
      .describe("Note left by customer during checkout."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z
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
              .describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
    line_items: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            image: z
              .object({
                id: z.number().optional().describe("Image ID."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Properties of the main product image.")
              .strict()
              .optional()
              .describe("Properties of the main product image."),
            meta_data: z
              .array(
                z
                  .object({
                    display_key: z
                      .string()
                      .optional()
                      .describe("Meta key for UI display."),
                    display_value: z
                      .string()
                      .optional()
                      .describe("Meta value for UI display."),
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
            name: z
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
              .describe("Product name."),
            parent_name: z
              .string()
              .optional()
              .describe("Parent product name if the product is a variation."),
            price: z.number().optional().describe("Product price."),
            product_id: z
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
              .describe("Product ID."),
            quantity: z.number().optional().describe("Quantity ordered."),
            sku: z.string().optional().describe("Product SKU."),
            subtotal: z
              .string()
              .optional()
              .describe("Line subtotal (before discounts)."),
            subtotal_tax: z
              .string()
              .optional()
              .describe("Line subtotal tax (before discounts)."),
            tax_class: z.string().optional().describe("Tax class of product."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
            variation_id: z
              .number()
              .optional()
              .describe("Variation ID, if applicable."),
          })
          .strict(),
      )
      .optional()
      .describe("Line items data."),
    manual_update: z
      .boolean()
      .optional()
      .describe(
        'Set the action as manual so that the order note registers as "added by user".',
      ),
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
    parent_id: z.number().optional().describe("Parent order ID."),
    payment_method: z.string().optional().describe("Payment method ID."),
    payment_method_title: z
      .string()
      .optional()
      .describe("Payment method title."),
    set_paid: z
      .boolean()
      .optional()
      .describe(
        "Define if the order is paid. It will set the status to processing and reduce stock items.",
      ),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z
          .string()
          .optional()
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Shipping address.")
      .strict()
      .optional()
      .describe("Shipping address."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z
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
              .describe("Shipping method ID."),
            method_title: z
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
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
    status: z
      .enum([
        "auto-draft",
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ])
      .optional()
      .describe("Order status."),
    transaction_id: z.string().optional().describe("Unique transaction ID."),
  })
  .strict();

export type OrdersCreateBody = z.infer<typeof ordersCreateBodySchema>;

/**
 * POST /orders response body.
 */
export const ordersCreateResponseSchema = z
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
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        email: z.string().nullable().optional().describe("Email address."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        phone: z.string().optional().describe("Phone number."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Billing address.")
      .strict()
      .optional()
      .describe("Billing address."),
    cart_hash: z
      .string()
      .optional()
      .describe("MD5 hash of cart items to ensure orders are not modified."),
    cart_tax: z.string().optional().describe("Sum of line item taxes only."),
    coupon_lines: z
      .array(
        z
          .object({
            code: z.unknown().optional().describe("Coupon code."),
            discount: z.string().optional().describe("Discount total."),
            discount_tax: z.string().optional().describe("Discount total tax."),
            discount_type: z.string().optional().describe("Discount type."),
            free_shipping: z
              .boolean()
              .optional()
              .describe("Whether the coupon grants free shipping or not."),
            id: z.number().optional().describe("Item ID."),
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
            nominal_amount: z
              .number()
              .optional()
              .describe(
                "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
              ),
          })
          .strict(),
      )
      .optional()
      .describe("Coupons line data."),
    created_via: z
      .string()
      .optional()
      .describe("Shows where the order was created."),
    currency: z
      .enum([
        "AED",
        "AFN",
        "ALL",
        "AMD",
        "ANG",
        "AOA",
        "ARS",
        "AUD",
        "AWG",
        "AZN",
        "BAM",
        "BBD",
        "BDT",
        "BGN",
        "BHD",
        "BIF",
        "BMD",
        "BND",
        "BOB",
        "BRL",
        "BSD",
        "BTC",
        "BTN",
        "BWP",
        "BYR",
        "BYN",
        "BZD",
        "CAD",
        "CDF",
        "CHF",
        "CLP",
        "CNY",
        "COP",
        "CRC",
        "CUC",
        "CUP",
        "CVE",
        "CZK",
        "DJF",
        "DKK",
        "DOP",
        "DZD",
        "EGP",
        "ERN",
        "ETB",
        "EUR",
        "FJD",
        "FKP",
        "GBP",
        "GEL",
        "GGP",
        "GHS",
        "GIP",
        "GMD",
        "GNF",
        "GTQ",
        "GYD",
        "HKD",
        "HNL",
        "HRK",
        "HTG",
        "HUF",
        "IDR",
        "ILS",
        "IMP",
        "INR",
        "IQD",
        "IRR",
        "IRT",
        "ISK",
        "JEP",
        "JMD",
        "JOD",
        "JPY",
        "KES",
        "KGS",
        "KHR",
        "KMF",
        "KPW",
        "KRW",
        "KWD",
        "KYD",
        "KZT",
        "LAK",
        "LBP",
        "LKR",
        "LRD",
        "LSL",
        "LYD",
        "MAD",
        "MDL",
        "MGA",
        "MKD",
        "MMK",
        "MNT",
        "MOP",
        "MRU",
        "MUR",
        "MVR",
        "MWK",
        "MXN",
        "MYR",
        "MZN",
        "NAD",
        "NGN",
        "NIO",
        "NOK",
        "NPR",
        "NZD",
        "OMR",
        "PAB",
        "PEN",
        "PGK",
        "PHP",
        "PKR",
        "PLN",
        "PRB",
        "PYG",
        "QAR",
        "RON",
        "RSD",
        "RUB",
        "RWF",
        "SAR",
        "SBD",
        "SCR",
        "SDG",
        "SEK",
        "SGD",
        "SHP",
        "SLL",
        "SOS",
        "SRD",
        "SSP",
        "STN",
        "SYP",
        "SZL",
        "THB",
        "TJS",
        "TMT",
        "TND",
        "TOP",
        "TRY",
        "TTD",
        "TWD",
        "TZS",
        "UAH",
        "UGX",
        "USD",
        "UYU",
        "UZS",
        "VEF",
        "VES",
        "VND",
        "VUV",
        "WST",
        "XAF",
        "XCD",
        "XOF",
        "XPF",
        "YER",
        "ZAR",
        "ZMW",
      ])
      .optional()
      .describe("Currency the order was created with, in ISO format."),
    customer_id: z
      .number()
      .optional()
      .describe("User ID who owns the order. 0 for guests."),
    customer_ip_address: z
      .string()
      .optional()
      .describe("Customer's IP address."),
    customer_note: z
      .string()
      .optional()
      .describe("Note left by customer during checkout."),
    customer_user_agent: z
      .string()
      .optional()
      .describe("User agent of the customer."),
    date_completed: z
      .string()
      .optional()
      .describe("The date the order was completed, in the site's timezone."),
    date_completed_gmt: z
      .string()
      .optional()
      .describe("The date the order was completed, as GMT."),
    date_created: z
      .string()
      .optional()
      .describe("The date the order was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the order was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the order was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the order was last modified, as GMT."),
    date_paid: z
      .string()
      .optional()
      .describe("The date the order was paid, in the site's timezone."),
    date_paid_gmt: z
      .string()
      .optional()
      .describe("The date the order was paid, as GMT."),
    discount_tax: z
      .string()
      .optional()
      .describe("Total discount tax amount for the order."),
    discount_total: z
      .string()
      .optional()
      .describe("Total discount amount for the order."),
    fee_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
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
            name: z.unknown().optional().describe("Fee name."),
            tax_class: z.string().optional().describe("Tax class of fee."),
            tax_status: z
              .enum(["taxable", "none"])
              .optional()
              .describe("Tax status of fee."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Fee lines data."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    is_editable: z
      .boolean()
      .optional()
      .describe("Whether an order can be edited."),
    line_items: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            image: z
              .object({
                id: z.number().optional().describe("Image ID."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Properties of the main product image.")
              .strict()
              .optional()
              .describe("Properties of the main product image."),
            meta_data: z
              .array(
                z
                  .object({
                    display_key: z
                      .string()
                      .optional()
                      .describe("Meta key for UI display."),
                    display_value: z
                      .string()
                      .optional()
                      .describe("Meta value for UI display."),
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z.unknown().optional().describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            name: z.unknown().optional().describe("Product name."),
            parent_name: z
              .string()
              .optional()
              .describe("Parent product name if the product is a variation."),
            price: z.number().optional().describe("Product price."),
            product_id: z.unknown().optional().describe("Product ID."),
            quantity: z.number().optional().describe("Quantity ordered."),
            sku: z.string().optional().describe("Product SKU."),
            subtotal: z
              .string()
              .optional()
              .describe("Line subtotal (before discounts)."),
            subtotal_tax: z
              .string()
              .optional()
              .describe("Line subtotal tax (before discounts)."),
            tax_class: z.string().optional().describe("Tax class of product."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    subtotal: z.string().optional().describe("Tax subtotal."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
            variation_id: z
              .number()
              .optional()
              .describe("Variation ID, if applicable."),
          })
          .strict(),
      )
      .optional()
      .describe("Line items data."),
    manual_update: z
      .boolean()
      .optional()
      .describe(
        'Set the action as manual so that the order note registers as "added by user".',
      ),
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
    needs_payment: z
      .boolean()
      .optional()
      .describe(
        "Whether an order needs payment, based on status and order total.",
      ),
    needs_processing: z
      .boolean()
      .optional()
      .describe(
        "Whether an order needs processing before it can be completed.",
      ),
    number: z.string().optional().describe("Order number."),
    order_key: z.string().optional().describe("Order key."),
    parent_id: z.number().optional().describe("Parent order ID."),
    payment_method: z.string().optional().describe("Payment method ID."),
    payment_method_title: z
      .string()
      .optional()
      .describe("Payment method title."),
    payment_url: z.string().optional().describe("Order payment URL."),
    prices_include_tax: z
      .boolean()
      .optional()
      .describe("True the prices included tax during checkout."),
    refunds: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Refund ID."),
            reason: z.string().optional().describe("Refund reason."),
            total: z.string().optional().describe("Refund total."),
          })
          .strict(),
      )
      .optional()
      .describe("List of refunds."),
    set_paid: z
      .boolean()
      .optional()
      .describe(
        "Define if the order is paid. It will set the status to processing and reduce stock items.",
      ),
    shipping: z
      .object({
        address_1: z.string().optional().describe("Address line 1"),
        address_2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City name."),
        company: z.string().optional().describe("Company name."),
        country: z
          .string()
          .optional()
          .describe("Country code in ISO 3166-1 alpha-2 format."),
        first_name: z.string().optional().describe("First name."),
        last_name: z.string().optional().describe("Last name."),
        postcode: z.string().optional().describe("Postal code."),
        state: z
          .string()
          .optional()
          .describe("ISO code or name of the state, province or district."),
      })
      .describe("Shipping address.")
      .strict()
      .optional()
      .describe("Shipping address."),
    shipping_lines: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Item ID."),
            instance_id: z
              .string()
              .optional()
              .describe("Shipping instance ID."),
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
            method_id: z.unknown().optional().describe("Shipping method ID."),
            method_title: z
              .unknown()
              .optional()
              .describe("Shipping method name."),
            taxes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tax rate ID."),
                    total: z.string().optional().describe("Tax total."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Line taxes."),
            total: z
              .string()
              .optional()
              .describe("Line total (after discounts)."),
            total_tax: z
              .string()
              .optional()
              .describe("Line total tax (after discounts)."),
          })
          .strict(),
      )
      .optional()
      .describe("Shipping lines data."),
    shipping_tax: z
      .string()
      .optional()
      .describe("Total shipping tax amount for the order."),
    shipping_total: z
      .string()
      .optional()
      .describe("Total shipping amount for the order."),
    status: z
      .enum([
        "auto-draft",
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ])
      .optional()
      .describe("Order status."),
    tax_lines: z
      .array(
        z
          .object({
            compound: z
              .boolean()
              .optional()
              .describe("Show if is a compound tax rate."),
            id: z.number().optional().describe("Item ID."),
            label: z.string().optional().describe("Tax rate label."),
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
            rate_code: z.string().optional().describe("Tax rate code."),
            rate_id: z.number().optional().describe("Tax rate ID."),
            shipping_tax_total: z
              .string()
              .optional()
              .describe("Shipping tax total."),
            tax_total: z
              .string()
              .optional()
              .describe("Tax total (not including shipping taxes)."),
          })
          .strict(),
      )
      .optional()
      .describe("Tax lines data."),
    total: z.string().optional().describe("Grand total."),
    total_tax: z.string().optional().describe("Sum of all taxes."),
    transaction_id: z.string().optional().describe("Unique transaction ID."),
    version: z
      .string()
      .optional()
      .describe("Version of WooCommerce which last updated the order."),
  })
  .strict();

export type OrdersCreateResponse = z.infer<typeof ordersCreateResponseSchema>;

/**
 * GET /orders query parameters.
 */
export const ordersListQuerySchema = z
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
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    created_via: z
      .array(z.string())
      .optional()
      .describe(
        "Limit result set to orders created via specific sources (e.g. checkout, admin).",
      ),
    customer: z
      .number()
      .optional()
      .describe("Limit result set to orders assigned a specific customer."),
    dates_are_gmt: z
      .boolean()
      .optional()
      .describe(
        "Whether to consider GMT post dates when limiting response by published or modified date.",
      ),
    dp: z
      .number()
      .optional()
      .describe("Number of decimal points to use in each resource."),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    exclude_meta: z
      .array(z.string())
      .optional()
      .describe("Ensure meta_data excludes specific keys."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    include_meta: z
      .array(z.string())
      .optional()
      .describe("Limit meta_data to specific keys."),
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
    order_item_display_meta: z
      .boolean()
      .optional()
      .describe("Only show meta which is meant to be displayed for an order."),
    orderby: z
      .enum(["date", "id", "include", "title", "slug", "modified"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .array(z.number())
      .optional()
      .describe("Limit result set to those of particular parent IDs."),
    parent_exclude: z
      .array(z.number())
      .optional()
      .describe(
        "Limit result set to all items except those of a particular parent ID.",
      ),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .number()
      .optional()
      .describe("Limit result set to orders assigned a specific product."),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    status: z
      .array(
        z.enum([
          "any",
          "trash",
          "auto-draft",
          "pending",
          "processing",
          "on-hold",
          "completed",
          "cancelled",
          "refunded",
          "failed",
          "checkout-draft",
        ]),
      )
      .optional()
      .describe("Limit result set to orders which have specific statuses."),
  })
  .strict();

export type OrdersListQuery = z.infer<typeof ordersListQuerySchema>;

/**
 * GET /orders response body.
 */
export const ordersListResponseSchema = z.array(
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
            .describe("Country code in ISO 3166-1 alpha-2 format."),
          email: z.string().nullable().optional().describe("Email address."),
          first_name: z.string().optional().describe("First name."),
          last_name: z.string().optional().describe("Last name."),
          phone: z.string().optional().describe("Phone number."),
          postcode: z.string().optional().describe("Postal code."),
          state: z
            .string()
            .optional()
            .describe("ISO code or name of the state, province or district."),
        })
        .describe("Billing address.")
        .strict()
        .optional()
        .describe("Billing address."),
      cart_hash: z
        .string()
        .optional()
        .describe("MD5 hash of cart items to ensure orders are not modified."),
      cart_tax: z.string().optional().describe("Sum of line item taxes only."),
      coupon_lines: z
        .array(
          z
            .object({
              code: z.unknown().optional().describe("Coupon code."),
              discount: z.string().optional().describe("Discount total."),
              discount_tax: z
                .string()
                .optional()
                .describe("Discount total tax."),
              discount_type: z.string().optional().describe("Discount type."),
              free_shipping: z
                .boolean()
                .optional()
                .describe("Whether the coupon grants free shipping or not."),
              id: z.number().optional().describe("Item ID."),
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
              nominal_amount: z
                .number()
                .optional()
                .describe(
                  "Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type).",
                ),
            })
            .strict(),
        )
        .optional()
        .describe("Coupons line data."),
      created_via: z
        .string()
        .optional()
        .describe("Shows where the order was created."),
      currency: z
        .enum([
          "AED",
          "AFN",
          "ALL",
          "AMD",
          "ANG",
          "AOA",
          "ARS",
          "AUD",
          "AWG",
          "AZN",
          "BAM",
          "BBD",
          "BDT",
          "BGN",
          "BHD",
          "BIF",
          "BMD",
          "BND",
          "BOB",
          "BRL",
          "BSD",
          "BTC",
          "BTN",
          "BWP",
          "BYR",
          "BYN",
          "BZD",
          "CAD",
          "CDF",
          "CHF",
          "CLP",
          "CNY",
          "COP",
          "CRC",
          "CUC",
          "CUP",
          "CVE",
          "CZK",
          "DJF",
          "DKK",
          "DOP",
          "DZD",
          "EGP",
          "ERN",
          "ETB",
          "EUR",
          "FJD",
          "FKP",
          "GBP",
          "GEL",
          "GGP",
          "GHS",
          "GIP",
          "GMD",
          "GNF",
          "GTQ",
          "GYD",
          "HKD",
          "HNL",
          "HRK",
          "HTG",
          "HUF",
          "IDR",
          "ILS",
          "IMP",
          "INR",
          "IQD",
          "IRR",
          "IRT",
          "ISK",
          "JEP",
          "JMD",
          "JOD",
          "JPY",
          "KES",
          "KGS",
          "KHR",
          "KMF",
          "KPW",
          "KRW",
          "KWD",
          "KYD",
          "KZT",
          "LAK",
          "LBP",
          "LKR",
          "LRD",
          "LSL",
          "LYD",
          "MAD",
          "MDL",
          "MGA",
          "MKD",
          "MMK",
          "MNT",
          "MOP",
          "MRU",
          "MUR",
          "MVR",
          "MWK",
          "MXN",
          "MYR",
          "MZN",
          "NAD",
          "NGN",
          "NIO",
          "NOK",
          "NPR",
          "NZD",
          "OMR",
          "PAB",
          "PEN",
          "PGK",
          "PHP",
          "PKR",
          "PLN",
          "PRB",
          "PYG",
          "QAR",
          "RON",
          "RSD",
          "RUB",
          "RWF",
          "SAR",
          "SBD",
          "SCR",
          "SDG",
          "SEK",
          "SGD",
          "SHP",
          "SLL",
          "SOS",
          "SRD",
          "SSP",
          "STN",
          "SYP",
          "SZL",
          "THB",
          "TJS",
          "TMT",
          "TND",
          "TOP",
          "TRY",
          "TTD",
          "TWD",
          "TZS",
          "UAH",
          "UGX",
          "USD",
          "UYU",
          "UZS",
          "VEF",
          "VES",
          "VND",
          "VUV",
          "WST",
          "XAF",
          "XCD",
          "XOF",
          "XPF",
          "YER",
          "ZAR",
          "ZMW",
        ])
        .optional()
        .describe("Currency the order was created with, in ISO format."),
      customer_id: z
        .number()
        .optional()
        .describe("User ID who owns the order. 0 for guests."),
      customer_ip_address: z
        .string()
        .optional()
        .describe("Customer's IP address."),
      customer_note: z
        .string()
        .optional()
        .describe("Note left by customer during checkout."),
      customer_user_agent: z
        .string()
        .optional()
        .describe("User agent of the customer."),
      date_completed: z
        .string()
        .optional()
        .describe("The date the order was completed, in the site's timezone."),
      date_completed_gmt: z
        .string()
        .optional()
        .describe("The date the order was completed, as GMT."),
      date_created: z
        .string()
        .optional()
        .describe("The date the order was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the order was created, as GMT."),
      date_modified: z
        .string()
        .optional()
        .describe(
          "The date the order was last modified, in the site's timezone.",
        ),
      date_modified_gmt: z
        .string()
        .optional()
        .describe("The date the order was last modified, as GMT."),
      date_paid: z
        .string()
        .optional()
        .describe("The date the order was paid, in the site's timezone."),
      date_paid_gmt: z
        .string()
        .optional()
        .describe("The date the order was paid, as GMT."),
      discount_tax: z
        .string()
        .optional()
        .describe("Total discount tax amount for the order."),
      discount_total: z
        .string()
        .optional()
        .describe("Total discount amount for the order."),
      fee_lines: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Item ID."),
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
              name: z.unknown().optional().describe("Fee name."),
              tax_class: z.string().optional().describe("Tax class of fee."),
              tax_status: z
                .enum(["taxable", "none"])
                .optional()
                .describe("Tax status of fee."),
              taxes: z
                .array(
                  z
                    .object({
                      id: z.number().optional().describe("Tax rate ID."),
                      subtotal: z.string().optional().describe("Tax subtotal."),
                      total: z.string().optional().describe("Tax total."),
                    })
                    .strict(),
                )
                .optional()
                .describe("Line taxes."),
              total: z
                .string()
                .optional()
                .describe("Line total (after discounts)."),
              total_tax: z
                .string()
                .optional()
                .describe("Line total tax (after discounts)."),
            })
            .strict(),
        )
        .optional()
        .describe("Fee lines data."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      is_editable: z
        .boolean()
        .optional()
        .describe("Whether an order can be edited."),
      line_items: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Item ID."),
              image: z
                .object({
                  id: z.number().optional().describe("Image ID."),
                  src: z.string().optional().describe("Image URL."),
                })
                .describe("Properties of the main product image.")
                .strict()
                .optional()
                .describe("Properties of the main product image."),
              meta_data: z
                .array(
                  z
                    .object({
                      display_key: z
                        .string()
                        .optional()
                        .describe("Meta key for UI display."),
                      display_value: z
                        .string()
                        .optional()
                        .describe("Meta value for UI display."),
                      id: z.number().optional().describe("Meta ID."),
                      key: z.string().optional().describe("Meta key."),
                      value: z.unknown().optional().describe("Meta value."),
                    })
                    .strict(),
                )
                .optional()
                .describe("Meta data."),
              name: z.unknown().optional().describe("Product name."),
              parent_name: z
                .string()
                .optional()
                .describe("Parent product name if the product is a variation."),
              price: z.number().optional().describe("Product price."),
              product_id: z.unknown().optional().describe("Product ID."),
              quantity: z.number().optional().describe("Quantity ordered."),
              sku: z.string().optional().describe("Product SKU."),
              subtotal: z
                .string()
                .optional()
                .describe("Line subtotal (before discounts)."),
              subtotal_tax: z
                .string()
                .optional()
                .describe("Line subtotal tax (before discounts)."),
              tax_class: z
                .string()
                .optional()
                .describe("Tax class of product."),
              taxes: z
                .array(
                  z
                    .object({
                      id: z.number().optional().describe("Tax rate ID."),
                      subtotal: z.string().optional().describe("Tax subtotal."),
                      total: z.string().optional().describe("Tax total."),
                    })
                    .strict(),
                )
                .optional()
                .describe("Line taxes."),
              total: z
                .string()
                .optional()
                .describe("Line total (after discounts)."),
              total_tax: z
                .string()
                .optional()
                .describe("Line total tax (after discounts)."),
              variation_id: z
                .number()
                .optional()
                .describe("Variation ID, if applicable."),
            })
            .strict(),
        )
        .optional()
        .describe("Line items data."),
      manual_update: z
        .boolean()
        .optional()
        .describe(
          'Set the action as manual so that the order note registers as "added by user".',
        ),
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
      needs_payment: z
        .boolean()
        .optional()
        .describe(
          "Whether an order needs payment, based on status and order total.",
        ),
      needs_processing: z
        .boolean()
        .optional()
        .describe(
          "Whether an order needs processing before it can be completed.",
        ),
      number: z.string().optional().describe("Order number."),
      order_key: z.string().optional().describe("Order key."),
      parent_id: z.number().optional().describe("Parent order ID."),
      payment_method: z.string().optional().describe("Payment method ID."),
      payment_method_title: z
        .string()
        .optional()
        .describe("Payment method title."),
      payment_url: z.string().optional().describe("Order payment URL."),
      prices_include_tax: z
        .boolean()
        .optional()
        .describe("True the prices included tax during checkout."),
      refunds: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Refund ID."),
              reason: z.string().optional().describe("Refund reason."),
              total: z.string().optional().describe("Refund total."),
            })
            .strict(),
        )
        .optional()
        .describe("List of refunds."),
      set_paid: z
        .boolean()
        .optional()
        .describe(
          "Define if the order is paid. It will set the status to processing and reduce stock items.",
        ),
      shipping: z
        .object({
          address_1: z.string().optional().describe("Address line 1"),
          address_2: z.string().optional().describe("Address line 2"),
          city: z.string().optional().describe("City name."),
          company: z.string().optional().describe("Company name."),
          country: z
            .string()
            .optional()
            .describe("Country code in ISO 3166-1 alpha-2 format."),
          first_name: z.string().optional().describe("First name."),
          last_name: z.string().optional().describe("Last name."),
          postcode: z.string().optional().describe("Postal code."),
          state: z
            .string()
            .optional()
            .describe("ISO code or name of the state, province or district."),
        })
        .describe("Shipping address.")
        .strict()
        .optional()
        .describe("Shipping address."),
      shipping_lines: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Item ID."),
              instance_id: z
                .string()
                .optional()
                .describe("Shipping instance ID."),
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
              method_id: z.unknown().optional().describe("Shipping method ID."),
              method_title: z
                .unknown()
                .optional()
                .describe("Shipping method name."),
              taxes: z
                .array(
                  z
                    .object({
                      id: z.number().optional().describe("Tax rate ID."),
                      total: z.string().optional().describe("Tax total."),
                    })
                    .strict(),
                )
                .optional()
                .describe("Line taxes."),
              total: z
                .string()
                .optional()
                .describe("Line total (after discounts)."),
              total_tax: z
                .string()
                .optional()
                .describe("Line total tax (after discounts)."),
            })
            .strict(),
        )
        .optional()
        .describe("Shipping lines data."),
      shipping_tax: z
        .string()
        .optional()
        .describe("Total shipping tax amount for the order."),
      shipping_total: z
        .string()
        .optional()
        .describe("Total shipping amount for the order."),
      status: z
        .enum([
          "auto-draft",
          "pending",
          "processing",
          "on-hold",
          "completed",
          "cancelled",
          "refunded",
          "failed",
          "checkout-draft",
        ])
        .optional()
        .describe("Order status."),
      tax_lines: z
        .array(
          z
            .object({
              compound: z
                .boolean()
                .optional()
                .describe("Show if is a compound tax rate."),
              id: z.number().optional().describe("Item ID."),
              label: z.string().optional().describe("Tax rate label."),
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
              rate_code: z.string().optional().describe("Tax rate code."),
              rate_id: z.number().optional().describe("Tax rate ID."),
              shipping_tax_total: z
                .string()
                .optional()
                .describe("Shipping tax total."),
              tax_total: z
                .string()
                .optional()
                .describe("Tax total (not including shipping taxes)."),
            })
            .strict(),
        )
        .optional()
        .describe("Tax lines data."),
      total: z.string().optional().describe("Grand total."),
      total_tax: z.string().optional().describe("Sum of all taxes."),
      transaction_id: z.string().optional().describe("Unique transaction ID."),
      version: z
        .string()
        .optional()
        .describe("Version of WooCommerce which last updated the order."),
    })
    .strict(),
);

export type OrdersListResponse = z.infer<typeof ordersListResponseSchema>;

/**
 * GET /orders/statuses response body.
 */
export const ordersStatusesListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Order status name."),
      slug: z.string().optional().describe("Order status slug."),
    })
    .strict(),
);

export type OrdersStatusesListResponse = z.infer<
  typeof ordersStatusesListResponseSchema
>;
