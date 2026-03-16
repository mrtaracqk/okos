/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import type { WooRequestExecutor, WooRequestOptions } from "../core/types";
import type {
  DataContinentGetPathParams,
  DataContinentGetQuery,
  DataContinentGetResponse,
  DataContinentsListResponse,
  DataCountriesListResponse,
  DataCountryGetPathParams,
  DataCountryGetResponse,
  DataCurrenciesCurrentListResponse,
  DataCurrenciesListResponse,
  DataCurrencyGetPathParams,
  DataCurrencyGetQuery,
  DataCurrencyGetResponse,
  DataListResponse,
} from "../models/data";

export interface DataContinentGetRequest extends WooRequestOptions {
  path: DataContinentGetPathParams;
  query?: DataContinentGetQuery;
}

export type DataContinentsListRequest = WooRequestOptions;

export type DataCountriesListRequest = WooRequestOptions;

export interface DataCountryGetRequest extends WooRequestOptions {
  path: DataCountryGetPathParams;
}

export type DataCurrenciesCurrentListRequest = WooRequestOptions;

export type DataCurrenciesListRequest = WooRequestOptions;

export interface DataCurrencyGetRequest extends WooRequestOptions {
  path: DataCurrencyGetPathParams;
  query?: DataCurrencyGetQuery;
}

export type DataListRequest = WooRequestOptions;

export interface DataModule {
  getDataContinent(
    request: DataContinentGetRequest,
  ): Promise<DataContinentGetResponse>;
  listDataContinents(
    request?: DataContinentsListRequest,
  ): Promise<DataContinentsListResponse>;
  listDataCountries(
    request?: DataCountriesListRequest,
  ): Promise<DataCountriesListResponse>;
  getDataCountry(
    request: DataCountryGetRequest,
  ): Promise<DataCountryGetResponse>;
  listDataCurrenciesCurrent(
    request?: DataCurrenciesCurrentListRequest,
  ): Promise<DataCurrenciesCurrentListResponse>;
  listDataCurrencies(
    request?: DataCurrenciesListRequest,
  ): Promise<DataCurrenciesListResponse>;
  getDataCurrency(
    request: DataCurrencyGetRequest,
  ): Promise<DataCurrencyGetResponse>;
  listData(request?: DataListRequest): Promise<DataListResponse>;
}

export const getDataContinent = (
  execute: WooRequestExecutor,
  request: DataContinentGetRequest,
): Promise<DataContinentGetResponse> =>
  execute<DataContinentGetResponse>({
    method: "GET",
    routeTemplate: "/data/continents/{location}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const listDataContinents = (
  execute: WooRequestExecutor,
  request?: DataContinentsListRequest,
): Promise<DataContinentsListResponse> =>
  execute<DataContinentsListResponse>({
    method: "GET",
    routeTemplate: "/data/continents",
    headers: request?.headers,
    signal: request?.signal,
  });

export const listDataCountries = (
  execute: WooRequestExecutor,
  request?: DataCountriesListRequest,
): Promise<DataCountriesListResponse> =>
  execute<DataCountriesListResponse>({
    method: "GET",
    routeTemplate: "/data/countries",
    headers: request?.headers,
    signal: request?.signal,
  });

export const getDataCountry = (
  execute: WooRequestExecutor,
  request: DataCountryGetRequest,
): Promise<DataCountryGetResponse> =>
  execute<DataCountryGetResponse>({
    method: "GET",
    routeTemplate: "/data/countries/{location}",
    path: request.path,
    headers: request.headers,
    signal: request.signal,
  });

export const listDataCurrenciesCurrent = (
  execute: WooRequestExecutor,
  request?: DataCurrenciesCurrentListRequest,
): Promise<DataCurrenciesCurrentListResponse> =>
  execute<DataCurrenciesCurrentListResponse>({
    method: "GET",
    routeTemplate: "/data/currencies/current",
    headers: request?.headers,
    signal: request?.signal,
  });

export const listDataCurrencies = (
  execute: WooRequestExecutor,
  request?: DataCurrenciesListRequest,
): Promise<DataCurrenciesListResponse> =>
  execute<DataCurrenciesListResponse>({
    method: "GET",
    routeTemplate: "/data/currencies",
    headers: request?.headers,
    signal: request?.signal,
  });

export const getDataCurrency = (
  execute: WooRequestExecutor,
  request: DataCurrencyGetRequest,
): Promise<DataCurrencyGetResponse> =>
  execute<DataCurrencyGetResponse>({
    method: "GET",
    routeTemplate: "/data/currencies/{currency}",
    path: request.path,
    query: request.query,
    headers: request.headers,
    signal: request.signal,
  });

export const listData = (
  execute: WooRequestExecutor,
  request?: DataListRequest,
): Promise<DataListResponse> =>
  execute<DataListResponse>({
    method: "GET",
    routeTemplate: "/data",
    headers: request?.headers,
    signal: request?.signal,
  });

export const createDataModule = (execute: WooRequestExecutor): DataModule => ({
  getDataContinent: (request) => getDataContinent(execute, request),
  listDataContinents: (request) => listDataContinents(execute, request),
  listDataCountries: (request) => listDataCountries(execute, request),
  getDataCountry: (request) => getDataCountry(execute, request),
  listDataCurrenciesCurrent: (request) =>
    listDataCurrenciesCurrent(execute, request),
  listDataCurrencies: (request) => listDataCurrencies(execute, request),
  getDataCurrency: (request) => getDataCurrency(execute, request),
  listData: (request) => listData(execute, request),
});
