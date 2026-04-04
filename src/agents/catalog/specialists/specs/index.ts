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
export type CatalogWorkerKnowledgeEntry = { id: CatalogSpecialistId } & CatalogSpecialistRegistryEntry['knowledge'];
export type CatalogWorkerToolset = CatalogSpecialistRegistryEntry['tools'];

export const CATALOG_SPECIALISTS_BY_ID = Object.fromEntries(
  CATALOG_SPECIALIST_SPECS.map((spec) => [spec.id, spec]),
) as Readonly<Record<CatalogSpecialistId, CatalogSpecialistRegistryEntry>>;

export const CATALOG_WORKER_ENTRIES: readonly CatalogWorkerKnowledgeEntry[] =
  CATALOG_SPECIALIST_SPECS.map((spec) => ({
    id: spec.id,
    ...spec.knowledge,
  }));

export const CATALOG_WORKER_KNOWLEDGE = Object.fromEntries(
  CATALOG_WORKER_ENTRIES.map((entry) => [entry.id, entry]),
) as Readonly<Record<CatalogSpecialistId, CatalogWorkerKnowledgeEntry>>;

export function getCatalogWorkerToolset(workerId: CatalogSpecialistId): CatalogWorkerToolset {
  return CATALOG_SPECIALISTS_BY_ID[workerId].tools;
}

export function getCatalogWorkerRuntimeTools(workerId: CatalogSpecialistId): WooTool[] {
  const toolset = getCatalogWorkerToolset(workerId);
  return [...toolset.domainRead, ...toolset.domainMutations, ...toolset.researchRead];
}

export type {
  CatalogSpecialistKnowledge,
  CatalogSpecialistRouting,
  CatalogSpecialistSpec,
  CatalogSpecialistToolset,
} from './types';
