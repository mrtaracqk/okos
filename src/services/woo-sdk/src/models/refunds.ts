/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * GET /refunds query parameters.
 */
export const refundsListQuerySchema = z
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

export type RefundsListQuery = z.infer<typeof refundsListQuerySchema>;

/**
 * GET /refunds response body.
 */
export const refundsListResponseSchema = z.array(
  z
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
      date_created: z
        .string()
        .optional()
        .describe(
          "The date the order refund was created, in the site's timezone.",
        ),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the order refund was created, as GMT."),
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
      line_items: z
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
              name: z.unknown().optional().describe("Product name."),
              price: z.number().optional().describe("Product price."),
              product_id: z.unknown().optional().describe("Product ID."),
              quantity: z.number().optional().describe("Quantity ordered."),
              refund_total: z
                .number()
                .optional()
                .describe(
                  "Amount that will be refunded for this line item (excluding taxes).",
                ),
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
                      refund_total: z
                        .number()
                        .optional()
                        .describe("Amount that will be refunded for this tax."),
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
      parent_id: z.number().optional().describe("Parent order ID."),
      reason: z.string().optional().describe("Reason for refund."),
      refunded_by: z
        .number()
        .optional()
        .describe("User ID of user who created the refund."),
      refunded_payment: z
        .boolean()
        .optional()
        .describe("If the payment was refunded via the API."),
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
    })
    .strict(),
);

export type RefundsListResponse = z.infer<typeof refundsListResponseSchema>;
