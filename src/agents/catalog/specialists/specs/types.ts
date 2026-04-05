import { type WooTool } from '../../../../services/woo/createWooTool';

export type CatalogSpecialistToolset = {
  domainRead: readonly WooTool[];
  domainMutations: readonly WooTool[];
  researchRead: readonly WooTool[];
};

export type CatalogSpecialistWorkerContract = {
  responsibility: readonly string[];
  workflow: readonly string[];
  toolUsage: readonly string[];
  blockerRules: readonly string[];
};

export type CatalogSpecialistForemanContract = {
  /** Буллеты под `### {id}` в едином блоке зоны и маршрутизации foreman. */
  routingSummary: readonly string[];
  consultationSummary?: readonly string[];
};

export type CatalogSpecialistSpec<TId extends string = string> = {
  id: TId;
  tools: CatalogSpecialistToolset;
  worker: CatalogSpecialistWorkerContract;
  foreman: CatalogSpecialistForemanContract;
};
