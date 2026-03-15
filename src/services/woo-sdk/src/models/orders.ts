/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * DELETE /orders/{id} path parameters.
 */
export type OrderDeletePathParams = { id: number };

/**
 * DELETE /orders/{id} query parameters.
 */
export type OrderDeleteQuery = { force?: boolean };

/**
 * DELETE /orders/{id} response body.
 */
export type OrderDeleteResponse = unknown;

/**
 * GET /orders/{id}/actions/email_templates path parameters.
 */
export type OrderEmailTemplatesPathParams = { id: number };

/**
 * GET /orders/{id}/actions/email_templates response body.
 */
export type OrderEmailTemplatesResponse = unknown;

/**
 * GET /orders/{id} path parameters.
 */
export type OrderGetPathParams = { id: number };

/**
 * GET /orders/{id} query parameters.
 */
export type OrderGetQuery = { context?: "view" | "edit" };

/**
 * GET /orders/{id} response body.
 */
export type OrderGetResponse = unknown;

/**
 * DELETE /orders/{order_id}/notes/{id} path parameters.
 */
export type OrderNoteDeletePathParams = { id: number; order_id: number };

/**
 * DELETE /orders/{order_id}/notes/{id} query parameters.
 */
export type OrderNoteDeleteQuery = { force?: boolean };

/**
 * DELETE /orders/{order_id}/notes/{id} response body.
 */
export type OrderNoteDeleteResponse = unknown;

/**
 * GET /orders/{order_id}/notes/{id} path parameters.
 */
export type OrderNoteGetPathParams = { id: number; order_id: number };

/**
 * GET /orders/{order_id}/notes/{id} query parameters.
 */
export type OrderNoteGetQuery = { context?: "view" | "edit" };

/**
 * GET /orders/{order_id}/notes/{id} response body.
 */
export type OrderNoteGetResponse = unknown;

/**
 * POST /orders/{order_id}/notes path parameters.
 */
export type OrderNotesCreatePathParams = { order_id: number };

/**
 * POST /orders/{order_id}/notes request body.
 */
export type OrderNotesCreateBody = {
  added_by_user?: boolean;
  customer_note?: boolean;
  note: string;
};

/**
 * POST /orders/{order_id}/notes response body.
 */
export type OrderNotesCreateResponse = unknown;

/**
 * GET /orders/{order_id}/notes path parameters.
 */
export type OrderNotesListPathParams = { order_id: number };

/**
 * GET /orders/{order_id}/notes query parameters.
 */
export type OrderNotesListQuery = {
  context?: "view" | "edit";
  type?: "any" | "customer" | "internal";
};

/**
 * GET /orders/{order_id}/notes response body.
 */
export type OrderNotesListResponse = Array<unknown>;

/**
 * POST /orders/{id} path parameters.
 */
export type OrderPostCustomPathParams = { id: number };

/**
 * POST /orders/{id} request body.
 */
