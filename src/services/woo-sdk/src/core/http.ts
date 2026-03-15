/**
 * Source runtime for generated Woo SDK clients.
 * Changes here are copied into generated/woo-sdk/src/core.
 */

import { applyWooAuthentication } from "./auth";
import { buildWooRequestUrl, serializeJsonBody } from "./serialize";
import {
  CreateWooClientConfig,
  ExecuteWooRequestOptions,
  WooApiErrorDetails,
  WooHeadersInit,
  WooRequestExecutor,
} from "./types";

export class WooApiError<TData = unknown> extends Error {
  readonly data: TData;
  readonly headers: Headers;
  readonly method: ExecuteWooRequestOptions["method"];
  readonly status: number;
  readonly statusText: string;
  readonly url: string;

  constructor(message: string, details: WooApiErrorDetails<TData>) {
    super(message);
    this.name = "WooApiError";
    this.data = details.data;
    this.headers = details.headers;
    this.method = details.method;
    this.status = details.status;
    this.statusText = details.statusText;
    this.url = details.url;
  }
}

export const createWooRequestExecutor = (
  config: CreateWooClientConfig,
): WooRequestExecutor => {
  const fetchImplementation = config.fetch ?? globalThis.fetch;

  if (!fetchImplementation) {
    throw new Error(
      "Woo client requires a fetch implementation via config.fetch or globalThis.fetch.",
    );
  }

  return async <TResponse>(
    options: ExecuteWooRequestOptions,
  ): Promise<TResponse> => {
    const headers = new Headers(config.headers);
    mergeHeaders(headers, options.headers);

    const body = serializeJsonBody(options.body);

    if (body !== undefined && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    if (!headers.has("accept")) {
      headers.set("accept", "application/json");
    }

    const url = buildWooRequestUrl({
      baseUrl: config.baseUrl,
      path: options.path,
      query: options.query,
      routeTemplate: options.routeTemplate,
    });

    applyWooAuthentication(url, headers, config);

    const response = await fetchImplementation(url, {
      body,
      headers,
      method: options.method,
      signal: options.signal,
    });
    const responseData = await parseWooResponseBody(response);

    if (!response.ok) {
      throw new WooApiError(
        `Woo request failed with ${response.status} ${response.statusText}.`,
        {
          data: responseData,
          headers: response.headers,
          method: options.method,
          status: response.status,
          statusText: response.statusText,
          url: url.toString(),
        },
      );
    }

    return responseData as TResponse;
  };
};

const mergeHeaders = (
  target: Headers,
  headers: WooHeadersInit | undefined,
): void => {
  if (!headers) {
    return;
  }

  const resolvedHeaders = new Headers(headers);

  resolvedHeaders.forEach((value, key) => {
    target.set(key, value);
  });
};

const parseWooResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const text = await response.text();

  if (text.length === 0) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const shouldParseAsJson =
    contentType.includes("application/json") ||
    contentType.includes("+json") ||
    /^[\[{]/.test(text.trim());

  if (!shouldParseAsJson) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Failed to parse Woo response body as JSON: ${
        error instanceof Error ? error.message : "unknown parse error"
      }`,
    );
  }
};
