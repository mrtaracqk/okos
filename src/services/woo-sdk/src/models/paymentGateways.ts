/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * GET /payment_gateways/{id} path parameters.
 */
export type PaymentGatewayGetPathParams = { id: string };

/**
 * GET /payment_gateways/{id} query parameters.
 */
export type PaymentGatewayGetQuery = { context?: "view" | "edit" };

/**
 * GET /payment_gateways/{id} response body.
 */
export type PaymentGatewayGetResponse = unknown;

/**
 * POST /payment_gateways/{id} path parameters.
 */
export type PaymentGatewayPostCustomPathParams = { id: string };

/**
 * POST /payment_gateways/{id} request body.
 */
export type PaymentGatewayPostCustomBody = {
  description?: string;
  enabled?: boolean;
  order?: number;
  settings?: {
    default?: string;
    description?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    tip?: string;
    type?:
      | "text"
      | "email"
      | "number"
      | "color"
      | "password"
      | "textarea"
      | "select"
      | "multiselect"
      | "radio"
      | "image_width"
      | "checkbox";
    value?: string;
  };
  title?: string;
};

/**
 * POST /payment_gateways/{id} response body.
 */
export type PaymentGatewayPostCustomResponse = unknown;

/**
 * PUT /payment_gateways/{id} path parameters.
 */
export type PaymentGatewayUpdatePathParams = { id: string };

/**
 * PUT /payment_gateways/{id} request body.
 */
export type PaymentGatewayUpdateBody = {
  description?: string;
  enabled?: boolean;
  order?: number;
  settings?: {
    default?: string;
    description?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    tip?: string;
    type?:
      | "text"
      | "email"
      | "number"
      | "color"
      | "password"
      | "textarea"
      | "select"
      | "multiselect"
      | "radio"
      | "image_width"
      | "checkbox";
    value?: string;
  };
  title?: string;
};

/**
 * PUT /payment_gateways/{id} response body.
 */
export type PaymentGatewayUpdateResponse = unknown;

/**
 * GET /payment_gateways query parameters.
 */
export type PaymentGatewaysListQuery = { context?: "view" | "edit" };

/**
 * GET /payment_gateways response body.
 */
export type PaymentGatewaysListResponse = Array<{
  description?: string;
  enabled?: boolean;
  id?: string;
  method_description?: string;
  method_supports?: Array<string>;
  method_title?: string;
  order?: number;
  settings?: {
    default?: string;
    description?: string;
    id?: string;
    label?: string;
    placeholder?: string;
    tip?: string;
    type?:
      | "text"
      | "email"
      | "number"
      | "color"
      | "password"
      | "textarea"
      | "select"
      | "multiselect"
      | "radio"
      | "image_width"
      | "checkbox";
    value?: string;
  };
  title?: string;
}>;
