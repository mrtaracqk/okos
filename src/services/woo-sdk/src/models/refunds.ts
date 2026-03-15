/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * GET /refunds query parameters.
 */
export type RefundsListQuery = {
  after?: string;
  before?: string;
  context?: "view" | "edit";
  dates_are_gmt?: boolean;
  dp?: number;
  exclude?: Array<number>;
  exclude_meta?: Array<string>;
  include?: Array<number>;
  include_meta?: Array<string>;
  modified_after?: string;
  modified_before?: string;
  offset?: number;
  order?: "asc" | "desc";
  order_item_display_meta?: boolean;
  orderby?: "date" | "id" | "include" | "title" | "slug" | "modified";
  page?: number;
  parent?: Array<number>;
  parent_exclude?: Array<number>;
  per_page?: number;
  search?: string;
};

/**
 * GET /refunds response body.
 */
export type RefundsListResponse = Array<{
  amount?: string;
  api_refund?: boolean;
  api_restock?: boolean;
  date_created?: string;
  date_created_gmt?: string;
  fee_lines?: Array<{
    id?: number;
    meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
    name?: unknown;
    tax_class?: string;
    tax_status?: "taxable" | "none";
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  id?: number;
  line_items?: Array<{
    id?: number;
    meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
    name?: unknown;
    price?: number;
    product_id?: unknown;
    quantity?: number;
    refund_total?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{
      id?: number;
      refund_total?: number;
      subtotal?: string;
      total?: string;
    }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  parent_id?: number;
  reason?: string;
  refunded_by?: number;
  refunded_payment?: boolean;
  shipping_lines?: Array<{
    id?: number;
    instance_id?: string;
    meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
    method_id?: unknown;
    method_title?: unknown;
    taxes?: Array<{ id?: number; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  tax_lines?: Array<{
    compound?: boolean;
    id?: number;
    label?: string;
    meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
    rate_code?: string;
    rate_id?: number;
    shipping_tax_total?: string;
    tax_total?: string;
  }>;
}>;
