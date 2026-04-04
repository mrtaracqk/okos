import { type WooTool } from '../../../../services/woo/createWooTool';

export type CatalogSpecialistToolset = {
  domainRead: readonly WooTool[];
  domainMutations: readonly WooTool[];
  researchRead: readonly WooTool[];
};

export type CatalogSpecialistKnowledge = {
  ownershipRules: readonly string[];
  lookupRules: readonly string[];
  blockerRules: readonly string[];
};

export type CatalogSpecialistRouting = {
  routingRules: readonly string[];
};

export type CatalogSpecialistSpec<TId extends string = string> = {
  id: TId;
  tools: CatalogSpecialistToolset;
  knowledge: CatalogSpecialistKnowledge;
  routingRules: CatalogSpecialistRouting['routingRules'];
};
