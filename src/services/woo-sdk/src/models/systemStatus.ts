/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: unknown
 */

/**
 * POST /system_status/tools/{id} path parameters.
 */
export type SystemStatuToolPostCustomPathParams = { id: string };

/**
 * POST /system_status/tools/{id} request body.
 */
export type SystemStatuToolPostCustomBody = {
  action?: string;
  description?: string;
  message?: string;
  name?: string;
  success?: boolean;
};

/**
 * POST /system_status/tools/{id} response body.
 */
export type SystemStatuToolPostCustomResponse = unknown;

/**
 * GET /system_status query parameters.
 */
export type SystemStatusListQuery = { context?: "view" };

/**
 * GET /system_status response body.
 */
export type SystemStatusListResponse = Array<{
  active_plugins?: Array<{
    author_name?: string;
    author_url?: string;
    name?: string;
    network_activated?: boolean;
    plugin?: string;
    url?: string;
    version?: string;
    version_latest?: string;
  }>;
  database?: {
    database_prefix?: string;
    database_tables?: Array<string>;
    maxmind_geoip_database?: string;
    wc_database_version?: string;
  };
  dropins_mu_plugins?: Array<string>;
  environment?: {
    curl_version?: string;
    default_timezone?: string;
    domdocument_enabled?: boolean;
    fsockopen_or_curl_enabled?: boolean;
    gzip_enabled?: boolean;
    home_url?: string;
    language?: string;
    log_directory?: string;
    log_directory_writable?: boolean;
    max_upload_size?: number;
    mbstring_enabled?: boolean;
    mysql_version?: string;
    mysql_version_string?: string;
    php_max_execution_time?: number;
    php_max_input_vars?: number;
    php_post_max_size?: number;
    php_version?: string;
    remote_get_response?: string;
    remote_get_successful?: boolean;
    remote_post_response?: string;
    remote_post_successful?: boolean;
    server_architecture?: string;
    server_info?: string;
    site_url?: string;
    soapclient_enabled?: boolean;
    store_id?: string;
    suhosin_installed?: boolean;
    version?: string;
    wp_cron?: boolean;
    wp_debug_mode?: boolean;
    wp_memory_limit?: number;
    wp_multisite?: boolean;
    wp_version?: string;
  };
  inactive_plugins?: Array<{
    author_name?: string;
    author_url?: string;
    name?: string;
    network_activated?: boolean;
    plugin?: string;
    url?: string;
    version?: string;
    version_latest?: string;
  }>;
  logging?: {
    default_handler?: string;
    level_threshold?: string;
    log_directory_size?: string;
    logging_enabled?: boolean;
    retention_period_days?: number;
  };
  pages?: Array<{
    block?: string;
    block_present?: boolean;
    block_required?: boolean;
    page_exists?: boolean;
    page_id?: string;
    page_name?: string;
    page_set?: boolean;
    page_visible?: boolean;
    shortcode?: string;
    shortcode_present?: boolean;
    shortcode_required?: boolean;
  }>;
  post_type_counts?: Array<string>;
  security?: { hide_errors?: boolean; secure_connection?: boolean };
  settings?: {
    api_enabled?: boolean;
    currency?: string;
    currency_position?: string;
    currency_symbol?: string;
    decimal_separator?: string;
    enabled_features?: Array<unknown>;
    enforce_approved_download_dirs?: boolean;
    force_ssl?: boolean;
    geolocation_enabled?: boolean;
    HPOS_enabled?: boolean;
    HPOS_sync_enabled?: boolean;
    number_of_decimals?: number;
    order_datastore?: string;
    product_visibility_terms?: Array<string>;
    taxonomies?: Array<string>;
    thousand_separator?: string;
    wccom_connected?: string;
  };
  theme?: {
    author_url?: string;
    has_outdated_templates?: boolean;
    has_woocommerce_file?: boolean;
    has_woocommerce_support?: boolean;
    is_block_theme?: boolean;
    is_child_theme?: boolean;
    name?: string;
    overrides?: Array<string>;
    parent_author_url?: string;
    parent_name?: string;
    parent_version?: string;
    version?: string;
    version_latest?: string;
  };
}>;

/**
 * GET /system_status/tools/{id} path parameters.
 */
export type SystemStatusToolGetPathParams = { id: string };

/**
 * GET /system_status/tools/{id} response body.
 */
export type SystemStatusToolGetResponse = unknown;

/**
 * PUT /system_status/tools/{id} path parameters.
 */
export type SystemStatusToolUpdatePathParams = { id: string };

/**
 * PUT /system_status/tools/{id} request body.
 */
export type SystemStatusToolUpdateBody = {
  action?: string;
  description?: string;
  message?: string;
  name?: string;
  success?: boolean;
};

/**
 * PUT /system_status/tools/{id} response body.
 */
export type SystemStatusToolUpdateResponse = unknown;

/**
 * GET /system_status/tools query parameters.
 */
export type SystemStatusToolsListQuery = { context?: "view" | "edit" };

/**
 * GET /system_status/tools response body.
 */
export type SystemStatusToolsListResponse = Array<{
  action?: string;
  description?: string;
  id?: string;
  message?: string;
  name?: string;
  success?: boolean;
}>;
