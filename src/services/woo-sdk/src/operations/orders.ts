/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  OrderDeletePathParams,
  OrderDeleteQuery,
  OrderDeleteResponse,
  OrderEmailTemplatesPathParams,
  OrderEmailTemplatesResponse,
  OrderGetPathParams,
  OrderGetQuery,
  OrderGetResponse,
  OrderNoteDeletePathParams,
  OrderNoteDeleteQuery,
  OrderNoteDeleteResponse,
  OrderNoteGetPathParams,
  OrderNoteGetQuery,
  OrderNoteGetResponse,
  OrderNotesCreateBody,
  OrderNotesCreatePathParams,
  OrderNotesCreateResponse,
  OrderNotesListPathParams,
  OrderNotesListQuery,
  OrderNotesListResponse,
  OrderPostCustomBody,
  OrderPostCustomPathParams,
  OrderPostCustomResponse,
  OrderPutBatchCustomBody,
  OrderPutBatchCustomResponse,
  OrderReceiptCreateBody,
  OrderReceiptCreatePathParams,
  OrderReceiptCreateResponse,
  OrderReceiptListPathParams,
  OrderReceiptListResponse,
  OrderRefundDeletePathParams,
  OrderRefundDeleteQuery,
  OrderRefundDeleteResponse,
  OrderRefundGetPathParams,
  OrderRefundGetQuery,
  OrderRefundGetResponse,
  OrderRefundsCreateBody,
  OrderRefundsCreatePathParams,
  OrderRefundsCreateResponse,
  OrderRefundsListPathParams,
  OrderRefundsListQuery,
  OrderRefundsListResponse,
  OrderSendEmailBody,
  OrderSendEmailPathParams,
  OrderSendEmailResponse,
  OrderSendOrderDetailsBody,
  OrderSendOrderDetailsPathParams,
  OrderSendOrderDetailsResponse,
  OrderUpdateBody,
  OrderUpdatePathParams,
  OrderUpdateResponse,
  OrdersBatchUpdateBody,
  OrdersBatchUpdateResponse,
  OrdersCreateBody,
  OrdersCreateResponse,
  OrdersListQuery,
  OrdersListResponse,
  OrdersStatusesListResponse,
} from "../models/orders";

export interface OrderDeleteRequest extends WooRequestOptions {
  path: OrderDeletePathParams;
  query?: OrderDeleteQuery;
}

export interface OrderEmailTemplatesRequest extends WooRequestOptions {
  path: OrderEmailTemplatesPathParams;
}

export interface OrderGetRequest extends WooRequestOptions {
  path: OrderGetPathParams;
  query?: OrderGetQuery;
}

export interface OrderNoteDeleteRequest extends WooRequestOptions {
  path: OrderNoteDeletePathParams;
  query?: OrderNoteDeleteQuery;
}

export interface OrderNoteGetRequest extends WooRequestOptions {
  path: OrderNoteGetPathParams;
  query?: OrderNoteGetQuery;
}

export interface OrderNotesCreateRequest extends WooRequestOptions {
  path: OrderNotesCreatePathParams;
  body?: OrderNotesCreateBody;
}

export interface OrderNotesListRequest extends WooRequestOptions {
  path: OrderNotesListPathParams;
  query?: OrderNotesListQuery;
}

export interface OrderPostCustomRequest extends WooRequestOptions {
  path: OrderPostCustomPathParams;
  body?: OrderPostCustomBody;
}

export interface OrderPutBatchCustomRequest extends WooRequestOptions {
  body?: OrderPutBatchCustomBody;
}

export interface OrderReceiptCreateRequest extends WooRequestOptions {
  path: OrderReceiptCreatePathParams;
  body?: OrderReceiptCreateBody;
}

export interface OrderReceiptListRequest extends WooRequestOptions {
  path: OrderReceiptListPathParams;
}

export interface OrderRefundDeleteRequest extends WooRequestOptions {
  path: OrderRefundDeletePathParams;
  query?: OrderRefundDeleteQuery;
}

