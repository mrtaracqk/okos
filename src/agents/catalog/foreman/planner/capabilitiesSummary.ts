import {
  CATALOG_SPECIALIST_SPECS,
  type CatalogSpecialistSpec,
} from '../../specialists/specs';

const t = (tool: { name: string }) => `\`${tool.name}\``;
const renderToolList = (tools: readonly { name: string }[]) => tools.map(t).join(', ');

function renderCapabilitiesSection(spec: CatalogSpecialistSpec) {
  const lines = [
    `### ${spec.id}`,
    `- **Читает в своей зоне:** ${renderToolList(spec.tools.domainRead)}`,
    `- **Меняет в своей зоне:** ${renderToolList(spec.tools.domainMutations)}`,
  ];

  if (spec.tools.researchRead.length > 0) {
    lines.push(
      `- **Research lookup в соседних доменах:** ${renderToolList(spec.tools.researchRead)}`,
    );
  }

  if (spec.foreman.consultationSummary && spec.foreman.consultationSummary.length > 0) {
    lines.push(
      `- **Консультирует:** ${spec.foreman.consultationSummary.join('; ')}`,
    );
  }

  return lines.join('\n');
}

/**
 * Краткий справочник инструментов воркеров для промпта catalog-agent (имена — как у модели: wc_v3_…).
 */
export function renderCatalogForemanWorkerCapabilities(
  specs: readonly CatalogSpecialistSpec[] = CATALOG_SPECIALIST_SPECS,
): string {
  return `## Возможности воркеров (инструменты)

${specs.map((spec) => renderCapabilitiesSection(spec)).join('\n\n')}`;
}
