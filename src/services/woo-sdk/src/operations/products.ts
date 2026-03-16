/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  ProductAttributePostCustomBody,
  ProductAttributePostCustomPathParams,
  ProductAttributePostCustomResponse,
  ProductAttributePutBatchCustomBody,
  ProductAttributePutBatchCustomResponse,
  ProductAttributeTermPostCustomBody,
  ProductAttributeTermPostCustomPathParams,
  ProductAttributeTermPostCustomResponse,
  ProductAttributeTermPutBatchCustomBody,
  ProductAttributeTermPutBatchCustomPathParams,
  ProductAttributeTermPutBatchCustomResponse,
  ProductBrandPostCustomBody,
  ProductBrandPostCustomPathParams,
  ProductBrandPostCustomResponse,
  ProductBrandPutBatchCustomBody,
  ProductBrandPutBatchCustomResponse,
  ProductCategoryPostCustomBody,
  ProductCategoryPostCustomPathParams,
  ProductCategoryPostCustomResponse,
  ProductCategoryPutBatchCustomBody,
  ProductCategoryPutBatchCustomResponse,
  ProductDeletePathParams,
  ProductDeleteQuery,
  ProductDeleteResponse,
  ProductDuplicateCreateBody,
  ProductDuplicateCreatePathParams,
  ProductDuplicateCreateResponse,
  ProductGetPathParams,
  ProductGetQuery,
  ProductGetResponse,
  ProductPostCustomBody,
  ProductPostCustomPathParams,
  ProductPostCustomResponse,
  ProductPutBatchCustomBody,
  ProductPutBatchCustomResponse,
  ProductReviewPostCustomBody,
  ProductReviewPostCustomPathParams,
  ProductReviewPostCustomResponse,
  ProductReviewPutBatchCustomBody,
  ProductReviewPutBatchCustomResponse,
  ProductShippingClassPostCustomBody,
  ProductShippingClassPostCustomPathParams,
  ProductShippingClassPostCustomResponse,
  ProductShippingClassPutBatchCustomBody,
  ProductShippingClassPutBatchCustomResponse,
  ProductTagPostCustomBody,
  ProductTagPostCustomPathParams,
  ProductTagPostCustomResponse,
  ProductTagPutBatchCustomBody,
  ProductTagPutBatchCustomResponse,
  ProductUpdateBody,
  ProductUpdatePathParams,
  ProductUpdateResponse,
  ProductVariationDeletePathParams,
  ProductVariationDeleteQuery,
  ProductVariationDeleteResponse,
  ProductVariationGetPathParams,
  ProductVariationGetQuery,
  ProductVariationGetResponse,
  ProductVariationPostCustomBody,
  ProductVariationPostCustomPathParams,
  ProductVariationPostCustomResponse,
  ProductVariationPutBatchCustomBody,
  ProductVariationPutBatchCustomPathParams,
  ProductVariationPutBatchCustomResponse,
  ProductVariationUpdateBody,
  ProductVariationUpdatePathParams,
  ProductVariationUpdateResponse,
  ProductVariationsBatchUpdateBody,
  ProductVariationsBatchUpdatePathParams,
  ProductVariationsBatchUpdateResponse,
  ProductVariationsCreateBody,
  ProductVariationsCreatePathParams,
  ProductVariationsCreateResponse,
  ProductVariationsGenerateCreateBody,
  ProductVariationsGenerateCreatePathParams,
  ProductVariationsGenerateCreateResponse,
  ProductVariationsListPathParams,
  ProductVariationsListQuery,
  ProductVariationsListResponse,
  ProductsAttributeDeletePathParams,
  ProductsAttributeDeleteQuery,
  ProductsAttributeDeleteResponse,
  ProductsAttributeGetPathParams,
  ProductsAttributeGetQuery,
  ProductsAttributeGetResponse,
  ProductsAttributeTermDeletePathParams,
  ProductsAttributeTermDeleteQuery,
  ProductsAttributeTermDeleteResponse,
  ProductsAttributeTermGetPathParams,
  ProductsAttributeTermGetQuery,
  ProductsAttributeTermGetResponse,
  ProductsAttributeTermUpdateBody,
  ProductsAttributeTermUpdatePathParams,
  ProductsAttributeTermUpdateResponse,
  ProductsAttributeTermsBatchUpdateBody,
  ProductsAttributeTermsBatchUpdatePathParams,
  ProductsAttributeTermsBatchUpdateResponse,
  ProductsAttributeTermsCreateBody,
  ProductsAttributeTermsCreatePathParams,
  ProductsAttributeTermsCreateResponse,
  ProductsAttributeTermsListPathParams,
  ProductsAttributeTermsListQuery,
  ProductsAttributeTermsListResponse,
  ProductsAttributeUpdateBody,
  ProductsAttributeUpdatePathParams,
  ProductsAttributeUpdateResponse,
  ProductsAttributesBatchUpdateBody,
  ProductsAttributesBatchUpdateResponse,
  ProductsAttributesCreateBody,
  ProductsAttributesCreateResponse,
  ProductsAttributesListQuery,
  ProductsAttributesListResponse,
  ProductsBatchUpdateBody,
  ProductsBatchUpdateResponse,
  ProductsBrandDeletePathParams,
  ProductsBrandDeleteQuery,
  ProductsBrandDeleteResponse,
  ProductsBrandGetPathParams,
  ProductsBrandGetQuery,
  ProductsBrandGetResponse,
  ProductsBrandUpdateBody,
  ProductsBrandUpdatePathParams,
  ProductsBrandUpdateResponse,
  ProductsBrandsBatchUpdateBody,
  ProductsBrandsBatchUpdateResponse,
  ProductsBrandsCreateBody,
  ProductsBrandsCreateResponse,
  ProductsBrandsListQuery,
  ProductsBrandsListResponse,
  ProductsCategoriesBatchUpdateBody,
  ProductsCategoriesBatchUpdateResponse,
  ProductsCategoriesCreateBody,
  ProductsCategoriesCreateResponse,
  ProductsCategoriesListQuery,
  ProductsCategoriesListResponse,
  ProductsCategoryDeletePathParams,
  ProductsCategoryDeleteQuery,
  ProductsCategoryDeleteResponse,
  ProductsCategoryGetPathParams,
  ProductsCategoryGetQuery,
  ProductsCategoryGetResponse,
  ProductsCategoryUpdateBody,
  ProductsCategoryUpdatePathParams,
  ProductsCategoryUpdateResponse,
  ProductsCreateBody,
  ProductsCreateResponse,
  ProductsCustomFieldsNamesListQuery,
  ProductsCustomFieldsNamesListResponse,
  ProductsListQuery,
  ProductsListResponse,
  ProductsReviewDeletePathParams,
  ProductsReviewDeleteQuery,
  ProductsReviewDeleteResponse,
  ProductsReviewGetPathParams,
  ProductsReviewGetQuery,
  ProductsReviewGetResponse,
  ProductsReviewUpdateBody,
  ProductsReviewUpdatePathParams,
  ProductsReviewUpdateResponse,
  ProductsReviewsBatchUpdateBody,
  ProductsReviewsBatchUpdateResponse,
  ProductsReviewsCreateBody,
  ProductsReviewsCreateResponse,
  ProductsReviewsListQuery,
  ProductsReviewsListResponse,
  ProductsShippingClassDeletePathParams,
  ProductsShippingClassDeleteQuery,
  ProductsShippingClassDeleteResponse,
  ProductsShippingClassGetPathParams,
  ProductsShippingClassGetQuery,
  ProductsShippingClassGetResponse,
  ProductsShippingClassUpdateBody,
  ProductsShippingClassUpdatePathParams,
  ProductsShippingClassUpdateResponse,
  ProductsShippingClassesBatchUpdateBody,
  ProductsShippingClassesBatchUpdateResponse,
  ProductsShippingClassesCreateBody,
  ProductsShippingClassesCreateResponse,
  ProductsShippingClassesListQuery,
  ProductsShippingClassesListResponse,
  ProductsShippingClassesSlugSuggestionListQuery,
  ProductsShippingClassesSlugSuggestionListResponse,
  ProductsSuggestedProductsListQuery,
  ProductsSuggestedProductsListResponse,
  ProductsTagDeletePathParams,
  ProductsTagDeleteQuery,
  ProductsTagDeleteResponse,
  ProductsTagGetPathParams,
  ProductsTagGetQuery,
  ProductsTagGetResponse,
  ProductsTagUpdateBody,
  ProductsTagUpdatePathParams,
  ProductsTagUpdateResponse,
  ProductsTagsBatchUpdateBody,
  ProductsTagsBatchUpdateResponse,
  ProductsTagsCreateBody,
  ProductsTagsCreateResponse,
  ProductsTagsListQuery,
  ProductsTagsListResponse,
} from "../models/products";

