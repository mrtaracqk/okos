import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import { type WorkerRun } from '../contracts/workerRun';

export type CatalogForemanRoute = 'dispatchTools' | 'plannerLimitFallback' | 'finalize';

export const CatalogGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  workerRuns: Annotation<WorkerRun[]>({
    reducer: (_, newWorkerRuns) => newWorkerRuns,
    default: () => [],
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
