/**
 * Structured request from main graph to catalog agent.
 * Single envelope for all catalog delegation; text view is derived for the initial prompt.
 */
export type CatalogDelegationRequest = {
  requestKind?: string;
  goal: string;
  facts: string[];
  constraints: string[];
  desiredOutcome: string;
};

/** Parse tool-call args into CatalogDelegationRequest; returns null if goal or desiredOutcome missing. */
export function parseCatalogDelegationRequest(args: unknown): CatalogDelegationRequest | null {
  if (args == null || typeof args !== 'object') return null;
  const o = args as Record<string, unknown>;
  const goal = typeof o.goal === 'string' ? o.goal.trim() : '';
  const desiredOutcome = typeof o.desiredOutcome === 'string' ? o.desiredOutcome.trim() : '';
  if (!goal || !desiredOutcome) return null;
  const facts = Array.isArray(o.facts)
    ? (o.facts as unknown[]).map((f) => (typeof f === 'string' ? f.trim() : '')).filter(Boolean)
    : [];
  const constraints = Array.isArray(o.constraints)
    ? (o.constraints as unknown[]).map((c) => (typeof c === 'string' ? c.trim() : '')).filter(Boolean)
    : [];
  const requestKind = typeof o.requestKind === 'string' ? o.requestKind.trim() || undefined : undefined;
  return { requestKind, goal, facts, constraints, desiredOutcome };
}

/** Render request envelope to a single prompt string for the catalog HumanMessage. */
export function renderCatalogDelegationRequestToPrompt(request: CatalogDelegationRequest): string {
  const parts: string[] = [];
  if (request.requestKind?.trim()) {
    parts.push(`Тип запроса: ${request.requestKind.trim()}`);
  }
  parts.push(`Цель: ${request.goal.trim()}`);
  if (request.facts.length > 0) {
    parts.push(`Известные данные:\n${request.facts.map((f) => `- ${f}`).join('\n')}`);
  }
  if (request.constraints.length > 0) {
    parts.push(`Ограничения:\n${request.constraints.map((c) => `- ${c}`).join('\n')}`);
  }
  parts.push(`Желаемый результат: ${request.desiredOutcome.trim()}`);
  return parts.join('\n\n');
}