export type OrderPostCustomBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  coupon_lines?: Array<{
    code?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    discount?: string;
    discount_tax?: string;
    discount_type?: string;
    free_shipping?: boolean;
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    nominal_amount?: number;
  }>;
  created_via?: string;
  currency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYR"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "IRT"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRU"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PRB"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "STN"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VES"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XCD"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMW";
  customer_id?: number;
  customer_note?: string;
  fee_lines?: Array<{
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    tax_class?: string;
    tax_status?: "taxable" | "none";
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  line_items?: Array<{
    id?: number;
    image?: { id?: number; src?: string };
    meta_data?: Array<{
      display_key?: string;
      display_value?: string;
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    parent_name?: string;
    price?: number;
    product_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    quantity?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  manual_update?: boolean;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  parent_id?: number;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    postcode?: string;
    state?: string;
  };
  shipping_lines?: Array<{
    id?: number;
    instance_id?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    method_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    method_title?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    taxes?: Array<{ id?: number; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  status?:
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft";
  transaction_id?: string;
};

/**
 * POST /orders/{id} response body.
 */
export type OrderPostCustomResponse = unknown;

/**
 * PUT /orders/batch request body.
 */
export type OrderPutBatchCustomBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  coupon_lines?: Array<{
    code?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    discount?: string;
    discount_tax?: string;
    discount_type?: string;
    free_shipping?: boolean;
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    nominal_amount?: number;
  }>;
  created_via?: string;
  currency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYR"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "IRT"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRU"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PRB"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "STN"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VES"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XCD"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMW";
  customer_id?: number;
  customer_note?: string;
  fee_lines?: Array<{
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    tax_class?: string;
    tax_status?: "taxable" | "none";
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  line_items?: Array<{
    id?: number;
    image?: { id?: number; src?: string };
    meta_data?: Array<{
      display_key?: string;
      display_value?: string;
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    parent_name?: string;
    price?: number;
    product_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    quantity?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  manual_update?: boolean;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  parent_id?: number;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    postcode?: string;
    state?: string;
  };
  shipping_lines?: Array<{
    id?: number;
    instance_id?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    method_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    method_title?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    taxes?: Array<{ id?: number; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  status?:
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft";
  transaction_id?: string;
};

/**
 * PUT /orders/batch response body.
 */
export type OrderPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /orders/{id}/receipt path parameters.
 */
export type OrderReceiptCreatePathParams = { id: number };

/**
 * POST /orders/{id}/receipt request body.
 */
export type OrderReceiptCreateBody = {
  expiration_date?: string;
  expiration_days?: number;
  force_new?: boolean;
};

/**
 * POST /orders/{id}/receipt response body.
 */
export type OrderReceiptCreateResponse = unknown;

/**
 * GET /orders/{id}/receipt path parameters.
 */
export type OrderReceiptListPathParams = { id: number };

/**
 * GET /orders/{id}/receipt response body.
 */
export type OrderReceiptListResponse = Array<unknown>;

/**
 * DELETE /orders/{order_id}/refunds/{id} path parameters.
 */
export type OrderRefundDeletePathParams = { id: number; order_id: number };

/**
 * DELETE /orders/{order_id}/refunds/{id} query parameters.
 */
export type OrderRefundDeleteQuery = { force?: boolean };

/**
 * DELETE /orders/{order_id}/refunds/{id} response body.
 */
export type OrderRefundDeleteResponse = unknown;

/**
 * GET /orders/{order_id}/refunds/{id} path parameters.
 */
export type OrderRefundGetPathParams = { id: number; order_id: number };

/**
 * GET /orders/{order_id}/refunds/{id} query parameters.
 */
export type OrderRefundGetQuery = { context?: "view" | "edit" };

/**
 * GET /orders/{order_id}/refunds/{id} response body.
 */
export type OrderRefundGetResponse = unknown;

/**
 * POST /orders/{order_id}/refunds path parameters.
 */
export type OrderRefundsCreatePathParams = { order_id: number };

/**
 * POST /orders/{order_id}/refunds request body.
 */
export type OrderRefundsCreateBody = {
  amount?: string;
  api_refund?: boolean;
  api_restock?: boolean;
  fee_lines?: Array<{
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    tax_class?: string;
    tax_status?: "taxable" | "none";
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  reason?: string;
  refunded_by?: number;
  shipping_lines?: Array<{
    id?: number;
    instance_id?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    method_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    method_title?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    taxes?: Array<{ id?: number; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
};

/**
 * POST /orders/{order_id}/refunds response body.
 */
export type OrderRefundsCreateResponse = unknown;

/**
 * GET /orders/{order_id}/refunds path parameters.
 */
export type OrderRefundsListPathParams = { order_id: number };

/**
 * GET /orders/{order_id}/refunds query parameters.
 */
export type OrderRefundsListQuery = {
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
 * GET /orders/{order_id}/refunds response body.
 */
export type OrderRefundsListResponse = Array<unknown>;

/**
 * POST /orders/{id}/actions/send_email path parameters.
 */
export type OrderSendEmailPathParams = { id: number };

/**
 * POST /orders/{id}/actions/send_email request body.
 */
export type OrderSendEmailBody = {
  email?: string;
  force_email_update?: boolean;
  template_id:
    | "new_order"
    | "cancelled_order"
    | "failed_order"
    | "customer_failed_order"
    | "customer_on_hold_order"
    | "customer_processing_order"
    | "customer_completed_order"
    | "customer_refunded_order"
    | "customer_invoice"
    | "customer_note"
    | "customer_reset_password"
    | "customer_new_account";
};

/**
 * POST /orders/{id}/actions/send_email response body.
 */
export type OrderSendEmailResponse = unknown;

/**
 * POST /orders/{id}/actions/send_order_details path parameters.
 */
export type OrderSendOrderDetailsPathParams = { id: number };

/**
 * POST /orders/{id}/actions/send_order_details request body.
 */
export type OrderSendOrderDetailsBody = {
  email?: string;
  force_email_update?: boolean;
};

/**
 * POST /orders/{id}/actions/send_order_details response body.
 */
export type OrderSendOrderDetailsResponse = unknown;

/**
 * PUT /orders/{id} path parameters.
 */
export type OrderUpdatePathParams = { id: number };

/**
 * PUT /orders/{id} request body.
 */
export type OrderUpdateBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  coupon_lines?: Array<{
    code?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    discount?: string;
    discount_tax?: string;
    discount_type?: string;
    free_shipping?: boolean;
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    nominal_amount?: number;
  }>;
  created_via?: string;
  currency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYR"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "IRT"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRU"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PRB"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "STN"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VES"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XCD"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMW";
  customer_id?: number;
  customer_note?: string;
  fee_lines?: Array<{
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    tax_class?: string;
    tax_status?: "taxable" | "none";
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  line_items?: Array<{
    id?: number;
    image?: { id?: number; src?: string };
    meta_data?: Array<{
      display_key?: string;
      display_value?: string;
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    parent_name?: string;
    price?: number;
    product_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    quantity?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  manual_update?: boolean;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  parent_id?: number;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    postcode?: string;
    state?: string;
  };
  shipping_lines?: Array<{
    id?: number;
    instance_id?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    method_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    method_title?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    taxes?: Array<{ id?: number; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  status?:
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft";
  transaction_id?: string;
};

/**
 * PUT /orders/{id} response body.
 */
export type OrderUpdateResponse = unknown;

/**
 * POST /orders/batch request body.
 */
export type OrdersBatchUpdateBody = {
  create?: Array<{
    billing?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      email?: string | null;
      first_name?: string;
      last_name?: string;
      phone?: string;
      postcode?: string;
      state?: string;
    };
    coupon_lines?: Array<{
      code?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      discount?: string;
      discount_tax?: string;
      discount_type?: string;
      free_shipping?: boolean;
      id?: number;
      meta_data?: Array<{
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      nominal_amount?: number;
    }>;
    created_via?: string;
    currency?:
      | "AED"
      | "AFN"
      | "ALL"
      | "AMD"
      | "ANG"
      | "AOA"
      | "ARS"
      | "AUD"
      | "AWG"
      | "AZN"
      | "BAM"
      | "BBD"
      | "BDT"
      | "BGN"
      | "BHD"
      | "BIF"
      | "BMD"
      | "BND"
      | "BOB"
      | "BRL"
      | "BSD"
      | "BTC"
      | "BTN"
      | "BWP"
      | "BYR"
      | "BYN"
      | "BZD"
      | "CAD"
      | "CDF"
      | "CHF"
      | "CLP"
      | "CNY"
      | "COP"
      | "CRC"
      | "CUC"
      | "CUP"
      | "CVE"
      | "CZK"
      | "DJF"
      | "DKK"
      | "DOP"
      | "DZD"
      | "EGP"
      | "ERN"
      | "ETB"
      | "EUR"
      | "FJD"
      | "FKP"
      | "GBP"
      | "GEL"
      | "GGP"
      | "GHS"
      | "GIP"
      | "GMD"
      | "GNF"
      | "GTQ"
      | "GYD"
      | "HKD"
      | "HNL"
      | "HRK"
      | "HTG"
      | "HUF"
      | "IDR"
      | "ILS"
      | "IMP"
      | "INR"
      | "IQD"
      | "IRR"
      | "IRT"
      | "ISK"
      | "JEP"
      | "JMD"
      | "JOD"
      | "JPY"
      | "KES"
      | "KGS"
      | "KHR"
      | "KMF"
      | "KPW"
      | "KRW"
      | "KWD"
      | "KYD"
      | "KZT"
      | "LAK"
      | "LBP"
      | "LKR"
      | "LRD"
      | "LSL"
      | "LYD"
      | "MAD"
      | "MDL"
      | "MGA"
      | "MKD"
      | "MMK"
      | "MNT"
      | "MOP"
      | "MRU"
      | "MUR"
      | "MVR"
      | "MWK"
      | "MXN"
      | "MYR"
      | "MZN"
      | "NAD"
      | "NGN"
      | "NIO"
      | "NOK"
      | "NPR"
      | "NZD"
      | "OMR"
      | "PAB"
      | "PEN"
      | "PGK"
      | "PHP"
      | "PKR"
      | "PLN"
      | "PRB"
      | "PYG"
      | "QAR"
      | "RON"
      | "RSD"
      | "RUB"
      | "RWF"
      | "SAR"
      | "SBD"
      | "SCR"
      | "SDG"
      | "SEK"
      | "SGD"
      | "SHP"
      | "SLL"
      | "SOS"
      | "SRD"
      | "SSP"
      | "STN"
      | "SYP"
      | "SZL"
      | "THB"
      | "TJS"
      | "TMT"
      | "TND"
      | "TOP"
      | "TRY"
      | "TTD"
      | "TWD"
      | "TZS"
      | "UAH"
      | "UGX"
      | "USD"
      | "UYU"
      | "UZS"
      | "VEF"
      | "VES"
      | "VND"
      | "VUV"
      | "WST"
      | "XAF"
      | "XCD"
      | "XOF"
      | "XPF"
      | "YER"
      | "ZAR"
      | "ZMW";
    customer_id?: number;
    customer_note?: string;
    fee_lines?: Array<{
      id?: number;
      meta_data?: Array<{
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      name?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      tax_class?: string;
      tax_status?: "taxable" | "none";
      taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
      total?: string;
      total_tax?: string;
    }>;
    line_items?: Array<{
      id?: number;
      image?: { id?: number; src?: string };
      meta_data?: Array<{
        display_key?: string;
        display_value?: string;
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      name?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      parent_name?: string;
      price?: number;
      product_id?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      quantity?: number;
      sku?: string;
      subtotal?: string;
      subtotal_tax?: string;
      tax_class?: string;
      taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
      total?: string;
      total_tax?: string;
      variation_id?: number;
    }>;
    manual_update?: boolean;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    parent_id?: number;
    payment_method?: string;
    payment_method_title?: string;
    set_paid?: boolean;
    shipping?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      first_name?: string;
      last_name?: string;
      postcode?: string;
      state?: string;
    };
    shipping_lines?: Array<{
      id?: number;
      instance_id?: string;
      meta_data?: Array<{
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      method_id?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      method_title?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      taxes?: Array<{ id?: number; total?: string }>;
      total?: string;
      total_tax?: string;
    }>;
    status?:
      | "auto-draft"
      | "pending"
      | "processing"
      | "on-hold"
      | "completed"
      | "cancelled"
      | "refunded"
      | "failed"
      | "checkout-draft";
    transaction_id?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    billing?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      email?: string | null;
      first_name?: string;
      last_name?: string;
      phone?: string;
      postcode?: string;
      state?: string;
    };
    coupon_lines?: Array<{
      code?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      discount?: string;
      discount_tax?: string;
      discount_type?: string;
      free_shipping?: boolean;
      id?: number;
      meta_data?: Array<{
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      nominal_amount?: number;
    }>;
    created_via?: string;
    currency?:
      | "AED"
      | "AFN"
      | "ALL"
      | "AMD"
      | "ANG"
      | "AOA"
      | "ARS"
      | "AUD"
      | "AWG"
      | "AZN"
      | "BAM"
      | "BBD"
      | "BDT"
      | "BGN"
      | "BHD"
      | "BIF"
      | "BMD"
      | "BND"
      | "BOB"
      | "BRL"
      | "BSD"
      | "BTC"
      | "BTN"
      | "BWP"
      | "BYR"
      | "BYN"
      | "BZD"
      | "CAD"
      | "CDF"
      | "CHF"
      | "CLP"
      | "CNY"
      | "COP"
      | "CRC"
      | "CUC"
      | "CUP"
      | "CVE"
      | "CZK"
      | "DJF"
      | "DKK"
      | "DOP"
      | "DZD"
      | "EGP"
      | "ERN"
      | "ETB"
      | "EUR"
      | "FJD"
      | "FKP"
      | "GBP"
      | "GEL"
      | "GGP"
      | "GHS"
      | "GIP"
      | "GMD"
      | "GNF"
      | "GTQ"
      | "GYD"
      | "HKD"
      | "HNL"
      | "HRK"
      | "HTG"
      | "HUF"
      | "IDR"
      | "ILS"
      | "IMP"
      | "INR"
      | "IQD"
      | "IRR"
      | "IRT"
      | "ISK"
      | "JEP"
      | "JMD"
      | "JOD"
      | "JPY"
      | "KES"
      | "KGS"
      | "KHR"
      | "KMF"
      | "KPW"
      | "KRW"
      | "KWD"
      | "KYD"
      | "KZT"
      | "LAK"
      | "LBP"
      | "LKR"
      | "LRD"
      | "LSL"
      | "LYD"
      | "MAD"
      | "MDL"
      | "MGA"
      | "MKD"
      | "MMK"
      | "MNT"
      | "MOP"
      | "MRU"
      | "MUR"
      | "MVR"
      | "MWK"
      | "MXN"
      | "MYR"
      | "MZN"
      | "NAD"
      | "NGN"
      | "NIO"
      | "NOK"
      | "NPR"
      | "NZD"
      | "OMR"
      | "PAB"
      | "PEN"
      | "PGK"
      | "PHP"
      | "PKR"
      | "PLN"
      | "PRB"
      | "PYG"
      | "QAR"
      | "RON"
      | "RSD"
      | "RUB"
      | "RWF"
      | "SAR"
      | "SBD"
      | "SCR"
      | "SDG"
      | "SEK"
      | "SGD"
      | "SHP"
      | "SLL"
      | "SOS"
      | "SRD"
      | "SSP"
      | "STN"
      | "SYP"
      | "SZL"
      | "THB"
      | "TJS"
      | "TMT"
      | "TND"
      | "TOP"
      | "TRY"
      | "TTD"
      | "TWD"
      | "TZS"
      | "UAH"
      | "UGX"
      | "USD"
      | "UYU"
      | "UZS"
      | "VEF"
      | "VES"
      | "VND"
      | "VUV"
      | "WST"
      | "XAF"
      | "XCD"
      | "XOF"
      | "XPF"
      | "YER"
      | "ZAR"
      | "ZMW";
    customer_id?: number;
    customer_note?: string;
    fee_lines?: Array<{
      id?: number;
      meta_data?: Array<{
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      name?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      tax_class?: string;
      tax_status?: "taxable" | "none";
      taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
      total?: string;
      total_tax?: string;
    }>;
    id: number;
    line_items?: Array<{
      id?: number;
      image?: { id?: number; src?: string };
      meta_data?: Array<{
        display_key?: string;
        display_value?: string;
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      name?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      parent_name?: string;
      price?: number;
      product_id?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      quantity?: number;
      sku?: string;
      subtotal?: string;
      subtotal_tax?: string;
      tax_class?: string;
      taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
      total?: string;
      total_tax?: string;
      variation_id?: number;
    }>;
    manual_update?: boolean;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    parent_id?: number;
    payment_method?: string;
    payment_method_title?: string;
    set_paid?: boolean;
    shipping?: {
      address_1?: string;
      address_2?: string;
      city?: string;
      company?: string;
      country?: string;
      first_name?: string;
      last_name?: string;
      postcode?: string;
      state?: string;
    };
    shipping_lines?: Array<{
      id?: number;
      instance_id?: string;
      meta_data?: Array<{
        id?: number;
        key?: string;
        value?:
          | null
          | Record<string, unknown>
          | string
          | number
          | boolean
          | Array<unknown>;
      }>;
      method_id?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      method_title?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
      taxes?: Array<{ id?: number; total?: string }>;
      total?: string;
      total_tax?: string;
    }>;
    status?:
      | "auto-draft"
      | "pending"
      | "processing"
      | "on-hold"
      | "completed"
      | "cancelled"
      | "refunded"
      | "failed"
      | "checkout-draft";
    transaction_id?: string;
  }>;
};

/**
 * POST /orders/batch response body.
 */
export type OrdersBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /orders request body.
 */
export type OrdersCreateBody = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  coupon_lines?: Array<{
    code?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    discount?: string;
    discount_tax?: string;
    discount_type?: string;
    free_shipping?: boolean;
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    nominal_amount?: number;
  }>;
  created_via?: string;
  currency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYR"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "IRT"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRU"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PRB"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "STN"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VES"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XCD"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMW";
  customer_id?: number;
  customer_note?: string;
  fee_lines?: Array<{
    id?: number;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    tax_class?: string;
    tax_status?: "taxable" | "none";
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  line_items?: Array<{
    id?: number;
    image?: { id?: number; src?: string };
    meta_data?: Array<{
      display_key?: string;
      display_value?: string;
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    name?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    parent_name?: string;
    price?: number;
    product_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    quantity?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  manual_update?: boolean;
  meta_data?: Array<{
    id?: number;
    key?: string;
    value?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
  }>;
  parent_id?: number;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    postcode?: string;
    state?: string;
  };
  shipping_lines?: Array<{
    id?: number;
    instance_id?: string;
    meta_data?: Array<{
      id?: number;
      key?: string;
      value?:
        | null
        | Record<string, unknown>
        | string
        | number
        | boolean
        | Array<unknown>;
    }>;
    method_id?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    method_title?:
      | null
      | Record<string, unknown>
      | string
      | number
      | boolean
      | Array<unknown>;
    taxes?: Array<{ id?: number; total?: string }>;
    total?: string;
    total_tax?: string;
  }>;
  status?:
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft";
  transaction_id?: string;
};

/**
 * POST /orders response body.
 */
export type OrdersCreateResponse = {
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  cart_hash?: string;
  cart_tax?: string;
  coupon_lines?: Array<{
    code?: unknown;
    discount?: string;
    discount_tax?: string;
    discount_type?: string;
    free_shipping?: boolean;
    id?: number;
    meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
    nominal_amount?: number;
  }>;
  created_via?: string;
  currency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYR"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "IRT"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRU"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PRB"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "STN"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VES"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XCD"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMW";
  customer_id?: number;
  customer_ip_address?: string;
  customer_note?: string;
  customer_user_agent?: string;
  date_completed?: string;
  date_completed_gmt?: string;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  date_paid?: string;
  date_paid_gmt?: string;
  discount_tax?: string;
  discount_total?: string;
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
  is_editable?: boolean;
  line_items?: Array<{
    id?: number;
    image?: { id?: number; src?: string };
    meta_data?: Array<{
      display_key?: string;
      display_value?: string;
      id?: number;
      key?: string;
      value?: unknown;
    }>;
    name?: unknown;
    parent_name?: string;
    price?: number;
    product_id?: unknown;
    quantity?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  manual_update?: boolean;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  needs_payment?: boolean;
  needs_processing?: boolean;
  number?: string;
  order_key?: string;
  parent_id?: number;
  payment_method?: string;
  payment_method_title?: string;
  payment_url?: string;
  prices_include_tax?: boolean;
  refunds?: Array<{ id?: number; reason?: string; total?: string }>;
  set_paid?: boolean;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    postcode?: string;
    state?: string;
  };
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
  shipping_tax?: string;
  shipping_total?: string;
  status?:
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft";
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
  total?: string;
  total_tax?: string;
  transaction_id?: string;
  version?: string;
};

/**
 * GET /orders query parameters.
 */
export type OrdersListQuery = {
  after?: string;
  before?: string;
  context?: "view" | "edit";
  created_via?: Array<string>;
  customer?: number;
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
  product?: number;
  search?: string;
  status?: Array<
    | "any"
    | "trash"
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft"
  >;
};

/**
 * GET /orders response body.
 */
export type OrdersListResponse = Array<{
  billing?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    phone?: string;
    postcode?: string;
    state?: string;
  };
  cart_hash?: string;
  cart_tax?: string;
  coupon_lines?: Array<{
    code?: unknown;
    discount?: string;
    discount_tax?: string;
    discount_type?: string;
    free_shipping?: boolean;
    id?: number;
    meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
    nominal_amount?: number;
  }>;
  created_via?: string;
  currency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYR"
    | "BYN"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "IRT"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRU"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PRB"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "SSP"
    | "STN"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VES"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XCD"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMW";
  customer_id?: number;
  customer_ip_address?: string;
  customer_note?: string;
  customer_user_agent?: string;
  date_completed?: string;
  date_completed_gmt?: string;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  date_paid?: string;
  date_paid_gmt?: string;
  discount_tax?: string;
  discount_total?: string;
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
  is_editable?: boolean;
  line_items?: Array<{
    id?: number;
    image?: { id?: number; src?: string };
    meta_data?: Array<{
      display_key?: string;
      display_value?: string;
      id?: number;
      key?: string;
      value?: unknown;
    }>;
    name?: unknown;
    parent_name?: string;
    price?: number;
    product_id?: unknown;
    quantity?: number;
    sku?: string;
    subtotal?: string;
    subtotal_tax?: string;
    tax_class?: string;
    taxes?: Array<{ id?: number; subtotal?: string; total?: string }>;
    total?: string;
    total_tax?: string;
    variation_id?: number;
  }>;
  manual_update?: boolean;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  needs_payment?: boolean;
  needs_processing?: boolean;
  number?: string;
  order_key?: string;
  parent_id?: number;
  payment_method?: string;
  payment_method_title?: string;
  payment_url?: string;
  prices_include_tax?: boolean;
  refunds?: Array<{ id?: number; reason?: string; total?: string }>;
  set_paid?: boolean;
  shipping?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    first_name?: string;
    last_name?: string;
    postcode?: string;
    state?: string;
  };
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
  shipping_tax?: string;
  shipping_total?: string;
  status?:
    | "auto-draft"
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "checkout-draft";
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
  total?: string;
  total_tax?: string;
  transaction_id?: string;
  version?: string;
}>;

/**
 * GET /orders/statuses response body.
 */
export type OrdersStatusesListResponse = Array<{
  name?: string;
  slug?: string;
}>;