export interface ProductAttributePostCustomRequest extends WooRequestOptions {
  path: ProductAttributePostCustomPathParams;
  body?: ProductAttributePostCustomBody;
}

export interface ProductAttributePutBatchCustomRequest extends WooRequestOptions {
  body?: ProductAttributePutBatchCustomBody;
}

export interface ProductAttributeTermPostCustomRequest extends WooRequestOptions {
  path: ProductAttributeTermPostCustomPathParams;
  body?: ProductAttributeTermPostCustomBody;
}

export interface ProductAttributeTermPutBatchCustomRequest extends WooRequestOptions {
  path: ProductAttributeTermPutBatchCustomPathParams;
  body?: ProductAttributeTermPutBatchCustomBody;
}

export interface ProductBrandPostCustomRequest extends WooRequestOptions {
  path: ProductBrandPostCustomPathParams;
  body?: ProductBrandPostCustomBody;
}

export interface ProductBrandPutBatchCustomRequest extends WooRequestOptions {
  body?: ProductBrandPutBatchCustomBody;
}

export interface ProductCategoryPostCustomRequest extends WooRequestOptions {
  path: ProductCategoryPostCustomPathParams;
  body?: ProductCategoryPostCustomBody;
}

export interface ProductCategoryPutBatchCustomRequest extends WooRequestOptions {
  body?: ProductCategoryPutBatchCustomBody;
}

export interface ProductDeleteRequest extends WooRequestOptions {
  path: ProductDeletePathParams;
  query?: ProductDeleteQuery;
}

export interface ProductDuplicateCreateRequest extends WooRequestOptions {
  path: ProductDuplicateCreatePathParams;
  body?: ProductDuplicateCreateBody;
}

export interface ProductGetRequest extends WooRequestOptions {
  path: ProductGetPathParams;
  query?: ProductGetQuery;
}

export interface ProductPostCustomRequest extends WooRequestOptions {
  path: ProductPostCustomPathParams;
  body?: ProductPostCustomBody;
}

export interface ProductPutBatchCustomRequest extends WooRequestOptions {
  body?: ProductPutBatchCustomBody;
}

export interface ProductReviewPostCustomRequest extends WooRequestOptions {
  path: ProductReviewPostCustomPathParams;
  body?: ProductReviewPostCustomBody;
}

export interface ProductReviewPutBatchCustomRequest extends WooRequestOptions {
  body?: ProductReviewPutBatchCustomBody;
}

export interface ProductShippingClassPostCustomRequest extends WooRequestOptions {
  path: ProductShippingClassPostCustomPathParams;
  body?: ProductShippingClassPostCustomBody;
}

export interface ProductShippingClassPutBatchCustomRequest extends WooRequestOptions {
  body?: ProductShippingClassPutBatchCustomBody;
}

export interface ProductTagPostCustomRequest extends WooRequestOptions {
  path: ProductTagPostCustomPathParams;
  body?: ProductTagPostCustomBody;
}

export interface ProductTagPutBatchCustomRequest extends WooRequestOptions {
  body?: ProductTagPutBatchCustomBody;
}

export interface ProductUpdateRequest extends WooRequestOptions {
  path: ProductUpdatePathParams;
  body?: ProductUpdateBody;
}

export interface ProductVariationDeleteRequest extends WooRequestOptions {
  path: ProductVariationDeletePathParams;
  query?: ProductVariationDeleteQuery;
}

export interface ProductVariationGetRequest extends WooRequestOptions {
  path: ProductVariationGetPathParams;
  query?: ProductVariationGetQuery;
}

export interface ProductVariationPostCustomRequest extends WooRequestOptions {
  path: ProductVariationPostCustomPathParams;
  body?: ProductVariationPostCustomBody;
}

export interface ProductVariationPutBatchCustomRequest extends WooRequestOptions {
  path: ProductVariationPutBatchCustomPathParams;
  body?: ProductVariationPutBatchCustomBody;
}

export interface ProductVariationUpdateRequest extends WooRequestOptions {
  path: ProductVariationUpdatePathParams;
  body?: ProductVariationUpdateBody;
}

export interface ProductVariationsBatchUpdateRequest extends WooRequestOptions {
  path: ProductVariationsBatchUpdatePathParams;
  body?: ProductVariationsBatchUpdateBody;
}

export interface ProductVariationsCreateRequest extends WooRequestOptions {
  path: ProductVariationsCreatePathParams;
  body?: ProductVariationsCreateBody;
}

export interface ProductVariationsGenerateCreateRequest extends WooRequestOptions {
  path: ProductVariationsGenerateCreatePathParams;
  body?: ProductVariationsGenerateCreateBody;
}

export interface ProductVariationsListRequest extends WooRequestOptions {
  path: ProductVariationsListPathParams;
  query?: ProductVariationsListQuery;
}

export interface ProductsAttributeDeleteRequest extends WooRequestOptions {
  path: ProductsAttributeDeletePathParams;
  query?: ProductsAttributeDeleteQuery;
}

export interface ProductsAttributeGetRequest extends WooRequestOptions {
  path: ProductsAttributeGetPathParams;
  query?: ProductsAttributeGetQuery;
}

export interface ProductsAttributeTermDeleteRequest extends WooRequestOptions {
  path: ProductsAttributeTermDeletePathParams;
  query?: ProductsAttributeTermDeleteQuery;
}

export interface ProductsAttributeTermGetRequest extends WooRequestOptions {
  path: ProductsAttributeTermGetPathParams;
  query?: ProductsAttributeTermGetQuery;
}

