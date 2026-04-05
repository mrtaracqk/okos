export function renderCatalogExecutionPlanningPolicy(): string {
  return `## План и handoff

- Перед вызовом воркера нужен активный план через \`new_execution_plan\`; структура \`planContext\`, \`tasks\`, полей шага — в Zod-схеме tool.
- Owner шага выбирай по конечному действию или конечному факту домена; не выделяй отдельный шаг только для lookup, если owner сам может снять неопределённость своими read/list.
- Повторный \`new_execution_plan\` — только когда меняется owner будущих шагов, их вход или цель (\`goal\`); иначе продолжай текущий план по \`catalog_execution_v3\` (\`approve_step\` / \`finish_catalog_turn\` по правилам ниже).`;
}
