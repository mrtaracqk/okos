import { type ToolRun } from '../../shared/toolLoopGraph';
import { type WorkerResultStatus } from './workerResult';

export type CatalogWorkerToolName =
  | 'run_category_worker'
  | 'run_attribute_worker'
  | 'run_product_worker'
  | 'run_variation_worker';

export type WorkerRun = {
  agent: CatalogWorkerToolName;
  details?: string;
  status: WorkerResultStatus | 'invalid';
  task: string;
  toolRuns?: ToolRun[];
};
