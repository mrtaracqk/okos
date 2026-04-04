import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import { type WorkerRun } from '../../contracts/workerRun';
import { type CatalogExecutionResult } from '../executionResult';
import { type CatalogToolCall } from '../tools/types';

export type CatalogPlannerRoute = 'dispatchTools' | 'plannerLimitFallback' | 'finalize';
export type CatalogPostDispatchRoute = 'planner' | 'finalize';
export type CatalogForemanRoute = CatalogPlannerRoute | CatalogPostDispatchRoute;

export const CatalogGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  workerRuns: Annotation<WorkerRun[]>({
    reducer: (_, newWorkerRuns) => newWorkerRuns,
    default: () => [],
  }),
  // Authoritative execution state for any active runtime plan. Active plan without this result is a protocol error.
  activeExecutionResult: Annotation<CatalogExecutionResult | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
  plannerIteration: Annotation<number>({
    reducer: (_, newValue) => newValue,
    default: () => 0,
  }),
  pendingToolCalls: Annotation<CatalogToolCall[]>({
    reducer: (_, newValue) => newValue,
    default: () => [],
  }),
  nextRoute: Annotation<CatalogForemanRoute>({
    reducer: (_, newValue) => newValue,
    default: () => 'finalize',
  }),
  finalizeOutcome: Annotation<'completed' | 'failed' | 'abandoned' | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
  fatalErrorMessage: Annotation<string | null>({
    reducer: (_, newValue) => newValue,
    default: () => null,
  }),
});

export type CatalogGraphState = typeof CatalogGraphStateAnnotation.State;
