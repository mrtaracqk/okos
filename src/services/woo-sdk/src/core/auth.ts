/**
 * Source runtime for generated Woo SDK clients.
 * Changes here are copied into generated/woo-sdk/src/core.
 */

import { CreateWooClientConfig } from "./types";

export const applyWooAuthentication = (
  url: URL,
  headers: Headers,
  config: Pick<
    CreateWooClientConfig,
    "authStrategy" | "consumerKey" | "consumerSecret"
  >,
): void => {
  const { consumerKey, consumerSecret } = config;

  if (!consumerKey && !consumerSecret) {
    return;
  }

  if (!consumerKey || !consumerSecret) {
    throw new Error(
      "Woo client authentication requires both consumerKey and consumerSecret.",
    );
  }

  const authStrategy = config.authStrategy ?? "auto";

  if (authStrategy === "query" || authStrategy === "auto") {
    url.searchParams.set("consumer_key", consumerKey);
    url.searchParams.set("consumer_secret", consumerSecret);
    return;
  }

  headers.set(
    "authorization",
    `Basic ${encodeBasicCredentials(consumerKey, consumerSecret)}`,
  );
};

const encodeBasicCredentials = (
  consumerKey: string,
  consumerSecret: string,
): string => {
  const rawValue = `${consumerKey}:${consumerSecret}`;

  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(rawValue);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(rawValue, "utf8").toString("base64");
  }

  throw new Error(
    "Woo client basic authentication requires btoa or Buffer support.",
  );
};
