import { type ToolRun } from '../../shared/toolLoopGraph';
import { type CatalogWorkerId } from './catalogWorkerId';
import { type WorkerResultEnvelope, type WorkerResultStatus } from './workerResult';
import { type WorkerTaskEnvelope } from './workerRequest';

export type WorkerRun = {
  agent: CatalogWorkerId;
  details?: string;
  status: WorkerResultStatus | 'invalid';
  task: string;
  toolRuns?: ToolRun[];
  /** Structured handoff passed to the worker (source of truth). */
  request?: WorkerTaskEnvelope;
  /** Structured result from the worker (source of truth). */
  result?: WorkerResultEnvelope;
};
