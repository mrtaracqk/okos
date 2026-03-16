/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { createWooRequestExecutor } from "./core/http";
import type { CreateWooClientConfig } from "./core/types";
import { createCouponsModule } from "./operations/coupons";
import type { CouponsModule } from "./operations/coupons";
import { createCustomersModule } from "./operations/customers";
import type { CustomersModule } from "./operations/customers";
import { createDataModule } from "./operations/data";
import type { DataModule } from "./operations/data";
import { createLayoutTemplatesModule } from "./operations/layoutTemplates";
import type { LayoutTemplatesModule } from "./operations/layoutTemplates";
import { createMarketplaceModule } from "./operations/marketplace";
import type { MarketplaceModule } from "./operations/marketplace";
import { createOrdersModule } from "./operations/orders";
import type { OrdersModule } from "./operations/orders";
import { createPaymentGatewaysModule } from "./operations/paymentGateways";
import type { PaymentGatewaysModule } from "./operations/paymentGateways";
import { createProductsModule } from "./operations/products";
import type { ProductsModule } from "./operations/products";
import { createRefundsModule } from "./operations/refunds";
import type { RefundsModule } from "./operations/refunds";
import { createReportsModule } from "./operations/reports";
import type { ReportsModule } from "./operations/reports";
import { createSettingsModule } from "./operations/settings";
import type { SettingsModule } from "./operations/settings";
import { createShippingModule } from "./operations/shipping";
import type { ShippingModule } from "./operations/shipping";
import { createShippingMethodsModule } from "./operations/shippingMethods";
import type { ShippingMethodsModule } from "./operations/shippingMethods";
import { createSystemStatusModule } from "./operations/systemStatus";
import type { SystemStatusModule } from "./operations/systemStatus";
import { createTaxesModule } from "./operations/taxes";
import type { TaxesModule } from "./operations/taxes";
import { createWebhooksModule } from "./operations/webhooks";
import type { WebhooksModule } from "./operations/webhooks";

export interface WooClient {
  coupons: CouponsModule;
  customers: CustomersModule;
  data: DataModule;
  layoutTemplates: LayoutTemplatesModule;
  marketplace: MarketplaceModule;
  orders: OrdersModule;
  paymentGateways: PaymentGatewaysModule;
  products: ProductsModule;
  refunds: RefundsModule;
  reports: ReportsModule;
  settings: SettingsModule;
  shipping: ShippingModule;
  shippingMethods: ShippingMethodsModule;
  systemStatus: SystemStatusModule;
  taxes: TaxesModule;
  webhooks: WebhooksModule;
}

export const createWooClient = (config: CreateWooClientConfig): WooClient => {
  const execute = createWooRequestExecutor(config);

  return {
    coupons: createCouponsModule(execute),
    customers: createCustomersModule(execute),
    data: createDataModule(execute),
    layoutTemplates: createLayoutTemplatesModule(execute),
    marketplace: createMarketplaceModule(execute),
    orders: createOrdersModule(execute),
    paymentGateways: createPaymentGatewaysModule(execute),
    products: createProductsModule(execute),
    refunds: createRefundsModule(execute),
    reports: createReportsModule(execute),
    settings: createSettingsModule(execute),
    shipping: createShippingModule(execute),
    shippingMethods: createShippingMethodsModule(execute),
    systemStatus: createSystemStatusModule(execute),
    taxes: createTaxesModule(execute),
    webhooks: createWebhooksModule(execute),
  };
};
