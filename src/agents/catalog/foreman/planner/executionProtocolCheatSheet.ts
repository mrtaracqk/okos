export function renderCatalogExecutionProtocolCheatSheet(): string {
  return `## После шага воркера

- Полный снимок состояния после \`new_execution_plan\` / \`approve_step\` — **только** в JSON tool result этого вызова; отдельного WORKER_RESULT или хвостового сообщения воркера не будет.
- Смысл последнего шага — из \`completed_step.worker_result\` (\`status\`, \`data\`, \`missingData\`, \`blocker\`, \`artifacts\`).
- Если \`completed_step.worker_result=null\`, используй \`completed_step.protocol_error\`.
- Если \`next_step.tool=approve_step\` — вызови \`approve_step\`.
- Иначе: \`new_execution_plan\` при смене owner, входа или цели; \`finish_catalog_turn\`, когда ответ пользователю готов или продолжать текущий план нельзя (тупик/блокер).`;
}
