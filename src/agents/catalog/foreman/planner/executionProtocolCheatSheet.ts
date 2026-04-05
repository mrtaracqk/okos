export function renderCatalogExecutionProtocolCheatSheet(): string {
  return `## Перепланирование

Reasoning идёт по актуальному \`catalog_execution_v3\` в tool result и runtime state.

- \`plan_update\` означает, что план только что создан или заменён.
- \`completed_step.worker_result\` — канонический structured result последнего шага; reason from \`status\`, \`data\`, \`missingData\`, \`blocker\` и \`artifacts\`.
- если \`completed_step.worker_result=null\`, используй \`completed_step.protocol_error\` и не восстанавливай шаг по prose.
- \`next_step.tool=approve_step\` — хвост плана остаётся валиден и следующий шаг уже определён.
- Нужен другой owner, другой слой данных или обновлённый вход для будущих задач — \`new_execution_plan\`.
- Facts и constraints будущих задач не обновляются автоматически из результата шага; если новый факт нужен дальше, заложи его в новый plan.
- \`upstreamArtifacts\` живут только в следующем шаге и сами по цепочке не тянутся.
- Всё сделано или execution упёрся в реальный тупик — \`finish_execution_plan\`.`;
}
