import { CATALOG_SPECIALIST_SPECS } from '../../specialists/specs';

function renderCatalogWorkerOwnerUnion() {
  return CATALOG_SPECIALIST_SPECS.map((spec) => spec.id).join(' | ');
}

function renderCatalogWorkerList() {
  return CATALOG_SPECIALIST_SPECS.map((spec) => `- ${spec.id}`).join('\n');
}

export function renderCatalogExecutionPlanningPolicy(): string {
  return `## Рабочий порядок

- Для цепочек с зависимостями между шагами сначала смотри \`inspect_catalog_playbook\`; простой одношаговый сценарий можно планировать сразу.
- Перед вызовом воркера план обязателен.
- План задаётся и полностью заменяется через \`new_execution_plan(planContext, tasks[])\`; повторный вызов снова запускает первую задачу и очищает старые \`upstreamArtifacts\`.
- \`planContext\`: \`goal\`, \`facts\`, \`constraints\` — общий контекст плана.
- Задача: \`taskId\`, \`responsible\` (${renderCatalogWorkerOwnerUnion()}), \`task\`, \`inputData.facts\`, \`inputData.constraints\`, \`inputData.contextNotes\`, \`responseStructure\`.
- Каталог напрямую не трогаешь — только воркеры. На входе у воркера handoff: \`planContext\`, \`taskInput\`, опционально \`upstreamArtifacts\`.
- В \`taskInput\` передавай \`objective\`, \`facts\`, \`constraints\`, \`expectedOutput\`, коротко \`contextNotes\`.
- Формулируй handoff вокруг конечной задачи owner-а; не декомпозируй prerequisite lookup в отдельный workflow, если owner умеет снять неопределённость сам.

Исполнители:
${renderCatalogWorkerList()}`;
}
