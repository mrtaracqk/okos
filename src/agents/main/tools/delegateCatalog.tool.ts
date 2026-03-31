import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const catalogDelegationRequestSchema = z.object({
  goal: z.string().min(1).describe('Цель запроса по каталогу.'),
  facts: z.array(z.string().min(1)).default([]).describe('Известные данные, релевантные запросу.'),
  constraints: z.array(z.string()).default([]).describe('Ограничения или условия.'),
  desiredOutcome: z.string().min(1).describe('Желаемый результат для пользователя.'),
});

/**
 * Схема и описание для `bindTools`: модель вызывает тул, а исполнение делает узел
 * `catalogAgent` в `main.graph` (подграф + форматирование), не `tool.invoke`.
 */
export const delegateCatalogTool = tool(
  async () => {
    throw new Error(
      'delegate_to_catalog_agent: execution is handled by main graph catalogAgent node, not tool.invoke.'
    );
  },
  {
    name: 'delegate_to_catalog_agent',
    description:
      'Передай связанный с каталогом запрос пользователя в catalog-agent для выполнения задачи. Укажи цель, известные данные, ограничения и желаемый результат.',
    schema: catalogDelegationRequestSchema,
  }
);