export interface OrderRefundGetRequest extends WooRequestOptions {
  path: OrderRefundGetPathParams;
  query?: OrderRefundGetQuery;
}

export interface OrderRefundsCreateRequest extends WooRequestOptions {
  path: OrderRefundsCreatePathParams;
  body?: OrderRefundsCreateBody;
}

export interface OrderRefundsListRequest extends WooRequestOptions {
  path: OrderRefundsListPathParams;
  query?: OrderRefundsListQuery;
}

export interface OrderSendEmailRequest extends WooRequestOptions {
  path: OrderSendEmailPathParams;
  body?: OrderSendEmailBody;
}

export interface OrderSendOrderDetailsRequest extends WooRequestOptions {
  path: OrderSendOrderDetailsPathParams;
  body?: OrderSendOrderDetailsBody;
}

export interface OrderUpdateRequest extends WooRequestOptions {
  path: OrderUpdatePathParams;
  body?: OrderUpdateBody;
}

export interface OrdersBatchUpdateRequest extends WooRequestOptions {
  body?: OrdersBatchUpdateBody;
}

export interface OrdersCreateRequest extends WooRequestOptions {
  body?: OrdersCreateBody;
}

export interface OrdersListRequest extends WooRequestOptions {
  query?: OrdersListQuery;
}

export type OrdersStatusesListRequest = WooRequestOptions;

export interface OrdersModule {
  deleteOrder(request: OrderDeleteRequest): Promise<OrderDeleteResponse>;
  emailOrderTemplates(
    request: OrderEmailTemplatesRequest,
  ): Promise<OrderEmailTemplatesResponse>;
  getOrder(request: OrderGetRequest): Promise<OrderGetResponse>;
  deleteOrderNote(
    request: OrderNoteDeleteRequest,
  ): Promise<OrderNoteDeleteResponse>;
  getOrderNote(request: OrderNoteGetRequest): Promise<OrderNoteGetResponse>;
  createOrderNote(
    request: OrderNotesCreateRequest,
  ): Promise<OrderNotesCreateResponse>;
  listOrderNotes(
    request: OrderNotesListRequest,
  ): Promise<OrderNotesListResponse>;
  postOrderCustom(
    request: OrderPostCustomRequest,
  ): Promise<OrderPostCustomResponse>;
  putOrderBatchCustom(
    request?: OrderPutBatchCustomRequest,
  ): Promise<OrderPutBatchCustomResponse>;
  createOrderReceipt(
    request: OrderReceiptCreateRequest,
  ): Promise<OrderReceiptCreateResponse>;
  listOrderReceipt(
    request: OrderReceiptListRequest,
  ): Promise<OrderReceiptListResponse>;
  deleteOrderRefund(
    request: OrderRefundDeleteRequest,
  ): Promise<OrderRefundDeleteResponse>;
  getOrderRefund(
    request: OrderRefundGetRequest,
  ): Promise<OrderRefundGetResponse>;
  createOrderRefund(
    request: OrderRefundsCreateRequest,
  ): Promise<OrderRefundsCreateResponse>;
  listOrderRefunds(
    request: OrderRefundsListRequest,
  ): Promise<OrderRefundsListResponse>;
  sendOrderEmail(
    request: OrderSendEmailRequest,
  ): Promise<OrderSendEmailResponse>;
  sendOrderOrderDetails(
    request: OrderSendOrderDetailsRequest,
  ): Promise<OrderSendOrderDetailsResponse>;
  updateOrder(request: OrderUpdateRequest): Promise<OrderUpdateResponse>;
  batchUpdateOrders(
    request?: OrdersBatchUpdateRequest,
  ): Promise<OrdersBatchUpdateResponse>;
  createOrder(request?: OrdersCreateRequest): Promise<OrdersCreateResponse>;
  listOrders(request?: OrdersListRequest): Promise<OrdersListResponse>;
  listOrdersStatuses(
    request?: OrdersStatusesListRequest,
  ): Promise<OrdersStatusesListResponse>;
}

