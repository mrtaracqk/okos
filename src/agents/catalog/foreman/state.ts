import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import { type WorkerRun } from '../contracts/workerRun';
import { type WorkerResultEnvelope } from '../contracts/workerResult';

export type CatalogForemanRoute = 'dispatchTools' | 'plannerLimitFallback' | 'finalize';

/** Initial delegation context; set once from the first user message. */
export type CatalogRequestContext = {
  initialPrompt: string;
};

export const CatalogGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  workerRuns: Annotation<WorkerRun[]>({
    reducer: (_, newWorkerRuns) => newWorkerRuns,
    default: () => [],
  }),
  /** Last worker result envelope (source of truth for planner decisions). */
  latestWorkerResult: Annotation<WorkerResultEnvelope | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
  /** Artifacts collected from all worker runs. */
  workerArtifacts: Annotation<unknown[]>({
    reducer: (_, newValue) => newValue,
    default: () => [],
  }),
  /** Initial request context; set once at first planner turn. */
  requestContext: Annotation<CatalogRequestContext | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
  plannerIteration: Annotation<number>({
    reducer: (_, newValue) => newValue,
    default: () => 0,
  }),
  pendingToolCalls: Annotation<any[]>({
    reducer: (_, newValue) => newValue,
    default: () => [],
  }),
  nextRoute: Annotation<CatalogForemanRoute>({
    reducer: (_, newValue) => newValue,
    default: () => 'finalize',
  }),
  finalizeOutcome: Annotation<'failed' | 'abandoned' | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
  fatalErrorMessage: Annotation<string | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
});
