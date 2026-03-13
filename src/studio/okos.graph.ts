import { createMainGraph } from '../agents/main/graphs/main.graph';
import { graphCheckpointer } from '../agents/shared/checkpointing';
import { noopMainGraphProgressReporter } from '../agents/main/progress';

export const studioGraph = createMainGraph({
  checkpointer: graphCheckpointer,
  name: 'Okos Studio Graph',
  progressReporter: noopMainGraphProgressReporter,
});
