/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * POST /system_status/tools/{id} path parameters.
 */
export const systemStatuToolPostCustomPathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type SystemStatuToolPostCustomPathParams = z.infer<
  typeof systemStatuToolPostCustomPathParamsSchema
>;

/**
 * POST /system_status/tools/{id} request body.
 */
export const systemStatuToolPostCustomBodySchema = z
  .object({
    action: z.string().optional().describe("What running the tool will do."),
    description: z.string().optional().describe("Tool description."),
    message: z.string().optional().describe("Tool return message."),
    name: z.string().optional().describe("Tool name."),
    success: z.boolean().optional().describe("Did the tool run successfully?"),
  })
  .strict();

export type SystemStatuToolPostCustomBody = z.infer<
  typeof systemStatuToolPostCustomBodySchema
>;

/**
 * POST /system_status/tools/{id} response body.
 */
export const systemStatuToolPostCustomResponseSchema = z.unknown();

export type SystemStatuToolPostCustomResponse = z.infer<
  typeof systemStatuToolPostCustomResponseSchema
>;

/**
 * GET /system_status query parameters.
 */
export const systemStatusListQuerySchema = z
  .object({
    context: z
      .enum(["view"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type SystemStatusListQuery = z.infer<typeof systemStatusListQuerySchema>;

/**
 * GET /system_status response body.
 */
export const systemStatusListResponseSchema = z.array(
  z
    .object({
      active_plugins: z
        .array(
          z
            .object({
              author_name: z
                .string()
                .optional()
                .describe("Plugin author name."),
              author_url: z.string().optional().describe("Plugin author URL."),
              name: z.string().optional().describe("Name of the plugin."),
              network_activated: z
                .boolean()
                .optional()
                .describe(
                  "Whether the plugin can only be activated network-wide.",
                ),
              plugin: z
                .string()
                .optional()
                .describe(
                  "Plugin basename. The path to the main plugin file relative to the plugins directory.",
                ),
              url: z.string().optional().describe("Plugin URL."),
              version: z
                .string()
                .optional()
                .describe("Current plugin version."),
              version_latest: z
                .string()
                .optional()
                .describe("Latest available plugin version."),
            })
            .strict(),
        )
        .optional()
        .describe("Active plugins."),
      database: z
        .object({
          database_prefix: z.string().optional().describe("Database prefix."),
          database_tables: z
            .array(z.string())
            .optional()
            .describe("Database tables."),
          maxmind_geoip_database: z
            .string()
            .optional()
            .describe("MaxMind GeoIP database."),
          wc_database_version: z
            .string()
            .optional()
            .describe("WC database version."),
        })
        .describe("Database.")
        .strict()
        .optional()
        .describe("Database."),
      dropins_mu_plugins: z
        .array(z.string())
        .optional()
        .describe("Dropins & MU plugins."),
      environment: z
        .object({
          curl_version: z.string().optional().describe("cURL version."),
          default_timezone: z.string().optional().describe("Default timezone."),
          domdocument_enabled: z
            .boolean()
            .optional()
            .describe("Is DomDocument class enabled?"),
          fsockopen_or_curl_enabled: z
            .boolean()
            .optional()
            .describe("Is fsockopen/cURL enabled?"),
          gzip_enabled: z.boolean().optional().describe("Is GZip enabled?"),
          home_url: z.string().optional().describe("Home URL."),
          language: z.string().optional().describe("WordPress language."),
          log_directory: z.string().optional().describe("Log directory."),
          log_directory_writable: z
            .boolean()
            .optional()
            .describe("Is log directory writable?"),
          max_upload_size: z.number().optional().describe("Max upload size."),
          mbstring_enabled: z
            .boolean()
            .optional()
            .describe("Is mbstring enabled?"),
          mysql_version: z.string().optional().describe("MySQL version."),
          mysql_version_string: z
            .string()
            .optional()
            .describe("MySQL version string."),
          php_max_execution_time: z
            .number()
            .optional()
            .describe("PHP max execution time."),
          php_max_input_vars: z
            .number()
            .optional()
            .describe("PHP max input vars."),
          php_post_max_size: z
            .number()
            .optional()
            .describe("PHP post max size."),
          php_version: z.string().optional().describe("PHP version."),
          remote_get_response: z
            .string()
            .optional()
            .describe("Remote GET response."),
          remote_get_successful: z
            .boolean()
            .optional()
            .describe("Remote GET successful?"),
          remote_post_response: z
            .string()
            .optional()
            .describe("Remote POST response."),
          remote_post_successful: z
            .boolean()
            .optional()
            .describe("Remote POST successful?"),
          server_architecture: z
            .string()
            .optional()
            .describe("Server architecture."),
          server_info: z.string().optional().describe("Server info."),
          site_url: z.string().optional().describe("Site URL."),
          soapclient_enabled: z
            .boolean()
            .optional()
            .describe("Is SoapClient class enabled?"),
          store_id: z
            .string()
            .optional()
            .describe("WooCommerce Store Identifier."),
          suhosin_installed: z
            .boolean()
            .optional()
            .describe("Is SUHOSIN installed?"),
          version: z.string().optional().describe("WooCommerce version."),
          wp_cron: z
            .boolean()
            .optional()
            .describe("Are WordPress cron jobs enabled?"),
          wp_debug_mode: z
            .boolean()
            .optional()
            .describe("Is WordPress debug mode active?"),
          wp_memory_limit: z
            .number()
            .optional()
            .describe("WordPress memory limit."),
          wp_multisite: z
            .boolean()
            .optional()
            .describe("Is WordPress multisite?"),
          wp_version: z.string().optional().describe("WordPress version."),
        })
        .describe("Environment.")
        .strict()
        .optional()
        .describe("Environment."),
      inactive_plugins: z
        .array(
          z
            .object({
              author_name: z
                .string()
                .optional()
                .describe("Plugin author name."),
              author_url: z.string().optional().describe("Plugin author URL."),
              name: z.string().optional().describe("Name of the plugin."),
              network_activated: z
                .boolean()
                .optional()
                .describe(
                  "Whether the plugin can only be activated network-wide.",
                ),
              plugin: z
                .string()
                .optional()
                .describe(
                  "Plugin basename. The path to the main plugin file relative to the plugins directory.",
                ),
              url: z.string().optional().describe("Plugin URL."),
              version: z
                .string()
                .optional()
                .describe("Current plugin version."),
              version_latest: z
                .string()
                .optional()
                .describe("Latest available plugin version."),
            })
            .strict(),
        )
        .optional()
        .describe("Inactive plugins."),
      logging: z
        .object({
          default_handler: z
            .string()
            .optional()
            .describe("The logging handler class."),
          level_threshold: z
            .string()
            .optional()
            .describe("Minimum severity level."),
          log_directory_size: z
            .string()
            .optional()
            .describe("The size of the log directory."),
          logging_enabled: z
            .boolean()
            .optional()
            .describe("Is logging enabled?"),
          retention_period_days: z
            .number()
            .optional()
            .describe("The number of days log entries are retained."),
        })
        .describe("Logging.")
        .strict()
        .optional()
        .describe("Logging."),
      pages: z
        .array(
          z
            .object({
              block: z.string().optional(),
              block_present: z.boolean().optional(),
              block_required: z.boolean().optional(),
              page_exists: z.boolean().optional(),
              page_id: z.string().optional(),
              page_name: z.string().optional(),
              page_set: z.boolean().optional(),
              page_visible: z.boolean().optional(),
              shortcode: z.string().optional(),
              shortcode_present: z.boolean().optional(),
              shortcode_required: z.boolean().optional(),
            })
            .strict(),
        )
        .optional()
        .describe("WooCommerce pages."),
      post_type_counts: z
        .array(z.string())
        .optional()
        .describe("Total post count."),
      security: z
        .object({
          hide_errors: z
            .boolean()
            .optional()
            .describe("Hide errors from visitors?"),
          secure_connection: z
            .boolean()
            .optional()
            .describe("Is the connection to your store secure?"),
        })
        .describe("Security.")
        .strict()
        .optional()
        .describe("Security."),
      settings: z
        .object({
          api_enabled: z
            .boolean()
            .optional()
            .describe("Legacy REST API enabled?"),
          currency: z.string().optional().describe("Currency."),
          currency_position: z
            .string()
            .optional()
            .describe("Currency position."),
          currency_symbol: z.string().optional().describe("Currency symbol."),
          decimal_separator: z
            .string()
            .optional()
            .describe("Decimal separator."),
          enabled_features: z
            .array(z.unknown())
            .optional()
            .describe("Enabled features."),
          enforce_approved_download_dirs: z
            .boolean()
            .optional()
            .describe("Enforce approved download directories?"),
          force_ssl: z.boolean().optional().describe("SSL forced?"),
          geolocation_enabled: z
            .boolean()
            .optional()
            .describe("Geolocation enabled?"),
          HPOS_enabled: z.boolean().optional().describe("Is HPOS enabled?"),
          HPOS_sync_enabled: z
            .boolean()
            .optional()
            .describe("Is HPOS sync enabled?"),
          number_of_decimals: z
            .number()
            .optional()
            .describe("Number of decimals."),
          order_datastore: z.string().optional().describe("Order datastore."),
          product_visibility_terms: z
            .array(z.string())
            .optional()
            .describe("Terms in the product visibility taxonomy."),
          taxonomies: z
            .array(z.string())
            .optional()
            .describe("Taxonomy terms for product/order statuses."),
          thousand_separator: z
            .string()
            .optional()
            .describe("Thousand separator."),
          wccom_connected: z
            .string()
            .optional()
            .describe("Is store connected to WooCommerce.com?"),
        })
        .describe("Settings.")
        .strict()
        .optional()
        .describe("Settings."),
      theme: z
        .object({
          author_url: z.string().optional().describe("Theme author URL."),
          has_outdated_templates: z
            .boolean()
            .optional()
            .describe("Does this theme have outdated templates?"),
          has_woocommerce_file: z
            .boolean()
            .optional()
            .describe("Does the theme have a woocommerce.php file?"),
          has_woocommerce_support: z
            .boolean()
            .optional()
            .describe("Does the theme declare WooCommerce support?"),
          is_block_theme: z
            .boolean()
            .optional()
            .describe("Is this theme a block theme?"),
          is_child_theme: z
            .boolean()
            .optional()
            .describe("Is this theme a child theme?"),
          name: z.string().optional().describe("Theme name."),
          overrides: z
            .array(z.string())
            .optional()
            .describe("Template overrides."),
          parent_author_url: z
            .string()
            .optional()
            .describe("Parent theme author URL."),
          parent_name: z.string().optional().describe("Parent theme name."),
          parent_version: z
            .string()
            .optional()
            .describe("Parent theme version."),
          version: z.string().optional().describe("Theme version."),
          version_latest: z
            .string()
            .optional()
            .describe("Latest version of theme."),
        })
        .describe("Theme.")
        .strict()
        .optional()
        .describe("Theme."),
    })
    .strict(),
);

export type SystemStatusListResponse = z.infer<
  typeof systemStatusListResponseSchema
>;

/**
 * GET /system_status/tools/{id} path parameters.
 */
export const systemStatusToolGetPathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type SystemStatusToolGetPathParams = z.infer<
  typeof systemStatusToolGetPathParamsSchema
>;

/**
 * GET /system_status/tools/{id} response body.
 */
export const systemStatusToolGetResponseSchema = z
  .object({
    action: z.string().optional().describe("What running the tool will do."),
    description: z.string().optional().describe("Tool description."),
    id: z.string().optional().describe("A unique identifier for the tool."),
    message: z.string().optional().describe("Tool return message."),
    name: z.string().optional().describe("Tool name."),
    success: z.boolean().optional().describe("Did the tool run successfully?"),
  })
  .strict();

export type SystemStatusToolGetResponse = z.infer<
  typeof systemStatusToolGetResponseSchema
>;

/**
 * PUT /system_status/tools/{id} path parameters.
 */
export const systemStatusToolUpdatePathParamsSchema = z
  .object({ id: z.string() })
  .strict();

export type SystemStatusToolUpdatePathParams = z.infer<
  typeof systemStatusToolUpdatePathParamsSchema
>;

/**
 * PUT /system_status/tools/{id} request body.
 */
export const systemStatusToolUpdateBodySchema = z
  .object({
    action: z.string().optional().describe("What running the tool will do."),
    description: z.string().optional().describe("Tool description."),
    message: z.string().optional().describe("Tool return message."),
    name: z.string().optional().describe("Tool name."),
    success: z.boolean().optional().describe("Did the tool run successfully?"),
  })
  .strict();

export type SystemStatusToolUpdateBody = z.infer<
  typeof systemStatusToolUpdateBodySchema
>;

/**
 * PUT /system_status/tools/{id} response body.
 */
export const systemStatusToolUpdateResponseSchema = z.unknown();

export type SystemStatusToolUpdateResponse = z.infer<
  typeof systemStatusToolUpdateResponseSchema
>;

/**
 * GET /system_status/tools query parameters.
 */
export const systemStatusToolsListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type SystemStatusToolsListQuery = z.infer<
  typeof systemStatusToolsListQuerySchema
>;

/**
 * GET /system_status/tools response body.
 */
export const systemStatusToolsListResponseSchema = z.array(
  z
    .object({
      action: z.string().optional().describe("What running the tool will do."),
      description: z.string().optional().describe("Tool description."),
      id: z.string().optional().describe("A unique identifier for the tool."),
      message: z.string().optional().describe("Tool return message."),
      name: z.string().optional().describe("Tool name."),
      success: z
        .boolean()
        .optional()
        .describe("Did the tool run successfully?"),
    })
    .strict(),
);

export type SystemStatusToolsListResponse = z.infer<
  typeof systemStatusToolsListResponseSchema
>;