export interface ProductsAttributeTermUpdateRequest extends WooRequestOptions {
  path: ProductsAttributeTermUpdatePathParams;
  body?: ProductsAttributeTermUpdateBody;
}

export interface ProductsAttributeTermsBatchUpdateRequest extends WooRequestOptions {
  path: ProductsAttributeTermsBatchUpdatePathParams;
  body?: ProductsAttributeTermsBatchUpdateBody;
}

export interface ProductsAttributeTermsCreateRequest extends WooRequestOptions {
  path: ProductsAttributeTermsCreatePathParams;
  body?: ProductsAttributeTermsCreateBody;
}

export interface ProductsAttributeTermsListRequest extends WooRequestOptions {
  path: ProductsAttributeTermsListPathParams;
  query?: ProductsAttributeTermsListQuery;
}

export interface ProductsAttributeUpdateRequest extends WooRequestOptions {
  path: ProductsAttributeUpdatePathParams;
  body?: ProductsAttributeUpdateBody;
}

export interface ProductsAttributesBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsAttributesBatchUpdateBody;
}

export interface ProductsAttributesCreateRequest extends WooRequestOptions {
  body?: ProductsAttributesCreateBody;
}

export interface ProductsAttributesListRequest extends WooRequestOptions {
  query?: ProductsAttributesListQuery;
}

export interface ProductsBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsBatchUpdateBody;
}

export interface ProductsBrandDeleteRequest extends WooRequestOptions {
  path: ProductsBrandDeletePathParams;
  query?: ProductsBrandDeleteQuery;
}

export interface ProductsBrandGetRequest extends WooRequestOptions {
  path: ProductsBrandGetPathParams;
  query?: ProductsBrandGetQuery;
}

export interface ProductsBrandUpdateRequest extends WooRequestOptions {
  path: ProductsBrandUpdatePathParams;
  body?: ProductsBrandUpdateBody;
}

export interface ProductsBrandsBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsBrandsBatchUpdateBody;
}

export interface ProductsBrandsCreateRequest extends WooRequestOptions {
  body?: ProductsBrandsCreateBody;
}

export interface ProductsBrandsListRequest extends WooRequestOptions {
  query?: ProductsBrandsListQuery;
}

export interface ProductsCategoriesBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsCategoriesBatchUpdateBody;
}

export interface ProductsCategoriesCreateRequest extends WooRequestOptions {
  body?: ProductsCategoriesCreateBody;
}

export interface ProductsCategoriesListRequest extends WooRequestOptions {
  query?: ProductsCategoriesListQuery;
}

export interface ProductsCategoryDeleteRequest extends WooRequestOptions {
  path: ProductsCategoryDeletePathParams;
  query?: ProductsCategoryDeleteQuery;
}

export interface ProductsCategoryGetRequest extends WooRequestOptions {
  path: ProductsCategoryGetPathParams;
  query?: ProductsCategoryGetQuery;
}

export interface ProductsCategoryUpdateRequest extends WooRequestOptions {
  path: ProductsCategoryUpdatePathParams;
  body?: ProductsCategoryUpdateBody;
}

export interface ProductsCreateRequest extends WooRequestOptions {
  body?: ProductsCreateBody;
}

export interface ProductsCustomFieldsNamesListRequest extends WooRequestOptions {
  query?: ProductsCustomFieldsNamesListQuery;
}

export interface ProductsListRequest extends WooRequestOptions {
  query?: ProductsListQuery;
}

export interface ProductsReviewDeleteRequest extends WooRequestOptions {
  path: ProductsReviewDeletePathParams;
  query?: ProductsReviewDeleteQuery;
}

export interface ProductsReviewGetRequest extends WooRequestOptions {
  path: ProductsReviewGetPathParams;
  query?: ProductsReviewGetQuery;
}

export interface ProductsReviewUpdateRequest extends WooRequestOptions {
  path: ProductsReviewUpdatePathParams;
  body?: ProductsReviewUpdateBody;
}

export interface ProductsReviewsBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsReviewsBatchUpdateBody;
}

export interface ProductsReviewsCreateRequest extends WooRequestOptions {
  body?: ProductsReviewsCreateBody;
}

export interface ProductsReviewsListRequest extends WooRequestOptions {
  query?: ProductsReviewsListQuery;
}

export interface ProductsShippingClassDeleteRequest extends WooRequestOptions {
  path: ProductsShippingClassDeletePathParams;
  query?: ProductsShippingClassDeleteQuery;
}

export interface ProductsShippingClassGetRequest extends WooRequestOptions {
  path: ProductsShippingClassGetPathParams;
  query?: ProductsShippingClassGetQuery;
}

export interface ProductsShippingClassUpdateRequest extends WooRequestOptions {
  path: ProductsShippingClassUpdatePathParams;
  body?: ProductsShippingClassUpdateBody;
}

export interface ProductsShippingClassesBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsShippingClassesBatchUpdateBody;
}

export interface ProductsShippingClassesCreateRequest extends WooRequestOptions {
  body?: ProductsShippingClassesCreateBody;
}

export interface ProductsShippingClassesListRequest extends WooRequestOptions {
  query?: ProductsShippingClassesListQuery;
}

export interface ProductsShippingClassesSlugSuggestionListRequest extends WooRequestOptions {
  query?: ProductsShippingClassesSlugSuggestionListQuery;
}

export interface ProductsSuggestedProductsListRequest extends WooRequestOptions {
  query?: ProductsSuggestedProductsListQuery;
}

export interface ProductsTagDeleteRequest extends WooRequestOptions {
  path: ProductsTagDeletePathParams;
  query?: ProductsTagDeleteQuery;
}

export interface ProductsTagGetRequest extends WooRequestOptions {
  path: ProductsTagGetPathParams;
  query?: ProductsTagGetQuery;
}

export interface ProductsTagUpdateRequest extends WooRequestOptions {
  path: ProductsTagUpdatePathParams;
  body?: ProductsTagUpdateBody;
}

export interface ProductsTagsBatchUpdateRequest extends WooRequestOptions {
  body?: ProductsTagsBatchUpdateBody;
}

export interface ProductsTagsCreateRequest extends WooRequestOptions {
  body?: ProductsTagsCreateBody;
}

export interface ProductsTagsListRequest extends WooRequestOptions {
  query?: ProductsTagsListQuery;
}

