/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * DELETE /shipping/zones/{id} path parameters.
 */
export type ShippingZoneDeletePathParams = { id: number };

/**
 * DELETE /shipping/zones/{id} query parameters.
 */
export type ShippingZoneDeleteQuery = { force?: boolean };

/**
 * DELETE /shipping/zones/{id} response body.
 */
export type ShippingZoneDeleteResponse = unknown;

/**
 * GET /shipping/zones/{id} path parameters.
 */
export type ShippingZoneGetPathParams = { id: number };

/**
 * GET /shipping/zones/{id} response body.
 */
export type ShippingZoneGetResponse = unknown;

/**
 * PUT /shipping/zones/{id}/locations path parameters.
 */
export type ShippingZoneLocationPutCustomPathParams = { id: number };

/**
 * PUT /shipping/zones/{id}/locations request body.
 */
export type ShippingZoneLocationPutCustomBody = {
  code?: string;
  type?: "postcode" | "state" | "country" | "continent";
};

/**
 * PUT /shipping/zones/{id}/locations response body.
 */
export type ShippingZoneLocationPutCustomResponse = unknown;

/**
 * POST /shipping/zones/{id}/locations path parameters.
 */
export type ShippingZoneLocationsCreatePathParams = { id: number };

/**
 * POST /shipping/zones/{id}/locations request body.
 */
export type ShippingZoneLocationsCreateBody = {
  code?: string;
  type?: "postcode" | "state" | "country" | "continent";
};

/**
 * POST /shipping/zones/{id}/locations response body.
 */
export type ShippingZoneLocationsCreateResponse = unknown;

/**
 * GET /shipping/zones/{id}/locations path parameters.
 */
export type ShippingZoneLocationsListPathParams = { id: number };

/**
 * GET /shipping/zones/{id}/locations response body.
 */
export type ShippingZoneLocationsListResponse = Array<unknown>;

/**
 * DELETE /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export type ShippingZoneMethodDeletePathParams = {
  instance_id: number;
  zone_id: number;
};

/**
 * DELETE /shipping/zones/{zone_id}/methods/{instance_id} query parameters.
 */
export type ShippingZoneMethodDeleteQuery = { force?: boolean };

/**
 * DELETE /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export type ShippingZoneMethodDeleteResponse = unknown;

/**
 * GET /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export type ShippingZoneMethodGetPathParams = {
  instance_id: number;
  zone_id: number;
};

/**
 * GET /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export type ShippingZoneMethodGetResponse = unknown;

/**
 * POST /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export type ShippingZoneMethodPostCustomPathParams = {
  instance_id: number;
  zone_id: number;
};

/**
 * POST /shipping/zones/{zone_id}/methods/{instance_id} request body.
 */
export type ShippingZoneMethodPostCustomBody = {
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
      | "checkbox"
      | "class"
      | "order";
    value?: string;
  };
};

/**
 * POST /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export type ShippingZoneMethodPostCustomResponse = unknown;

/**
 * PUT /shipping/zones/{zone_id}/methods/{instance_id} path parameters.
 */
export type ShippingZoneMethodUpdatePathParams = {
  instance_id: number;
  zone_id: number;
};

/**
 * PUT /shipping/zones/{zone_id}/methods/{instance_id} request body.
 */
export type ShippingZoneMethodUpdateBody = {
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
      | "checkbox"
      | "class"
      | "order";
    value?: string;
  };
};

/**
 * PUT /shipping/zones/{zone_id}/methods/{instance_id} response body.
 */
export type ShippingZoneMethodUpdateResponse = unknown;

/**
 * POST /shipping/zones/{zone_id}/methods path parameters.
 */
export type ShippingZoneMethodsCreatePathParams = { zone_id: number };

/**
 * POST /shipping/zones/{zone_id}/methods request body.
 */
export type ShippingZoneMethodsCreateBody = {
  enabled?: boolean;
  method_id: unknown;
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
      | "checkbox"
      | "class"
      | "order";
    value?: string;
  };
};

/**
 * POST /shipping/zones/{zone_id}/methods response body.
 */
export type ShippingZoneMethodsCreateResponse = unknown;

/**
 * GET /shipping/zones/{zone_id}/methods path parameters.
 */
export type ShippingZoneMethodsListPathParams = { zone_id: number };

/**
 * GET /shipping/zones/{zone_id}/methods response body.
 */
export type ShippingZoneMethodsListResponse = Array<unknown>;

/**
 * POST /shipping/zones/{id} path parameters.
 */
export type ShippingZonePostCustomPathParams = { id: number };

/**
 * POST /shipping/zones/{id} request body.
 */
export type ShippingZonePostCustomBody = { name?: string; order?: number };

/**
 * POST /shipping/zones/{id} response body.
 */
export type ShippingZonePostCustomResponse = unknown;

/**
 * PUT /shipping/zones/{id} path parameters.
 */
export type ShippingZoneUpdatePathParams = { id: number };

/**
 * PUT /shipping/zones/{id} request body.
 */
export type ShippingZoneUpdateBody = { name?: string; order?: number };

/**
 * PUT /shipping/zones/{id} response body.
 */
export type ShippingZoneUpdateResponse = unknown;

/**
 * POST /shipping/zones request body.
 */
export type ShippingZonesCreateBody = { name: string; order?: number };

/**
 * POST /shipping/zones response body.
 */
export type ShippingZonesCreateResponse = {
  id?: number;
  name?: string;
  order?: number;
};

/**
 * GET /shipping/zones response body.
 */
export type ShippingZonesListResponse = Array<{
  id?: number;
  name?: string;
  order?: number;
}>;
