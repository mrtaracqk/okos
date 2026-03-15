/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * POST /products/attributes/{id} path parameters.
 */
export type ProductAttributePostCustomPathParams = { id: number };

/**
 * POST /products/attributes/{id} request body.
 */
export type ProductAttributePostCustomBody = {
  has_archives?: boolean;
  name?: string;
  order_by?: "menu_order" | "name" | "name_num" | "id";
  slug?: string;
  type?: "select";
};

/**
 * POST /products/attributes/{id} response body.
 */
export type ProductAttributePostCustomResponse = unknown;

/**
 * PUT /products/attributes/batch request body.
 */
export type ProductAttributePutBatchCustomBody = {
  has_archives?: boolean;
  name?: string;
  order_by?: "menu_order" | "name" | "name_num" | "id";
  slug?: string;
  type?: "select";
};

/**
 * PUT /products/attributes/batch response body.
 */
export type ProductAttributePutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export type ProductAttributeTermPostCustomPathParams = {
  attribute_id: number;
  id: number;
};

/**
 * POST /products/attributes/{attribute_id}/terms/{id} request body.
 */
export type ProductAttributeTermPostCustomBody = {
  description?: string;
  menu_order?: number;
  name?: string;
  slug?: string;
};

/**
 * POST /products/attributes/{attribute_id}/terms/{id} response body.
 */
export type ProductAttributeTermPostCustomResponse = unknown;

/**
 * PUT /products/attributes/{attribute_id}/terms/batch path parameters.
 */
export type ProductAttributeTermPutBatchCustomPathParams = {
  attribute_id: number;
};

/**
 * PUT /products/attributes/{attribute_id}/terms/batch request body.
 */
export type ProductAttributeTermPutBatchCustomBody = {
  description?: string;
  menu_order?: number;
  name?: string;
  slug?: string;
};

/**
 * PUT /products/attributes/{attribute_id}/terms/batch response body.
 */
export type ProductAttributeTermPutBatchCustomResponse = unknown;

/**
 * POST /products/brands/{id} path parameters.
 */
export type ProductBrandPostCustomPathParams = { id: number };

/**
 * POST /products/brands/{id} request body.
 */
export type ProductBrandPostCustomBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * POST /products/brands/{id} response body.
 */
export type ProductBrandPostCustomResponse = unknown;

/**
 * PUT /products/brands/batch request body.
 */
export type ProductBrandPutBatchCustomBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * PUT /products/brands/batch response body.
 */
export type ProductBrandPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/categories/{id} path parameters.
 */
export type ProductCategoryPostCustomPathParams = { id: number };

/**
 * POST /products/categories/{id} request body.
 */
export type ProductCategoryPostCustomBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * POST /products/categories/{id} response body.
 */
export type ProductCategoryPostCustomResponse = unknown;

/**
 * PUT /products/categories/batch request body.
 */
export type ProductCategoryPutBatchCustomBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * PUT /products/categories/batch response body.
 */
export type ProductCategoryPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * DELETE /products/{id} path parameters.
 */
export type ProductDeletePathParams = { id: number };

/**
 * DELETE /products/{id} query parameters.
 */
export type ProductDeleteQuery = { force?: boolean };

/**
 * DELETE /products/{id} response body.
 */
export type ProductDeleteResponse = unknown;

/**
 * POST /products/{id}/duplicate path parameters.
 */
export type ProductDuplicateCreatePathParams = { id: number };

/**
 * POST /products/{id}/duplicate request body.
 */
