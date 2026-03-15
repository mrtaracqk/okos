/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * GET /reports/coupons/totals query parameters.
 */
export type ReportsCouponsTotalsListQuery = { context?: "view" };

/**
 * GET /reports/coupons/totals response body.
 */
export type ReportsCouponsTotalsListResponse = Array<{
  name?: string;
  slug?: string;
  total?: string;
}>;

/**
 * GET /reports/customers/totals query parameters.
 */
export type ReportsCustomersTotalsListQuery = { context?: "view" };

/**
 * GET /reports/customers/totals response body.
 */
export type ReportsCustomersTotalsListResponse = Array<{
  name?: string;
  slug?: string;
  total?: string;
}>;

/**
 * GET /reports query parameters.
 */
export type ReportsListQuery = { context?: "view" };

/**
 * GET /reports response body.
 */
export type ReportsListResponse = Array<{
  description?: string;
  slug?: string;
}>;

/**
 * GET /reports/orders/totals query parameters.
 */
export type ReportsOrdersTotalsListQuery = { context?: "view" };

/**
 * GET /reports/orders/totals response body.
 */
export type ReportsOrdersTotalsListResponse = Array<{
  name?: string;
  slug?: string;
  total?: string;
}>;

/**
 * GET /reports/products/totals query parameters.
 */
export type ReportsProductsTotalsListQuery = { context?: "view" };

/**
 * GET /reports/products/totals response body.
 */
export type ReportsProductsTotalsListResponse = Array<{
  name?: string;
  slug?: string;
  total?: string;
}>;

/**
 * GET /reports/reviews/totals query parameters.
 */
export type ReportsReviewsTotalsListQuery = { context?: "view" };

/**
 * GET /reports/reviews/totals response body.
 */
export type ReportsReviewsTotalsListResponse = Array<{
  name?: string;
  slug?: string;
  total?: string;
}>;

/**
 * GET /reports/sales query parameters.
 */
export type ReportsSalesListQuery = {
  context?: "view";
  date_max?: string;
  date_min?: string;
  period?: "week" | "month" | "last_month" | "year";
};

/**
 * GET /reports/sales response body.
 */
export type ReportsSalesListResponse = Array<{
  average_sales?: string;
  net_sales?: string;
  total_discount?: number;
  total_items?: number;
  total_orders?: number;
  total_refunds?: number;
  total_sales?: string;
  total_shipping?: string;
  total_tax?: string;
  totals?: Array<Array<unknown>>;
  totals_grouped_by?: string;
}>;

/**
 * GET /reports/top_sellers query parameters.
 */
export type ReportsTopSellersListQuery = {
  context?: "view";
  date_max?: string;
  date_min?: string;
  period?: "week" | "month" | "last_month" | "year";
};

/**
 * GET /reports/top_sellers response body.
 */
export type ReportsTopSellersListResponse = Array<{
  name?: string;
  product_id?: number;
  quantity?: number;
}>;
