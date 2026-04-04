import { type CatalogWorkerId } from '../../../contracts/catalogExecutionOwners';
import type { WorkerResult, WorkerResultStatus } from './workerResult';

export type WorkerRunProtocolErrorCode = 'missing_report_worker_result' | 'invalid_report_worker_result';

export type WorkerRunProtocolError = {
  code: WorkerRunProtocolErrorCode;
  message: string;
};

export type WorkerRun = {
  agent: CatalogWorkerId;
  errorSummary?: string;
  protocolError?: WorkerRunProtocolError;
  status: WorkerResultStatus | 'invalid';
  task: string;
  toolRunCount?: number;
  result?: WorkerResult;
};