export type ProductDuplicateCreateBody = {
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  backorders?: "no" | "notify" | "yes";
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: null | string;
  date_created_gmt?: null | string;
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  global_unique_id?: string;
  images?: Array<{
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  name?: string;
  parent_id?: number;
  post_password?: string;
  purchase_note?: string;
  regular_price?: string;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  virtual?: boolean;
  weight?: string;
};

/**
 * POST /products/{id}/duplicate response body.
 */
export type ProductDuplicateCreateResponse = unknown;

/**
 * GET /products/{id} path parameters.
 */
export type ProductGetPathParams = { id: number };

/**
 * GET /products/{id} query parameters.
 */
export type ProductGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/{id} response body.
 */
export type ProductGetResponse = unknown;

/**
 * POST /products/{id} path parameters.
 */
export type ProductPostCustomPathParams = { id: number };

/**
 * POST /products/{id} request body.
 */
export type ProductPostCustomBody = {
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  backorders?: "no" | "notify" | "yes";
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: null | string;
  date_created_gmt?: null | string;
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  global_unique_id?: string;
  images?: Array<{
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  name?: string;
  parent_id?: number;
  post_password?: string;
  purchase_note?: string;
  regular_price?: string;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  virtual?: boolean;
  weight?: string;
};

/**
 * POST /products/{id} response body.
 */
export type ProductPostCustomResponse = unknown;

/**
 * PUT /products/batch request body.
 */
export type ProductPutBatchCustomBody = {
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  backorders?: "no" | "notify" | "yes";
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: null | string;
  date_created_gmt?: null | string;
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  global_unique_id?: string;
  images?: Array<{
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  name?: string;
  parent_id?: number;
  post_password?: string;
  purchase_note?: string;
  regular_price?: string;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  virtual?: boolean;
  weight?: string;
};

/**
 * PUT /products/batch response body.
 */
export type ProductPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/reviews/{id} path parameters.
 */
export type ProductReviewPostCustomPathParams = { id: number };

/**
 * POST /products/reviews/{id} request body.
 */
export type ProductReviewPostCustomBody = {
  product_id?: number;
  product_name?: string;
  rating?: number;
  review?: string;
  reviewer?: string;
  reviewer_email?: string;
  status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
};

/**
 * POST /products/reviews/{id} response body.
 */
export type ProductReviewPostCustomResponse = unknown;

/**
 * PUT /products/reviews/batch request body.
 */
export type ProductReviewPutBatchCustomBody = {
  product_id?: number;
  product_name?: string;
  rating?: number;
  review?: string;
  reviewer?: string;
  reviewer_email?: string;
  status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
};

/**
 * PUT /products/reviews/batch response body.
 */
export type ProductReviewPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/shipping_classes/{id} path parameters.
 */
export type ProductShippingClassPostCustomPathParams = { id: number };

/**
 * POST /products/shipping_classes/{id} request body.
 */
export type ProductShippingClassPostCustomBody = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * POST /products/shipping_classes/{id} response body.
 */
export type ProductShippingClassPostCustomResponse = unknown;

/**
 * PUT /products/shipping_classes/batch request body.
 */
export type ProductShippingClassPutBatchCustomBody = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * PUT /products/shipping_classes/batch response body.
 */
export type ProductShippingClassPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/tags/{id} path parameters.
 */
export type ProductTagPostCustomPathParams = { id: number };

/**
 * POST /products/tags/{id} request body.
 */
export type ProductTagPostCustomBody = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * POST /products/tags/{id} response body.
 */
export type ProductTagPostCustomResponse = unknown;

/**
 * PUT /products/tags/batch request body.
 */
export type ProductTagPutBatchCustomBody = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * PUT /products/tags/batch response body.
 */
export type ProductTagPutBatchCustomResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * PUT /products/{id} path parameters.
 */
export type ProductUpdatePathParams = { id: number };

/**
 * PUT /products/{id} request body.
 */
export type ProductUpdateBody = {
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  backorders?: "no" | "notify" | "yes";
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: null | string;
  date_created_gmt?: null | string;
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  global_unique_id?: string;
  images?: Array<{
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  name?: string;
  parent_id?: number;
  post_password?: string;
  purchase_note?: string;
  regular_price?: string;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  virtual?: boolean;
  weight?: string;
};

/**
 * PUT /products/{id} response body.
 */
export type ProductUpdateResponse = unknown;

/**
 * DELETE /products/{product_id}/variations/{id} path parameters.
 */
export type ProductVariationDeletePathParams = {
  id: number;
  product_id: number;
};

/**
 * DELETE /products/{product_id}/variations/{id} query parameters.
 */
export type ProductVariationDeleteQuery = { force?: boolean };

/**
 * DELETE /products/{product_id}/variations/{id} response body.
 */
export type ProductVariationDeleteResponse = unknown;

/**
 * GET /products/{product_id}/variations/{id} path parameters.
 */
export type ProductVariationGetPathParams = { id: number; product_id: number };

/**
 * GET /products/{product_id}/variations/{id} query parameters.
 */
export type ProductVariationGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/{product_id}/variations/{id} response body.
 */
export type ProductVariationGetResponse = unknown;

/**
 * POST /products/{product_id}/variations/{id} path parameters.
 */
export type ProductVariationPostCustomPathParams = {
  id: number;
  product_id: number;
};

/**
 * POST /products/{product_id}/variations/{id} request body.
 */
export type ProductVariationPostCustomBody = {
  attributes?: Array<{ id?: number; name?: string; option?: string }>;
  backorders?: "no" | "notify" | "yes";
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  global_unique_id?: string;
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  regular_price?: string;
  sale_price?: string;
  shipping_class?: string;
  sku?: string;
  status?: "draft" | "pending" | "private" | "publish";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  virtual?: boolean;
  weight?: string;
};

/**
 * POST /products/{product_id}/variations/{id} response body.
 */
export type ProductVariationPostCustomResponse = unknown;

/**
 * PUT /products/{product_id}/variations/batch path parameters.
 */
export type ProductVariationPutBatchCustomPathParams = { product_id: number };

/**
 * PUT /products/{product_id}/variations/batch request body.
 */
export type ProductVariationPutBatchCustomBody = {
  attributes?: Array<{ id?: number; name?: string; option?: string }>;
  backorders?: "no" | "notify" | "yes";
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  global_unique_id?: string;
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  regular_price?: string;
  sale_price?: string;
  shipping_class?: string;
  sku?: string;
  status?: "draft" | "pending" | "private" | "publish";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  virtual?: boolean;
  weight?: string;
};

/**
 * PUT /products/{product_id}/variations/batch response body.
 */
export type ProductVariationPutBatchCustomResponse = unknown;

/**
 * PUT /products/{product_id}/variations/{id} path parameters.
 */
export type ProductVariationUpdatePathParams = {
  id: number;
  product_id: number;
};

/**
 * PUT /products/{product_id}/variations/{id} request body.
 */
export type ProductVariationUpdateBody = {
  attributes?: Array<{ id?: number; name?: string; option?: string }>;
  backorders?: "no" | "notify" | "yes";
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  global_unique_id?: string;
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  regular_price?: string;
  sale_price?: string;
  shipping_class?: string;
  sku?: string;
  status?: "draft" | "pending" | "private" | "publish";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  virtual?: boolean;
  weight?: string;
};

/**
 * PUT /products/{product_id}/variations/{id} response body.
 */
export type ProductVariationUpdateResponse = unknown;

/**
 * POST /products/{product_id}/variations/batch path parameters.
 */
export type ProductVariationsBatchUpdatePathParams = { product_id: number };

/**
 * POST /products/{product_id}/variations/batch request body.
 */
export type ProductVariationsBatchUpdateBody = {
  create?: Array<{
    attributes?: Array<{ id?: number; name?: string; option?: string }>;
    backorders?: "no" | "notify" | "yes";
    date_on_sale_from?: null | string;
    date_on_sale_from_gmt?: null | string;
    date_on_sale_to?: null | string;
    date_on_sale_to_gmt?: null | string;
    description?: string;
    dimensions?: { height?: string; length?: string; width?: string };
    download_expiry?: number;
    download_limit?: number;
    downloadable?: boolean;
    downloads?: Array<{ file?: string; id?: string; name?: string }>;
    global_unique_id?: string;
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    low_stock_amount?: number | null;
    manage_stock?: boolean;
    menu_order?: number;
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
    regular_price?: string;
    sale_price?: string;
    shipping_class?: string;
    sku?: string;
    status?: "draft" | "pending" | "private" | "publish";
    stock_quantity?: number;
    stock_status?: "instock" | "outofstock" | "onbackorder";
    tax_class?: string;
    tax_status?: "taxable" | "shipping" | "none";
    virtual?: boolean;
    weight?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    attributes?: Array<{ id?: number; name?: string; option?: string }>;
    backorders?: "no" | "notify" | "yes";
    date_on_sale_from?: null | string;
    date_on_sale_from_gmt?: null | string;
    date_on_sale_to?: null | string;
    date_on_sale_to_gmt?: null | string;
    description?: string;
    dimensions?: { height?: string; length?: string; width?: string };
    download_expiry?: number;
    download_limit?: number;
    downloadable?: boolean;
    downloads?: Array<{ file?: string; id?: string; name?: string }>;
    global_unique_id?: string;
    id: number;
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    low_stock_amount?: number | null;
    manage_stock?: boolean;
    menu_order?: number;
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
    regular_price?: string;
    sale_price?: string;
    shipping_class?: string;
    sku?: string;
    status?: "draft" | "pending" | "private" | "publish";
    stock_quantity?: number;
    stock_status?: "instock" | "outofstock" | "onbackorder";
    tax_class?: string;
    tax_status?: "taxable" | "shipping" | "none";
    virtual?: boolean;
    weight?: string;
  }>;
};

/**
 * POST /products/{product_id}/variations/batch response body.
 */
export type ProductVariationsBatchUpdateResponse = unknown;

/**
 * POST /products/{product_id}/variations path parameters.
 */
export type ProductVariationsCreatePathParams = { product_id: number };

/**
 * POST /products/{product_id}/variations request body.
 */
export type ProductVariationsCreateBody = {
  attributes?: Array<{ id?: number; name?: string; option?: string }>;
  backorders?: "no" | "notify" | "yes";
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  global_unique_id?: string;
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  regular_price?: string;
  sale_price?: string;
  shipping_class?: string;
  sku?: string;
  status?: "draft" | "pending" | "private" | "publish";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  virtual?: boolean;
  weight?: string;
};

/**
 * POST /products/{product_id}/variations response body.
 */
export type ProductVariationsCreateResponse = unknown;

/**
 * POST /products/{product_id}/variations/generate path parameters.
 */
export type ProductVariationsGenerateCreatePathParams = { product_id: number };

/**
 * POST /products/{product_id}/variations/generate request body.
 */
export type ProductVariationsGenerateCreateBody = {
  attributes?: Array<{ id?: number; name?: string; option?: string }>;
  backorders?: "no" | "notify" | "yes";
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  default_values?: {
    attributes?: Array<{ id?: number; name?: string; option?: string }>;
    backorders?: "no" | "notify" | "yes";
    date_on_sale_from?: null | string;
    date_on_sale_from_gmt?: null | string;
    date_on_sale_to?: null | string;
    date_on_sale_to_gmt?: null | string;
    description?: string;
    dimensions?: { height?: string; length?: string; width?: string };
    download_expiry?: number;
    download_limit?: number;
    downloadable?: boolean;
    downloads?: Array<{ file?: string; id?: string; name?: string }>;
    global_unique_id?: string;
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    low_stock_amount?: number | null;
    manage_stock?: boolean;
    menu_order?: number;
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
    regular_price?: string;
    sale_price?: string;
    shipping_class?: string;
    sku?: string;
    status?: "draft" | "pending" | "private" | "publish";
    stock_quantity?: number;
    stock_status?: "instock" | "outofstock" | "onbackorder";
    tax_class?: string;
    tax_status?: "taxable" | "shipping" | "none";
    virtual?: boolean;
    weight?: string;
  };
  delete?: boolean;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  global_unique_id?: string;
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  regular_price?: string;
  sale_price?: string;
  shipping_class?: string;
  sku?: string;
  status?: "draft" | "pending" | "private" | "publish";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  virtual?: boolean;
  weight?: string;
};

/**
 * POST /products/{product_id}/variations/generate response body.
 */
export type ProductVariationsGenerateCreateResponse = unknown;

/**
 * GET /products/{product_id}/variations path parameters.
 */
export type ProductVariationsListPathParams = { product_id: number };

/**
 * GET /products/{product_id}/variations query parameters.
 */
export type ProductVariationsListQuery = {
  after?: string;
  attributes?: Array<{
    attribute?: string;
    term?: string;
    terms?: Array<unknown>;
  }>;
  before?: string;
  context?: "view" | "edit";
  dates_are_gmt?: boolean;
  downloadable?: boolean;
  exclude?: Array<number>;
  exclude_meta?: Array<string>;
  exclude_status?: Array<
    "future" | "trash" | "draft" | "pending" | "private" | "publish"
  >;
  has_price?: boolean;
  include?: Array<number>;
  include_meta?: Array<string>;
  include_status?: Array<
    "any" | "future" | "trash" | "draft" | "pending" | "private" | "publish"
  >;
  max_price?: string;
  min_price?: string;
  modified_after?: string;
  modified_before?: string;
  offset?: number;
  on_sale?: boolean;
  order?: "asc" | "desc";
  orderby?:
    | "date"
    | "id"
    | "include"
    | "title"
    | "slug"
    | "modified"
    | "menu_order";
  page?: number;
  parent?: Array<number>;
  parent_exclude?: Array<number>;
  per_page?: number;
  search?: string;
  sku?: string;
  slug?: string;
  status?:
    | "any"
    | "future"
    | "trash"
    | "draft"
    | "pending"
    | "private"
    | "publish";
  stock_status?: "instock" | "outofstock" | "onbackorder";
  virtual?: boolean;
};

/**
 * GET /products/{product_id}/variations response body.
 */
export type ProductVariationsListResponse = Array<unknown>;

/**
 * DELETE /products/attributes/{id} path parameters.
 */
export type ProductsAttributeDeletePathParams = { id: number };

/**
 * DELETE /products/attributes/{id} query parameters.
 */
export type ProductsAttributeDeleteQuery = { force?: boolean };

/**
 * DELETE /products/attributes/{id} response body.
 */
export type ProductsAttributeDeleteResponse = unknown;

/**
 * GET /products/attributes/{id} path parameters.
 */
export type ProductsAttributeGetPathParams = { id: number };

/**
 * GET /products/attributes/{id} query parameters.
 */
export type ProductsAttributeGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/attributes/{id} response body.
 */
export type ProductsAttributeGetResponse = unknown;

/**
 * DELETE /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export type ProductsAttributeTermDeletePathParams = {
  attribute_id: number;
  id: number;
};

/**
 * DELETE /products/attributes/{attribute_id}/terms/{id} query parameters.
 */
export type ProductsAttributeTermDeleteQuery = { force?: boolean };

/**
 * DELETE /products/attributes/{attribute_id}/terms/{id} response body.
 */
export type ProductsAttributeTermDeleteResponse = unknown;

/**
 * GET /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export type ProductsAttributeTermGetPathParams = {
  attribute_id: number;
  id: number;
};

/**
 * GET /products/attributes/{attribute_id}/terms/{id} query parameters.
 */
export type ProductsAttributeTermGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/attributes/{attribute_id}/terms/{id} response body.
 */
export type ProductsAttributeTermGetResponse = unknown;

/**
 * PUT /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export type ProductsAttributeTermUpdatePathParams = {
  attribute_id: number;
  id: number;
};

/**
 * PUT /products/attributes/{attribute_id}/terms/{id} request body.
 */
export type ProductsAttributeTermUpdateBody = {
  description?: string;
  menu_order?: number;
  name?: string;
  slug?: string;
};

/**
 * PUT /products/attributes/{attribute_id}/terms/{id} response body.
 */
export type ProductsAttributeTermUpdateResponse = unknown;

/**
 * POST /products/attributes/{attribute_id}/terms/batch path parameters.
 */
export type ProductsAttributeTermsBatchUpdatePathParams = {
  attribute_id: number;
};

/**
 * POST /products/attributes/{attribute_id}/terms/batch request body.
 */
export type ProductsAttributeTermsBatchUpdateBody = {
  create?: Array<{
    description?: string;
    menu_order?: number;
    name?: string;
    slug?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    description?: string;
    id: number;
    menu_order?: number;
    name?: string;
    slug?: string;
  }>;
};

/**
 * POST /products/attributes/{attribute_id}/terms/batch response body.
 */
export type ProductsAttributeTermsBatchUpdateResponse = unknown;

/**
 * POST /products/attributes/{attribute_id}/terms path parameters.
 */
export type ProductsAttributeTermsCreatePathParams = { attribute_id: number };

/**
 * POST /products/attributes/{attribute_id}/terms request body.
 */
export type ProductsAttributeTermsCreateBody = {
  description?: string;
  menu_order?: number;
  name: string;
  slug?: string;
};

/**
 * POST /products/attributes/{attribute_id}/terms response body.
 */
export type ProductsAttributeTermsCreateResponse = unknown;

/**
 * GET /products/attributes/{attribute_id}/terms path parameters.
 */
export type ProductsAttributeTermsListPathParams = { attribute_id: number };

/**
 * GET /products/attributes/{attribute_id}/terms query parameters.
 */
export type ProductsAttributeTermsListQuery = {
  context?: "view" | "edit";
  exclude?: Array<number>;
  hide_empty?: boolean;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "term_group"
    | "description"
    | "count";
  page?: number;
  parent?: number;
  per_page?: number;
  product?: number;
  search?: string;
  slug?: string;
};

/**
 * GET /products/attributes/{attribute_id}/terms response body.
 */
export type ProductsAttributeTermsListResponse = Array<unknown>;

/**
 * PUT /products/attributes/{id} path parameters.
 */
export type ProductsAttributeUpdatePathParams = { id: number };

/**
 * PUT /products/attributes/{id} request body.
 */
export type ProductsAttributeUpdateBody = {
  has_archives?: boolean;
  name?: string;
  order_by?: "menu_order" | "name" | "name_num" | "id";
  slug?: string;
  type?: "select";
};

/**
 * PUT /products/attributes/{id} response body.
 */
export type ProductsAttributeUpdateResponse = unknown;

/**
 * POST /products/attributes/batch request body.
 */
export type ProductsAttributesBatchUpdateBody = {
  create?: Array<{
    has_archives?: boolean;
    name?: string;
    order_by?: "menu_order" | "name" | "name_num" | "id";
    slug?: string;
    type?: "select";
  }>;
  delete?: Array<number>;
  update?: Array<{
    has_archives?: boolean;
    id: number;
    name?: string;
    order_by?: "menu_order" | "name" | "name_num" | "id";
    slug?: string;
    type?: "select";
  }>;
};

/**
 * POST /products/attributes/batch response body.
 */
export type ProductsAttributesBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/attributes request body.
 */
export type ProductsAttributesCreateBody = {
  has_archives?: boolean;
  name: string;
  order_by?: "menu_order" | "name" | "name_num" | "id";
  slug?: string;
  type?: "select";
};

/**
 * POST /products/attributes response body.
 */
export type ProductsAttributesCreateResponse = {
  has_archives?: boolean;
  id?: number;
  name?: string;
  order_by?: "menu_order" | "name" | "name_num" | "id";
  slug?: string;
  type?: "select";
};

/**
 * GET /products/attributes query parameters.
 */
export type ProductsAttributesListQuery = { context?: "view" | "edit" };

/**
 * GET /products/attributes response body.
 */
export type ProductsAttributesListResponse = Array<{
  has_archives?: boolean;
  id?: number;
  name?: string;
  order_by?: "menu_order" | "name" | "name_num" | "id";
  slug?: string;
  type?: "select";
}>;

/**
 * POST /products/batch request body.
 */
export type ProductsBatchUpdateBody = {
  create?: Array<{
    attributes?: Array<{
      id?: number;
      name?: string;
      options?: Array<string>;
      position?: number;
      variation?: boolean;
      visible?: boolean;
    }>;
    backorders?: "no" | "notify" | "yes";
    brands?: Array<{ id?: number; name?: string; slug?: string }>;
    button_text?: string;
    catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
    categories?: Array<{ id?: number; name?: string; slug?: string }>;
    cross_sell_ids?: Array<number>;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_on_sale_from?: null | string;
    date_on_sale_from_gmt?: null | string;
    date_on_sale_to?: null | string;
    date_on_sale_to_gmt?: null | string;
    default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
    description?: string;
    dimensions?: { height?: string; length?: string; width?: string };
    download_expiry?: number;
    download_limit?: number;
    downloadable?: boolean;
    downloads?: Array<{ file?: string; id?: string; name?: string }>;
    external_url?: string;
    featured?: boolean;
    global_unique_id?: string;
    images?: Array<{
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    }>;
    low_stock_amount?: number | null;
    manage_stock?: boolean;
    menu_order?: number;
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
    name?: string;
    parent_id?: number;
    post_password?: string;
    purchase_note?: string;
    regular_price?: string;
    reviews_allowed?: boolean;
    sale_price?: string;
    shipping_class?: string;
    short_description?: string;
    sku?: string;
    slug?: string;
    sold_individually?: boolean;
    status?:
      | "draft"
      | "pending"
      | "private"
      | "publish"
      | "future"
      | "auto-draft"
      | "trash";
    stock_quantity?: number;
    stock_status?: "instock" | "outofstock" | "onbackorder";
    tags?: Array<{ id?: number; name?: string; slug?: string }>;
    tax_class?: string;
    tax_status?: "taxable" | "shipping" | "none";
    type?: "simple" | "grouped" | "external" | "variable";
    upsell_ids?: Array<number>;
    virtual?: boolean;
    weight?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    attributes?: Array<{
      id?: number;
      name?: string;
      options?: Array<string>;
      position?: number;
      variation?: boolean;
      visible?: boolean;
    }>;
    backorders?: "no" | "notify" | "yes";
    brands?: Array<{ id?: number; name?: string; slug?: string }>;
    button_text?: string;
    catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
    categories?: Array<{ id?: number; name?: string; slug?: string }>;
    cross_sell_ids?: Array<number>;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_on_sale_from?: null | string;
    date_on_sale_from_gmt?: null | string;
    date_on_sale_to?: null | string;
    date_on_sale_to_gmt?: null | string;
    default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
    description?: string;
    dimensions?: { height?: string; length?: string; width?: string };
    download_expiry?: number;
    download_limit?: number;
    downloadable?: boolean;
    downloads?: Array<{ file?: string; id?: string; name?: string }>;
    external_url?: string;
    featured?: boolean;
    global_unique_id?: string;
    id: number;
    images?: Array<{
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    }>;
    low_stock_amount?: number | null;
    manage_stock?: boolean;
    menu_order?: number;
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
    name?: string;
    parent_id?: number;
    post_password?: string;
    purchase_note?: string;
    regular_price?: string;
    reviews_allowed?: boolean;
    sale_price?: string;
    shipping_class?: string;
    short_description?: string;
    sku?: string;
    slug?: string;
    sold_individually?: boolean;
    status?:
      | "draft"
      | "pending"
      | "private"
      | "publish"
      | "future"
      | "auto-draft"
      | "trash";
    stock_quantity?: number;
    stock_status?: "instock" | "outofstock" | "onbackorder";
    tags?: Array<{ id?: number; name?: string; slug?: string }>;
    tax_class?: string;
    tax_status?: "taxable" | "shipping" | "none";
    type?: "simple" | "grouped" | "external" | "variable";
    upsell_ids?: Array<number>;
    virtual?: boolean;
    weight?: string;
  }>;
};

/**
 * POST /products/batch response body.
 */
export type ProductsBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * DELETE /products/brands/{id} path parameters.
 */
export type ProductsBrandDeletePathParams = { id: number };

/**
 * DELETE /products/brands/{id} query parameters.
 */
export type ProductsBrandDeleteQuery = { force?: boolean };

/**
 * DELETE /products/brands/{id} response body.
 */
export type ProductsBrandDeleteResponse = unknown;

/**
 * GET /products/brands/{id} path parameters.
 */
export type ProductsBrandGetPathParams = { id: number };

/**
 * GET /products/brands/{id} query parameters.
 */
export type ProductsBrandGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/brands/{id} response body.
 */
export type ProductsBrandGetResponse = unknown;

/**
 * PUT /products/brands/{id} path parameters.
 */
export type ProductsBrandUpdatePathParams = { id: number };

/**
 * PUT /products/brands/{id} request body.
 */
export type ProductsBrandUpdateBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * PUT /products/brands/{id} response body.
 */
export type ProductsBrandUpdateResponse = unknown;

/**
 * POST /products/brands/batch request body.
 */
export type ProductsBrandsBatchUpdateBody = {
  create?: Array<{
    description?: string;
    display?: "default" | "products" | "subcategories" | "both";
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    menu_order?: number;
    name?: string;
    parent?: number;
    slug?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    description?: string;
    display?: "default" | "products" | "subcategories" | "both";
    id: number;
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    menu_order?: number;
    name?: string;
    parent?: number;
    slug?: string;
  }>;
};

/**
 * POST /products/brands/batch response body.
 */
export type ProductsBrandsBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/brands request body.
 */
export type ProductsBrandsCreateBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name: string;
  parent?: number;
  slug?: string;
};

/**
 * POST /products/brands response body.
 */
export type ProductsBrandsCreateResponse = {
  count?: number;
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  id?: number;
  image?: {
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * GET /products/brands query parameters.
 */
export type ProductsBrandsListQuery = {
  context?: "view" | "edit";
  exclude?: Array<number>;
  hide_empty?: boolean;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "term_group"
    | "description"
    | "count";
  page?: number;
  parent?: number;
  per_page?: number;
  product?: number;
  search?: string;
  slug?: string;
};

/**
 * GET /products/brands response body.
 */
export type ProductsBrandsListResponse = Array<{
  count?: number;
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  id?: number;
  image?: {
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
}>;

/**
 * POST /products/categories/batch request body.
 */
export type ProductsCategoriesBatchUpdateBody = {
  create?: Array<{
    description?: string;
    display?: "default" | "products" | "subcategories" | "both";
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    menu_order?: number;
    name?: string;
    parent?: number;
    slug?: string;
  }>;
  delete?: Array<number>;
  update?: Array<{
    description?: string;
    display?: "default" | "products" | "subcategories" | "both";
    id: number;
    image?: {
      alt?: string;
      date_created?: null | string;
      date_created_gmt?: null | string;
      date_modified?: null | string;
      date_modified_gmt?: null | string;
      id?: number;
      name?: string;
      src?: string;
    };
    menu_order?: number;
    name?: string;
    parent?: number;
    slug?: string;
  }>;
};

/**
 * POST /products/categories/batch response body.
 */
export type ProductsCategoriesBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/categories request body.
 */
export type ProductsCategoriesCreateBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name: string;
  parent?: number;
  slug?: string;
};

/**
 * POST /products/categories response body.
 */
export type ProductsCategoriesCreateResponse = {
  count?: number;
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  id?: number;
  image?: {
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * GET /products/categories query parameters.
 */
export type ProductsCategoriesListQuery = {
  context?: "view" | "edit";
  exclude?: Array<number>;
  hide_empty?: boolean;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "term_group"
    | "description"
    | "count";
  page?: number;
  parent?: number;
  per_page?: number;
  product?: number;
  search?: string;
  slug?: string;
};

/**
 * GET /products/categories response body.
 */
export type ProductsCategoriesListResponse = Array<{
  count?: number;
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  id?: number;
  image?: {
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
}>;

/**
 * DELETE /products/categories/{id} path parameters.
 */
export type ProductsCategoryDeletePathParams = { id: number };

/**
 * DELETE /products/categories/{id} query parameters.
 */
export type ProductsCategoryDeleteQuery = { force?: boolean };

/**
 * DELETE /products/categories/{id} response body.
 */
export type ProductsCategoryDeleteResponse = unknown;

/**
 * GET /products/categories/{id} path parameters.
 */
export type ProductsCategoryGetPathParams = { id: number };

/**
 * GET /products/categories/{id} query parameters.
 */
export type ProductsCategoryGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/categories/{id} response body.
 */
export type ProductsCategoryGetResponse = unknown;

/**
 * PUT /products/categories/{id} path parameters.
 */
export type ProductsCategoryUpdatePathParams = { id: number };

/**
 * PUT /products/categories/{id} request body.
 */
export type ProductsCategoryUpdateBody = {
  description?: string;
  display?: "default" | "products" | "subcategories" | "both";
  image?: {
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  };
  menu_order?: number;
  name?: string;
  parent?: number;
  slug?: string;
};

/**
 * PUT /products/categories/{id} response body.
 */
export type ProductsCategoryUpdateResponse = unknown;

/**
 * POST /products request body.
 */
export type ProductsCreateBody = {
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  backorders?: "no" | "notify" | "yes";
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: null | string;
  date_created_gmt?: null | string;
  date_on_sale_from?: null | string;
  date_on_sale_from_gmt?: null | string;
  date_on_sale_to?: null | string;
  date_on_sale_to_gmt?: null | string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  global_unique_id?: string;
  images?: Array<{
    alt?: string;
    date_created?: null | string;
    date_created_gmt?: null | string;
    date_modified?: null | string;
    date_modified_gmt?: null | string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
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
  name?: string;
  parent_id?: number;
  post_password?: string;
  purchase_note?: string;
  regular_price?: string;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  virtual?: boolean;
  weight?: string;
};

/**
 * POST /products response body.
 */
export type ProductsCreateResponse = {
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  average_rating?: string;
  backordered?: boolean;
  backorders?: "no" | "notify" | "yes";
  backorders_allowed?: boolean;
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  date_on_sale_from?: string;
  date_on_sale_from_gmt?: string;
  date_on_sale_to?: string;
  date_on_sale_to_gmt?: string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  generated_slug?: string;
  global_unique_id?: string;
  grouped_products?: Array<number>;
  has_options?: boolean;
  id?: number;
  images?: Array<{
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  name?: string;
  on_sale?: boolean;
  parent_id?: number;
  permalink?: string;
  permalink_template?: string;
  post_password?: string;
  price?: string;
  price_html?: string;
  purchasable?: boolean;
  purchase_note?: string;
  rating_count?: number;
  regular_price?: string;
  related_ids?: Array<number>;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  shipping_class_id?: string;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  total_sales?: number;
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  variations?: Array<number>;
  virtual?: boolean;
  weight?: string;
};

/**
 * GET /products/custom-fields/names query parameters.
 */
export type ProductsCustomFieldsNamesListQuery = {
  context?: string;
  order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  search?: string;
};

/**
 * GET /products/custom-fields/names response body.
 */
export type ProductsCustomFieldsNamesListResponse = Array<unknown>;

/**
 * GET /products query parameters.
 */
export type ProductsListQuery = {
  after?: string;
  attribute?: string;
  attribute_term?: string;
  before?: string;
  brand?: string;
  category?: string;
  context?: "view" | "edit";
  dates_are_gmt?: boolean;
  downloadable?: boolean;
  exclude?: Array<number>;
  exclude_meta?: Array<string>;
  exclude_status?: Array<
    "future" | "trash" | "draft" | "pending" | "private" | "publish"
  >;
  exclude_types?: Array<"simple" | "grouped" | "external" | "variable">;
  featured?: boolean;
  include?: Array<number>;
  include_meta?: Array<string>;
  include_status?: Array<
    "any" | "future" | "trash" | "draft" | "pending" | "private" | "publish"
  >;
  include_types?: Array<"simple" | "grouped" | "external" | "variable">;
  max_price?: string;
  min_price?: string;
  modified_after?: string;
  modified_before?: string;
  offset?: number;
  on_sale?: boolean;
  order?: "asc" | "desc";
  orderby?:
    | "date"
    | "id"
    | "include"
    | "title"
    | "slug"
    | "modified"
    | "popularity"
    | "rating"
    | "post__in"
    | "price"
    | "sales"
    | "menu_order"
    | "random";
  page?: number;
  parent?: Array<number>;
  parent_exclude?: Array<number>;
  per_page?: number;
  search?: string;
  search_name_or_sku?: string;
  search_sku?: string;
  shipping_class?: string;
  sku?: string;
  slug?: string;
  status?:
    | "any"
    | "future"
    | "trash"
    | "draft"
    | "pending"
    | "private"
    | "publish";
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tag?: string;
  type?: "simple" | "grouped" | "external" | "variable";
  virtual?: boolean;
};

/**
 * GET /products response body.
 */
export type ProductsListResponse = Array<{
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  average_rating?: string;
  backordered?: boolean;
  backorders?: "no" | "notify" | "yes";
  backorders_allowed?: boolean;
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  date_on_sale_from?: string;
  date_on_sale_from_gmt?: string;
  date_on_sale_to?: string;
  date_on_sale_to_gmt?: string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  generated_slug?: string;
  global_unique_id?: string;
  grouped_products?: Array<number>;
  has_options?: boolean;
  id?: number;
  images?: Array<{
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  name?: string;
  on_sale?: boolean;
  parent_id?: number;
  permalink?: string;
  permalink_template?: string;
  post_password?: string;
  price?: string;
  price_html?: string;
  purchasable?: boolean;
  purchase_note?: string;
  rating_count?: number;
  regular_price?: string;
  related_ids?: Array<number>;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  shipping_class_id?: string;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  total_sales?: number;
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  variations?: Array<number>;
  virtual?: boolean;
  weight?: string;
}>;

/**
 * DELETE /products/reviews/{id} path parameters.
 */
export type ProductsReviewDeletePathParams = { id: number };

/**
 * DELETE /products/reviews/{id} query parameters.
 */
export type ProductsReviewDeleteQuery = { force?: boolean };

/**
 * DELETE /products/reviews/{id} response body.
 */
export type ProductsReviewDeleteResponse = unknown;

/**
 * GET /products/reviews/{id} path parameters.
 */
export type ProductsReviewGetPathParams = { id: number };

/**
 * GET /products/reviews/{id} query parameters.
 */
export type ProductsReviewGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/reviews/{id} response body.
 */
export type ProductsReviewGetResponse = unknown;

/**
 * PUT /products/reviews/{id} path parameters.
 */
export type ProductsReviewUpdatePathParams = { id: number };

/**
 * PUT /products/reviews/{id} request body.
 */
export type ProductsReviewUpdateBody = {
  product_id?: number;
  product_name?: string;
  rating?: number;
  review?: string;
  reviewer?: string;
  reviewer_email?: string;
  status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
};

/**
 * PUT /products/reviews/{id} response body.
 */
export type ProductsReviewUpdateResponse = unknown;

/**
 * POST /products/reviews/batch request body.
 */
export type ProductsReviewsBatchUpdateBody = {
  create?: Array<{
    product_id?: number;
    product_name?: string;
    rating?: number;
    review?: string;
    reviewer?: string;
    reviewer_email?: string;
    status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
  }>;
  delete?: Array<number>;
  update?: Array<{
    id: number;
    product_id?: number;
    product_name?: string;
    rating?: number;
    review?: string;
    reviewer?: string;
    reviewer_email?: string;
    status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
  }>;
};

/**
 * POST /products/reviews/batch response body.
 */
export type ProductsReviewsBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/reviews request body.
 */
export type ProductsReviewsCreateBody = {
  product_id: number;
  product_name?: string;
  rating?: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
};

/**
 * POST /products/reviews response body.
 */
export type ProductsReviewsCreateResponse = {
  date_created?: string;
  date_created_gmt?: string;
  id?: number;
  product_id?: number;
  product_name?: string;
  product_permalink?: string;
  rating?: number;
  review?: string;
  reviewer?: string;
  reviewer_avatar_urls?: { "24"?: string; "48"?: string; "96"?: string };
  reviewer_email?: string;
  status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
  verified?: boolean;
};

/**
 * GET /products/reviews query parameters.
 */
export type ProductsReviewsListQuery = {
  after?: string;
  before?: string;
  context?: "view" | "edit";
  exclude?: Array<number>;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?: "date" | "date_gmt" | "id" | "include" | "product";
  page?: number;
  per_page?: number;
  product?: Array<number>;
  reviewer?: Array<number>;
  reviewer_email?: string;
  reviewer_exclude?: Array<number>;
  search?: string;
  status?: "all" | "hold" | "approved" | "spam" | "trash";
};

/**
 * GET /products/reviews response body.
 */
export type ProductsReviewsListResponse = Array<{
  date_created?: string;
  date_created_gmt?: string;
  id?: number;
  product_id?: number;
  product_name?: string;
  product_permalink?: string;
  rating?: number;
  review?: string;
  reviewer?: string;
  reviewer_avatar_urls?: { "24"?: string; "48"?: string; "96"?: string };
  reviewer_email?: string;
  status?: "approved" | "hold" | "spam" | "unspam" | "trash" | "untrash";
  verified?: boolean;
}>;

/**
 * DELETE /products/shipping_classes/{id} path parameters.
 */
export type ProductsShippingClassDeletePathParams = { id: number };

/**
 * DELETE /products/shipping_classes/{id} query parameters.
 */
export type ProductsShippingClassDeleteQuery = { force?: boolean };

/**
 * DELETE /products/shipping_classes/{id} response body.
 */
export type ProductsShippingClassDeleteResponse = unknown;

/**
 * GET /products/shipping_classes/{id} path parameters.
 */
export type ProductsShippingClassGetPathParams = { id: number };

/**
 * GET /products/shipping_classes/{id} query parameters.
 */
export type ProductsShippingClassGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/shipping_classes/{id} response body.
 */
export type ProductsShippingClassGetResponse = unknown;

/**
 * PUT /products/shipping_classes/{id} path parameters.
 */
export type ProductsShippingClassUpdatePathParams = { id: number };

/**
 * PUT /products/shipping_classes/{id} request body.
 */
export type ProductsShippingClassUpdateBody = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * PUT /products/shipping_classes/{id} response body.
 */
export type ProductsShippingClassUpdateResponse = unknown;

/**
 * POST /products/shipping_classes/batch request body.
 */
export type ProductsShippingClassesBatchUpdateBody = {
  create?: Array<{ description?: string; name?: string; slug?: string }>;
  delete?: Array<number>;
  update?: Array<{
    description?: string;
    id: number;
    name?: string;
    slug?: string;
  }>;
};

/**
 * POST /products/shipping_classes/batch response body.
 */
export type ProductsShippingClassesBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/shipping_classes request body.
 */
export type ProductsShippingClassesCreateBody = {
  description?: string;
  name: string;
  slug?: string;
};

/**
 * POST /products/shipping_classes response body.
 */
export type ProductsShippingClassesCreateResponse = {
  count?: number;
  description?: string;
  id?: number;
  name?: string;
  slug?: string;
};

/**
 * GET /products/shipping_classes query parameters.
 */
export type ProductsShippingClassesListQuery = {
  context?: "view" | "edit";
  exclude?: Array<number>;
  hide_empty?: boolean;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "term_group"
    | "description"
    | "count";
  page?: number;
  parent?: number;
  per_page?: number;
  product?: number;
  search?: string;
  slug?: string;
};

/**
 * GET /products/shipping_classes response body.
 */
export type ProductsShippingClassesListResponse = Array<{
  count?: number;
  description?: string;
  id?: number;
  name?: string;
  slug?: string;
}>;

/**
 * GET /products/shipping_classes/slug-suggestion query parameters.
 */
export type ProductsShippingClassesSlugSuggestionListQuery = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * GET /products/shipping_classes/slug-suggestion response body.
 */
export type ProductsShippingClassesSlugSuggestionListResponse = Array<{
  count?: number;
  description?: string;
  id?: number;
  name?: string;
  slug?: string;
}>;

/**
 * GET /products/suggested-products query parameters.
 */
export type ProductsSuggestedProductsListQuery = {
  after?: string;
  attribute?: string;
  attribute_term?: string;
  before?: string;
  brand?: string;
  categories?: Array<number>;
  category?: string;
  context?: "view" | "edit";
  dates_are_gmt?: boolean;
  exclude?: Array<number>;
  exclude_meta?: Array<string>;
  featured?: boolean;
  in_stock?: boolean;
  include?: Array<number>;
  include_meta?: Array<string>;
  limit?: number;
  max_price?: string;
  min_price?: string;
  modified_after?: string;
  modified_before?: string;
  offset?: number;
  on_sale?: boolean;
  order?: "asc" | "desc";
  orderby?:
    | "date"
    | "id"
    | "include"
    | "title"
    | "slug"
    | "modified"
    | "popularity"
    | "rating"
    | "post__in"
    | "price"
    | "sales"
    | "menu_order"
    | "random";
  page?: number;
  parent?: Array<number>;
  parent_exclude?: Array<number>;
  per_page?: number;
  search?: string;
  shipping_class?: string;
  sku?: string;
  slug?: string;
  status?:
    | "any"
    | "future"
    | "trash"
    | "draft"
    | "pending"
    | "private"
    | "publish";
  tag?: string;
  tags?: Array<number>;
  type?: "simple" | "grouped" | "external" | "variable";
};

/**
 * GET /products/suggested-products response body.
 */
export type ProductsSuggestedProductsListResponse = Array<{
  attributes?: Array<{
    id?: number;
    name?: string;
    options?: Array<string>;
    position?: number;
    variation?: boolean;
    visible?: boolean;
  }>;
  average_rating?: string;
  backordered?: boolean;
  backorders?: "no" | "notify" | "yes";
  backorders_allowed?: boolean;
  brands?: Array<{ id?: number; name?: string; slug?: string }>;
  button_text?: string;
  catalog_visibility?: "visible" | "catalog" | "search" | "hidden";
  categories?: Array<{ id?: number; name?: string; slug?: string }>;
  cross_sell_ids?: Array<number>;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  date_on_sale_from?: string;
  date_on_sale_from_gmt?: string;
  date_on_sale_to?: string;
  date_on_sale_to_gmt?: string;
  default_attributes?: Array<{ id?: number; name?: string; option?: string }>;
  description?: string;
  dimensions?: { height?: string; length?: string; width?: string };
  download_expiry?: number;
  download_limit?: number;
  downloadable?: boolean;
  downloads?: Array<{ file?: string; id?: string; name?: string }>;
  external_url?: string;
  featured?: boolean;
  generated_slug?: string;
  global_unique_id?: string;
  grouped_products?: Array<number>;
  has_options?: boolean;
  id?: number;
  images?: Array<{
    alt?: string;
    date_created?: string;
    date_created_gmt?: string;
    date_modified?: string;
    date_modified_gmt?: string;
    id?: number;
    name?: string;
    src?: string;
  }>;
  low_stock_amount?: number | null;
  manage_stock?: boolean;
  menu_order?: number;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
  name?: string;
  on_sale?: boolean;
  parent_id?: number;
  permalink?: string;
  permalink_template?: string;
  post_password?: string;
  price?: string;
  price_html?: string;
  purchasable?: boolean;
  purchase_note?: string;
  rating_count?: number;
  regular_price?: string;
  related_ids?: Array<number>;
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  shipping_class_id?: string;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?:
    | "draft"
    | "pending"
    | "private"
    | "publish"
    | "future"
    | "auto-draft"
    | "trash";
  stock_quantity?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  tags?: Array<{ id?: number; name?: string; slug?: string }>;
  tax_class?: string;
  tax_status?: "taxable" | "shipping" | "none";
  total_sales?: number;
  type?: "simple" | "grouped" | "external" | "variable";
  upsell_ids?: Array<number>;
  variations?: Array<number>;
  virtual?: boolean;
  weight?: string;
}>;

/**
 * DELETE /products/tags/{id} path parameters.
 */
export type ProductsTagDeletePathParams = { id: number };

/**
 * DELETE /products/tags/{id} query parameters.
 */
export type ProductsTagDeleteQuery = { force?: boolean };

/**
 * DELETE /products/tags/{id} response body.
 */
export type ProductsTagDeleteResponse = unknown;

/**
 * GET /products/tags/{id} path parameters.
 */
export type ProductsTagGetPathParams = { id: number };

/**
 * GET /products/tags/{id} query parameters.
 */
export type ProductsTagGetQuery = { context?: "view" | "edit" };

/**
 * GET /products/tags/{id} response body.
 */
export type ProductsTagGetResponse = unknown;

/**
 * PUT /products/tags/{id} path parameters.
 */
export type ProductsTagUpdatePathParams = { id: number };

/**
 * PUT /products/tags/{id} request body.
 */
export type ProductsTagUpdateBody = {
  description?: string;
  name?: string;
  slug?: string;
};

/**
 * PUT /products/tags/{id} response body.
 */
export type ProductsTagUpdateResponse = unknown;

/**
 * POST /products/tags/batch request body.
 */
export type ProductsTagsBatchUpdateBody = {
  create?: Array<{ description?: string; name?: string; slug?: string }>;
  delete?: Array<number>;
  update?: Array<{
    description?: string;
    id: number;
    name?: string;
    slug?: string;
  }>;
};

/**
 * POST /products/tags/batch response body.
 */
export type ProductsTagsBatchUpdateResponse = {
  create?: Array<Record<string, unknown>>;
  delete?: Array<number>;
  update?: Array<Record<string, unknown>>;
};

/**
 * POST /products/tags request body.
 */
export type ProductsTagsCreateBody = {
  description?: string;
  name: string;
  slug?: string;
};

/**
 * POST /products/tags response body.
 */
export type ProductsTagsCreateResponse = {
  count?: number;
  description?: string;
  id?: number;
  name?: string;
  slug?: string;
};

/**
 * GET /products/tags query parameters.
 */
export type ProductsTagsListQuery = {
  context?: "view" | "edit";
  exclude?: Array<number>;
  hide_empty?: boolean;
  include?: Array<number>;
  offset?: number;
  order?: "asc" | "desc";
  orderby?:
    | "id"
    | "include"
    | "name"
    | "slug"
    | "term_group"
    | "description"
    | "count";
  page?: number;
  parent?: number;
  per_page?: number;
  product?: number;
  search?: string;
  slug?: string;
};

/**
 * GET /products/tags response body.
 */
export type ProductsTagsListResponse = Array<{
  count?: number;
  description?: string;
  id?: number;
  name?: string;
  slug?: string;
}>;
