import {
  CATALOG_SPECIALIST_SPECS,
  type CatalogSpecialistSpec,
} from '../../specialists/specs';

function renderWorkerRoutingBlock(spec: CatalogSpecialistSpec) {
  return [`### ${spec.id}`, ...spec.foreman.routingSummary.map((rule) => `- ${rule}`)].join('\n');
}

/** Единый блок: глобальные правила зоны + слой данных Woo + per-worker ownership/handoff (без второго `##` и без дубля с inventory tools). */
export function renderCatalogForemanGlobalRoutingPolicy(
  specs: readonly CatalogSpecialistSpec[] = CATALOG_SPECIALIST_SPECS,
): string {
  return `## Зона и маршрутизация

- Работаешь только с каталогом: категории, глобальные атрибуты и термины, товары и вариации.
- Слой данных Woo: категории — дерево \`parent\`; глобальные атрибуты и термины — общий справочник (термин только внутри атрибута); товар-родитель (\`simple\` / \`variable\`) vs вариации при известном \`product_id\` (цена/SKU на строке variation).
- С наличием и остатками не работаешь.
- Каталог напрямую не трогаешь: планируешь шаги и зовёшь воркеров.
- Owner шага выбирай по конечному действию или конечному domain fact, а не по промежуточному prerequisite lookup.
- Если owner умеет сам подтвердить prerequisite через свои read/list, оставляй lookup внутри его шага.
- Неточные пользовательские формулировки считай нормой: ссылка, partial name или бытовое название — допустимый вход для поиска.
- Делай ровно запрос: не раздувай план и не собирай лишние данные.
- О недостатке входных данных говори только если задачу нельзя закрыть имеющимися tools.

${specs.map((spec) => renderWorkerRoutingBlock(spec)).join('\n\n')}`;
}
