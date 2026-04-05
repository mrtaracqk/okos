import { attributeWorkerSpec } from './attributeWorkerSpec';
import { categoryWorkerSpec } from './categoryWorkerSpec';
import { productWorkerSpec } from './productWorkerSpec';
import { variationWorkerSpec } from './variationWorkerSpec';
import { type WooTool } from '../../../../services/woo/createWooTool';

export function buildCatalogWorkerIds<TId extends string>(specs: readonly { id: TId }[]): TId[] {
  return specs.map((spec) => spec.id);
}

export const CATALOG_SPECIALIST_SPECS = [
  categoryWorkerSpec,
  attributeWorkerSpec,
  productWorkerSpec,
  variationWorkerSpec,
] as const;

type CatalogSpecialistRegistryEntry = (typeof CATALOG_SPECIALIST_SPECS)[number];

export type CatalogSpecialistId = CatalogSpecialistRegistryEntry['id'];
export type CatalogWorkerContractEntry = { id: CatalogSpecialistId } & CatalogSpecialistRegistryEntry['worker'];
export type CatalogWorkerToolset = CatalogSpecialistRegistryEntry['tools'];
export type CatalogForemanSpecialistEntry = { id: CatalogSpecialistId } & CatalogSpecialistRegistryEntry['foreman'];

export const CATALOG_SPECIALISTS_BY_ID = Object.fromEntries(
  CATALOG_SPECIALIST_SPECS.map((spec) => [spec.id, spec]),
) as Readonly<Record<CatalogSpecialistId, CatalogSpecialistRegistryEntry>>;

export const CATALOG_WORKER_ENTRIES: readonly CatalogWorkerContractEntry[] =
  CATALOG_SPECIALIST_SPECS.map((spec) => ({
    id: spec.id,
    ...spec.worker,
  }));

export const CATALOG_WORKER_CONTRACTS = Object.fromEntries(
  CATALOG_WORKER_ENTRIES.map((entry) => [entry.id, entry]),
) as Readonly<Record<CatalogSpecialistId, CatalogWorkerContractEntry>>;

export const CATALOG_FOREMAN_SPECIALIST_ENTRIES: readonly CatalogForemanSpecialistEntry[] =
  CATALOG_SPECIALIST_SPECS.map((spec) => ({
    id: spec.id,
    ...spec.foreman,
  }));

export const CATALOG_FOREMAN_SPECIALIST_SUMMARIES = Object.fromEntries(
  CATALOG_FOREMAN_SPECIALIST_ENTRIES.map((entry) => [entry.id, entry]),
) as Readonly<Record<CatalogSpecialistId, CatalogForemanSpecialistEntry>>;

export function getCatalogWorkerToolset(workerId: CatalogSpecialistId): CatalogWorkerToolset {
  return CATALOG_SPECIALISTS_BY_ID[workerId].tools;
}

export function getCatalogWorkerRuntimeTools(workerId: CatalogSpecialistId): WooTool[] {
  const toolset = getCatalogWorkerToolset(workerId);
  return [...toolset.domainRead, ...toolset.domainMutations, ...toolset.researchRead];
}

export type {
  CatalogSpecialistForemanContract,
  CatalogSpecialistSpec,
  CatalogSpecialistToolset,
  CatalogSpecialistWorkerContract,
} from './types';
