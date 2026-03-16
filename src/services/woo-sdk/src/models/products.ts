/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * POST /products/attributes/{id} path parameters.
 */
export const productAttributePostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductAttributePostCustomPathParams = z.infer<
  typeof productAttributePostCustomPathParamsSchema
>;

/**
 * POST /products/attributes/{id} request body.
 */
export const productAttributePostCustomBodySchema = z
  .object({
    has_archives: z
      .boolean()
      .optional()
      .describe("Enable/Disable attribute archives."),
    name: z.string().optional().describe("Attribute name."),
    order_by: z
      .enum(["menu_order", "name", "name_num", "id"])
      .optional()
      .describe("Default sort order."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
    type: z.enum(["select"]).optional().describe("Type of attribute."),
  })
  .strict();

export type ProductAttributePostCustomBody = z.infer<
  typeof productAttributePostCustomBodySchema
>;

/**
 * POST /products/attributes/{id} response body.
 */
export const productAttributePostCustomResponseSchema = z.unknown();

export type ProductAttributePostCustomResponse = z.infer<
  typeof productAttributePostCustomResponseSchema
>;

/**
 * PUT /products/attributes/batch request body.
 */
export const productAttributePutBatchCustomBodySchema = z
  .object({
    has_archives: z
      .boolean()
      .optional()
      .describe("Enable/Disable attribute archives."),
    name: z.string().optional().describe("Attribute name."),
    order_by: z
      .enum(["menu_order", "name", "name_num", "id"])
      .optional()
      .describe("Default sort order."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
    type: z.enum(["select"]).optional().describe("Type of attribute."),
  })
  .strict();

export type ProductAttributePutBatchCustomBody = z.infer<
  typeof productAttributePutBatchCustomBodySchema
>;

/**
 * PUT /products/attributes/batch response body.
 */
export const productAttributePutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductAttributePutBatchCustomResponse = z.infer<
  typeof productAttributePutBatchCustomResponseSchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export const productAttributeTermPostCustomPathParamsSchema = z
  .object({ attribute_id: z.number(), id: z.number() })
  .strict();

export type ProductAttributeTermPostCustomPathParams = z.infer<
  typeof productAttributeTermPostCustomPathParamsSchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms/{id} request body.
 */
export const productAttributeTermPostCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Term name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductAttributeTermPostCustomBody = z.infer<
  typeof productAttributeTermPostCustomBodySchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms/{id} response body.
 */
export const productAttributeTermPostCustomResponseSchema = z.unknown();

export type ProductAttributeTermPostCustomResponse = z.infer<
  typeof productAttributeTermPostCustomResponseSchema
>;

/**
 * PUT /products/attributes/{attribute_id}/terms/batch path parameters.
 */
export const productAttributeTermPutBatchCustomPathParamsSchema = z
  .object({ attribute_id: z.number() })
  .strict();

export type ProductAttributeTermPutBatchCustomPathParams = z.infer<
  typeof productAttributeTermPutBatchCustomPathParamsSchema
>;

/**
 * PUT /products/attributes/{attribute_id}/terms/batch request body.
 */
export const productAttributeTermPutBatchCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Term name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductAttributeTermPutBatchCustomBody = z.infer<
  typeof productAttributeTermPutBatchCustomBodySchema
>;

/**
 * PUT /products/attributes/{attribute_id}/terms/batch response body.
 */
export const productAttributeTermPutBatchCustomResponseSchema = z.unknown();

export type ProductAttributeTermPutBatchCustomResponse = z.infer<
  typeof productAttributeTermPutBatchCustomResponseSchema
>;

/**
 * POST /products/brands/{id} path parameters.
 */
export const productBrandPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductBrandPostCustomPathParams = z.infer<
  typeof productBrandPostCustomPathParamsSchema
>;

/**
 * POST /products/brands/{id} request body.
 */
export const productBrandPostCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductBrandPostCustomBody = z.infer<
  typeof productBrandPostCustomBodySchema
>;

/**
 * POST /products/brands/{id} response body.
 */
export const productBrandPostCustomResponseSchema = z.unknown();

export type ProductBrandPostCustomResponse = z.infer<
  typeof productBrandPostCustomResponseSchema
>;

/**
 * PUT /products/brands/batch request body.
 */
export const productBrandPutBatchCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductBrandPutBatchCustomBody = z.infer<
  typeof productBrandPutBatchCustomBodySchema
>;

/**
 * PUT /products/brands/batch response body.
 */
export const productBrandPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductBrandPutBatchCustomResponse = z.infer<
  typeof productBrandPutBatchCustomResponseSchema
>;

/**
 * POST /products/categories/{id} path parameters.
 */
export const productCategoryPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductCategoryPostCustomPathParams = z.infer<
  typeof productCategoryPostCustomPathParamsSchema
>;

/**
 * POST /products/categories/{id} request body.
 */
export const productCategoryPostCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductCategoryPostCustomBody = z.infer<
  typeof productCategoryPostCustomBodySchema
>;

/**
 * POST /products/categories/{id} response body.
 */
export const productCategoryPostCustomResponseSchema = z.unknown();

export type ProductCategoryPostCustomResponse = z.infer<
  typeof productCategoryPostCustomResponseSchema
>;

/**
 * PUT /products/categories/batch request body.
 */
export const productCategoryPutBatchCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductCategoryPutBatchCustomBody = z.infer<
  typeof productCategoryPutBatchCustomBodySchema
>;

/**
 * PUT /products/categories/batch response body.
 */
export const productCategoryPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductCategoryPutBatchCustomResponse = z.infer<
  typeof productCategoryPutBatchCustomResponseSchema
>;

/**
 * DELETE /products/{id} path parameters.
 */
export const productDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductDeletePathParams = z.infer<
  typeof productDeletePathParamsSchema
>;

/**
 * DELETE /products/{id} query parameters.
 */
export const productDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type ProductDeleteQuery = z.infer<typeof productDeleteQuerySchema>;

/**
 * DELETE /products/{id} response body.
 */
export const productDeleteResponseSchema = z.unknown();

export type ProductDeleteResponse = z.infer<typeof productDeleteResponseSchema>;

/**
 * POST /products/{id}/duplicate path parameters.
 */
export const productDuplicateCreatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductDuplicateCreatePathParams = z.infer<
  typeof productDuplicateCreatePathParamsSchema
>;

/**
 * POST /products/{id}/duplicate request body.
 */
export const productDuplicateCreateBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    name: z.string().optional().describe("Product name."),
    parent_id: z.number().optional().describe("Product parent ID."),
    post_password: z.string().optional().describe("Post password."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    regular_price: z.string().optional().describe("Product regular price."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductDuplicateCreateBody = z.infer<
  typeof productDuplicateCreateBodySchema
>;

/**
 * POST /products/{id}/duplicate response body.
 */
export const productDuplicateCreateResponseSchema = z.unknown();

export type ProductDuplicateCreateResponse = z.infer<
  typeof productDuplicateCreateResponseSchema
>;

/**
 * GET /products/{id} path parameters.
 */
export const productGetPathParamsSchema = z.object({ id: z.number() }).strict();

export type ProductGetPathParams = z.infer<typeof productGetPathParamsSchema>;

/**
 * GET /products/{id} query parameters.
 */
export const productGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductGetQuery = z.infer<typeof productGetQuerySchema>;

/**
 * GET /products/{id} response body.
 */
export const productGetResponseSchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    average_rating: z.string().optional().describe("Reviews average rating."),
    backordered: z
      .boolean()
      .optional()
      .describe("Shows if the product is on backordered."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    backorders_allowed: z
      .boolean()
      .optional()
      .describe("Shows if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the product was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the product was last modified, as GMT."),
    date_on_sale_from: z
      .string()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    generated_slug: z
      .string()
      .optional()
      .describe("Slug automatically generated from the product name."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    grouped_products: z
      .array(z.number())
      .optional()
      .describe("List of grouped products ID."),
    has_options: z
      .boolean()
      .optional()
      .describe(
        "Shows if the product needs to be configured before it can be bought.",
      ),
    id: z.number().optional().describe("Unique identifier for the resource."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
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
    name: z.string().optional().describe("Product name."),
    on_sale: z
      .boolean()
      .optional()
      .describe("Shows if the product is on sale."),
    parent_id: z.number().optional().describe("Product parent ID."),
    permalink: z.string().optional().describe("Product URL."),
    permalink_template: z
      .string()
      .optional()
      .describe("Permalink template for the product."),
    post_password: z.string().optional().describe("Post password."),
    price: z.string().optional().describe("Current product price."),
    price_html: z.string().optional().describe("Price formatted in HTML."),
    purchasable: z
      .boolean()
      .optional()
      .describe("Shows if the product can be bought."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    rating_count: z
      .number()
      .optional()
      .describe("Amount of reviews that the product have."),
    regular_price: z.string().optional().describe("Product regular price."),
    related_ids: z
      .array(z.number())
      .optional()
      .describe("List of related products IDs."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    shipping_class_id: z.string().optional().describe("Shipping class ID."),
    shipping_required: z
      .boolean()
      .optional()
      .describe("Shows if the product need to be shipped."),
    shipping_taxable: z
      .boolean()
      .optional()
      .describe("Shows whether or not the product shipping is taxable."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    total_sales: z.number().optional().describe("Amount of sales."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    variations: z
      .array(z.number())
      .optional()
      .describe("List of variations IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductGetResponse = z.infer<typeof productGetResponseSchema>;

/**
 * POST /products/{id} path parameters.
 */
export const productPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductPostCustomPathParams = z.infer<
  typeof productPostCustomPathParamsSchema
>;

/**
 * POST /products/{id} request body.
 */
export const productPostCustomBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    name: z.string().optional().describe("Product name."),
    parent_id: z.number().optional().describe("Product parent ID."),
    post_password: z.string().optional().describe("Post password."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    regular_price: z.string().optional().describe("Product regular price."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductPostCustomBody = z.infer<typeof productPostCustomBodySchema>;

/**
 * POST /products/{id} response body.
 */
export const productPostCustomResponseSchema = z.unknown();

export type ProductPostCustomResponse = z.infer<
  typeof productPostCustomResponseSchema
>;

/**
 * PUT /products/batch request body.
 */
export const productPutBatchCustomBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    name: z.string().optional().describe("Product name."),
    parent_id: z.number().optional().describe("Product parent ID."),
    post_password: z.string().optional().describe("Post password."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    regular_price: z.string().optional().describe("Product regular price."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductPutBatchCustomBody = z.infer<
  typeof productPutBatchCustomBodySchema
>;

/**
 * PUT /products/batch response body.
 */
export const productPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductPutBatchCustomResponse = z.infer<
  typeof productPutBatchCustomResponseSchema
>;

/**
 * POST /products/reviews/{id} path parameters.
 */
export const productReviewPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductReviewPostCustomPathParams = z.infer<
  typeof productReviewPostCustomPathParamsSchema
>;

/**
 * POST /products/reviews/{id} request body.
 */
export const productReviewPostCustomBodySchema = z
  .object({
    product_id: z
      .number()
      .optional()
      .describe(
        "Unique identifier for the product that the review belongs to.",
      ),
    product_name: z.string().optional().describe("Product name."),
    rating: z.number().optional().describe("Review rating (0 to 5)."),
    review: z.string().optional().describe("The content of the review."),
    reviewer: z.string().optional().describe("Reviewer name."),
    reviewer_email: z.string().optional().describe("Reviewer email."),
    status: z
      .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
      .optional()
      .describe("Status of the review."),
  })
  .strict();

export type ProductReviewPostCustomBody = z.infer<
  typeof productReviewPostCustomBodySchema
>;

/**
 * POST /products/reviews/{id} response body.
 */
export const productReviewPostCustomResponseSchema = z.unknown();

export type ProductReviewPostCustomResponse = z.infer<
  typeof productReviewPostCustomResponseSchema
>;

/**
 * PUT /products/reviews/batch request body.
 */
export const productReviewPutBatchCustomBodySchema = z
  .object({
    product_id: z
      .number()
      .optional()
      .describe(
        "Unique identifier for the product that the review belongs to.",
      ),
    product_name: z.string().optional().describe("Product name."),
    rating: z.number().optional().describe("Review rating (0 to 5)."),
    review: z.string().optional().describe("The content of the review."),
    reviewer: z.string().optional().describe("Reviewer name."),
    reviewer_email: z.string().optional().describe("Reviewer email."),
    status: z
      .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
      .optional()
      .describe("Status of the review."),
  })
  .strict();

export type ProductReviewPutBatchCustomBody = z.infer<
  typeof productReviewPutBatchCustomBodySchema
>;

/**
 * PUT /products/reviews/batch response body.
 */
export const productReviewPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductReviewPutBatchCustomResponse = z.infer<
  typeof productReviewPutBatchCustomResponseSchema
>;

/**
 * POST /products/shipping_classes/{id} path parameters.
 */
export const productShippingClassPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductShippingClassPostCustomPathParams = z.infer<
  typeof productShippingClassPostCustomPathParamsSchema
>;

/**
 * POST /products/shipping_classes/{id} request body.
 */
export const productShippingClassPostCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Shipping class name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductShippingClassPostCustomBody = z.infer<
  typeof productShippingClassPostCustomBodySchema
>;

/**
 * POST /products/shipping_classes/{id} response body.
 */
export const productShippingClassPostCustomResponseSchema = z.unknown();

export type ProductShippingClassPostCustomResponse = z.infer<
  typeof productShippingClassPostCustomResponseSchema
>;

/**
 * PUT /products/shipping_classes/batch request body.
 */
export const productShippingClassPutBatchCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Shipping class name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductShippingClassPutBatchCustomBody = z.infer<
  typeof productShippingClassPutBatchCustomBodySchema
>;

/**
 * PUT /products/shipping_classes/batch response body.
 */
export const productShippingClassPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductShippingClassPutBatchCustomResponse = z.infer<
  typeof productShippingClassPutBatchCustomResponseSchema
>;

/**
 * POST /products/tags/{id} path parameters.
 */
export const productTagPostCustomPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductTagPostCustomPathParams = z.infer<
  typeof productTagPostCustomPathParamsSchema
>;

/**
 * POST /products/tags/{id} request body.
 */
export const productTagPostCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Tag name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductTagPostCustomBody = z.infer<
  typeof productTagPostCustomBodySchema
>;

/**
 * POST /products/tags/{id} response body.
 */
export const productTagPostCustomResponseSchema = z.unknown();

export type ProductTagPostCustomResponse = z.infer<
  typeof productTagPostCustomResponseSchema
>;

/**
 * PUT /products/tags/batch request body.
 */
export const productTagPutBatchCustomBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Tag name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductTagPutBatchCustomBody = z.infer<
  typeof productTagPutBatchCustomBodySchema
>;

/**
 * PUT /products/tags/batch response body.
 */
export const productTagPutBatchCustomResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductTagPutBatchCustomResponse = z.infer<
  typeof productTagPutBatchCustomResponseSchema
>;

/**
 * PUT /products/{id} path parameters.
 */
export const productUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductUpdatePathParams = z.infer<
  typeof productUpdatePathParamsSchema
>;

/**
 * PUT /products/{id} request body.
 */
export const productUpdateBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    name: z.string().optional().describe("Product name."),
    parent_id: z.number().optional().describe("Product parent ID."),
    post_password: z.string().optional().describe("Post password."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    regular_price: z.string().optional().describe("Product regular price."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductUpdateBody = z.infer<typeof productUpdateBodySchema>;

/**
 * PUT /products/{id} response body.
 */
export const productUpdateResponseSchema = z.unknown();

export type ProductUpdateResponse = z.infer<typeof productUpdateResponseSchema>;

/**
 * DELETE /products/{product_id}/variations/{id} path parameters.
 */
export const productVariationDeletePathParamsSchema = z
  .object({ id: z.number(), product_id: z.number() })
  .strict();

export type ProductVariationDeletePathParams = z.infer<
  typeof productVariationDeletePathParamsSchema
>;

/**
 * DELETE /products/{product_id}/variations/{id} query parameters.
 */
export const productVariationDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type ProductVariationDeleteQuery = z.infer<
  typeof productVariationDeleteQuerySchema
>;

/**
 * DELETE /products/{product_id}/variations/{id} response body.
 */
export const productVariationDeleteResponseSchema = z.unknown();

export type ProductVariationDeleteResponse = z.infer<
  typeof productVariationDeleteResponseSchema
>;

/**
 * GET /products/{product_id}/variations/{id} path parameters.
 */
export const productVariationGetPathParamsSchema = z
  .object({ id: z.number(), product_id: z.number() })
  .strict();

export type ProductVariationGetPathParams = z.infer<
  typeof productVariationGetPathParamsSchema
>;

/**
 * GET /products/{product_id}/variations/{id} query parameters.
 */
export const productVariationGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductVariationGetQuery = z.infer<
  typeof productVariationGetQuerySchema
>;

/**
 * GET /products/{product_id}/variations/{id} response body.
 */
export const productVariationGetResponseSchema = z.unknown();

export type ProductVariationGetResponse = z.infer<
  typeof productVariationGetResponseSchema
>;

/**
 * POST /products/{product_id}/variations/{id} path parameters.
 */
export const productVariationPostCustomPathParamsSchema = z
  .object({ id: z.number(), product_id: z.number() })
  .strict();

export type ProductVariationPostCustomPathParams = z.infer<
  typeof productVariationPostCustomPathParamsSchema
>;

/**
 * POST /products/{product_id}/variations/{id} request body.
 */
export const productVariationPostCustomBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    description: z.string().optional().describe("Variation description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Variation height (in)."),
        length: z.string().optional().describe("Variation length (in)."),
        width: z.string().optional().describe("Variation width (in)."),
      })
      .describe("Variation dimensions.")
      .strict()
      .optional()
      .describe("Variation dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the variation is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Variation image data.")
      .strict()
      .optional()
      .describe("Variation image data."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the variation."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at variation level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    regular_price: z.string().optional().describe("Variation regular price."),
    sale_price: z.string().optional().describe("Variation sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    status: z
      .enum(["draft", "pending", "private", "publish"])
      .optional()
      .describe("Variation status."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    virtual: z.boolean().optional().describe("If the variation is virtual."),
    weight: z.string().optional().describe("Variation weight (lbs)."),
  })
  .strict();

export type ProductVariationPostCustomBody = z.infer<
  typeof productVariationPostCustomBodySchema
>;

/**
 * POST /products/{product_id}/variations/{id} response body.
 */
export const productVariationPostCustomResponseSchema = z.unknown();

export type ProductVariationPostCustomResponse = z.infer<
  typeof productVariationPostCustomResponseSchema
>;

/**
 * PUT /products/{product_id}/variations/batch path parameters.
 */
export const productVariationPutBatchCustomPathParamsSchema = z
  .object({ product_id: z.number() })
  .strict();

export type ProductVariationPutBatchCustomPathParams = z.infer<
  typeof productVariationPutBatchCustomPathParamsSchema
>;

/**
 * PUT /products/{product_id}/variations/batch request body.
 */
export const productVariationPutBatchCustomBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    description: z.string().optional().describe("Variation description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Variation height (in)."),
        length: z.string().optional().describe("Variation length (in)."),
        width: z.string().optional().describe("Variation width (in)."),
      })
      .describe("Variation dimensions.")
      .strict()
      .optional()
      .describe("Variation dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the variation is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Variation image data.")
      .strict()
      .optional()
      .describe("Variation image data."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the variation."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at variation level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    regular_price: z.string().optional().describe("Variation regular price."),
    sale_price: z.string().optional().describe("Variation sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    status: z
      .enum(["draft", "pending", "private", "publish"])
      .optional()
      .describe("Variation status."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    virtual: z.boolean().optional().describe("If the variation is virtual."),
    weight: z.string().optional().describe("Variation weight (lbs)."),
  })
  .strict();

export type ProductVariationPutBatchCustomBody = z.infer<
  typeof productVariationPutBatchCustomBodySchema
>;

/**
 * PUT /products/{product_id}/variations/batch response body.
 */
export const productVariationPutBatchCustomResponseSchema = z.unknown();

export type ProductVariationPutBatchCustomResponse = z.infer<
  typeof productVariationPutBatchCustomResponseSchema
>;

/**
 * PUT /products/{product_id}/variations/{id} path parameters.
 */
export const productVariationUpdatePathParamsSchema = z
  .object({ id: z.number(), product_id: z.number() })
  .strict();

export type ProductVariationUpdatePathParams = z.infer<
  typeof productVariationUpdatePathParamsSchema
>;

/**
 * PUT /products/{product_id}/variations/{id} request body.
 */
export const productVariationUpdateBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    description: z.string().optional().describe("Variation description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Variation height (in)."),
        length: z.string().optional().describe("Variation length (in)."),
        width: z.string().optional().describe("Variation width (in)."),
      })
      .describe("Variation dimensions.")
      .strict()
      .optional()
      .describe("Variation dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the variation is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Variation image data.")
      .strict()
      .optional()
      .describe("Variation image data."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the variation."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at variation level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    regular_price: z.string().optional().describe("Variation regular price."),
    sale_price: z.string().optional().describe("Variation sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    status: z
      .enum(["draft", "pending", "private", "publish"])
      .optional()
      .describe("Variation status."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    virtual: z.boolean().optional().describe("If the variation is virtual."),
    weight: z.string().optional().describe("Variation weight (lbs)."),
  })
  .strict();

export type ProductVariationUpdateBody = z.infer<
  typeof productVariationUpdateBodySchema
>;

/**
 * PUT /products/{product_id}/variations/{id} response body.
 */
export const productVariationUpdateResponseSchema = z.unknown();

export type ProductVariationUpdateResponse = z.infer<
  typeof productVariationUpdateResponseSchema
>;

/**
 * POST /products/{product_id}/variations/batch path parameters.
 */
export const productVariationsBatchUpdatePathParamsSchema = z
  .object({ product_id: z.number() })
  .strict();

export type ProductVariationsBatchUpdatePathParams = z.infer<
  typeof productVariationsBatchUpdatePathParamsSchema
>;

/**
 * POST /products/{product_id}/variations/batch request body.
 */
export const productVariationsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            attributes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Attribute ID."),
                    name: z.string().optional().describe("Attribute name."),
                    option: z
                      .string()
                      .optional()
                      .describe("Selected attribute term name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of attributes."),
            backorders: z
              .enum(["no", "notify", "yes"])
              .optional()
              .describe(
                "If managing stock, this controls if backorders are allowed.",
              ),
            date_on_sale_from: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, in the site's timezone."),
            date_on_sale_from_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, as GMT."),
            date_on_sale_to: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            date_on_sale_to_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            description: z
              .string()
              .optional()
              .describe("Variation description."),
            dimensions: z
              .object({
                height: z
                  .string()
                  .optional()
                  .describe("Variation height (in)."),
                length: z
                  .string()
                  .optional()
                  .describe("Variation length (in)."),
                width: z.string().optional().describe("Variation width (in)."),
              })
              .describe("Variation dimensions.")
              .strict()
              .optional()
              .describe("Variation dimensions."),
            download_expiry: z
              .number()
              .optional()
              .describe(
                "Number of days until access to downloadable files expires.",
              ),
            download_limit: z
              .number()
              .optional()
              .describe(
                "Number of times downloadable files can be downloaded after purchase.",
              ),
            downloadable: z
              .boolean()
              .optional()
              .describe("If the variation is downloadable."),
            downloads: z
              .array(
                z
                  .object({
                    file: z.string().optional().describe("File URL."),
                    id: z.string().optional().describe("File ID."),
                    name: z.string().optional().describe("File name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of downloadable files."),
            global_unique_id: z
              .string()
              .optional()
              .describe("GTIN, UPC, EAN or ISBN."),
            image: z
              .object({
                alt: z.string().optional().describe("Image alternative text."),
                date_created: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was created, in the site's timezone.",
                  ),
                date_created_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was created, as GMT."),
                date_modified: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was last modified, in the site's timezone.",
                  ),
                date_modified_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was last modified, as GMT."),
                id: z.number().optional().describe("Image ID."),
                name: z.string().optional().describe("Image name."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Variation image data.")
              .strict()
              .optional()
              .describe("Variation image data."),
            low_stock_amount: z
              .number()
              .nullable()
              .optional()
              .describe("Low Stock amount for the variation."),
            manage_stock: z
              .boolean()
              .optional()
              .describe("Stock management at variation level."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort products."),
            meta_data: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z
                      .union([
                        z.record(z.string(), z.unknown()),
                        z.string(),
                        z.number(),
                        z.boolean(),
                        z.number(),
                        z.array(z.unknown()),
                      ])
                      .nullable()
                      .optional()
                      .describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            regular_price: z
              .string()
              .optional()
              .describe("Variation regular price."),
            sale_price: z.string().optional().describe("Variation sale price."),
            shipping_class: z
              .string()
              .optional()
              .describe("Shipping class slug."),
            sku: z.string().optional().describe("Stock Keeping Unit."),
            status: z
              .enum(["draft", "pending", "private", "publish"])
              .optional()
              .describe("Variation status."),
            stock_quantity: z.number().optional().describe("Stock quantity."),
            stock_status: z
              .enum(["instock", "outofstock", "onbackorder"])
              .optional()
              .describe("Controls the stock status of the product."),
            tax_class: z.string().optional().describe("Tax class."),
            tax_status: z
              .enum(["taxable", "shipping", "none"])
              .optional()
              .describe("Tax status."),
            virtual: z
              .boolean()
              .optional()
              .describe("If the variation is virtual."),
            weight: z.string().optional().describe("Variation weight (lbs)."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            attributes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Attribute ID."),
                    name: z.string().optional().describe("Attribute name."),
                    option: z
                      .string()
                      .optional()
                      .describe("Selected attribute term name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of attributes."),
            backorders: z
              .enum(["no", "notify", "yes"])
              .optional()
              .describe(
                "If managing stock, this controls if backorders are allowed.",
              ),
            date_on_sale_from: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, in the site's timezone."),
            date_on_sale_from_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, as GMT."),
            date_on_sale_to: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            date_on_sale_to_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            description: z
              .string()
              .optional()
              .describe("Variation description."),
            dimensions: z
              .object({
                height: z
                  .string()
                  .optional()
                  .describe("Variation height (in)."),
                length: z
                  .string()
                  .optional()
                  .describe("Variation length (in)."),
                width: z.string().optional().describe("Variation width (in)."),
              })
              .describe("Variation dimensions.")
              .strict()
              .optional()
              .describe("Variation dimensions."),
            download_expiry: z
              .number()
              .optional()
              .describe(
                "Number of days until access to downloadable files expires.",
              ),
            download_limit: z
              .number()
              .optional()
              .describe(
                "Number of times downloadable files can be downloaded after purchase.",
              ),
            downloadable: z
              .boolean()
              .optional()
              .describe("If the variation is downloadable."),
            downloads: z
              .array(
                z
                  .object({
                    file: z.string().optional().describe("File URL."),
                    id: z.string().optional().describe("File ID."),
                    name: z.string().optional().describe("File name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of downloadable files."),
            global_unique_id: z
              .string()
              .optional()
              .describe("GTIN, UPC, EAN or ISBN."),
            id: z.number(),
            image: z
              .object({
                alt: z.string().optional().describe("Image alternative text."),
                date_created: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was created, in the site's timezone.",
                  ),
                date_created_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was created, as GMT."),
                date_modified: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was last modified, in the site's timezone.",
                  ),
                date_modified_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was last modified, as GMT."),
                id: z.number().optional().describe("Image ID."),
                name: z.string().optional().describe("Image name."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Variation image data.")
              .strict()
              .optional()
              .describe("Variation image data."),
            low_stock_amount: z
              .number()
              .nullable()
              .optional()
              .describe("Low Stock amount for the variation."),
            manage_stock: z
              .boolean()
              .optional()
              .describe("Stock management at variation level."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort products."),
            meta_data: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z
                      .union([
                        z.record(z.string(), z.unknown()),
                        z.string(),
                        z.number(),
                        z.boolean(),
                        z.number(),
                        z.array(z.unknown()),
                      ])
                      .nullable()
                      .optional()
                      .describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            regular_price: z
              .string()
              .optional()
              .describe("Variation regular price."),
            sale_price: z.string().optional().describe("Variation sale price."),
            shipping_class: z
              .string()
              .optional()
              .describe("Shipping class slug."),
            sku: z.string().optional().describe("Stock Keeping Unit."),
            status: z
              .enum(["draft", "pending", "private", "publish"])
              .optional()
              .describe("Variation status."),
            stock_quantity: z.number().optional().describe("Stock quantity."),
            stock_status: z
              .enum(["instock", "outofstock", "onbackorder"])
              .optional()
              .describe("Controls the stock status of the product."),
            tax_class: z.string().optional().describe("Tax class."),
            tax_status: z
              .enum(["taxable", "shipping", "none"])
              .optional()
              .describe("Tax status."),
            virtual: z
              .boolean()
              .optional()
              .describe("If the variation is virtual."),
            weight: z.string().optional().describe("Variation weight (lbs)."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductVariationsBatchUpdateBody = z.infer<
  typeof productVariationsBatchUpdateBodySchema
>;

/**
 * POST /products/{product_id}/variations/batch response body.
 */
export const productVariationsBatchUpdateResponseSchema = z.unknown();

export type ProductVariationsBatchUpdateResponse = z.infer<
  typeof productVariationsBatchUpdateResponseSchema
>;

/**
 * POST /products/{product_id}/variations path parameters.
 */
export const productVariationsCreatePathParamsSchema = z
  .object({ product_id: z.number() })
  .strict();

export type ProductVariationsCreatePathParams = z.infer<
  typeof productVariationsCreatePathParamsSchema
>;

/**
 * POST /products/{product_id}/variations request body.
 */
export const productVariationsCreateBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    description: z.string().optional().describe("Variation description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Variation height (in)."),
        length: z.string().optional().describe("Variation length (in)."),
        width: z.string().optional().describe("Variation width (in)."),
      })
      .describe("Variation dimensions.")
      .strict()
      .optional()
      .describe("Variation dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the variation is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Variation image data.")
      .strict()
      .optional()
      .describe("Variation image data."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the variation."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at variation level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    regular_price: z.string().optional().describe("Variation regular price."),
    sale_price: z.string().optional().describe("Variation sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    status: z
      .enum(["draft", "pending", "private", "publish"])
      .optional()
      .describe("Variation status."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    virtual: z.boolean().optional().describe("If the variation is virtual."),
    weight: z.string().optional().describe("Variation weight (lbs)."),
  })
  .strict();

export type ProductVariationsCreateBody = z.infer<
  typeof productVariationsCreateBodySchema
>;

/**
 * POST /products/{product_id}/variations response body.
 */
export const productVariationsCreateResponseSchema = z.unknown();

export type ProductVariationsCreateResponse = z.infer<
  typeof productVariationsCreateResponseSchema
>;

/**
 * POST /products/{product_id}/variations/generate path parameters.
 */
export const productVariationsGenerateCreatePathParamsSchema = z
  .object({ product_id: z.number() })
  .strict();

export type ProductVariationsGenerateCreatePathParams = z.infer<
  typeof productVariationsGenerateCreatePathParamsSchema
>;

/**
 * POST /products/{product_id}/variations/generate request body.
 */
export const productVariationsGenerateCreateBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_values: z
      .object({
        attributes: z
          .array(
            z
              .object({
                id: z.number().optional().describe("Attribute ID."),
                name: z.string().optional().describe("Attribute name."),
                option: z
                  .string()
                  .optional()
                  .describe("Selected attribute term name."),
              })
              .strict(),
          )
          .optional()
          .describe("List of attributes."),
        backorders: z
          .enum(["no", "notify", "yes"])
          .optional()
          .describe(
            "If managing stock, this controls if backorders are allowed.",
          ),
        date_on_sale_from: z
          .string()
          .nullable()
          .optional()
          .describe("Start date of sale price, in the site's timezone."),
        date_on_sale_from_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("Start date of sale price, as GMT."),
        date_on_sale_to: z
          .string()
          .nullable()
          .optional()
          .describe("End date of sale price, in the site's timezone."),
        date_on_sale_to_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("End date of sale price, in the site's timezone."),
        description: z.string().optional().describe("Variation description."),
        dimensions: z
          .object({
            height: z.string().optional().describe("Variation height (in)."),
            length: z.string().optional().describe("Variation length (in)."),
            width: z.string().optional().describe("Variation width (in)."),
          })
          .describe("Variation dimensions.")
          .strict()
          .optional()
          .describe("Variation dimensions."),
        download_expiry: z
          .number()
          .optional()
          .describe(
            "Number of days until access to downloadable files expires.",
          ),
        download_limit: z
          .number()
          .optional()
          .describe(
            "Number of times downloadable files can be downloaded after purchase.",
          ),
        downloadable: z
          .boolean()
          .optional()
          .describe("If the variation is downloadable."),
        downloads: z
          .array(
            z
              .object({
                file: z.string().optional().describe("File URL."),
                id: z.string().optional().describe("File ID."),
                name: z.string().optional().describe("File name."),
              })
              .strict(),
          )
          .optional()
          .describe("List of downloadable files."),
        global_unique_id: z
          .string()
          .optional()
          .describe("GTIN, UPC, EAN or ISBN."),
        image: z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .describe("Variation image data.")
          .strict()
          .optional()
          .describe("Variation image data."),
        low_stock_amount: z
          .number()
          .nullable()
          .optional()
          .describe("Low Stock amount for the variation."),
        manage_stock: z
          .boolean()
          .optional()
          .describe("Stock management at variation level."),
        menu_order: z
          .number()
          .optional()
          .describe("Menu order, used to custom sort products."),
        meta_data: z
          .array(
            z
              .object({
                id: z.number().optional().describe("Meta ID."),
                key: z.string().optional().describe("Meta key."),
                value: z
                  .union([
                    z.record(z.string(), z.unknown()),
                    z.string(),
                    z.number(),
                    z.boolean(),
                    z.number(),
                    z.array(z.unknown()),
                  ])
                  .nullable()
                  .optional()
                  .describe("Meta value."),
              })
              .strict(),
          )
          .optional()
          .describe("Meta data."),
        regular_price: z
          .string()
          .optional()
          .describe("Variation regular price."),
        sale_price: z.string().optional().describe("Variation sale price."),
        shipping_class: z.string().optional().describe("Shipping class slug."),
        sku: z.string().optional().describe("Stock Keeping Unit."),
        status: z
          .enum(["draft", "pending", "private", "publish"])
          .optional()
          .describe("Variation status."),
        stock_quantity: z.number().optional().describe("Stock quantity."),
        stock_status: z
          .enum(["instock", "outofstock", "onbackorder"])
          .optional()
          .describe("Controls the stock status of the product."),
        tax_class: z.string().optional().describe("Tax class."),
        tax_status: z
          .enum(["taxable", "shipping", "none"])
          .optional()
          .describe("Tax status."),
        virtual: z
          .boolean()
          .optional()
          .describe("If the variation is virtual."),
        weight: z.string().optional().describe("Variation weight (lbs)."),
      })
      .describe("Default values for generated variations.")
      .strict()
      .optional()
      .describe("Default values for generated variations."),
    delete: z.boolean().optional().describe("Deletes unused variations."),
    description: z.string().optional().describe("Variation description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Variation height (in)."),
        length: z.string().optional().describe("Variation length (in)."),
        width: z.string().optional().describe("Variation width (in)."),
      })
      .describe("Variation dimensions.")
      .strict()
      .optional()
      .describe("Variation dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the variation is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Variation image data.")
      .strict()
      .optional()
      .describe("Variation image data."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the variation."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at variation level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    regular_price: z.string().optional().describe("Variation regular price."),
    sale_price: z.string().optional().describe("Variation sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    status: z
      .enum(["draft", "pending", "private", "publish"])
      .optional()
      .describe("Variation status."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    virtual: z.boolean().optional().describe("If the variation is virtual."),
    weight: z.string().optional().describe("Variation weight (lbs)."),
  })
  .strict();

export type ProductVariationsGenerateCreateBody = z.infer<
  typeof productVariationsGenerateCreateBodySchema
>;

/**
 * POST /products/{product_id}/variations/generate response body.
 */
export const productVariationsGenerateCreateResponseSchema = z.unknown();

export type ProductVariationsGenerateCreateResponse = z.infer<
  typeof productVariationsGenerateCreateResponseSchema
>;

/**
 * GET /products/{product_id}/variations path parameters.
 */
export const productVariationsListPathParamsSchema = z
  .object({ product_id: z.number() })
  .strict();

export type ProductVariationsListPathParams = z.infer<
  typeof productVariationsListPathParamsSchema
>;

/**
 * GET /products/{product_id}/variations query parameters.
 */
export const productVariationsListQuerySchema = z
  .object({
    after: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published after a given ISO8601 compliant date.",
      ),
    attributes: z
      .array(
        z
          .object({
            attribute: z.string().optional().describe("Attribute slug."),
            term: z.string().optional().describe("Attribute term."),
            terms: z.array(z.unknown()).optional().describe("Attribute terms."),
          })
          .strict(),
      )
      .optional()
      .describe("Limit result set to products with specified attributes."),
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
    downloadable: z
      .boolean()
      .optional()
      .describe("Limit result set to downloadable product variations."),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    exclude_meta: z
      .array(z.string())
      .optional()
      .describe("Ensure meta_data excludes specific keys."),
    exclude_status: z
      .array(
        z.enum(["future", "trash", "draft", "pending", "private", "publish"]),
      )
      .optional()
      .describe(
        "Exclude product variations with any of the statuses from result set.",
      ),
    has_price: z
      .boolean()
      .optional()
      .describe("Limit result set to products with or without price."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    include_meta: z
      .array(z.string())
      .optional()
      .describe("Limit meta_data to specific keys."),
    include_status: z
      .array(
        z.enum([
          "any",
          "future",
          "trash",
          "draft",
          "pending",
          "private",
          "publish",
        ]),
      )
      .optional()
      .describe(
        "Limit result set to product variations with any of the statuses.",
      ),
    max_price: z
      .string()
      .optional()
      .describe("Limit result set to products based on a maximum price."),
    min_price: z
      .string()
      .optional()
      .describe("Limit result set to products based on a minimum price."),
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
    on_sale: z
      .boolean()
      .optional()
      .describe("Limit result set to products on sale."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "date",
        "id",
        "include",
        "title",
        "slug",
        "modified",
        "menu_order",
      ])
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
    sku: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with specific SKU(s). Use commas to separate.",
      ),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to products with a specific slug."),
    status: z
      .enum([
        "any",
        "future",
        "trash",
        "draft",
        "pending",
        "private",
        "publish",
      ])
      .optional()
      .describe("Limit result set to products assigned a specific status."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Limit result set to products with specified stock status."),
    virtual: z
      .boolean()
      .optional()
      .describe("Limit result set to virtual product variations."),
  })
  .strict();

export type ProductVariationsListQuery = z.infer<
  typeof productVariationsListQuerySchema
>;

/**
 * GET /products/{product_id}/variations response body.
 */
export const productVariationsListResponseSchema = z.array(z.unknown());

export type ProductVariationsListResponse = z.infer<
  typeof productVariationsListResponseSchema
>;

/**
 * DELETE /products/attributes/{id} path parameters.
 */
export const productsAttributeDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsAttributeDeletePathParams = z.infer<
  typeof productsAttributeDeletePathParamsSchema
>;

/**
 * DELETE /products/attributes/{id} query parameters.
 */
export const productsAttributeDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type ProductsAttributeDeleteQuery = z.infer<
  typeof productsAttributeDeleteQuerySchema
>;

/**
 * DELETE /products/attributes/{id} response body.
 */
export const productsAttributeDeleteResponseSchema = z.unknown();

export type ProductsAttributeDeleteResponse = z.infer<
  typeof productsAttributeDeleteResponseSchema
>;

/**
 * GET /products/attributes/{id} path parameters.
 */
export const productsAttributeGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsAttributeGetPathParams = z.infer<
  typeof productsAttributeGetPathParamsSchema
>;

/**
 * GET /products/attributes/{id} query parameters.
 */
export const productsAttributeGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsAttributeGetQuery = z.infer<
  typeof productsAttributeGetQuerySchema
>;

/**
 * GET /products/attributes/{id} response body.
 */
export const productsAttributeGetResponseSchema = z
  .object({
    has_archives: z
      .boolean()
      .optional()
      .describe("Enable/Disable attribute archives."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Attribute name."),
    order_by: z
      .enum(["menu_order", "name", "name_num", "id"])
      .optional()
      .describe("Default sort order."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
    type: z.enum(["select"]).optional().describe("Type of attribute."),
  })
  .strict();

export type ProductsAttributeGetResponse = z.infer<
  typeof productsAttributeGetResponseSchema
>;

/**
 * DELETE /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export const productsAttributeTermDeletePathParamsSchema = z
  .object({ attribute_id: z.number(), id: z.number() })
  .strict();

export type ProductsAttributeTermDeletePathParams = z.infer<
  typeof productsAttributeTermDeletePathParamsSchema
>;

/**
 * DELETE /products/attributes/{attribute_id}/terms/{id} query parameters.
 */
export const productsAttributeTermDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type ProductsAttributeTermDeleteQuery = z.infer<
  typeof productsAttributeTermDeleteQuerySchema
>;

/**
 * DELETE /products/attributes/{attribute_id}/terms/{id} response body.
 */
export const productsAttributeTermDeleteResponseSchema = z.unknown();

export type ProductsAttributeTermDeleteResponse = z.infer<
  typeof productsAttributeTermDeleteResponseSchema
>;

/**
 * GET /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export const productsAttributeTermGetPathParamsSchema = z
  .object({ attribute_id: z.number(), id: z.number() })
  .strict();

export type ProductsAttributeTermGetPathParams = z.infer<
  typeof productsAttributeTermGetPathParamsSchema
>;

/**
 * GET /products/attributes/{attribute_id}/terms/{id} query parameters.
 */
export const productsAttributeTermGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsAttributeTermGetQuery = z.infer<
  typeof productsAttributeTermGetQuerySchema
>;

/**
 * GET /products/attributes/{attribute_id}/terms/{id} response body.
 */
export const productsAttributeTermGetResponseSchema = z.unknown();

export type ProductsAttributeTermGetResponse = z.infer<
  typeof productsAttributeTermGetResponseSchema
>;

/**
 * PUT /products/attributes/{attribute_id}/terms/{id} path parameters.
 */
export const productsAttributeTermUpdatePathParamsSchema = z
  .object({ attribute_id: z.number(), id: z.number() })
  .strict();

export type ProductsAttributeTermUpdatePathParams = z.infer<
  typeof productsAttributeTermUpdatePathParamsSchema
>;

/**
 * PUT /products/attributes/{attribute_id}/terms/{id} request body.
 */
export const productsAttributeTermUpdateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Term name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsAttributeTermUpdateBody = z.infer<
  typeof productsAttributeTermUpdateBodySchema
>;

/**
 * PUT /products/attributes/{attribute_id}/terms/{id} response body.
 */
export const productsAttributeTermUpdateResponseSchema = z.unknown();

export type ProductsAttributeTermUpdateResponse = z.infer<
  typeof productsAttributeTermUpdateResponseSchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms/batch path parameters.
 */
export const productsAttributeTermsBatchUpdatePathParamsSchema = z
  .object({ attribute_id: z.number() })
  .strict();

export type ProductsAttributeTermsBatchUpdatePathParams = z.infer<
  typeof productsAttributeTermsBatchUpdatePathParamsSchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms/batch request body.
 */
export const productsAttributeTermsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort the resource."),
            name: z.string().optional().describe("Term name."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            id: z.number(),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort the resource."),
            name: z.string().optional().describe("Term name."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsAttributeTermsBatchUpdateBody = z.infer<
  typeof productsAttributeTermsBatchUpdateBodySchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms/batch response body.
 */
export const productsAttributeTermsBatchUpdateResponseSchema = z.unknown();

export type ProductsAttributeTermsBatchUpdateResponse = z.infer<
  typeof productsAttributeTermsBatchUpdateResponseSchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms path parameters.
 */
export const productsAttributeTermsCreatePathParamsSchema = z
  .object({ attribute_id: z.number() })
  .strict();

export type ProductsAttributeTermsCreatePathParams = z.infer<
  typeof productsAttributeTermsCreatePathParamsSchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms request body.
 */
export const productsAttributeTermsCreateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().describe("Name for the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsAttributeTermsCreateBody = z.infer<
  typeof productsAttributeTermsCreateBodySchema
>;

/**
 * POST /products/attributes/{attribute_id}/terms response body.
 */
export const productsAttributeTermsCreateResponseSchema = z.unknown();

export type ProductsAttributeTermsCreateResponse = z.infer<
  typeof productsAttributeTermsCreateResponseSchema
>;

/**
 * GET /products/attributes/{attribute_id}/terms path parameters.
 */
export const productsAttributeTermsListPathParamsSchema = z
  .object({ attribute_id: z.number() })
  .strict();

export type ProductsAttributeTermsListPathParams = z.infer<
  typeof productsAttributeTermsListPathParamsSchema
>;

/**
 * GET /products/attributes/{attribute_id}/terms query parameters.
 */
export const productsAttributeTermsListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    hide_empty: z
      .boolean()
      .optional()
      .describe("Whether to hide resources not assigned to any products."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    offset: z
      .number()
      .optional()
      .describe(
        "Offset the result set by a specific number of items. Applies to hierarchical taxonomies only.",
      ),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "id",
        "include",
        "name",
        "slug",
        "term_group",
        "description",
        "count",
      ])
      .optional()
      .describe("Sort collection by resource attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.",
      ),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific product.",
      ),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific slug."),
  })
  .strict();

export type ProductsAttributeTermsListQuery = z.infer<
  typeof productsAttributeTermsListQuerySchema
>;

/**
 * GET /products/attributes/{attribute_id}/terms response body.
 */
export const productsAttributeTermsListResponseSchema = z.array(z.unknown());

export type ProductsAttributeTermsListResponse = z.infer<
  typeof productsAttributeTermsListResponseSchema
>;

/**
 * PUT /products/attributes/{id} path parameters.
 */
export const productsAttributeUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsAttributeUpdatePathParams = z.infer<
  typeof productsAttributeUpdatePathParamsSchema
>;

/**
 * PUT /products/attributes/{id} request body.
 */
export const productsAttributeUpdateBodySchema = z
  .object({
    has_archives: z
      .boolean()
      .optional()
      .describe("Enable/Disable attribute archives."),
    name: z.string().optional().describe("Attribute name."),
    order_by: z
      .enum(["menu_order", "name", "name_num", "id"])
      .optional()
      .describe("Default sort order."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
    type: z.enum(["select"]).optional().describe("Type of attribute."),
  })
  .strict();

export type ProductsAttributeUpdateBody = z.infer<
  typeof productsAttributeUpdateBodySchema
>;

/**
 * PUT /products/attributes/{id} response body.
 */
export const productsAttributeUpdateResponseSchema = z.unknown();

export type ProductsAttributeUpdateResponse = z.infer<
  typeof productsAttributeUpdateResponseSchema
>;

/**
 * POST /products/attributes/batch request body.
 */
export const productsAttributesBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            has_archives: z
              .boolean()
              .optional()
              .describe("Enable/Disable attribute archives."),
            name: z.string().optional().describe("Attribute name."),
            order_by: z
              .enum(["menu_order", "name", "name_num", "id"])
              .optional()
              .describe("Default sort order."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
            type: z.enum(["select"]).optional().describe("Type of attribute."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            has_archives: z
              .boolean()
              .optional()
              .describe("Enable/Disable attribute archives."),
            id: z.number(),
            name: z.string().optional().describe("Attribute name."),
            order_by: z
              .enum(["menu_order", "name", "name_num", "id"])
              .optional()
              .describe("Default sort order."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
            type: z.enum(["select"]).optional().describe("Type of attribute."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsAttributesBatchUpdateBody = z.infer<
  typeof productsAttributesBatchUpdateBodySchema
>;

/**
 * POST /products/attributes/batch response body.
 */
export const productsAttributesBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsAttributesBatchUpdateResponse = z.infer<
  typeof productsAttributesBatchUpdateResponseSchema
>;

/**
 * POST /products/attributes request body.
 */
export const productsAttributesCreateBodySchema = z
  .object({
    has_archives: z
      .boolean()
      .optional()
      .describe("Enable/Disable attribute archives."),
    name: z.string().describe("Name for the resource."),
    order_by: z
      .enum(["menu_order", "name", "name_num", "id"])
      .optional()
      .describe("Default sort order."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
    type: z.enum(["select"]).optional().describe("Type of attribute."),
  })
  .strict();

export type ProductsAttributesCreateBody = z.infer<
  typeof productsAttributesCreateBodySchema
>;

/**
 * POST /products/attributes response body.
 */
export const productsAttributesCreateResponseSchema = z
  .object({
    has_archives: z
      .boolean()
      .optional()
      .describe("Enable/Disable attribute archives."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Attribute name."),
    order_by: z
      .enum(["menu_order", "name", "name_num", "id"])
      .optional()
      .describe("Default sort order."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
    type: z.enum(["select"]).optional().describe("Type of attribute."),
  })
  .strict();

export type ProductsAttributesCreateResponse = z.infer<
  typeof productsAttributesCreateResponseSchema
>;

/**
 * GET /products/attributes query parameters.
 */
export const productsAttributesListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsAttributesListQuery = z.infer<
  typeof productsAttributesListQuerySchema
>;

/**
 * GET /products/attributes response body.
 */
export const productsAttributesListResponseSchema = z.array(
  z
    .object({
      has_archives: z
        .boolean()
        .optional()
        .describe("Enable/Disable attribute archives."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("Attribute name."),
      order_by: z
        .enum(["menu_order", "name", "name_num", "id"])
        .optional()
        .describe("Default sort order."),
      slug: z
        .string()
        .optional()
        .describe(
          "An alphanumeric identifier for the resource unique to its type.",
        ),
      type: z.enum(["select"]).optional().describe("Type of attribute."),
    })
    .strict(),
);

export type ProductsAttributesListResponse = z.infer<
  typeof productsAttributesListResponseSchema
>;

/**
 * POST /products/batch request body.
 */
export const productsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            attributes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Attribute ID."),
                    name: z.string().optional().describe("Attribute name."),
                    options: z
                      .array(z.string())
                      .optional()
                      .describe(
                        "List of available term names of the attribute.",
                      ),
                    position: z
                      .number()
                      .optional()
                      .describe("Attribute position."),
                    variation: z
                      .boolean()
                      .optional()
                      .describe(
                        "Define if the attribute can be used as variation.",
                      ),
                    visible: z
                      .boolean()
                      .optional()
                      .describe(
                        'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
                      ),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of attributes."),
            backorders: z
              .enum(["no", "notify", "yes"])
              .optional()
              .describe(
                "If managing stock, this controls if backorders are allowed.",
              ),
            brands: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Brand ID."),
                    name: z.string().optional().describe("Brand name."),
                    slug: z.string().optional().describe("Brand slug."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of brands."),
            button_text: z
              .string()
              .optional()
              .describe(
                "Product external button text. Only for external products.",
              ),
            catalog_visibility: z
              .enum(["visible", "catalog", "search", "hidden"])
              .optional()
              .describe("Catalog visibility."),
            categories: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Category ID."),
                    name: z.string().optional().describe("Category name."),
                    slug: z.string().optional().describe("Category slug."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of categories."),
            cross_sell_ids: z
              .array(z.number())
              .optional()
              .describe("List of cross-sell products IDs."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the product was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the product was created, as GMT."),
            date_on_sale_from: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, in the site's timezone."),
            date_on_sale_from_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, as GMT."),
            date_on_sale_to: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            date_on_sale_to_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            default_attributes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Attribute ID."),
                    name: z.string().optional().describe("Attribute name."),
                    option: z
                      .string()
                      .optional()
                      .describe("Selected attribute term name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Defaults variation attributes."),
            description: z.string().optional().describe("Product description."),
            dimensions: z
              .object({
                height: z.string().optional().describe("Product height (in)."),
                length: z.string().optional().describe("Product length (in)."),
                width: z.string().optional().describe("Product width (in)."),
              })
              .describe("Product dimensions.")
              .strict()
              .optional()
              .describe("Product dimensions."),
            download_expiry: z
              .number()
              .optional()
              .describe(
                "Number of days until access to downloadable files expires.",
              ),
            download_limit: z
              .number()
              .optional()
              .describe(
                "Number of times downloadable files can be downloaded after purchase.",
              ),
            downloadable: z
              .boolean()
              .optional()
              .describe("If the product is downloadable."),
            downloads: z
              .array(
                z
                  .object({
                    file: z.string().optional().describe("File URL."),
                    id: z.string().optional().describe("File ID."),
                    name: z.string().optional().describe("File name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of downloadable files."),
            external_url: z
              .string()
              .optional()
              .describe("Product external URL. Only for external products."),
            featured: z.boolean().optional().describe("Featured product."),
            global_unique_id: z
              .string()
              .optional()
              .describe("GTIN, UPC, EAN or ISBN."),
            images: z
              .array(
                z
                  .object({
                    alt: z
                      .string()
                      .optional()
                      .describe("Image alternative text."),
                    date_created: z
                      .string()
                      .nullable()
                      .optional()
                      .describe(
                        "The date the image was created, in the site's timezone.",
                      ),
                    date_created_gmt: z
                      .string()
                      .nullable()
                      .optional()
                      .describe("The date the image was created, as GMT."),
                    date_modified: z
                      .string()
                      .nullable()
                      .optional()
                      .describe(
                        "The date the image was last modified, in the site's timezone.",
                      ),
                    date_modified_gmt: z
                      .string()
                      .nullable()
                      .optional()
                      .describe(
                        "The date the image was last modified, as GMT.",
                      ),
                    id: z.number().optional().describe("Image ID."),
                    name: z.string().optional().describe("Image name."),
                    src: z.string().optional().describe("Image URL."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of images."),
            low_stock_amount: z
              .number()
              .nullable()
              .optional()
              .describe("Low Stock amount for the product."),
            manage_stock: z
              .boolean()
              .optional()
              .describe("Stock management at product level."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort products."),
            meta_data: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z
                      .union([
                        z.record(z.string(), z.unknown()),
                        z.string(),
                        z.number(),
                        z.boolean(),
                        z.number(),
                        z.array(z.unknown()),
                      ])
                      .nullable()
                      .optional()
                      .describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            name: z.string().optional().describe("Product name."),
            parent_id: z.number().optional().describe("Product parent ID."),
            post_password: z.string().optional().describe("Post password."),
            purchase_note: z
              .string()
              .optional()
              .describe("Optional note to send the customer after purchase."),
            regular_price: z
              .string()
              .optional()
              .describe("Product regular price."),
            reviews_allowed: z.boolean().optional().describe("Allow reviews."),
            sale_price: z.string().optional().describe("Product sale price."),
            shipping_class: z
              .string()
              .optional()
              .describe("Shipping class slug."),
            short_description: z
              .string()
              .optional()
              .describe("Product short description."),
            sku: z.string().optional().describe("Stock Keeping Unit."),
            slug: z.string().optional().describe("Product slug."),
            sold_individually: z
              .boolean()
              .optional()
              .describe("Allow one item to be bought in a single order."),
            status: z
              .enum([
                "draft",
                "pending",
                "private",
                "publish",
                "future",
                "auto-draft",
                "trash",
              ])
              .optional()
              .describe("Product status (post status)."),
            stock_quantity: z.number().optional().describe("Stock quantity."),
            stock_status: z
              .enum(["instock", "outofstock", "onbackorder"])
              .optional()
              .describe("Controls the stock status of the product."),
            tags: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tag ID."),
                    name: z.string().optional().describe("Tag name."),
                    slug: z.string().optional().describe("Tag slug."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of tags."),
            tax_class: z.string().optional().describe("Tax class."),
            tax_status: z
              .enum(["taxable", "shipping", "none"])
              .optional()
              .describe("Tax status."),
            type: z
              .enum(["simple", "grouped", "external", "variable"])
              .optional()
              .describe("Product type."),
            upsell_ids: z
              .array(z.number())
              .optional()
              .describe("List of up-sell products IDs."),
            virtual: z
              .boolean()
              .optional()
              .describe("If the product is virtual."),
            weight: z.string().optional().describe("Product weight (lbs)."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            attributes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Attribute ID."),
                    name: z.string().optional().describe("Attribute name."),
                    options: z
                      .array(z.string())
                      .optional()
                      .describe(
                        "List of available term names of the attribute.",
                      ),
                    position: z
                      .number()
                      .optional()
                      .describe("Attribute position."),
                    variation: z
                      .boolean()
                      .optional()
                      .describe(
                        "Define if the attribute can be used as variation.",
                      ),
                    visible: z
                      .boolean()
                      .optional()
                      .describe(
                        'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
                      ),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of attributes."),
            backorders: z
              .enum(["no", "notify", "yes"])
              .optional()
              .describe(
                "If managing stock, this controls if backorders are allowed.",
              ),
            brands: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Brand ID."),
                    name: z.string().optional().describe("Brand name."),
                    slug: z.string().optional().describe("Brand slug."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of brands."),
            button_text: z
              .string()
              .optional()
              .describe(
                "Product external button text. Only for external products.",
              ),
            catalog_visibility: z
              .enum(["visible", "catalog", "search", "hidden"])
              .optional()
              .describe("Catalog visibility."),
            categories: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Category ID."),
                    name: z.string().optional().describe("Category name."),
                    slug: z.string().optional().describe("Category slug."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of categories."),
            cross_sell_ids: z
              .array(z.number())
              .optional()
              .describe("List of cross-sell products IDs."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the product was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the product was created, as GMT."),
            date_on_sale_from: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, in the site's timezone."),
            date_on_sale_from_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("Start date of sale price, as GMT."),
            date_on_sale_to: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            date_on_sale_to_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("End date of sale price, in the site's timezone."),
            default_attributes: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Attribute ID."),
                    name: z.string().optional().describe("Attribute name."),
                    option: z
                      .string()
                      .optional()
                      .describe("Selected attribute term name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Defaults variation attributes."),
            description: z.string().optional().describe("Product description."),
            dimensions: z
              .object({
                height: z.string().optional().describe("Product height (in)."),
                length: z.string().optional().describe("Product length (in)."),
                width: z.string().optional().describe("Product width (in)."),
              })
              .describe("Product dimensions.")
              .strict()
              .optional()
              .describe("Product dimensions."),
            download_expiry: z
              .number()
              .optional()
              .describe(
                "Number of days until access to downloadable files expires.",
              ),
            download_limit: z
              .number()
              .optional()
              .describe(
                "Number of times downloadable files can be downloaded after purchase.",
              ),
            downloadable: z
              .boolean()
              .optional()
              .describe("If the product is downloadable."),
            downloads: z
              .array(
                z
                  .object({
                    file: z.string().optional().describe("File URL."),
                    id: z.string().optional().describe("File ID."),
                    name: z.string().optional().describe("File name."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of downloadable files."),
            external_url: z
              .string()
              .optional()
              .describe("Product external URL. Only for external products."),
            featured: z.boolean().optional().describe("Featured product."),
            global_unique_id: z
              .string()
              .optional()
              .describe("GTIN, UPC, EAN or ISBN."),
            id: z.number(),
            images: z
              .array(
                z
                  .object({
                    alt: z
                      .string()
                      .optional()
                      .describe("Image alternative text."),
                    date_created: z
                      .string()
                      .nullable()
                      .optional()
                      .describe(
                        "The date the image was created, in the site's timezone.",
                      ),
                    date_created_gmt: z
                      .string()
                      .nullable()
                      .optional()
                      .describe("The date the image was created, as GMT."),
                    date_modified: z
                      .string()
                      .nullable()
                      .optional()
                      .describe(
                        "The date the image was last modified, in the site's timezone.",
                      ),
                    date_modified_gmt: z
                      .string()
                      .nullable()
                      .optional()
                      .describe(
                        "The date the image was last modified, as GMT.",
                      ),
                    id: z.number().optional().describe("Image ID."),
                    name: z.string().optional().describe("Image name."),
                    src: z.string().optional().describe("Image URL."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of images."),
            low_stock_amount: z
              .number()
              .nullable()
              .optional()
              .describe("Low Stock amount for the product."),
            manage_stock: z
              .boolean()
              .optional()
              .describe("Stock management at product level."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort products."),
            meta_data: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Meta ID."),
                    key: z.string().optional().describe("Meta key."),
                    value: z
                      .union([
                        z.record(z.string(), z.unknown()),
                        z.string(),
                        z.number(),
                        z.boolean(),
                        z.number(),
                        z.array(z.unknown()),
                      ])
                      .nullable()
                      .optional()
                      .describe("Meta value."),
                  })
                  .strict(),
              )
              .optional()
              .describe("Meta data."),
            name: z.string().optional().describe("Product name."),
            parent_id: z.number().optional().describe("Product parent ID."),
            post_password: z.string().optional().describe("Post password."),
            purchase_note: z
              .string()
              .optional()
              .describe("Optional note to send the customer after purchase."),
            regular_price: z
              .string()
              .optional()
              .describe("Product regular price."),
            reviews_allowed: z.boolean().optional().describe("Allow reviews."),
            sale_price: z.string().optional().describe("Product sale price."),
            shipping_class: z
              .string()
              .optional()
              .describe("Shipping class slug."),
            short_description: z
              .string()
              .optional()
              .describe("Product short description."),
            sku: z.string().optional().describe("Stock Keeping Unit."),
            slug: z.string().optional().describe("Product slug."),
            sold_individually: z
              .boolean()
              .optional()
              .describe("Allow one item to be bought in a single order."),
            status: z
              .enum([
                "draft",
                "pending",
                "private",
                "publish",
                "future",
                "auto-draft",
                "trash",
              ])
              .optional()
              .describe("Product status (post status)."),
            stock_quantity: z.number().optional().describe("Stock quantity."),
            stock_status: z
              .enum(["instock", "outofstock", "onbackorder"])
              .optional()
              .describe("Controls the stock status of the product."),
            tags: z
              .array(
                z
                  .object({
                    id: z.number().optional().describe("Tag ID."),
                    name: z.string().optional().describe("Tag name."),
                    slug: z.string().optional().describe("Tag slug."),
                  })
                  .strict(),
              )
              .optional()
              .describe("List of tags."),
            tax_class: z.string().optional().describe("Tax class."),
            tax_status: z
              .enum(["taxable", "shipping", "none"])
              .optional()
              .describe("Tax status."),
            type: z
              .enum(["simple", "grouped", "external", "variable"])
              .optional()
              .describe("Product type."),
            upsell_ids: z
              .array(z.number())
              .optional()
              .describe("List of up-sell products IDs."),
            virtual: z
              .boolean()
              .optional()
              .describe("If the product is virtual."),
            weight: z.string().optional().describe("Product weight (lbs)."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsBatchUpdateBody = z.infer<
  typeof productsBatchUpdateBodySchema
>;

/**
 * POST /products/batch response body.
 */
export const productsBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsBatchUpdateResponse = z.infer<
  typeof productsBatchUpdateResponseSchema
>;

/**
 * DELETE /products/brands/{id} path parameters.
 */
export const productsBrandDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsBrandDeletePathParams = z.infer<
  typeof productsBrandDeletePathParamsSchema
>;

/**
 * DELETE /products/brands/{id} query parameters.
 */
export const productsBrandDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type ProductsBrandDeleteQuery = z.infer<
  typeof productsBrandDeleteQuerySchema
>;

/**
 * DELETE /products/brands/{id} response body.
 */
export const productsBrandDeleteResponseSchema = z.unknown();

export type ProductsBrandDeleteResponse = z.infer<
  typeof productsBrandDeleteResponseSchema
>;

/**
 * GET /products/brands/{id} path parameters.
 */
export const productsBrandGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsBrandGetPathParams = z.infer<
  typeof productsBrandGetPathParamsSchema
>;

/**
 * GET /products/brands/{id} query parameters.
 */
export const productsBrandGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsBrandGetQuery = z.infer<typeof productsBrandGetQuerySchema>;

/**
 * GET /products/brands/{id} response body.
 */
export const productsBrandGetResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsBrandGetResponse = z.infer<
  typeof productsBrandGetResponseSchema
>;

/**
 * PUT /products/brands/{id} path parameters.
 */
export const productsBrandUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsBrandUpdatePathParams = z.infer<
  typeof productsBrandUpdatePathParamsSchema
>;

/**
 * PUT /products/brands/{id} request body.
 */
export const productsBrandUpdateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsBrandUpdateBody = z.infer<
  typeof productsBrandUpdateBodySchema
>;

/**
 * PUT /products/brands/{id} response body.
 */
export const productsBrandUpdateResponseSchema = z.unknown();

export type ProductsBrandUpdateResponse = z.infer<
  typeof productsBrandUpdateResponseSchema
>;

/**
 * POST /products/brands/batch request body.
 */
export const productsBrandsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            display: z
              .enum(["default", "products", "subcategories", "both"])
              .optional()
              .describe("Category archive display type."),
            image: z
              .object({
                alt: z.string().optional().describe("Image alternative text."),
                date_created: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was created, in the site's timezone.",
                  ),
                date_created_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was created, as GMT."),
                date_modified: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was last modified, in the site's timezone.",
                  ),
                date_modified_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was last modified, as GMT."),
                id: z.number().optional().describe("Image ID."),
                name: z.string().optional().describe("Image name."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Image data.")
              .strict()
              .optional()
              .describe("Image data."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort the resource."),
            name: z.string().optional().describe("Category name."),
            parent: z
              .number()
              .optional()
              .describe("The ID for the parent of the resource."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            display: z
              .enum(["default", "products", "subcategories", "both"])
              .optional()
              .describe("Category archive display type."),
            id: z.number(),
            image: z
              .object({
                alt: z.string().optional().describe("Image alternative text."),
                date_created: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was created, in the site's timezone.",
                  ),
                date_created_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was created, as GMT."),
                date_modified: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was last modified, in the site's timezone.",
                  ),
                date_modified_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was last modified, as GMT."),
                id: z.number().optional().describe("Image ID."),
                name: z.string().optional().describe("Image name."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Image data.")
              .strict()
              .optional()
              .describe("Image data."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort the resource."),
            name: z.string().optional().describe("Category name."),
            parent: z
              .number()
              .optional()
              .describe("The ID for the parent of the resource."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsBrandsBatchUpdateBody = z.infer<
  typeof productsBrandsBatchUpdateBodySchema
>;

/**
 * POST /products/brands/batch response body.
 */
export const productsBrandsBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsBrandsBatchUpdateResponse = z.infer<
  typeof productsBrandsBatchUpdateResponseSchema
>;

/**
 * POST /products/brands request body.
 */
export const productsBrandsCreateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().describe("Name for the resource."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsBrandsCreateBody = z.infer<
  typeof productsBrandsCreateBodySchema
>;

/**
 * POST /products/brands response body.
 */
export const productsBrandsCreateResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsBrandsCreateResponse = z.infer<
  typeof productsBrandsCreateResponseSchema
>;

/**
 * GET /products/brands query parameters.
 */
export const productsBrandsListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    hide_empty: z
      .boolean()
      .optional()
      .describe("Whether to hide resources not assigned to any products."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    offset: z
      .number()
      .optional()
      .describe(
        "Offset the result set by a specific number of items. Applies to hierarchical taxonomies only.",
      ),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "id",
        "include",
        "name",
        "slug",
        "term_group",
        "description",
        "count",
      ])
      .optional()
      .describe("Sort collection by resource attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.",
      ),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific product.",
      ),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific slug."),
  })
  .strict();

export type ProductsBrandsListQuery = z.infer<
  typeof productsBrandsListQuerySchema
>;

/**
 * GET /products/brands response body.
 */
export const productsBrandsListResponseSchema = z.array(
  z
    .object({
      count: z
        .number()
        .optional()
        .describe("Number of published products for the resource."),
      description: z
        .string()
        .optional()
        .describe("HTML description of the resource."),
      display: z
        .enum(["default", "products", "subcategories", "both"])
        .optional()
        .describe("Category archive display type."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      image: z
        .object({
          alt: z.string().optional().describe("Image alternative text."),
          date_created: z
            .string()
            .optional()
            .describe(
              "The date the image was created, in the site's timezone.",
            ),
          date_created_gmt: z
            .string()
            .optional()
            .describe("The date the image was created, as GMT."),
          date_modified: z
            .string()
            .optional()
            .describe(
              "The date the image was last modified, in the site's timezone.",
            ),
          date_modified_gmt: z
            .string()
            .optional()
            .describe("The date the image was last modified, as GMT."),
          id: z.number().optional().describe("Image ID."),
          name: z.string().optional().describe("Image name."),
          src: z.string().optional().describe("Image URL."),
        })
        .describe("Image data.")
        .strict()
        .optional()
        .describe("Image data."),
      menu_order: z
        .number()
        .optional()
        .describe("Menu order, used to custom sort the resource."),
      name: z.string().optional().describe("Category name."),
      parent: z
        .number()
        .optional()
        .describe("The ID for the parent of the resource."),
      slug: z
        .string()
        .optional()
        .describe(
          "An alphanumeric identifier for the resource unique to its type.",
        ),
    })
    .strict(),
);

export type ProductsBrandsListResponse = z.infer<
  typeof productsBrandsListResponseSchema
>;

/**
 * POST /products/categories/batch request body.
 */
export const productsCategoriesBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            display: z
              .enum(["default", "products", "subcategories", "both"])
              .optional()
              .describe("Category archive display type."),
            image: z
              .object({
                alt: z.string().optional().describe("Image alternative text."),
                date_created: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was created, in the site's timezone.",
                  ),
                date_created_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was created, as GMT."),
                date_modified: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was last modified, in the site's timezone.",
                  ),
                date_modified_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was last modified, as GMT."),
                id: z.number().optional().describe("Image ID."),
                name: z.string().optional().describe("Image name."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Image data.")
              .strict()
              .optional()
              .describe("Image data."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort the resource."),
            name: z.string().optional().describe("Category name."),
            parent: z
              .number()
              .optional()
              .describe("The ID for the parent of the resource."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            display: z
              .enum(["default", "products", "subcategories", "both"])
              .optional()
              .describe("Category archive display type."),
            id: z.number(),
            image: z
              .object({
                alt: z.string().optional().describe("Image alternative text."),
                date_created: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was created, in the site's timezone.",
                  ),
                date_created_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was created, as GMT."),
                date_modified: z
                  .string()
                  .nullable()
                  .optional()
                  .describe(
                    "The date the image was last modified, in the site's timezone.",
                  ),
                date_modified_gmt: z
                  .string()
                  .nullable()
                  .optional()
                  .describe("The date the image was last modified, as GMT."),
                id: z.number().optional().describe("Image ID."),
                name: z.string().optional().describe("Image name."),
                src: z.string().optional().describe("Image URL."),
              })
              .describe("Image data.")
              .strict()
              .optional()
              .describe("Image data."),
            menu_order: z
              .number()
              .optional()
              .describe("Menu order, used to custom sort the resource."),
            name: z.string().optional().describe("Category name."),
            parent: z
              .number()
              .optional()
              .describe("The ID for the parent of the resource."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsCategoriesBatchUpdateBody = z.infer<
  typeof productsCategoriesBatchUpdateBodySchema
>;

/**
 * POST /products/categories/batch response body.
 */
export const productsCategoriesBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsCategoriesBatchUpdateResponse = z.infer<
  typeof productsCategoriesBatchUpdateResponseSchema
>;

/**
 * POST /products/categories request body.
 */
export const productsCategoriesCreateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().describe("Name for the resource."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsCategoriesCreateBody = z.infer<
  typeof productsCategoriesCreateBodySchema
>;

/**
 * POST /products/categories response body.
 */
export const productsCategoriesCreateResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsCategoriesCreateResponse = z.infer<
  typeof productsCategoriesCreateResponseSchema
>;

/**
 * GET /products/categories query parameters.
 */
export const productsCategoriesListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    hide_empty: z
      .boolean()
      .optional()
      .describe("Whether to hide resources not assigned to any products."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    offset: z
      .number()
      .optional()
      .describe(
        "Offset the result set by a specific number of items. Applies to hierarchical taxonomies only.",
      ),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "id",
        "include",
        "name",
        "slug",
        "term_group",
        "description",
        "count",
      ])
      .optional()
      .describe("Sort collection by resource attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.",
      ),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific product.",
      ),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific slug."),
  })
  .strict();

export type ProductsCategoriesListQuery = z.infer<
  typeof productsCategoriesListQuerySchema
>;

/**
 * GET /products/categories response body.
 */
export const productsCategoriesListResponseSchema = z.array(
  z
    .object({
      count: z
        .number()
        .optional()
        .describe("Number of published products for the resource."),
      description: z
        .string()
        .optional()
        .describe("HTML description of the resource."),
      display: z
        .enum(["default", "products", "subcategories", "both"])
        .optional()
        .describe("Category archive display type."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      image: z
        .object({
          alt: z.string().optional().describe("Image alternative text."),
          date_created: z
            .string()
            .optional()
            .describe(
              "The date the image was created, in the site's timezone.",
            ),
          date_created_gmt: z
            .string()
            .optional()
            .describe("The date the image was created, as GMT."),
          date_modified: z
            .string()
            .optional()
            .describe(
              "The date the image was last modified, in the site's timezone.",
            ),
          date_modified_gmt: z
            .string()
            .optional()
            .describe("The date the image was last modified, as GMT."),
          id: z.number().optional().describe("Image ID."),
          name: z.string().optional().describe("Image name."),
          src: z.string().optional().describe("Image URL."),
        })
        .describe("Image data.")
        .strict()
        .optional()
        .describe("Image data."),
      menu_order: z
        .number()
        .optional()
        .describe("Menu order, used to custom sort the resource."),
      name: z.string().optional().describe("Category name."),
      parent: z
        .number()
        .optional()
        .describe("The ID for the parent of the resource."),
      slug: z
        .string()
        .optional()
        .describe(
          "An alphanumeric identifier for the resource unique to its type.",
        ),
    })
    .strict(),
);

export type ProductsCategoriesListResponse = z.infer<
  typeof productsCategoriesListResponseSchema
>;

/**
 * DELETE /products/categories/{id} path parameters.
 */
export const productsCategoryDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsCategoryDeletePathParams = z.infer<
  typeof productsCategoryDeletePathParamsSchema
>;

/**
 * DELETE /products/categories/{id} query parameters.
 */
export const productsCategoryDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type ProductsCategoryDeleteQuery = z.infer<
  typeof productsCategoryDeleteQuerySchema
>;

/**
 * DELETE /products/categories/{id} response body.
 */
export const productsCategoryDeleteResponseSchema = z.unknown();

export type ProductsCategoryDeleteResponse = z.infer<
  typeof productsCategoryDeleteResponseSchema
>;

/**
 * GET /products/categories/{id} path parameters.
 */
export const productsCategoryGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsCategoryGetPathParams = z.infer<
  typeof productsCategoryGetPathParamsSchema
>;

/**
 * GET /products/categories/{id} query parameters.
 */
export const productsCategoryGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsCategoryGetQuery = z.infer<
  typeof productsCategoryGetQuerySchema
>;

/**
 * GET /products/categories/{id} response body.
 */
export const productsCategoryGetResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsCategoryGetResponse = z.infer<
  typeof productsCategoryGetResponseSchema
>;

/**
 * PUT /products/categories/{id} path parameters.
 */
export const productsCategoryUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsCategoryUpdatePathParams = z.infer<
  typeof productsCategoryUpdatePathParamsSchema
>;

/**
 * PUT /products/categories/{id} request body.
 */
export const productsCategoryUpdateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    display: z
      .enum(["default", "products", "subcategories", "both"])
      .optional()
      .describe("Category archive display type."),
    image: z
      .object({
        alt: z.string().optional().describe("Image alternative text."),
        date_created: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, in the site's timezone."),
        date_created_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was created, as GMT."),
        date_modified: z
          .string()
          .nullable()
          .optional()
          .describe(
            "The date the image was last modified, in the site's timezone.",
          ),
        date_modified_gmt: z
          .string()
          .nullable()
          .optional()
          .describe("The date the image was last modified, as GMT."),
        id: z.number().optional().describe("Image ID."),
        name: z.string().optional().describe("Image name."),
        src: z.string().optional().describe("Image URL."),
      })
      .describe("Image data.")
      .strict()
      .optional()
      .describe("Image data."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort the resource."),
    name: z.string().optional().describe("Category name."),
    parent: z
      .number()
      .optional()
      .describe("The ID for the parent of the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsCategoryUpdateBody = z.infer<
  typeof productsCategoryUpdateBodySchema
>;

/**
 * PUT /products/categories/{id} response body.
 */
export const productsCategoryUpdateResponseSchema = z.unknown();

export type ProductsCategoryUpdateResponse = z.infer<
  typeof productsCategoryUpdateResponseSchema
>;

/**
 * POST /products request body.
 */
export const productsCreateBodySchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_on_sale_from: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .nullable()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .nullable()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .nullable()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
    meta_data: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Meta ID."),
            key: z.string().optional().describe("Meta key."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Meta value."),
          })
          .strict(),
      )
      .optional()
      .describe("Meta data."),
    name: z.string().optional().describe("Product name."),
    parent_id: z.number().optional().describe("Product parent ID."),
    post_password: z.string().optional().describe("Post password."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    regular_price: z.string().optional().describe("Product regular price."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductsCreateBody = z.infer<typeof productsCreateBodySchema>;

/**
 * POST /products response body.
 */
export const productsCreateResponseSchema = z
  .object({
    attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            options: z
              .array(z.string())
              .optional()
              .describe("List of available term names of the attribute."),
            position: z.number().optional().describe("Attribute position."),
            variation: z
              .boolean()
              .optional()
              .describe("Define if the attribute can be used as variation."),
            visible: z
              .boolean()
              .optional()
              .describe(
                'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
              ),
          })
          .strict(),
      )
      .optional()
      .describe("List of attributes."),
    average_rating: z.string().optional().describe("Reviews average rating."),
    backordered: z
      .boolean()
      .optional()
      .describe("Shows if the product is on backordered."),
    backorders: z
      .enum(["no", "notify", "yes"])
      .optional()
      .describe("If managing stock, this controls if backorders are allowed."),
    backorders_allowed: z
      .boolean()
      .optional()
      .describe("Shows if backorders are allowed."),
    brands: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Brand ID."),
            name: z.string().optional().describe("Brand name."),
            slug: z.string().optional().describe("Brand slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of brands."),
    button_text: z
      .string()
      .optional()
      .describe("Product external button text. Only for external products."),
    catalog_visibility: z
      .enum(["visible", "catalog", "search", "hidden"])
      .optional()
      .describe("Catalog visibility."),
    categories: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Category ID."),
            name: z.string().optional().describe("Category name."),
            slug: z.string().optional().describe("Category slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of categories."),
    cross_sell_ids: z
      .array(z.number())
      .optional()
      .describe("List of cross-sell products IDs."),
    date_created: z
      .string()
      .optional()
      .describe("The date the product was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the product was created, as GMT."),
    date_modified: z
      .string()
      .optional()
      .describe(
        "The date the product was last modified, in the site's timezone.",
      ),
    date_modified_gmt: z
      .string()
      .optional()
      .describe("The date the product was last modified, as GMT."),
    date_on_sale_from: z
      .string()
      .optional()
      .describe("Start date of sale price, in the site's timezone."),
    date_on_sale_from_gmt: z
      .string()
      .optional()
      .describe("Start date of sale price, as GMT."),
    date_on_sale_to: z
      .string()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    date_on_sale_to_gmt: z
      .string()
      .optional()
      .describe("End date of sale price, in the site's timezone."),
    default_attributes: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Attribute ID."),
            name: z.string().optional().describe("Attribute name."),
            option: z
              .string()
              .optional()
              .describe("Selected attribute term name."),
          })
          .strict(),
      )
      .optional()
      .describe("Defaults variation attributes."),
    description: z.string().optional().describe("Product description."),
    dimensions: z
      .object({
        height: z.string().optional().describe("Product height (in)."),
        length: z.string().optional().describe("Product length (in)."),
        width: z.string().optional().describe("Product width (in)."),
      })
      .describe("Product dimensions.")
      .strict()
      .optional()
      .describe("Product dimensions."),
    download_expiry: z
      .number()
      .optional()
      .describe("Number of days until access to downloadable files expires."),
    download_limit: z
      .number()
      .optional()
      .describe(
        "Number of times downloadable files can be downloaded after purchase.",
      ),
    downloadable: z
      .boolean()
      .optional()
      .describe("If the product is downloadable."),
    downloads: z
      .array(
        z
          .object({
            file: z.string().optional().describe("File URL."),
            id: z.string().optional().describe("File ID."),
            name: z.string().optional().describe("File name."),
          })
          .strict(),
      )
      .optional()
      .describe("List of downloadable files."),
    external_url: z
      .string()
      .optional()
      .describe("Product external URL. Only for external products."),
    featured: z.boolean().optional().describe("Featured product."),
    generated_slug: z
      .string()
      .optional()
      .describe("Slug automatically generated from the product name."),
    global_unique_id: z.string().optional().describe("GTIN, UPC, EAN or ISBN."),
    grouped_products: z
      .array(z.number())
      .optional()
      .describe("List of grouped products ID."),
    has_options: z
      .boolean()
      .optional()
      .describe(
        "Shows if the product needs to be configured before it can be bought.",
      ),
    id: z.number().optional().describe("Unique identifier for the resource."),
    images: z
      .array(
        z
          .object({
            alt: z.string().optional().describe("Image alternative text."),
            date_created: z
              .string()
              .optional()
              .describe(
                "The date the image was created, in the site's timezone.",
              ),
            date_created_gmt: z
              .string()
              .optional()
              .describe("The date the image was created, as GMT."),
            date_modified: z
              .string()
              .optional()
              .describe(
                "The date the image was last modified, in the site's timezone.",
              ),
            date_modified_gmt: z
              .string()
              .optional()
              .describe("The date the image was last modified, as GMT."),
            id: z.number().optional().describe("Image ID."),
            name: z.string().optional().describe("Image name."),
            src: z.string().optional().describe("Image URL."),
          })
          .strict(),
      )
      .optional()
      .describe("List of images."),
    low_stock_amount: z
      .number()
      .nullable()
      .optional()
      .describe("Low Stock amount for the product."),
    manage_stock: z
      .boolean()
      .optional()
      .describe("Stock management at product level."),
    menu_order: z
      .number()
      .optional()
      .describe("Menu order, used to custom sort products."),
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
    name: z.string().optional().describe("Product name."),
    on_sale: z
      .boolean()
      .optional()
      .describe("Shows if the product is on sale."),
    parent_id: z.number().optional().describe("Product parent ID."),
    permalink: z.string().optional().describe("Product URL."),
    permalink_template: z
      .string()
      .optional()
      .describe("Permalink template for the product."),
    post_password: z.string().optional().describe("Post password."),
    price: z.string().optional().describe("Current product price."),
    price_html: z.string().optional().describe("Price formatted in HTML."),
    purchasable: z
      .boolean()
      .optional()
      .describe("Shows if the product can be bought."),
    purchase_note: z
      .string()
      .optional()
      .describe("Optional note to send the customer after purchase."),
    rating_count: z
      .number()
      .optional()
      .describe("Amount of reviews that the product have."),
    regular_price: z.string().optional().describe("Product regular price."),
    related_ids: z
      .array(z.number())
      .optional()
      .describe("List of related products IDs."),
    reviews_allowed: z.boolean().optional().describe("Allow reviews."),
    sale_price: z.string().optional().describe("Product sale price."),
    shipping_class: z.string().optional().describe("Shipping class slug."),
    shipping_class_id: z.string().optional().describe("Shipping class ID."),
    shipping_required: z
      .boolean()
      .optional()
      .describe("Shows if the product need to be shipped."),
    shipping_taxable: z
      .boolean()
      .optional()
      .describe("Shows whether or not the product shipping is taxable."),
    short_description: z
      .string()
      .optional()
      .describe("Product short description."),
    sku: z.string().optional().describe("Stock Keeping Unit."),
    slug: z.string().optional().describe("Product slug."),
    sold_individually: z
      .boolean()
      .optional()
      .describe("Allow one item to be bought in a single order."),
    status: z
      .enum([
        "draft",
        "pending",
        "private",
        "publish",
        "future",
        "auto-draft",
        "trash",
      ])
      .optional()
      .describe("Product status (post status)."),
    stock_quantity: z.number().optional().describe("Stock quantity."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Controls the stock status of the product."),
    tags: z
      .array(
        z
          .object({
            id: z.number().optional().describe("Tag ID."),
            name: z.string().optional().describe("Tag name."),
            slug: z.string().optional().describe("Tag slug."),
          })
          .strict(),
      )
      .optional()
      .describe("List of tags."),
    tax_class: z.string().optional().describe("Tax class."),
    tax_status: z
      .enum(["taxable", "shipping", "none"])
      .optional()
      .describe("Tax status."),
    total_sales: z.number().optional().describe("Amount of sales."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Product type."),
    upsell_ids: z
      .array(z.number())
      .optional()
      .describe("List of up-sell products IDs."),
    variations: z
      .array(z.number())
      .optional()
      .describe("List of variations IDs."),
    virtual: z.boolean().optional().describe("If the product is virtual."),
    weight: z.string().optional().describe("Product weight (lbs)."),
  })
  .strict();

export type ProductsCreateResponse = z.infer<
  typeof productsCreateResponseSchema
>;

/**
 * GET /products/custom-fields/names query parameters.
 */
export const productsCustomFieldsNamesListQuerySchema = z
  .object({
    context: z
      .string()
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort items ascending or descending."),
    page: z.number().optional().describe("Current page of the collection."),
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

export type ProductsCustomFieldsNamesListQuery = z.infer<
  typeof productsCustomFieldsNamesListQuerySchema
>;

/**
 * GET /products/custom-fields/names response body.
 */
export const productsCustomFieldsNamesListResponseSchema = z.array(z.unknown());

export type ProductsCustomFieldsNamesListResponse = z.infer<
  typeof productsCustomFieldsNamesListResponseSchema
>;

/**
 * GET /products query parameters.
 */
export const productsListQuerySchema = z
  .object({
    after: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published after a given ISO8601 compliant date.",
      ),
    attribute: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with a specific attribute. Use the taxonomy name/attribute slug.",
      ),
    attribute_term: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with a specific attribute term ID (required an assigned attribute).",
      ),
    before: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published before a given ISO8601 compliant date.",
      ),
    brand: z
      .string()
      .optional()
      .describe("Limit result set to products assigned a specific brand ID."),
    category: z
      .string()
      .optional()
      .describe(
        "Limit result set to products assigned a specific category ID.",
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
    downloadable: z
      .boolean()
      .optional()
      .describe("Limit result set to downloadable products."),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    exclude_meta: z
      .array(z.string())
      .optional()
      .describe("Ensure meta_data excludes specific keys."),
    exclude_status: z
      .array(
        z.enum(["future", "trash", "draft", "pending", "private", "publish"]),
      )
      .optional()
      .describe("Exclude products with any of the statuses from result set."),
    exclude_types: z
      .array(z.enum(["simple", "grouped", "external", "variable"]))
      .optional()
      .describe("Exclude products with any of the types from result set."),
    featured: z
      .boolean()
      .optional()
      .describe("Limit result set to featured products."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    include_meta: z
      .array(z.string())
      .optional()
      .describe("Limit meta_data to specific keys."),
    include_status: z
      .array(
        z.enum([
          "any",
          "future",
          "trash",
          "draft",
          "pending",
          "private",
          "publish",
        ]),
      )
      .optional()
      .describe("Limit result set to products with any of the statuses."),
    include_types: z
      .array(z.enum(["simple", "grouped", "external", "variable"]))
      .optional()
      .describe("Limit result set to products with any of the types."),
    max_price: z
      .string()
      .optional()
      .describe("Limit result set to products based on a maximum price."),
    min_price: z
      .string()
      .optional()
      .describe("Limit result set to products based on a minimum price."),
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
    on_sale: z
      .boolean()
      .optional()
      .describe("Limit result set to products on sale."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "date",
        "id",
        "include",
        "title",
        "slug",
        "modified",
        "popularity",
        "rating",
        "post__in",
        "price",
        "sales",
        "menu_order",
        "random",
        "popularity",
        "rating",
        "menu_order",
        "price",
        "popularity",
        "rating",
      ])
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
    search_name_or_sku: z
      .string()
      .optional()
      .describe(
        "Limit results to those with a name or SKU that partial matches a string. This argument takes precedence over 'search', 'sku' and 'search_sku'.",
      ),
    search_sku: z
      .string()
      .optional()
      .describe(
        "Limit results to those with a SKU that partial matches a string. This argument takes precedence over 'sku'.",
      ),
    shipping_class: z
      .string()
      .optional()
      .describe(
        "Limit result set to products assigned a specific shipping class ID.",
      ),
    sku: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with specific SKU(s). Use commas to separate.",
      ),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to products with a specific slug."),
    status: z
      .enum([
        "any",
        "future",
        "trash",
        "draft",
        "pending",
        "private",
        "publish",
      ])
      .optional()
      .describe("Limit result set to products assigned a specific status."),
    stock_status: z
      .enum(["instock", "outofstock", "onbackorder"])
      .optional()
      .describe("Limit result set to products with specified stock status."),
    tag: z
      .string()
      .optional()
      .describe("Limit result set to products assigned a specific tag ID."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Limit result set to products assigned a specific type."),
    virtual: z
      .boolean()
      .optional()
      .describe("Limit result set to virtual products."),
  })
  .strict();

export type ProductsListQuery = z.infer<typeof productsListQuerySchema>;

/**
 * GET /products response body.
 */
export const productsListResponseSchema = z.array(
  z
    .object({
      attributes: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Attribute ID."),
              name: z.string().optional().describe("Attribute name."),
              options: z
                .array(z.string())
                .optional()
                .describe("List of available term names of the attribute."),
              position: z.number().optional().describe("Attribute position."),
              variation: z
                .boolean()
                .optional()
                .describe("Define if the attribute can be used as variation."),
              visible: z
                .boolean()
                .optional()
                .describe(
                  'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
                ),
            })
            .strict(),
        )
        .optional()
        .describe("List of attributes."),
      average_rating: z.string().optional().describe("Reviews average rating."),
      backordered: z
        .boolean()
        .optional()
        .describe("Shows if the product is on backordered."),
      backorders: z
        .enum(["no", "notify", "yes"])
        .optional()
        .describe(
          "If managing stock, this controls if backorders are allowed.",
        ),
      backorders_allowed: z
        .boolean()
        .optional()
        .describe("Shows if backorders are allowed."),
      brands: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Brand ID."),
              name: z.string().optional().describe("Brand name."),
              slug: z.string().optional().describe("Brand slug."),
            })
            .strict(),
        )
        .optional()
        .describe("List of brands."),
      button_text: z
        .string()
        .optional()
        .describe("Product external button text. Only for external products."),
      catalog_visibility: z
        .enum(["visible", "catalog", "search", "hidden"])
        .optional()
        .describe("Catalog visibility."),
      categories: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Category ID."),
              name: z.string().optional().describe("Category name."),
              slug: z.string().optional().describe("Category slug."),
            })
            .strict(),
        )
        .optional()
        .describe("List of categories."),
      cross_sell_ids: z
        .array(z.number())
        .optional()
        .describe("List of cross-sell products IDs."),
      date_created: z
        .string()
        .optional()
        .describe("The date the product was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the product was created, as GMT."),
      date_modified: z
        .string()
        .optional()
        .describe(
          "The date the product was last modified, in the site's timezone.",
        ),
      date_modified_gmt: z
        .string()
        .optional()
        .describe("The date the product was last modified, as GMT."),
      date_on_sale_from: z
        .string()
        .optional()
        .describe("Start date of sale price, in the site's timezone."),
      date_on_sale_from_gmt: z
        .string()
        .optional()
        .describe("Start date of sale price, as GMT."),
      date_on_sale_to: z
        .string()
        .optional()
        .describe("End date of sale price, in the site's timezone."),
      date_on_sale_to_gmt: z
        .string()
        .optional()
        .describe("End date of sale price, in the site's timezone."),
      default_attributes: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Attribute ID."),
              name: z.string().optional().describe("Attribute name."),
              option: z
                .string()
                .optional()
                .describe("Selected attribute term name."),
            })
            .strict(),
        )
        .optional()
        .describe("Defaults variation attributes."),
      description: z.string().optional().describe("Product description."),
      dimensions: z
        .object({
          height: z.string().optional().describe("Product height (in)."),
          length: z.string().optional().describe("Product length (in)."),
          width: z.string().optional().describe("Product width (in)."),
        })
        .describe("Product dimensions.")
        .strict()
        .optional()
        .describe("Product dimensions."),
      download_expiry: z
        .number()
        .optional()
        .describe("Number of days until access to downloadable files expires."),
      download_limit: z
        .number()
        .optional()
        .describe(
          "Number of times downloadable files can be downloaded after purchase.",
        ),
      downloadable: z
        .boolean()
        .optional()
        .describe("If the product is downloadable."),
      downloads: z
        .array(
          z
            .object({
              file: z.string().optional().describe("File URL."),
              id: z.string().optional().describe("File ID."),
              name: z.string().optional().describe("File name."),
            })
            .strict(),
        )
        .optional()
        .describe("List of downloadable files."),
      external_url: z
        .string()
        .optional()
        .describe("Product external URL. Only for external products."),
      featured: z.boolean().optional().describe("Featured product."),
      generated_slug: z
        .string()
        .optional()
        .describe("Slug automatically generated from the product name."),
      global_unique_id: z
        .string()
        .optional()
        .describe("GTIN, UPC, EAN or ISBN."),
      grouped_products: z
        .array(z.number())
        .optional()
        .describe("List of grouped products ID."),
      has_options: z
        .boolean()
        .optional()
        .describe(
          "Shows if the product needs to be configured before it can be bought.",
        ),
      id: z.number().optional().describe("Unique identifier for the resource."),
      images: z
        .array(
          z
            .object({
              alt: z.string().optional().describe("Image alternative text."),
              date_created: z
                .string()
                .optional()
                .describe(
                  "The date the image was created, in the site's timezone.",
                ),
              date_created_gmt: z
                .string()
                .optional()
                .describe("The date the image was created, as GMT."),
              date_modified: z
                .string()
                .optional()
                .describe(
                  "The date the image was last modified, in the site's timezone.",
                ),
              date_modified_gmt: z
                .string()
                .optional()
                .describe("The date the image was last modified, as GMT."),
              id: z.number().optional().describe("Image ID."),
              name: z.string().optional().describe("Image name."),
              src: z.string().optional().describe("Image URL."),
            })
            .strict(),
        )
        .optional()
        .describe("List of images."),
      low_stock_amount: z
        .number()
        .nullable()
        .optional()
        .describe("Low Stock amount for the product."),
      manage_stock: z
        .boolean()
        .optional()
        .describe("Stock management at product level."),
      menu_order: z
        .number()
        .optional()
        .describe("Menu order, used to custom sort products."),
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
      name: z.string().optional().describe("Product name."),
      on_sale: z
        .boolean()
        .optional()
        .describe("Shows if the product is on sale."),
      parent_id: z.number().optional().describe("Product parent ID."),
      permalink: z.string().optional().describe("Product URL."),
      permalink_template: z
        .string()
        .optional()
        .describe("Permalink template for the product."),
      post_password: z.string().optional().describe("Post password."),
      price: z.string().optional().describe("Current product price."),
      price_html: z.string().optional().describe("Price formatted in HTML."),
      purchasable: z
        .boolean()
        .optional()
        .describe("Shows if the product can be bought."),
      purchase_note: z
        .string()
        .optional()
        .describe("Optional note to send the customer after purchase."),
      rating_count: z
        .number()
        .optional()
        .describe("Amount of reviews that the product have."),
      regular_price: z.string().optional().describe("Product regular price."),
      related_ids: z
        .array(z.number())
        .optional()
        .describe("List of related products IDs."),
      reviews_allowed: z.boolean().optional().describe("Allow reviews."),
      sale_price: z.string().optional().describe("Product sale price."),
      shipping_class: z.string().optional().describe("Shipping class slug."),
      shipping_class_id: z.string().optional().describe("Shipping class ID."),
      shipping_required: z
        .boolean()
        .optional()
        .describe("Shows if the product need to be shipped."),
      shipping_taxable: z
        .boolean()
        .optional()
        .describe("Shows whether or not the product shipping is taxable."),
      short_description: z
        .string()
        .optional()
        .describe("Product short description."),
      sku: z.string().optional().describe("Stock Keeping Unit."),
      slug: z.string().optional().describe("Product slug."),
      sold_individually: z
        .boolean()
        .optional()
        .describe("Allow one item to be bought in a single order."),
      status: z
        .enum([
          "draft",
          "pending",
          "private",
          "publish",
          "future",
          "auto-draft",
          "trash",
        ])
        .optional()
        .describe("Product status (post status)."),
      stock_quantity: z.number().optional().describe("Stock quantity."),
      stock_status: z
        .enum(["instock", "outofstock", "onbackorder"])
        .optional()
        .describe("Controls the stock status of the product."),
      tags: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Tag ID."),
              name: z.string().optional().describe("Tag name."),
              slug: z.string().optional().describe("Tag slug."),
            })
            .strict(),
        )
        .optional()
        .describe("List of tags."),
      tax_class: z.string().optional().describe("Tax class."),
      tax_status: z
        .enum(["taxable", "shipping", "none"])
        .optional()
        .describe("Tax status."),
      total_sales: z.number().optional().describe("Amount of sales."),
      type: z
        .enum(["simple", "grouped", "external", "variable"])
        .optional()
        .describe("Product type."),
      upsell_ids: z
        .array(z.number())
        .optional()
        .describe("List of up-sell products IDs."),
      variations: z
        .array(z.number())
        .optional()
        .describe("List of variations IDs."),
      virtual: z.boolean().optional().describe("If the product is virtual."),
      weight: z.string().optional().describe("Product weight (lbs)."),
    })
    .strict(),
);

export type ProductsListResponse = z.infer<typeof productsListResponseSchema>;

/**
 * DELETE /products/reviews/{id} path parameters.
 */
export const productsReviewDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsReviewDeletePathParams = z.infer<
  typeof productsReviewDeletePathParamsSchema
>;

/**
 * DELETE /products/reviews/{id} query parameters.
 */
export const productsReviewDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Whether to bypass trash and force deletion."),
  })
  .strict();

export type ProductsReviewDeleteQuery = z.infer<
  typeof productsReviewDeleteQuerySchema
>;

/**
 * DELETE /products/reviews/{id} response body.
 */
export const productsReviewDeleteResponseSchema = z.unknown();

export type ProductsReviewDeleteResponse = z.infer<
  typeof productsReviewDeleteResponseSchema
>;

/**
 * GET /products/reviews/{id} path parameters.
 */
export const productsReviewGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsReviewGetPathParams = z.infer<
  typeof productsReviewGetPathParamsSchema
>;

/**
 * GET /products/reviews/{id} query parameters.
 */
export const productsReviewGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsReviewGetQuery = z.infer<
  typeof productsReviewGetQuerySchema
>;

/**
 * GET /products/reviews/{id} response body.
 */
export const productsReviewGetResponseSchema = z
  .object({
    date_created: z
      .string()
      .optional()
      .describe("The date the review was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the review was created, as GMT."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    product_id: z
      .number()
      .optional()
      .describe(
        "Unique identifier for the product that the review belongs to.",
      ),
    product_name: z.string().optional().describe("Product name."),
    product_permalink: z.string().optional().describe("Product URL."),
    rating: z.number().optional().describe("Review rating (0 to 5)."),
    review: z.string().optional().describe("The content of the review."),
    reviewer: z.string().optional().describe("Reviewer name."),
    reviewer_avatar_urls: z
      .object({
        "24": z
          .string()
          .optional()
          .describe("Avatar URL with image size of 24 pixels."),
        "48": z
          .string()
          .optional()
          .describe("Avatar URL with image size of 48 pixels."),
        "96": z
          .string()
          .optional()
          .describe("Avatar URL with image size of 96 pixels."),
      })
      .describe("Avatar URLs for the object reviewer.")
      .strict()
      .optional()
      .describe("Avatar URLs for the object reviewer."),
    reviewer_email: z.string().optional().describe("Reviewer email."),
    status: z
      .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
      .optional()
      .describe("Status of the review."),
    verified: z
      .boolean()
      .optional()
      .describe("Shows if the reviewer bought the product or not."),
  })
  .strict();

export type ProductsReviewGetResponse = z.infer<
  typeof productsReviewGetResponseSchema
>;

/**
 * PUT /products/reviews/{id} path parameters.
 */
export const productsReviewUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsReviewUpdatePathParams = z.infer<
  typeof productsReviewUpdatePathParamsSchema
>;

/**
 * PUT /products/reviews/{id} request body.
 */
export const productsReviewUpdateBodySchema = z
  .object({
    product_id: z
      .number()
      .optional()
      .describe(
        "Unique identifier for the product that the review belongs to.",
      ),
    product_name: z.string().optional().describe("Product name."),
    rating: z.number().optional().describe("Review rating (0 to 5)."),
    review: z.string().optional().describe("The content of the review."),
    reviewer: z.string().optional().describe("Reviewer name."),
    reviewer_email: z.string().optional().describe("Reviewer email."),
    status: z
      .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
      .optional()
      .describe("Status of the review."),
  })
  .strict();

export type ProductsReviewUpdateBody = z.infer<
  typeof productsReviewUpdateBodySchema
>;

/**
 * PUT /products/reviews/{id} response body.
 */
export const productsReviewUpdateResponseSchema = z.unknown();

export type ProductsReviewUpdateResponse = z.infer<
  typeof productsReviewUpdateResponseSchema
>;

/**
 * POST /products/reviews/batch request body.
 */
export const productsReviewsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            product_id: z
              .number()
              .optional()
              .describe(
                "Unique identifier for the product that the review belongs to.",
              ),
            product_name: z.string().optional().describe("Product name."),
            rating: z.number().optional().describe("Review rating (0 to 5)."),
            review: z
              .string()
              .optional()
              .describe("The content of the review."),
            reviewer: z.string().optional().describe("Reviewer name."),
            reviewer_email: z.string().optional().describe("Reviewer email."),
            status: z
              .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
              .optional()
              .describe("Status of the review."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            id: z.number(),
            product_id: z
              .number()
              .optional()
              .describe(
                "Unique identifier for the product that the review belongs to.",
              ),
            product_name: z.string().optional().describe("Product name."),
            rating: z.number().optional().describe("Review rating (0 to 5)."),
            review: z
              .string()
              .optional()
              .describe("The content of the review."),
            reviewer: z.string().optional().describe("Reviewer name."),
            reviewer_email: z.string().optional().describe("Reviewer email."),
            status: z
              .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
              .optional()
              .describe("Status of the review."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsReviewsBatchUpdateBody = z.infer<
  typeof productsReviewsBatchUpdateBodySchema
>;

/**
 * POST /products/reviews/batch response body.
 */
export const productsReviewsBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsReviewsBatchUpdateResponse = z.infer<
  typeof productsReviewsBatchUpdateResponseSchema
>;

/**
 * POST /products/reviews request body.
 */
export const productsReviewsCreateBodySchema = z
  .object({
    product_id: z.number().describe("Unique identifier for the product."),
    product_name: z.string().optional().describe("Product name."),
    rating: z.number().optional().describe("Review rating (0 to 5)."),
    review: z.string().describe("Review content."),
    reviewer: z.string().describe("Name of the reviewer."),
    reviewer_email: z.string().describe("Email of the reviewer."),
    status: z
      .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
      .optional()
      .describe("Status of the review."),
  })
  .strict();

export type ProductsReviewsCreateBody = z.infer<
  typeof productsReviewsCreateBodySchema
>;

/**
 * POST /products/reviews response body.
 */
export const productsReviewsCreateResponseSchema = z
  .object({
    date_created: z
      .string()
      .optional()
      .describe("The date the review was created, in the site's timezone."),
    date_created_gmt: z
      .string()
      .optional()
      .describe("The date the review was created, as GMT."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    product_id: z
      .number()
      .optional()
      .describe(
        "Unique identifier for the product that the review belongs to.",
      ),
    product_name: z.string().optional().describe("Product name."),
    product_permalink: z.string().optional().describe("Product URL."),
    rating: z.number().optional().describe("Review rating (0 to 5)."),
    review: z.string().optional().describe("The content of the review."),
    reviewer: z.string().optional().describe("Reviewer name."),
    reviewer_avatar_urls: z
      .object({
        "24": z
          .string()
          .optional()
          .describe("Avatar URL with image size of 24 pixels."),
        "48": z
          .string()
          .optional()
          .describe("Avatar URL with image size of 48 pixels."),
        "96": z
          .string()
          .optional()
          .describe("Avatar URL with image size of 96 pixels."),
      })
      .describe("Avatar URLs for the object reviewer.")
      .strict()
      .optional()
      .describe("Avatar URLs for the object reviewer."),
    reviewer_email: z.string().optional().describe("Reviewer email."),
    status: z
      .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
      .optional()
      .describe("Status of the review."),
    verified: z
      .boolean()
      .optional()
      .describe("Shows if the reviewer bought the product or not."),
  })
  .strict();

export type ProductsReviewsCreateResponse = z.infer<
  typeof productsReviewsCreateResponseSchema
>;

/**
 * GET /products/reviews query parameters.
 */
export const productsReviewsListQuerySchema = z
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
        "Limit response to reviews published before a given ISO8601 compliant date.",
      ),
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific IDs."),
    offset: z
      .number()
      .optional()
      .describe("Offset the result set by a specific number of items."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum(["date", "date_gmt", "id", "include", "product"])
      .optional()
      .describe("Sort collection by object attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .array(z.number())
      .optional()
      .describe(
        "Limit result set to reviews assigned to specific product IDs.",
      ),
    reviewer: z
      .array(z.number())
      .optional()
      .describe("Limit result set to reviews assigned to specific user IDs."),
    reviewer_email: z
      .string()
      .optional()
      .describe("Limit result set to that from a specific author email."),
    reviewer_exclude: z
      .array(z.number())
      .optional()
      .describe(
        "Ensure result set excludes reviews assigned to specific user IDs.",
      ),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    status: z
      .enum(["all", "hold", "approved", "spam", "trash"])
      .optional()
      .describe("Limit result set to reviews assigned a specific status."),
  })
  .strict();

export type ProductsReviewsListQuery = z.infer<
  typeof productsReviewsListQuerySchema
>;

/**
 * GET /products/reviews response body.
 */
export const productsReviewsListResponseSchema = z.array(
  z
    .object({
      date_created: z
        .string()
        .optional()
        .describe("The date the review was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the review was created, as GMT."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      product_id: z
        .number()
        .optional()
        .describe(
          "Unique identifier for the product that the review belongs to.",
        ),
      product_name: z.string().optional().describe("Product name."),
      product_permalink: z.string().optional().describe("Product URL."),
      rating: z.number().optional().describe("Review rating (0 to 5)."),
      review: z.string().optional().describe("The content of the review."),
      reviewer: z.string().optional().describe("Reviewer name."),
      reviewer_avatar_urls: z
        .object({
          "24": z
            .string()
            .optional()
            .describe("Avatar URL with image size of 24 pixels."),
          "48": z
            .string()
            .optional()
            .describe("Avatar URL with image size of 48 pixels."),
          "96": z
            .string()
            .optional()
            .describe("Avatar URL with image size of 96 pixels."),
        })
        .describe("Avatar URLs for the object reviewer.")
        .strict()
        .optional()
        .describe("Avatar URLs for the object reviewer."),
      reviewer_email: z.string().optional().describe("Reviewer email."),
      status: z
        .enum(["approved", "hold", "spam", "unspam", "trash", "untrash"])
        .optional()
        .describe("Status of the review."),
      verified: z
        .boolean()
        .optional()
        .describe("Shows if the reviewer bought the product or not."),
    })
    .strict(),
);

export type ProductsReviewsListResponse = z.infer<
  typeof productsReviewsListResponseSchema
>;

/**
 * DELETE /products/shipping_classes/{id} path parameters.
 */
export const productsShippingClassDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsShippingClassDeletePathParams = z.infer<
  typeof productsShippingClassDeletePathParamsSchema
>;

/**
 * DELETE /products/shipping_classes/{id} query parameters.
 */
export const productsShippingClassDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type ProductsShippingClassDeleteQuery = z.infer<
  typeof productsShippingClassDeleteQuerySchema
>;

/**
 * DELETE /products/shipping_classes/{id} response body.
 */
export const productsShippingClassDeleteResponseSchema = z.unknown();

export type ProductsShippingClassDeleteResponse = z.infer<
  typeof productsShippingClassDeleteResponseSchema
>;

/**
 * GET /products/shipping_classes/{id} path parameters.
 */
export const productsShippingClassGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsShippingClassGetPathParams = z.infer<
  typeof productsShippingClassGetPathParamsSchema
>;

/**
 * GET /products/shipping_classes/{id} query parameters.
 */
export const productsShippingClassGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsShippingClassGetQuery = z.infer<
  typeof productsShippingClassGetQuerySchema
>;

/**
 * GET /products/shipping_classes/{id} response body.
 */
export const productsShippingClassGetResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Shipping class name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsShippingClassGetResponse = z.infer<
  typeof productsShippingClassGetResponseSchema
>;

/**
 * PUT /products/shipping_classes/{id} path parameters.
 */
export const productsShippingClassUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsShippingClassUpdatePathParams = z.infer<
  typeof productsShippingClassUpdatePathParamsSchema
>;

/**
 * PUT /products/shipping_classes/{id} request body.
 */
export const productsShippingClassUpdateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Shipping class name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsShippingClassUpdateBody = z.infer<
  typeof productsShippingClassUpdateBodySchema
>;

/**
 * PUT /products/shipping_classes/{id} response body.
 */
export const productsShippingClassUpdateResponseSchema = z.unknown();

export type ProductsShippingClassUpdateResponse = z.infer<
  typeof productsShippingClassUpdateResponseSchema
>;

/**
 * POST /products/shipping_classes/batch request body.
 */
export const productsShippingClassesBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            name: z.string().optional().describe("Shipping class name."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            id: z.number(),
            name: z.string().optional().describe("Shipping class name."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsShippingClassesBatchUpdateBody = z.infer<
  typeof productsShippingClassesBatchUpdateBodySchema
>;

/**
 * POST /products/shipping_classes/batch response body.
 */
export const productsShippingClassesBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsShippingClassesBatchUpdateResponse = z.infer<
  typeof productsShippingClassesBatchUpdateResponseSchema
>;

/**
 * POST /products/shipping_classes request body.
 */
export const productsShippingClassesCreateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().describe("Name for the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsShippingClassesCreateBody = z.infer<
  typeof productsShippingClassesCreateBodySchema
>;

/**
 * POST /products/shipping_classes response body.
 */
export const productsShippingClassesCreateResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Shipping class name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsShippingClassesCreateResponse = z.infer<
  typeof productsShippingClassesCreateResponseSchema
>;

/**
 * GET /products/shipping_classes query parameters.
 */
export const productsShippingClassesListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    hide_empty: z
      .boolean()
      .optional()
      .describe("Whether to hide resources not assigned to any products."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    offset: z
      .number()
      .optional()
      .describe(
        "Offset the result set by a specific number of items. Applies to hierarchical taxonomies only.",
      ),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "id",
        "include",
        "name",
        "slug",
        "term_group",
        "description",
        "count",
      ])
      .optional()
      .describe("Sort collection by resource attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.",
      ),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific product.",
      ),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific slug."),
  })
  .strict();

export type ProductsShippingClassesListQuery = z.infer<
  typeof productsShippingClassesListQuerySchema
>;

/**
 * GET /products/shipping_classes response body.
 */
export const productsShippingClassesListResponseSchema = z.array(
  z
    .object({
      count: z
        .number()
        .optional()
        .describe("Number of published products for the resource."),
      description: z
        .string()
        .optional()
        .describe("HTML description of the resource."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("Shipping class name."),
      slug: z
        .string()
        .optional()
        .describe(
          "An alphanumeric identifier for the resource unique to its type.",
        ),
    })
    .strict(),
);

export type ProductsShippingClassesListResponse = z.infer<
  typeof productsShippingClassesListResponseSchema
>;

/**
 * GET /products/shipping_classes/slug-suggestion query parameters.
 */
export const productsShippingClassesSlugSuggestionListQuerySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Shipping class name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsShippingClassesSlugSuggestionListQuery = z.infer<
  typeof productsShippingClassesSlugSuggestionListQuerySchema
>;

/**
 * GET /products/shipping_classes/slug-suggestion response body.
 */
export const productsShippingClassesSlugSuggestionListResponseSchema = z.array(
  z
    .object({
      count: z
        .number()
        .optional()
        .describe("Number of published products for the resource."),
      description: z
        .string()
        .optional()
        .describe("HTML description of the resource."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("Shipping class name."),
      slug: z
        .string()
        .optional()
        .describe(
          "An alphanumeric identifier for the resource unique to its type.",
        ),
    })
    .strict(),
);

export type ProductsShippingClassesSlugSuggestionListResponse = z.infer<
  typeof productsShippingClassesSlugSuggestionListResponseSchema
>;

/**
 * GET /products/suggested-products query parameters.
 */
export const productsSuggestedProductsListQuerySchema = z
  .object({
    after: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published after a given ISO8601 compliant date.",
      ),
    attribute: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with a specific attribute. Use the taxonomy name/attribute slug.",
      ),
    attribute_term: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with a specific attribute term ID (required an assigned attribute).",
      ),
    before: z
      .string()
      .optional()
      .describe(
        "Limit response to resources published before a given ISO8601 compliant date.",
      ),
    brand: z
      .string()
      .optional()
      .describe("Limit result set to products assigned a specific brand ID."),
    categories: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific product categorie ids."),
    category: z
      .string()
      .optional()
      .describe(
        "Limit result set to products assigned a specific category ID.",
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
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    exclude_meta: z
      .array(z.string())
      .optional()
      .describe("Ensure meta_data excludes specific keys."),
    featured: z
      .boolean()
      .optional()
      .describe("Limit result set to featured products."),
    in_stock: z
      .boolean()
      .optional()
      .describe("Limit result set to products in stock or out of stock."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    include_meta: z
      .array(z.string())
      .optional()
      .describe("Limit meta_data to specific keys."),
    limit: z
      .number()
      .optional()
      .describe("Limit result set to specific amount of suggested products."),
    max_price: z
      .string()
      .optional()
      .describe("Limit result set to products based on a maximum price."),
    min_price: z
      .string()
      .optional()
      .describe("Limit result set to products based on a minimum price."),
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
    on_sale: z
      .boolean()
      .optional()
      .describe("Limit result set to products on sale."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "date",
        "id",
        "include",
        "title",
        "slug",
        "modified",
        "popularity",
        "rating",
        "post__in",
        "price",
        "sales",
        "menu_order",
        "random",
        "popularity",
        "rating",
        "menu_order",
      ])
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
    shipping_class: z
      .string()
      .optional()
      .describe(
        "Limit result set to products assigned a specific shipping class ID.",
      ),
    sku: z
      .string()
      .optional()
      .describe(
        "Limit result set to products with specific SKU(s). Use commas to separate.",
      ),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to products with a specific slug."),
    status: z
      .enum([
        "any",
        "future",
        "trash",
        "draft",
        "pending",
        "private",
        "publish",
      ])
      .optional()
      .describe("Limit result set to products assigned a specific status."),
    tag: z
      .string()
      .optional()
      .describe("Limit result set to products assigned a specific tag ID."),
    tags: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific product tag ids."),
    type: z
      .enum(["simple", "grouped", "external", "variable"])
      .optional()
      .describe("Limit result set to products assigned a specific type."),
  })
  .strict();

export type ProductsSuggestedProductsListQuery = z.infer<
  typeof productsSuggestedProductsListQuerySchema
>;

/**
 * GET /products/suggested-products response body.
 */
export const productsSuggestedProductsListResponseSchema = z.array(
  z
    .object({
      attributes: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Attribute ID."),
              name: z.string().optional().describe("Attribute name."),
              options: z
                .array(z.string())
                .optional()
                .describe("List of available term names of the attribute."),
              position: z.number().optional().describe("Attribute position."),
              variation: z
                .boolean()
                .optional()
                .describe("Define if the attribute can be used as variation."),
              visible: z
                .boolean()
                .optional()
                .describe(
                  'Define if the attribute is visible on the "Additional information" tab in the product\'s page.',
                ),
            })
            .strict(),
        )
        .optional()
        .describe("List of attributes."),
      average_rating: z.string().optional().describe("Reviews average rating."),
      backordered: z
        .boolean()
        .optional()
        .describe("Shows if the product is on backordered."),
      backorders: z
        .enum(["no", "notify", "yes"])
        .optional()
        .describe(
          "If managing stock, this controls if backorders are allowed.",
        ),
      backorders_allowed: z
        .boolean()
        .optional()
        .describe("Shows if backorders are allowed."),
      brands: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Brand ID."),
              name: z.string().optional().describe("Brand name."),
              slug: z.string().optional().describe("Brand slug."),
            })
            .strict(),
        )
        .optional()
        .describe("List of brands."),
      button_text: z
        .string()
        .optional()
        .describe("Product external button text. Only for external products."),
      catalog_visibility: z
        .enum(["visible", "catalog", "search", "hidden"])
        .optional()
        .describe("Catalog visibility."),
      categories: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Category ID."),
              name: z.string().optional().describe("Category name."),
              slug: z.string().optional().describe("Category slug."),
            })
            .strict(),
        )
        .optional()
        .describe("List of categories."),
      cross_sell_ids: z
        .array(z.number())
        .optional()
        .describe("List of cross-sell products IDs."),
      date_created: z
        .string()
        .optional()
        .describe("The date the product was created, in the site's timezone."),
      date_created_gmt: z
        .string()
        .optional()
        .describe("The date the product was created, as GMT."),
      date_modified: z
        .string()
        .optional()
        .describe(
          "The date the product was last modified, in the site's timezone.",
        ),
      date_modified_gmt: z
        .string()
        .optional()
        .describe("The date the product was last modified, as GMT."),
      date_on_sale_from: z
        .string()
        .optional()
        .describe("Start date of sale price, in the site's timezone."),
      date_on_sale_from_gmt: z
        .string()
        .optional()
        .describe("Start date of sale price, as GMT."),
      date_on_sale_to: z
        .string()
        .optional()
        .describe("End date of sale price, in the site's timezone."),
      date_on_sale_to_gmt: z
        .string()
        .optional()
        .describe("End date of sale price, in the site's timezone."),
      default_attributes: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Attribute ID."),
              name: z.string().optional().describe("Attribute name."),
              option: z
                .string()
                .optional()
                .describe("Selected attribute term name."),
            })
            .strict(),
        )
        .optional()
        .describe("Defaults variation attributes."),
      description: z.string().optional().describe("Product description."),
      dimensions: z
        .object({
          height: z.string().optional().describe("Product height (in)."),
          length: z.string().optional().describe("Product length (in)."),
          width: z.string().optional().describe("Product width (in)."),
        })
        .describe("Product dimensions.")
        .strict()
        .optional()
        .describe("Product dimensions."),
      download_expiry: z
        .number()
        .optional()
        .describe("Number of days until access to downloadable files expires."),
      download_limit: z
        .number()
        .optional()
        .describe(
          "Number of times downloadable files can be downloaded after purchase.",
        ),
      downloadable: z
        .boolean()
        .optional()
        .describe("If the product is downloadable."),
      downloads: z
        .array(
          z
            .object({
              file: z.string().optional().describe("File URL."),
              id: z.string().optional().describe("File ID."),
              name: z.string().optional().describe("File name."),
            })
            .strict(),
        )
        .optional()
        .describe("List of downloadable files."),
      external_url: z
        .string()
        .optional()
        .describe("Product external URL. Only for external products."),
      featured: z.boolean().optional().describe("Featured product."),
      generated_slug: z
        .string()
        .optional()
        .describe("Slug automatically generated from the product name."),
      global_unique_id: z
        .string()
        .optional()
        .describe("GTIN, UPC, EAN or ISBN."),
      grouped_products: z
        .array(z.number())
        .optional()
        .describe("List of grouped products ID."),
      has_options: z
        .boolean()
        .optional()
        .describe(
          "Shows if the product needs to be configured before it can be bought.",
        ),
      id: z.number().optional().describe("Unique identifier for the resource."),
      images: z
        .array(
          z
            .object({
              alt: z.string().optional().describe("Image alternative text."),
              date_created: z
                .string()
                .optional()
                .describe(
                  "The date the image was created, in the site's timezone.",
                ),
              date_created_gmt: z
                .string()
                .optional()
                .describe("The date the image was created, as GMT."),
              date_modified: z
                .string()
                .optional()
                .describe(
                  "The date the image was last modified, in the site's timezone.",
                ),
              date_modified_gmt: z
                .string()
                .optional()
                .describe("The date the image was last modified, as GMT."),
              id: z.number().optional().describe("Image ID."),
              name: z.string().optional().describe("Image name."),
              src: z.string().optional().describe("Image URL."),
            })
            .strict(),
        )
        .optional()
        .describe("List of images."),
      low_stock_amount: z
        .number()
        .nullable()
        .optional()
        .describe("Low Stock amount for the product."),
      manage_stock: z
        .boolean()
        .optional()
        .describe("Stock management at product level."),
      menu_order: z
        .number()
        .optional()
        .describe("Menu order, used to custom sort products."),
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
      name: z.string().optional().describe("Product name."),
      on_sale: z
        .boolean()
        .optional()
        .describe("Shows if the product is on sale."),
      parent_id: z.number().optional().describe("Product parent ID."),
      permalink: z.string().optional().describe("Product URL."),
      permalink_template: z
        .string()
        .optional()
        .describe("Permalink template for the product."),
      post_password: z.string().optional().describe("Post password."),
      price: z.string().optional().describe("Current product price."),
      price_html: z.string().optional().describe("Price formatted in HTML."),
      purchasable: z
        .boolean()
        .optional()
        .describe("Shows if the product can be bought."),
      purchase_note: z
        .string()
        .optional()
        .describe("Optional note to send the customer after purchase."),
      rating_count: z
        .number()
        .optional()
        .describe("Amount of reviews that the product have."),
      regular_price: z.string().optional().describe("Product regular price."),
      related_ids: z
        .array(z.number())
        .optional()
        .describe("List of related products IDs."),
      reviews_allowed: z.boolean().optional().describe("Allow reviews."),
      sale_price: z.string().optional().describe("Product sale price."),
      shipping_class: z.string().optional().describe("Shipping class slug."),
      shipping_class_id: z.string().optional().describe("Shipping class ID."),
      shipping_required: z
        .boolean()
        .optional()
        .describe("Shows if the product need to be shipped."),
      shipping_taxable: z
        .boolean()
        .optional()
        .describe("Shows whether or not the product shipping is taxable."),
      short_description: z
        .string()
        .optional()
        .describe("Product short description."),
      sku: z.string().optional().describe("Stock Keeping Unit."),
      slug: z.string().optional().describe("Product slug."),
      sold_individually: z
        .boolean()
        .optional()
        .describe("Allow one item to be bought in a single order."),
      status: z
        .enum([
          "draft",
          "pending",
          "private",
          "publish",
          "future",
          "auto-draft",
          "trash",
        ])
        .optional()
        .describe("Product status (post status)."),
      stock_quantity: z.number().optional().describe("Stock quantity."),
      stock_status: z
        .enum(["instock", "outofstock", "onbackorder"])
        .optional()
        .describe("Controls the stock status of the product."),
      tags: z
        .array(
          z
            .object({
              id: z.number().optional().describe("Tag ID."),
              name: z.string().optional().describe("Tag name."),
              slug: z.string().optional().describe("Tag slug."),
            })
            .strict(),
        )
        .optional()
        .describe("List of tags."),
      tax_class: z.string().optional().describe("Tax class."),
      tax_status: z
        .enum(["taxable", "shipping", "none"])
        .optional()
        .describe("Tax status."),
      total_sales: z.number().optional().describe("Amount of sales."),
      type: z
        .enum(["simple", "grouped", "external", "variable"])
        .optional()
        .describe("Product type."),
      upsell_ids: z
        .array(z.number())
        .optional()
        .describe("List of up-sell products IDs."),
      variations: z
        .array(z.number())
        .optional()
        .describe("List of variations IDs."),
      virtual: z.boolean().optional().describe("If the product is virtual."),
      weight: z.string().optional().describe("Product weight (lbs)."),
    })
    .strict(),
);

export type ProductsSuggestedProductsListResponse = z.infer<
  typeof productsSuggestedProductsListResponseSchema
>;

/**
 * DELETE /products/tags/{id} path parameters.
 */
export const productsTagDeletePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsTagDeletePathParams = z.infer<
  typeof productsTagDeletePathParamsSchema
>;

/**
 * DELETE /products/tags/{id} query parameters.
 */
export const productsTagDeleteQuerySchema = z
  .object({
    force: z
      .boolean()
      .optional()
      .describe("Required to be true, as resource does not support trashing."),
  })
  .strict();

export type ProductsTagDeleteQuery = z.infer<
  typeof productsTagDeleteQuerySchema
>;

/**
 * DELETE /products/tags/{id} response body.
 */
export const productsTagDeleteResponseSchema = z.unknown();

export type ProductsTagDeleteResponse = z.infer<
  typeof productsTagDeleteResponseSchema
>;

/**
 * GET /products/tags/{id} path parameters.
 */
export const productsTagGetPathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsTagGetPathParams = z.infer<
  typeof productsTagGetPathParamsSchema
>;

/**
 * GET /products/tags/{id} query parameters.
 */
export const productsTagGetQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
  })
  .strict();

export type ProductsTagGetQuery = z.infer<typeof productsTagGetQuerySchema>;

/**
 * GET /products/tags/{id} response body.
 */
export const productsTagGetResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Tag name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsTagGetResponse = z.infer<
  typeof productsTagGetResponseSchema
>;

/**
 * PUT /products/tags/{id} path parameters.
 */
export const productsTagUpdatePathParamsSchema = z
  .object({ id: z.number() })
  .strict();

export type ProductsTagUpdatePathParams = z.infer<
  typeof productsTagUpdatePathParamsSchema
>;

/**
 * PUT /products/tags/{id} request body.
 */
export const productsTagUpdateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().optional().describe("Tag name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsTagUpdateBody = z.infer<typeof productsTagUpdateBodySchema>;

/**
 * PUT /products/tags/{id} response body.
 */
export const productsTagUpdateResponseSchema = z.unknown();

export type ProductsTagUpdateResponse = z.infer<
  typeof productsTagUpdateResponseSchema
>;

/**
 * POST /products/tags/batch request body.
 */
export const productsTagsBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            name: z.string().optional().describe("Tag name."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            description: z
              .string()
              .optional()
              .describe("HTML description of the resource."),
            id: z.number(),
            name: z.string().optional().describe("Tag name."),
            slug: z
              .string()
              .optional()
              .describe(
                "An alphanumeric identifier for the resource unique to its type.",
              ),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type ProductsTagsBatchUpdateBody = z.infer<
  typeof productsTagsBatchUpdateBodySchema
>;

/**
 * POST /products/tags/batch response body.
 */
export const productsTagsBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type ProductsTagsBatchUpdateResponse = z.infer<
  typeof productsTagsBatchUpdateResponseSchema
>;

/**
 * POST /products/tags request body.
 */
export const productsTagsCreateBodySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    name: z.string().describe("Name for the resource."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsTagsCreateBody = z.infer<
  typeof productsTagsCreateBodySchema
>;

/**
 * POST /products/tags response body.
 */
export const productsTagsCreateResponseSchema = z
  .object({
    count: z
      .number()
      .optional()
      .describe("Number of published products for the resource."),
    description: z
      .string()
      .optional()
      .describe("HTML description of the resource."),
    id: z.number().optional().describe("Unique identifier for the resource."),
    name: z.string().optional().describe("Tag name."),
    slug: z
      .string()
      .optional()
      .describe(
        "An alphanumeric identifier for the resource unique to its type.",
      ),
  })
  .strict();

export type ProductsTagsCreateResponse = z.infer<
  typeof productsTagsCreateResponseSchema
>;

/**
 * GET /products/tags query parameters.
 */
export const productsTagsListQuerySchema = z
  .object({
    context: z
      .enum(["view", "edit"])
      .optional()
      .describe(
        "Scope under which the request is made; determines fields present in response.",
      ),
    exclude: z
      .array(z.number())
      .optional()
      .describe("Ensure result set excludes specific IDs."),
    hide_empty: z
      .boolean()
      .optional()
      .describe("Whether to hide resources not assigned to any products."),
    include: z
      .array(z.number())
      .optional()
      .describe("Limit result set to specific ids."),
    offset: z
      .number()
      .optional()
      .describe(
        "Offset the result set by a specific number of items. Applies to hierarchical taxonomies only.",
      ),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Order sort attribute ascending or descending."),
    orderby: z
      .enum([
        "id",
        "include",
        "name",
        "slug",
        "term_group",
        "description",
        "count",
      ])
      .optional()
      .describe("Sort collection by resource attribute."),
    page: z.number().optional().describe("Current page of the collection."),
    parent: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.",
      ),
    per_page: z
      .number()
      .optional()
      .describe("Maximum number of items to be returned in result set."),
    product: z
      .number()
      .optional()
      .describe(
        "Limit result set to resources assigned to a specific product.",
      ),
    search: z
      .string()
      .optional()
      .describe("Limit results to those matching a string."),
    slug: z
      .string()
      .optional()
      .describe("Limit result set to resources with a specific slug."),
  })
  .strict();

export type ProductsTagsListQuery = z.infer<typeof productsTagsListQuerySchema>;

/**
 * GET /products/tags response body.
 */
export const productsTagsListResponseSchema = z.array(
  z
    .object({
      count: z
        .number()
        .optional()
        .describe("Number of published products for the resource."),
      description: z
        .string()
        .optional()
        .describe("HTML description of the resource."),
      id: z.number().optional().describe("Unique identifier for the resource."),
      name: z.string().optional().describe("Tag name."),
      slug: z
        .string()
        .optional()
        .describe(
          "An alphanumeric identifier for the resource unique to its type.",
        ),
    })
    .strict(),
);

export type ProductsTagsListResponse = z.infer<
  typeof productsTagsListResponseSchema
>;