export interface ProductsModule {
  postProductAttributeCustom(
    request: ProductAttributePostCustomRequest,
  ): Promise<ProductAttributePostCustomResponse>;
  putProductAttributeBatchCustom(
    request?: ProductAttributePutBatchCustomRequest,
  ): Promise<ProductAttributePutBatchCustomResponse>;
  postProductAttributeTermCustom(
    request: ProductAttributeTermPostCustomRequest,
  ): Promise<ProductAttributeTermPostCustomResponse>;
  putProductAttributeTermBatchCustom(
    request: ProductAttributeTermPutBatchCustomRequest,
  ): Promise<ProductAttributeTermPutBatchCustomResponse>;
  postProductBrandCustom(
    request: ProductBrandPostCustomRequest,
  ): Promise<ProductBrandPostCustomResponse>;
  putProductBrandBatchCustom(
    request?: ProductBrandPutBatchCustomRequest,
  ): Promise<ProductBrandPutBatchCustomResponse>;
  postProductCategoryCustom(
    request: ProductCategoryPostCustomRequest,
  ): Promise<ProductCategoryPostCustomResponse>;
  putProductCategoryBatchCustom(
    request?: ProductCategoryPutBatchCustomRequest,
  ): Promise<ProductCategoryPutBatchCustomResponse>;
  deleteProduct(request: ProductDeleteRequest): Promise<ProductDeleteResponse>;
  createProductDuplicate(
    request: ProductDuplicateCreateRequest,
  ): Promise<ProductDuplicateCreateResponse>;
  getProduct(request: ProductGetRequest): Promise<ProductGetResponse>;
  postProductCustom(
    request: ProductPostCustomRequest,
  ): Promise<ProductPostCustomResponse>;
  putProductBatchCustom(
    request?: ProductPutBatchCustomRequest,
  ): Promise<ProductPutBatchCustomResponse>;
  postProductReviewCustom(
    request: ProductReviewPostCustomRequest,
  ): Promise<ProductReviewPostCustomResponse>;
  putProductReviewBatchCustom(
    request?: ProductReviewPutBatchCustomRequest,
  ): Promise<ProductReviewPutBatchCustomResponse>;
  postProductShippingClassCustom(
    request: ProductShippingClassPostCustomRequest,
  ): Promise<ProductShippingClassPostCustomResponse>;
  putProductShippingClassBatchCustom(
    request?: ProductShippingClassPutBatchCustomRequest,
  ): Promise<ProductShippingClassPutBatchCustomResponse>;
  postProductTagCustom(
    request: ProductTagPostCustomRequest,
  ): Promise<ProductTagPostCustomResponse>;
  putProductTagBatchCustom(
    request?: ProductTagPutBatchCustomRequest,
  ): Promise<ProductTagPutBatchCustomResponse>;
  updateProduct(request: ProductUpdateRequest): Promise<ProductUpdateResponse>;
  deleteProductVariation(
    request: ProductVariationDeleteRequest,
  ): Promise<ProductVariationDeleteResponse>;
  getProductVariation(
    request: ProductVariationGetRequest,
  ): Promise<ProductVariationGetResponse>;
  postProductVariationCustom(
    request: ProductVariationPostCustomRequest,
  ): Promise<ProductVariationPostCustomResponse>;
  putProductVariationBatchCustom(
    request: ProductVariationPutBatchCustomRequest,
  ): Promise<ProductVariationPutBatchCustomResponse>;
  updateProductVariation(
    request: ProductVariationUpdateRequest,
  ): Promise<ProductVariationUpdateResponse>;
  batchUpdateProductVariations(
    request: ProductVariationsBatchUpdateRequest,
  ): Promise<ProductVariationsBatchUpdateResponse>;
  createProductVariation(
    request: ProductVariationsCreateRequest,
  ): Promise<ProductVariationsCreateResponse>;
  createProductVariationsGenerate(
    request: ProductVariationsGenerateCreateRequest,
  ): Promise<ProductVariationsGenerateCreateResponse>;
  listProductVariations(
    request: ProductVariationsListRequest,
  ): Promise<ProductVariationsListResponse>;
  deleteProductsAttribute(
    request: ProductsAttributeDeleteRequest,
  ): Promise<ProductsAttributeDeleteResponse>;
  getProductsAttribute(
    request: ProductsAttributeGetRequest,
  ): Promise<ProductsAttributeGetResponse>;
  deleteProductsAttributeTerm(
    request: ProductsAttributeTermDeleteRequest,
  ): Promise<ProductsAttributeTermDeleteResponse>;
  getProductsAttributeTerm(
    request: ProductsAttributeTermGetRequest,
  ): Promise<ProductsAttributeTermGetResponse>;
  updateProductsAttributeTerm(
    request: ProductsAttributeTermUpdateRequest,
  ): Promise<ProductsAttributeTermUpdateResponse>;
  batchUpdateProductsAttributeTerms(
    request: ProductsAttributeTermsBatchUpdateRequest,
  ): Promise<ProductsAttributeTermsBatchUpdateResponse>;
  createProductsAttributeTerm(
    request: ProductsAttributeTermsCreateRequest,
  ): Promise<ProductsAttributeTermsCreateResponse>;
  listProductsAttributeTerms(
    request: ProductsAttributeTermsListRequest,
  ): Promise<ProductsAttributeTermsListResponse>;
  updateProductsAttribute(
    request: ProductsAttributeUpdateRequest,
  ): Promise<ProductsAttributeUpdateResponse>;
  batchUpdateProductsAttributes(
    request?: ProductsAttributesBatchUpdateRequest,
  ): Promise<ProductsAttributesBatchUpdateResponse>;
  createProductsAttribute(
    request?: ProductsAttributesCreateRequest,
  ): Promise<ProductsAttributesCreateResponse>;
  listProductsAttributes(
    request?: ProductsAttributesListRequest,
  ): Promise<ProductsAttributesListResponse>;
  batchUpdateProducts(
    request?: ProductsBatchUpdateRequest,
  ): Promise<ProductsBatchUpdateResponse>;
  deleteProductsBrand(
    request: ProductsBrandDeleteRequest,
  ): Promise<ProductsBrandDeleteResponse>;
  getProductsBrand(
    request: ProductsBrandGetRequest,
  ): Promise<ProductsBrandGetResponse>;
  updateProductsBrand(
    request: ProductsBrandUpdateRequest,
  ): Promise<ProductsBrandUpdateResponse>;
  batchUpdateProductsBrands(
    request?: ProductsBrandsBatchUpdateRequest,
  ): Promise<ProductsBrandsBatchUpdateResponse>;
  createProductsBrand(
    request?: ProductsBrandsCreateRequest,
  ): Promise<ProductsBrandsCreateResponse>;
  listProductsBrands(
    request?: ProductsBrandsListRequest,
  ): Promise<ProductsBrandsListResponse>;
  batchUpdateProductsCategories(
    request?: ProductsCategoriesBatchUpdateRequest,
  ): Promise<ProductsCategoriesBatchUpdateResponse>;
  createProductsCategory(
    request?: ProductsCategoriesCreateRequest,
  ): Promise<ProductsCategoriesCreateResponse>;
  listProductsCategories(
    request?: ProductsCategoriesListRequest,
  ): Promise<ProductsCategoriesListResponse>;
  deleteProductsCategory(
    request: ProductsCategoryDeleteRequest,
  ): Promise<ProductsCategoryDeleteResponse>;
  getProductsCategory(
    request: ProductsCategoryGetRequest,
  ): Promise<ProductsCategoryGetResponse>;
  updateProductsCategory(
    request: ProductsCategoryUpdateRequest,
  ): Promise<ProductsCategoryUpdateResponse>;
  createProduct(
    request?: ProductsCreateRequest,
  ): Promise<ProductsCreateResponse>;
  listProductsCustomFieldsNames(
    request?: ProductsCustomFieldsNamesListRequest,
  ): Promise<ProductsCustomFieldsNamesListResponse>;
  listProducts(request?: ProductsListRequest): Promise<ProductsListResponse>;
  deleteProductsReview(
    request: ProductsReviewDeleteRequest,
  ): Promise<ProductsReviewDeleteResponse>;
  getProductsReview(
    request: ProductsReviewGetRequest,
  ): Promise<ProductsReviewGetResponse>;
  updateProductsReview(
    request: ProductsReviewUpdateRequest,
  ): Promise<ProductsReviewUpdateResponse>;
  batchUpdateProductsReviews(
    request?: ProductsReviewsBatchUpdateRequest,
  ): Promise<ProductsReviewsBatchUpdateResponse>;
  createProductsReview(
    request?: ProductsReviewsCreateRequest,
  ): Promise<ProductsReviewsCreateResponse>;
  listProductsReviews(
    request?: ProductsReviewsListRequest,
  ): Promise<ProductsReviewsListResponse>;
  deleteProductsShippingClass(
    request: ProductsShippingClassDeleteRequest,
  ): Promise<ProductsShippingClassDeleteResponse>;
  getProductsShippingClass(
    request: ProductsShippingClassGetRequest,
  ): Promise<ProductsShippingClassGetResponse>;
  updateProductsShippingClass(
    request: ProductsShippingClassUpdateRequest,
  ): Promise<ProductsShippingClassUpdateResponse>;
  batchUpdateProductsShippingClasses(
    request?: ProductsShippingClassesBatchUpdateRequest,
  ): Promise<ProductsShippingClassesBatchUpdateResponse>;
  createProductsShippingClass(
    request?: ProductsShippingClassesCreateRequest,
  ): Promise<ProductsShippingClassesCreateResponse>;
  listProductsShippingClasses(
    request?: ProductsShippingClassesListRequest,
  ): Promise<ProductsShippingClassesListResponse>;
  listProductsShippingClassesSlugSuggestion(
    request?: ProductsShippingClassesSlugSuggestionListRequest,
  ): Promise<ProductsShippingClassesSlugSuggestionListResponse>;
  listProductsSuggestedProducts(
    request?: ProductsSuggestedProductsListRequest,
  ): Promise<ProductsSuggestedProductsListResponse>;
  deleteProductsTag(
    request: ProductsTagDeleteRequest,
  ): Promise<ProductsTagDeleteResponse>;
  getProductsTag(
    request: ProductsTagGetRequest,
  ): Promise<ProductsTagGetResponse>;
  updateProductsTag(
    request: ProductsTagUpdateRequest,
  ): Promise<ProductsTagUpdateResponse>;
  batchUpdateProductsTags(
    request?: ProductsTagsBatchUpdateRequest,
  ): Promise<ProductsTagsBatchUpdateResponse>;
  createProductsTag(
    request?: ProductsTagsCreateRequest,
  ): Promise<ProductsTagsCreateResponse>;
  listProductsTags(
    request?: ProductsTagsListRequest,
  ): Promise<ProductsTagsListResponse>;
}

