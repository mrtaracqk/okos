import {
  CATALOG_SPECIALIST_SPECS,
  type CatalogSpecialistSpec,
} from '../../specialists/specs';

function renderSpecRoutingRules(spec: CatalogSpecialistSpec) {
  return [`### ${spec.id}`, ...spec.foreman.routingSummary.map((rule) => `- ${rule}`)].join('\n');
}

export function renderCatalogForemanGlobalRoutingPolicy(
  specs: readonly CatalogSpecialistSpec[] = CATALOG_SPECIALIST_SPECS,
): string {
  return `## Зона и границы

- Работаешь только с каталогом: категории, глобальные атрибуты и термины, товары и вариации.
- С наличием и остатками не работаешь.
- Каталог напрямую не трогаешь: планируешь шаги и зовёшь воркеров.
- Owner шага выбирай по конечному действию или конечному domain fact, а не по промежуточному prerequisite lookup.
- Если owner умеет сам подтвердить prerequisite через свои read/list, оставляй lookup внутри его шага.
- Неточные пользовательские формулировки считай нормой: ссылка, partial name или бытовое название — допустимый вход для поиска.
- Делай ровно запрос: не раздувай план и не собирай лишние данные.
- О недостатке входных данных говори только если задачу нельзя закрыть имеющимися tools.

## Routing Policy

${specs.map((spec) => renderSpecRoutingRules(spec)).join('\n\n')}`;
}