export const deleteOrder = (
  execute: WooRequestExecutor,
  request: OrderDeleteRequest,
): Promise<OrderDeleteResponse> =>
  execute<OrderDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/orders/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const emailOrderTemplates = (
  execute: WooRequestExecutor,
  request: OrderEmailTemplatesRequest,
): Promise<OrderEmailTemplatesResponse> =>
  execute<OrderEmailTemplatesResponse>({
    method: "GET",
    routeTemplate: "/orders/{id}/actions/email_templates",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const getOrder = (
  execute: WooRequestExecutor,
  request: OrderGetRequest,
): Promise<OrderGetResponse> =>
  execute<OrderGetResponse>({
    method: "GET",
    routeTemplate: "/orders/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const deleteOrderNote = (
  execute: WooRequestExecutor,
  request: OrderNoteDeleteRequest,
): Promise<OrderNoteDeleteResponse> =>
  execute<OrderNoteDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/orders/{order_id}/notes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getOrderNote = (
  execute: WooRequestExecutor,
  request: OrderNoteGetRequest,
): Promise<OrderNoteGetResponse> =>
  execute<OrderNoteGetResponse>({
    method: "GET",
    routeTemplate: "/orders/{order_id}/notes/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const createOrderNote = (
  execute: WooRequestExecutor,
  request: OrderNotesCreateRequest,
): Promise<OrderNotesCreateResponse> =>
  execute<OrderNotesCreateResponse>({
    method: "POST",
    routeTemplate: "/orders/{order_id}/notes",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listOrderNotes = (
  execute: WooRequestExecutor,
  request: OrderNotesListRequest,
): Promise<OrderNotesListResponse> =>
  execute<OrderNotesListResponse>({
    method: "GET",
    routeTemplate: "/orders/{order_id}/notes",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const postOrderCustom = (
  execute: WooRequestExecutor,
  request: OrderPostCustomRequest,
): Promise<OrderPostCustomResponse> =>
  execute<OrderPostCustomResponse>({
    method: "POST",
    routeTemplate: "/orders/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const putOrderBatchCustom = (
  execute: WooRequestExecutor,
  request?: OrderPutBatchCustomRequest,
): Promise<OrderPutBatchCustomResponse> =>
  execute<OrderPutBatchCustomResponse>({
    method: "PUT",
    routeTemplate: "/orders/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createOrderReceipt = (
  execute: WooRequestExecutor,
  request: OrderReceiptCreateRequest,
): Promise<OrderReceiptCreateResponse> =>
  execute<OrderReceiptCreateResponse>({
    method: "POST",
    routeTemplate: "/orders/{id}/receipt",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listOrderReceipt = (
  execute: WooRequestExecutor,
  request: OrderReceiptListRequest,
): Promise<OrderReceiptListResponse> =>
  execute<OrderReceiptListResponse>({
    method: "GET",
    routeTemplate: "/orders/{id}/receipt",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const deleteOrderRefund = (
  execute: WooRequestExecutor,
  request: OrderRefundDeleteRequest,
): Promise<OrderRefundDeleteResponse> =>
  execute<OrderRefundDeleteResponse>({
    method: "DELETE",
    routeTemplate: "/orders/{order_id}/refunds/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const getOrderRefund = (
  execute: WooRequestExecutor,
  request: OrderRefundGetRequest,
): Promise<OrderRefundGetResponse> =>
  execute<OrderRefundGetResponse>({
    method: "GET",
    routeTemplate: "/orders/{order_id}/refunds/{id}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const createOrderRefund = (
  execute: WooRequestExecutor,
  request: OrderRefundsCreateRequest,
): Promise<OrderRefundsCreateResponse> =>
  execute<OrderRefundsCreateResponse>({
    method: "POST",
    routeTemplate: "/orders/{order_id}/refunds",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const listOrderRefunds = (
  execute: WooRequestExecutor,
  request: OrderRefundsListRequest,
): Promise<OrderRefundsListResponse> =>
  execute<OrderRefundsListResponse>({
    method: "GET",
    routeTemplate: "/orders/{order_id}/refunds",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const sendOrderEmail = (
  execute: WooRequestExecutor,
  request: OrderSendEmailRequest,
): Promise<OrderSendEmailResponse> =>
  execute<OrderSendEmailResponse>({
    method: "POST",
    routeTemplate: "/orders/{id}/actions/send_email",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const sendOrderOrderDetails = (
  execute: WooRequestExecutor,
  request: OrderSendOrderDetailsRequest,
): Promise<OrderSendOrderDetailsResponse> =>
  execute<OrderSendOrderDetailsResponse>({
    method: "POST",
    routeTemplate: "/orders/{id}/actions/send_order_details",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const updateOrder = (
  execute: WooRequestExecutor,
  request: OrderUpdateRequest,
): Promise<OrderUpdateResponse> =>
  execute<OrderUpdateResponse>({
    method: "PUT",
    routeTemplate: "/orders/{id}",
    path: request.path,
    body: request.body,
    headers: request.headers,
    signal: request.signal,
  });

export const batchUpdateOrders = (
  execute: WooRequestExecutor,
  request?: OrdersBatchUpdateRequest,
): Promise<OrdersBatchUpdateResponse> =>
  execute<OrdersBatchUpdateResponse>({
    method: "POST",
    routeTemplate: "/orders/batch",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const createOrder = (
  execute: WooRequestExecutor,
  request?: OrdersCreateRequest,
): Promise<OrdersCreateResponse> =>
  execute<OrdersCreateResponse>({
    method: "POST",
    routeTemplate: "/orders",
    body: request?.body,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listOrders = (
  execute: WooRequestExecutor,
  request?: OrdersListRequest,
): Promise<OrdersListResponse> =>
  execute<OrdersListResponse>({
    method: "GET",
    routeTemplate: "/orders",
    query: request?.query,
    headers: request?.headers,
    signal: request?.signal,
  });

export const listOrdersStatuses = (
  execute: WooRequestExecutor,
  request?: OrdersStatusesListRequest,
): Promise<OrdersStatusesListResponse> =>
  execute<OrdersStatusesListResponse>({
    method: "GET",
    routeTemplate: "/orders/statuses",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createOrdersModule = (
  execute: WooRequestExecutor,
): OrdersModule => ({
  deleteOrder: (request) => deleteOrder(execute, request),
  emailOrderTemplates: (request) => emailOrderTemplates(execute, request),
  getOrder: (request) => getOrder(execute, request),
  deleteOrderNote: (request) => deleteOrderNote(execute, request),
  getOrderNote: (request) => getOrderNote(execute, request),
  createOrderNote: (request) => createOrderNote(execute, request),
  listOrderNotes: (request) => listOrderNotes(execute, request),
  postOrderCustom: (request) => postOrderCustom(execute, request),
  putOrderBatchCustom: (request) => putOrderBatchCustom(execute, request),
  createOrderReceipt: (request) => createOrderReceipt(execute, request),
  listOrderReceipt: (request) => listOrderReceipt(execute, request),
  deleteOrderRefund: (request) => deleteOrderRefund(execute, request),
  getOrderRefund: (request) => getOrderRefund(execute, request),
  createOrderRefund: (request) => createOrderRefund(execute, request),
  listOrderRefunds: (request) => listOrderRefunds(execute, request),
  sendOrderEmail: (request) => sendOrderEmail(execute, request),
  sendOrderOrderDetails: (request) => sendOrderOrderDetails(execute, request),
  updateOrder: (request) => updateOrder(execute, request),
  batchUpdateOrders: (request) => batchUpdateOrders(execute, request),
  createOrder: (request) => createOrder(execute, request),
  listOrders: (request) => listOrders(execute, request),
  listOrdersStatuses: (request) => listOrdersStatuses(execute, request),
});
