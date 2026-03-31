/**
 * Source runtime for generated Woo SDK clients.
 * Changes here are copied into generated/woo-sdk/src/core.
 */

export type WooAuthStrategy = "auto" | "basic" | "query";
export type WooHeadersInit =
  | Headers
  | Array<[string, string]>
  | Record<string, string>;

export interface CreateWooClientConfig {
  authStrategy?: WooAuthStrategy;
  baseUrl: string;
  consumerKey?: string;
  consumerSecret?: string;
  fetch?: typeof fetch;
  headers?: WooHeadersInit;
}

export interface WooRequestOptions {
  headers?: WooHeadersInit;
  signal?: AbortSignal;
}

export interface ExecuteWooRequestOptions extends WooRequestOptions {
  body?: unknown;
  method: "DELETE" | "GET" | "POST" | "PUT";
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  routeTemplate: string;
}

export type WooRequestExecutor = <TResponse>(
  options: ExecuteWooRequestOptions,
) => Promise<TResponse>;

/** Same wire format as WooRequestExecutor, plus response Headers (WordPress collection pagination). */
export type WooRequestExecutorWithHeaders = <TResponse>(
  options: ExecuteWooRequestOptions,
) => Promise<{ data: TResponse; headers: Headers }>;

export interface WooApiErrorDetails<TData = unknown> {
  data: TData;
  headers: Headers;
  method: ExecuteWooRequestOptions["method"];
  status: number;
  statusText: string;
  url: string;
}