export const postProductAttributeCustom = (
  execute: WooRequestExecutor,
  request: ProductAttributePostCustomRequest,
): Promise<ProductAttributePostCustomResponse> =>
  execute<ProductAttributePostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/attributes/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductAttributeBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductAttributePutBatchCustomRequest,
): Promise<ProductAttributePutBatchCustomResponse> =>
  execute<ProductAttributePutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/attributes/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const postProductAttributeTermCustom = (
  execute: WooRequestExecutor,
  request: ProductAttributeTermPostCustomRequest,
): Promise<ProductAttributeTermPostCustomResponse> =>
  execute<ProductAttributeTermPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/attributes/{attribute_id}/terms/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductAttributeTermBatchCustom = (
  execute: WooRequestExecutor,
  request: ProductAttributeTermPutBatchCustomRequest,
): Promise<ProductAttributeTermPutBatchCustomResponse> =>
  execute<ProductAttributeTermPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/attributes/{attribute_id}/terms/batch",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const postProductBrandCustom = (
  execute: WooRequestExecutor,
  request: ProductBrandPostCustomRequest,
): Promise<ProductBrandPostCustomResponse> =>
  execute<ProductBrandPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/brands/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductBrandBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductBrandPutBatchCustomRequest,
): Promise<ProductBrandPutBatchCustomResponse> =>
  execute<ProductBrandPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/brands/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const postProductCategoryCustom = (
  execute: WooRequestExecutor,
  request: ProductCategoryPostCustomRequest,
): Promise<ProductCategoryPostCustomResponse> =>
  execute<ProductCategoryPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/categories/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductCategoryBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductCategoryPutBatchCustomRequest,
): Promise<ProductCategoryPutBatchCustomResponse> =>
  execute<ProductCategoryPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/categories/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteProduct = (
  execute: WooRequestExecutor,
  request: ProductDeleteRequest,
): Promise<ProductDeleteResponse> =>
  execute<ProductDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const createProductDuplicate = (
  execute: WooRequestExecutor,
  request: ProductDuplicateCreateRequest,
): Promise<ProductDuplicateCreateResponse> =>
  execute<ProductDuplicateCreateResponse>({
    method: "POST",
    routeTemplate: "/products/{id}/duplicate",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const getProduct = (
  execute: WooRequestExecutor,
  request: ProductGetRequest,
): Promise<ProductGetResponse> =>
  execute<ProductGetResponse>({
    method: "GET",
    routeTemplate: "/products/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postProductCustom = (
  execute: WooRequestExecutor,
  request: ProductPostCustomRequest,
): Promise<ProductPostCustomResponse> =>
  execute<ProductPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductPutBatchCustomRequest,
): Promise<ProductPutBatchCustomResponse> =>
  execute<ProductPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const postProductReviewCustom = (
  execute: WooRequestExecutor,
  request: ProductReviewPostCustomRequest,
): Promise<ProductReviewPostCustomResponse> =>
  execute<ProductReviewPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/reviews/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductReviewBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductReviewPutBatchCustomRequest,
): Promise<ProductReviewPutBatchCustomResponse> =>
  execute<ProductReviewPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/reviews/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const postProductShippingClassCustom = (
  execute: WooRequestExecutor,
  request: ProductShippingClassPostCustomRequest,
): Promise<ProductShippingClassPostCustomResponse> =>
  execute<ProductShippingClassPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/shipping_classes/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductShippingClassBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductShippingClassPutBatchCustomRequest,
): Promise<ProductShippingClassPutBatchCustomResponse> =>
  execute<ProductShippingClassPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/shipping_classes/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const postProductTagCustom = (
  execute: WooRequestExecutor,
  request: ProductTagPostCustomRequest,
): Promise<ProductTagPostCustomResponse> =>
  execute<ProductTagPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/tags/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductTagBatchCustom = (
  execute: WooRequestExecutor,
  request?: ProductTagPutBatchCustomRequest,
): Promise<ProductTagPutBatchCustomResponse> =>
  execute<ProductTagPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/tags/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const updateProduct = (
  execute: WooRequestExecutor,
  request: ProductUpdateRequest,
): Promise<ProductUpdateResponse> =>
  execute<ProductUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const deleteProductVariation = (
  execute: WooRequestExecutor,
  request: ProductVariationDeleteRequest,
): Promise<ProductVariationDeleteResponse> =>
  execute<ProductVariationDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/{product_id}/variations/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductVariation = (
  execute: WooRequestExecutor,
  request: ProductVariationGetRequest,
): Promise<ProductVariationGetResponse> =>
  execute<ProductVariationGetResponse>({
    method: "GET",
    routeTemplate: "/products/{product_id}/variations/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postProductVariationCustom = (
  execute: WooRequestExecutor,
  request: ProductVariationPostCustomRequest,
): Promise<ProductVariationPostCustomResponse> =>
  execute<ProductVariationPostCustomResponse>({
    method: "POST",
    routeTemplate: "/products/{product_id}/variations/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putProductVariationBatchCustom = (
  execute: WooRequestExecutor,
  request: ProductVariationPutBatchCustomRequest,
): Promise<ProductVariationPutBatchCustomResponse> =>
  execute<ProductVariationPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/products/{product_id}/variations/batch",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductVariation = (
  execute: WooRequestExecutor,
  request: ProductVariationUpdateRequest,
): Promise<ProductVariationUpdateResponse> =>
  execute<ProductVariationUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/{product_id}/variations/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductVariations = (
  execute: WooRequestExecutor,
  request: ProductVariationsBatchUpdateRequest,
): Promise<ProductVariationsBatchUpdateResponse> =>
  execute<ProductVariationsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/{product_id}/variations/batch",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createProductVariation = (
  execute: WooRequestExecutor,
  request: ProductVariationsCreateRequest,
): Promise<ProductVariationsCreateResponse> =>
  execute<ProductVariationsCreateResponse>({
    method: "POST",
    routeTemplate: "/products/{product_id}/variations",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createProductVariationsGenerate = (
  execute: WooRequestExecutor,
  request: ProductVariationsGenerateCreateRequest,
): Promise<ProductVariationsGenerateCreateResponse> =>
  execute<ProductVariationsGenerateCreateResponse>({
    method: "POST",
    routeTemplate: "/products/{product_id}/variations/generate",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listProductVariations = (
  execute: WooRequestExecutor,
  request: ProductVariationsListRequest,
): Promise<ProductVariationsListResponse> =>
  execute<ProductVariationsListResponse>({
    method: "GET",
    routeTemplate: "/products/{product_id}/variations",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const deleteProductsAttribute = (
  execute: WooRequestExecutor,
  request: ProductsAttributeDeleteRequest,
): Promise<ProductsAttributeDeleteResponse> =>
  execute<ProductsAttributeDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/attributes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsAttribute = (
  execute: WooRequestExecutor,
  request: ProductsAttributeGetRequest,
): Promise<ProductsAttributeGetResponse> =>
  execute<ProductsAttributeGetResponse>({
    method: "GET",
    routeTemplate: "/products/attributes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const deleteProductsAttributeTerm = (
  execute: WooRequestExecutor,
  request: ProductsAttributeTermDeleteRequest,
): Promise<ProductsAttributeTermDeleteResponse> =>
  execute<ProductsAttributeTermDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/attributes/{attribute_id}/terms/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsAttributeTerm = (
  execute: WooRequestExecutor,
  request: ProductsAttributeTermGetRequest,
): Promise<ProductsAttributeTermGetResponse> =>
  execute<ProductsAttributeTermGetResponse>({
    method: "GET",
    routeTemplate: "/products/attributes/{attribute_id}/terms/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsAttributeTerm = (
  execute: WooRequestExecutor,
  request: ProductsAttributeTermUpdateRequest,
): Promise<ProductsAttributeTermUpdateResponse> =>
  execute<ProductsAttributeTermUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/attributes/{attribute_id}/terms/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductsAttributeTerms = (
  execute: WooRequestExecutor,
  request: ProductsAttributeTermsBatchUpdateRequest,
): Promise<ProductsAttributeTermsBatchUpdateResponse> =>
  execute<ProductsAttributeTermsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/attributes/{attribute_id}/terms/batch",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createProductsAttributeTerm = (
  execute: WooRequestExecutor,
  request: ProductsAttributeTermsCreateRequest,
): Promise<ProductsAttributeTermsCreateResponse> =>
  execute<ProductsAttributeTermsCreateResponse>({
    method: "POST",
    routeTemplate: "/products/attributes/{attribute_id}/terms",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listProductsAttributeTerms = (
  execute: WooRequestExecutor,
  request: ProductsAttributeTermsListRequest,
): Promise<ProductsAttributeTermsListResponse> =>
  execute<ProductsAttributeTermsListResponse>({
    method: "GET",
    routeTemplate: "/products/attributes/{attribute_id}/terms",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsAttribute = (
  execute: WooRequestExecutor,
  request: ProductsAttributeUpdateRequest,
): Promise<ProductsAttributeUpdateResponse> =>
  execute<ProductsAttributeUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/attributes/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductsAttributes = (
  execute: WooRequestExecutor,
  request?: ProductsAttributesBatchUpdateRequest,
): Promise<ProductsAttributesBatchUpdateResponse> =>
  execute<ProductsAttributesBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/attributes/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsAttribute = (
  execute: WooRequestExecutor,
  request?: ProductsAttributesCreateRequest,
): Promise<ProductsAttributesCreateResponse> =>
  execute<ProductsAttributesCreateResponse>({
    method: "POST",
    routeTemplate: "/products/attributes",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsAttributes = (
  execute: WooRequestExecutor,
  request?: ProductsAttributesListRequest,
): Promise<ProductsAttributesListResponse> =>
  execute<ProductsAttributesListResponse>({
    method: "GET",
    routeTemplate: "/products/attributes",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const batchUpdateProducts = (
  execute: WooRequestExecutor,
  request?: ProductsBatchUpdateRequest,
): Promise<ProductsBatchUpdateResponse> =>
  execute<ProductsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteProductsBrand = (
  execute: WooRequestExecutor,
  request: ProductsBrandDeleteRequest,
): Promise<ProductsBrandDeleteResponse> =>
  execute<ProductsBrandDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/brands/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsBrand = (
  execute: WooRequestExecutor,
  request: ProductsBrandGetRequest,
): Promise<ProductsBrandGetResponse> =>
  execute<ProductsBrandGetResponse>({
    method: "GET",
    routeTemplate: "/products/brands/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsBrand = (
  execute: WooRequestExecutor,
  request: ProductsBrandUpdateRequest,
): Promise<ProductsBrandUpdateResponse> =>
  execute<ProductsBrandUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/brands/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductsBrands = (
  execute: WooRequestExecutor,
  request?: ProductsBrandsBatchUpdateRequest,
): Promise<ProductsBrandsBatchUpdateResponse> =>
  execute<ProductsBrandsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/brands/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsBrand = (
  execute: WooRequestExecutor,
  request?: ProductsBrandsCreateRequest,
): Promise<ProductsBrandsCreateResponse> =>
  execute<ProductsBrandsCreateResponse>({
    method: "POST",
    routeTemplate: "/products/brands",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsBrands = (
  execute: WooRequestExecutor,
  request?: ProductsBrandsListRequest,
): Promise<ProductsBrandsListResponse> =>
  execute<ProductsBrandsListResponse>({
    method: "GET",
    routeTemplate: "/products/brands",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const batchUpdateProductsCategories = (
  execute: WooRequestExecutor,
  request?: ProductsCategoriesBatchUpdateRequest,
): Promise<ProductsCategoriesBatchUpdateResponse> =>
  execute<ProductsCategoriesBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/categories/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsCategory = (
  execute: WooRequestExecutor,
  request?: ProductsCategoriesCreateRequest,
): Promise<ProductsCategoriesCreateResponse> =>
  execute<ProductsCategoriesCreateResponse>({
    method: "POST",
    routeTemplate: "/products/categories",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsCategories = (
  execute: WooRequestExecutor,
  request?: ProductsCategoriesListRequest,
): Promise<ProductsCategoriesListResponse> =>
  execute<ProductsCategoriesListResponse>({
    method: "GET",
    routeTemplate: "/products/categories",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteProductsCategory = (
  execute: WooRequestExecutor,
  request: ProductsCategoryDeleteRequest,
): Promise<ProductsCategoryDeleteResponse> =>
  execute<ProductsCategoryDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/categories/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsCategory = (
  execute: WooRequestExecutor,
  request: ProductsCategoryGetRequest,
): Promise<ProductsCategoryGetResponse> =>
  execute<ProductsCategoryGetResponse>({
    method: "GET",
    routeTemplate: "/products/categories/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsCategory = (
  execute: WooRequestExecutor,
  request: ProductsCategoryUpdateRequest,
): Promise<ProductsCategoryUpdateResponse> =>
  execute<ProductsCategoryUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/categories/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const createProduct = (
  execute: WooRequestExecutor,
  request?: ProductsCreateRequest,
): Promise<ProductsCreateResponse> =>
  execute<ProductsCreateResponse>({
    method: "POST",
    routeTemplate: "/products",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsCustomFieldsNames = (
  execute: WooRequestExecutor,
  request?: ProductsCustomFieldsNamesListRequest,
): Promise<ProductsCustomFieldsNamesListResponse> =>
  execute<ProductsCustomFieldsNamesListResponse>({
    method: "GET",
    routeTemplate: "/products/custom-fields/names",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProducts = (
  execute: WooRequestExecutor,
  request?: ProductsListRequest,
): Promise<ProductsListResponse> =>
  execute<ProductsListResponse>({
    method: "GET",
    routeTemplate: "/products",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteProductsReview = (
  execute: WooRequestExecutor,
  request: ProductsReviewDeleteRequest,
): Promise<ProductsReviewDeleteResponse> =>
  execute<ProductsReviewDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/reviews/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsReview = (
  execute: WooRequestExecutor,
  request: ProductsReviewGetRequest,
): Promise<ProductsReviewGetResponse> =>
  execute<ProductsReviewGetResponse>({
    method: "GET",
    routeTemplate: "/products/reviews/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsReview = (
  execute: WooRequestExecutor,
  request: ProductsReviewUpdateRequest,
): Promise<ProductsReviewUpdateResponse> =>
  execute<ProductsReviewUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/reviews/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductsReviews = (
  execute: WooRequestExecutor,
  request?: ProductsReviewsBatchUpdateRequest,
): Promise<ProductsReviewsBatchUpdateResponse> =>
  execute<ProductsReviewsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/reviews/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsReview = (
  execute: WooRequestExecutor,
  request?: ProductsReviewsCreateRequest,
): Promise<ProductsReviewsCreateResponse> =>
  execute<ProductsReviewsCreateResponse>({
    method: "POST",
    routeTemplate: "/products/reviews",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsReviews = (
  execute: WooRequestExecutor,
  request?: ProductsReviewsListRequest,
): Promise<ProductsReviewsListResponse> =>
  execute<ProductsReviewsListResponse>({
    method: "GET",
    routeTemplate: "/products/reviews",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteProductsShippingClass = (
  execute: WooRequestExecutor,
  request: ProductsShippingClassDeleteRequest,
): Promise<ProductsShippingClassDeleteResponse> =>
  execute<ProductsShippingClassDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/shipping_classes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsShippingClass = (
  execute: WooRequestExecutor,
  request: ProductsShippingClassGetRequest,
): Promise<ProductsShippingClassGetResponse> =>
  execute<ProductsShippingClassGetResponse>({
    method: "GET",
    routeTemplate: "/products/shipping_classes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsShippingClass = (
  execute: WooRequestExecutor,
  request: ProductsShippingClassUpdateRequest,
): Promise<ProductsShippingClassUpdateResponse> =>
  execute<ProductsShippingClassUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/shipping_classes/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductsShippingClasses = (
  execute: WooRequestExecutor,
  request?: ProductsShippingClassesBatchUpdateRequest,
): Promise<ProductsShippingClassesBatchUpdateResponse> =>
  execute<ProductsShippingClassesBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/shipping_classes/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsShippingClass = (
  execute: WooRequestExecutor,
  request?: ProductsShippingClassesCreateRequest,
): Promise<ProductsShippingClassesCreateResponse> =>
  execute<ProductsShippingClassesCreateResponse>({
    method: "POST",
    routeTemplate: "/products/shipping_classes",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsShippingClasses = (
  execute: WooRequestExecutor,
  request?: ProductsShippingClassesListRequest,
): Promise<ProductsShippingClassesListResponse> =>
  execute<ProductsShippingClassesListResponse>({
    method: "GET",
    routeTemplate: "/products/shipping_classes",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsShippingClassesSlugSuggestion = (
  execute: WooRequestExecutor,
  request?: ProductsShippingClassesSlugSuggestionListRequest,
): Promise<ProductsShippingClassesSlugSuggestionListResponse> =>
  execute<ProductsShippingClassesSlugSuggestionListResponse>({
    method: "GET",
    routeTemplate: "/products/shipping_classes/slug-suggestion",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsSuggestedProducts = (
  execute: WooRequestExecutor,
  request?: ProductsSuggestedProductsListRequest,
): Promise<ProductsSuggestedProductsListResponse> =>
  execute<ProductsSuggestedProductsListResponse>({
    method: "GET",
    routeTemplate: "/products/suggested-products",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const deleteProductsTag = (
  execute: WooRequestExecutor,
  request: ProductsTagDeleteRequest,
): Promise<ProductsTagDeleteResponse> =>
  execute<ProductsTagDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/products/tags/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getProductsTag = (
  execute: WooRequestExecutor,
  request: ProductsTagGetRequest,
): Promise<ProductsTagGetResponse> =>
  execute<ProductsTagGetResponse>({
    method: "GET",
    routeTemplate: "/products/tags/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const updateProductsTag = (
  execute: WooRequestExecutor,
  request: ProductsTagUpdateRequest,
): Promise<ProductsTagUpdateResponse> =>
  execute<ProductsTagUpdateResponse>({
    method: "PUT",
    routeTemplate: "/products/tags/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateProductsTags = (
  execute: WooRequestExecutor,
  request?: ProductsTagsBatchUpdateRequest,
): Promise<ProductsTagsBatchUpdateResponse> =>
  execute<ProductsTagsBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/products/tags/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsTag = (
  execute: WooRequestExecutor,
  request?: ProductsTagsCreateRequest,
): Promise<ProductsTagsCreateResponse> =>
  execute<ProductsTagsCreateResponse>({
    method: "POST",
    routeTemplate: "/products/tags",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listProductsTags = (
  execute: WooRequestExecutor,
  request?: ProductsTagsListRequest,
): Promise<ProductsTagsListResponse> =>
  execute<ProductsTagsListResponse>({
    method: "GET",
    routeTemplate: "/products/tags",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createProductsModule = (
  execute: WooRequestExecutor,
): ProductsModule => ({
  postProductAttributeCustom: (request) =>
    postProductAttributeCustom(execute, request),
  putProductAttributeBatchCustom: (request) =>
    putProductAttributeBatchCustom(execute, request),
  postProductAttributeTermCustom: (request) =>
    postProductAttributeTermCustom(execute, request),
  putProductAttributeTermBatchCustom: (request) =>
    putProductAttributeTermBatchCustom(execute, request),
  postProductBrandCustom: (request) => postProductBrandCustom(execute, request),
  putProductBrandBatchCustom: (request) =>
    putProductBrandBatchCustom(execute, request),
  postProductCategoryCustom: (request) =>
    postProductCategoryCustom(execute, request),
  putProductCategoryBatchCustom: (request) =>
    putProductCategoryBatchCustom(execute, request),
  deleteProduct: (request) => deleteProduct(execute, request),
  createProductDuplicate: (request) => createProductDuplicate(execute, request),
  getProduct: (request) => getProduct(execute, request),
  postProductCustom: (request) => postProductCustom(execute, request),
  putProductBatchCustom: (request) => putProductBatchCustom(execute, request),
  postProductReviewCustom: (request) =>
    postProductReviewCustom(execute, request),
  putProductReviewBatchCustom: (request) =>
    putProductReviewBatchCustom(execute, request),
  postProductShippingClassCustom: (request) =>
    postProductShippingClassCustom(execute, request),
  putProductShippingClassBatchCustom: (request) =>
    putProductShippingClassBatchCustom(execute, request),
  postProductTagCustom: (request) => postProductTagCustom(execute, request),
  putProductTagBatchCustom: (request) =>
    putProductTagBatchCustom(execute, request),
  updateProduct: (request) => updateProduct(execute, request),
  deleteProductVariation: (request) => deleteProductVariation(execute, request),
  getProductVariation: (request) => getProductVariation(execute, request),
  postProductVariationCustom: (request) =>
    postProductVariationCustom(execute, request),
  putProductVariationBatchCustom: (request) =>
    putProductVariationBatchCustom(execute, request),
  updateProductVariation: (request) => updateProductVariation(execute, request),
  batchUpdateProductVariations: (request) =>
    batchUpdateProductVariations(execute, request),
  createProductVariation: (request) => createProductVariation(execute, request),
  createProductVariationsGenerate: (request) =>
    createProductVariationsGenerate(execute, request),
  listProductVariations: (request) => listProductVariations(execute, request),
  deleteProductsAttribute: (request) =>
    deleteProductsAttribute(execute, request),
  getProductsAttribute: (request) => getProductsAttribute(execute, request),
  deleteProductsAttributeTerm: (request) =>
    deleteProductsAttributeTerm(execute, request),
  getProductsAttributeTerm: (request) =>
    getProductsAttributeTerm(execute, request),
  updateProductsAttributeTerm: (request) =>
    updateProductsAttributeTerm(execute, request),
  batchUpdateProductsAttributeTerms: (request) =>
    batchUpdateProductsAttributeTerms(execute, request),
  createProductsAttributeTerm: (request) =>
    createProductsAttributeTerm(execute, request),
  listProductsAttributeTerms: (request) =>
    listProductsAttributeTerms(execute, request),
  updateProductsAttribute: (request) =>
    updateProductsAttribute(execute, request),
  batchUpdateProductsAttributes: (request) =>
    batchUpdateProductsAttributes(execute, request),
  createProductsAttribute: (request) =>
    createProductsAttribute(execute, request),
  listProductsAttributes: (request) => listProductsAttributes(execute, request),
  batchUpdateProducts: (request) => batchUpdateProducts(execute, request),
  deleteProductsBrand: (request) => deleteProductsBrand(execute, request),
  getProductsBrand: (request) => getProductsBrand(execute, request),
  updateProductsBrand: (request) => updateProductsBrand(execute, request),
  batchUpdateProductsBrands: (request) =>
    batchUpdateProductsBrands(execute, request),
  createProductsBrand: (request) => createProductsBrand(execute, request),
  listProductsBrands: (request) => listProductsBrands(execute, request),
  batchUpdateProductsCategories: (request) =>
    batchUpdateProductsCategories(execute, request),
  createProductsCategory: (request) => createProductsCategory(execute, request),
  listProductsCategories: (request) => listProductsCategories(execute, request),
  deleteProductsCategory: (request) => deleteProductsCategory(execute, request),
  getProductsCategory: (request) => getProductsCategory(execute, request),
  updateProductsCategory: (request) => updateProductsCategory(execute, request),
  createProduct: (request) => createProduct(execute, request),
  listProductsCustomFieldsNames: (request) =>
    listProductsCustomFieldsNames(execute, request),
  listProducts: (request) => listProducts(execute, request),
  deleteProductsReview: (request) => deleteProductsReview(execute, request),
  getProductsReview: (request) => getProductsReview(execute, request),
  updateProductsReview: (request) => updateProductsReview(execute, request),
  batchUpdateProductsReviews: (request) =>
    batchUpdateProductsReviews(execute, request),
  createProductsReview: (request) => createProductsReview(execute, request),
  listProductsReviews: (request) => listProductsReviews(execute, request),
  deleteProductsShippingClass: (request) =>
    deleteProductsShippingClass(execute, request),
  getProductsShippingClass: (request) =>
    getProductsShippingClass(execute, request),
  updateProductsShippingClass: (request) =>
    updateProductsShippingClass(execute, request),
  batchUpdateProductsShippingClasses: (request) =>
    batchUpdateProductsShippingClasses(execute, request),
  createProductsShippingClass: (request) =>
    createProductsShippingClass(execute, request),
  listProductsShippingClasses: (request) =>
    listProductsShippingClasses(execute, request),
  listProductsShippingClassesSlugSuggestion: (request) =>
    listProductsShippingClassesSlugSuggestion(execute, request),
  listProductsSuggestedProducts: (request) =>
    listProductsSuggestedProducts(execute, request),
  deleteProductsTag: (request) => deleteProductsTag(execute, request),
  getProductsTag: (request) => getProductsTag(execute, request),
  updateProductsTag: (request) => updateProductsTag(execute, request),
  batchUpdateProductsTags: (request) =>
    batchUpdateProductsTags(execute, request),
  createProductsTag: (request) => createProductsTag(execute, request),
  listProductsTags: (request) => listProductsTags(execute, request),
});
