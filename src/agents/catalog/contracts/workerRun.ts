import type { WorkerResultEnvelope, WorkerResultStatus } from './workerResult';
import { type CatalogWorkerId } from './catalogWorkerId';

export type WorkerRun = {
  agent: CatalogWorkerId;
  errorSummary?: string;
  status: WorkerResultStatus | 'invalid';
  task: string;
  toolRunCount?: number;
  result?: WorkerResultEnvelope;
};
