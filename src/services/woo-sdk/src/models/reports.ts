/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * GET /reports/coupons/totals query parameters.
 */
export const reportsCouponsTotalsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ReportsCouponsTotalsListQuery = z.infer<
  typeof reportsCouponsTotalsListQuerySchema
>;

/**
 * GET /reports/coupons/totals response body.
 */
export const reportsCouponsTotalsListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Coupon type name."),
      slug: z
        .string()
        .optional()
        .describe("An alphanumeric identifier for the resource."),
      total: z.string().optional().describe("Amount of coupons."),
    })
    .strict(),
);

export type ReportsCouponsTotalsListResponse = z.infer<
  typeof reportsCouponsTotalsListResponseSchema
>;

/**
 * GET /reports/customers/totals query parameters.
 */
export const reportsCustomersTotalsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ReportsCustomersTotalsListQuery = z.infer<
  typeof reportsCustomersTotalsListQuerySchema
>;

/**
 * GET /reports/customers/totals response body.
 */
export const reportsCustomersTotalsListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Customer type name."),
      slug: z
        .string()
        .optional()
        .describe("An alphanumeric identifier for the resource."),
      total: z.string().optional().describe("Amount of customers."),
    })
    .strict(),
);

export type ReportsCustomersTotalsListResponse = z.infer<
  typeof reportsCustomersTotalsListResponseSchema
>;

/**
 * GET /reports query parameters.
 */
export const reportsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ReportsListQuery = z.infer<typeof reportsListQuerySchema>;

/**
 * GET /reports response body.
 */
export const reportsListResponseSchema = z.array(
  z
    .object({
      description: z
        .string()
        .optional()
        .describe("A human-readable description of the resource."),
      slug: z
        .string()
        .optional()
        .describe("An alphanumeric identifier for the resource."),
    })
    .strict(),
);

export type ReportsListResponse = z.infer<typeof reportsListResponseSchema>;

/**
 * GET /reports/orders/totals query parameters.
 */
export const reportsOrdersTotalsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ReportsOrdersTotalsListQuery = z.infer<
  typeof reportsOrdersTotalsListQuerySchema
>;

/**
 * GET /reports/orders/totals response body.
 */
export const reportsOrdersTotalsListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Order status name."),
      slug: z
        .string()
        .optional()
        .describe("An alphanumeric identifier for the resource."),
      total: z.string().optional().describe("Amount of orders."),
    })
    .strict(),
);

export type ReportsOrdersTotalsListResponse = z.infer<
  typeof reportsOrdersTotalsListResponseSchema
>;

/**
 * GET /reports/products/totals query parameters.
 */
export const reportsProductsTotalsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ReportsProductsTotalsListQuery = z.infer<
  typeof reportsProductsTotalsListQuerySchema
>;

/**
 * GET /reports/products/totals response body.
 */
export const reportsProductsTotalsListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Product type name."),
      slug: z
        .string()
        .optional()
        .describe("An alphanumeric identifier for the resource."),
      total: z.string().optional().describe("Amount of products."),
    })
    .strict(),
);

export type ReportsProductsTotalsListResponse = z.infer<
  typeof reportsProductsTotalsListResponseSchema
>;

/**
 * GET /reports/reviews/totals query parameters.
 */
export const reportsReviewsTotalsListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ReportsReviewsTotalsListQuery = z.infer<
  typeof reportsReviewsTotalsListQuerySchema
>;

/**
 * GET /reports/reviews/totals response body.
 */
export const reportsReviewsTotalsListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Review type name."),
      slug: z
        .string()
        .optional()
        .describe("An alphanumeric identifier for the resource."),
      total: z.string().optional().describe("Amount of reviews."),
    })
    .strict(),
);

export type ReportsReviewsTotalsListResponse = z.infer<
  typeof reportsReviewsTotalsListResponseSchema
>;

/**
 * GET /reports/sales query parameters.
 */
export const reportsSalesListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    date_max: z
      .string()
      .optional()
      .describe(
        "Return sales for a specific end date, the date need to be in the YYYY-MM-DD format.",
      ),
    date_min: z
      .string()
      .optional()
      .describe(
        "Return sales for a specific start date, the date need to be in the YYYY-MM-DD format.",
      ),
    period: z
      .enum(["week", "month", "last_month", "year"])
      .optional()
      .describe("Report period."),
  })
  .strict();

export type ReportsSalesListQuery = z.infer<typeof reportsSalesListQuerySchema>;

/**
 * GET /reports/sales response body.
 */
export const reportsSalesListResponseSchema = z.array(
  z
    .object({
      average_sales: z.string().optional().describe("Average net daily sales."),
      net_sales: z.string().optional().describe("Net sales in the period."),
      total_discount: z.number().optional().describe("Total of coupons used."),
      total_items: z.number().optional().describe("Total of items purchased."),
      total_orders: z.number().optional().describe("Total of orders placed."),
      total_refunds: z
        .number()
        .optional()
        .describe("Total of refunded orders."),
      total_sales: z.string().optional().describe("Gross sales in the period."),
      total_shipping: z
        .string()
        .optional()
        .describe("Total charged for shipping."),
      total_tax: z.string().optional().describe("Total charged for taxes."),
      totals: z.array(z.array(z.unknown())).optional().describe("Totals."),
      totals_grouped_by: z.string().optional().describe("Group type."),
    })
    .strict(),
);

export type ReportsSalesListResponse = z.infer<
  typeof reportsSalesListResponseSchema
>;

/**
 * GET /reports/top_sellers query parameters.
 */
export const reportsTopSellersListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    date_max: z
      .string()
      .optional()
      .describe(
        "Return sales for a specific end date, the date need to be in the YYYY-MM-DD format.",
      ),
    date_min: z
      .string()
      .optional()
      .describe(
        "Return sales for a specific start date, the date need to be in the YYYY-MM-DD format.",
      ),
    period: z
      .enum(["week", "month", "last_month", "year"])
      .optional()
      .describe("Report period."),
  })
  .strict();

export type ReportsTopSellersListQuery = z.infer<
  typeof reportsTopSellersListQuerySchema
>;

/**
 * GET /reports/top_sellers response body.
 */
export const reportsTopSellersListResponseSchema = z.array(
  z
    .object({
      name: z.string().optional().describe("Product name."),
      product_id: z.number().optional().describe("Product ID."),
      quantity: z.number().optional().describe("Total number of purchases."),
    })
    .strict(),
);

export type ReportsTopSellersListResponse = z.infer<
  typeof reportsTopSellersListResponseSchema
>;
