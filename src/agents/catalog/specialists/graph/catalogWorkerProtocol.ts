import type { WorkerTaskEnvelope } from '../../contracts/workerRequest';
import {
  normalizeWorkerResult,
  WORKER_RESULT_TOOL_NAME,
  type WorkerResult,
} from '../../contracts/workerResult';
import { toJsonSafeValue } from '../../../shared/jsonSafe';
import { type ToolRun } from '../../../shared/toolRun';

export function renderWorkerHandoffMessage(handoff: WorkerTaskEnvelope): string {
  return [
    'WORKER_HANDOFF',
    '```json',
    JSON.stringify(
      {
        planContext: {
          goal: handoff.planContext.goal,
          facts: handoff.planContext.facts,
          constraints: handoff.planContext.constraints,
        },
        taskInput: {
          objective: handoff.taskInput.objective,
          facts: handoff.taskInput.facts,
          constraints: handoff.taskInput.constraints,
          expectedOutput: handoff.taskInput.expectedOutput,
          contextNotes: handoff.taskInput.contextNotes ?? null,
        },
        upstreamArtifacts: handoff.upstreamArtifacts !== undefined ? toJsonSafeValue(handoff.upstreamArtifacts) : null,
      },
      null,
      2
    ),
    '```',
  ].join('\n');
}

export function extractCatalogFinalResult(toolRun: ToolRun): WorkerResult | null {
  if (toolRun.toolName !== WORKER_RESULT_TOOL_NAME || toolRun.status !== 'completed' || toolRun.structured == null) {
    return null;
  }

  return normalizeWorkerResult(toolRun.structured);
}
