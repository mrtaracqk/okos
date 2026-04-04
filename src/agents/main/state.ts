import { Annotation, type BaseCheckpointSaver } from '@langchain/langgraph';
import { type BaseMessage } from '@langchain/core/messages';
import { type CatalogDelegationResult } from '../catalog';
import { graphCheckpointer } from '../shared/checkpointing';

export const MainGraphStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (oldMessages, newMessages) => [...oldMessages, ...newMessages],
  }),
  chatId: Annotation<number>(),
  catalogDelegation: Annotation<CatalogDelegationResult | null>({
    reducer: (_oldValue, newValue) => newValue,
    default: () => null,
  }),
});

export type MainGraphState = typeof MainGraphStateAnnotation.State;

export type CreateMainGraphOptions = {
  checkpointer?: BaseCheckpointSaver | boolean;
  name?: string;
};

export const defaultMainGraphCheckpointer = graphCheckpointer;
