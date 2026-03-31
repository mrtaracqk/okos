import { getCatalogWorkerToolset } from '../specialists/shared/workerToolsets';

const t = (tool: { name: string }) => `\`${tool.name}\``;
const renderToolList = (tools: readonly { name: string }[]) => tools.map(t).join(', ');

/**
 * Краткий справочник инструментов воркеров для промпта catalog-agent (имена — как у модели: wc_v3_…).
 */
export function renderCatalogForemanWorkerCapabilities(): string {
  const category = getCatalogWorkerToolset('category-worker');
  const attribute = getCatalogWorkerToolset('attribute-worker');
  const product = getCatalogWorkerToolset('product-worker');
  const variation = getCatalogWorkerToolset('variation-worker');

  return `## Возможности воркеров (инструменты)

### category-worker
- **Читает и ищет в своей зоне:** ${renderToolList(category.domainRead)}
- **Меняет в своей зоне:** ${renderToolList(category.domainMutations)}

### attribute-worker
- **Читает в своей зоне:** ${renderToolList(attribute.domainRead)}
- **Меняет в своей зоне:** ${renderToolList(attribute.domainMutations)}

### product-worker
- **Читает в своей зоне:** ${renderToolList(product.domainRead)}
- **Меняет в своей зоне:** ${renderToolList(product.domainMutations)}
- **Research lookup в соседних доменах:** ${renderToolList(product.researchRead)}

### variation-worker
- **Читает в своей зоне:** ${renderToolList(variation.domainRead)}
- **Меняет в своей зоне:** ${renderToolList(variation.domainMutations)}
- **Research lookup в соседних доменах:** ${renderToolList(variation.researchRead)}`;
}
