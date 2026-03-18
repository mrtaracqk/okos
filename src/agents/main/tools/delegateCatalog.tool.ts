import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { runCatalogAgent } from '../../catalog';
import { renderCatalogDelegationRequestToPrompt } from '../catalogDelegation';
import type { CatalogDelegationRequest } from '../catalogDelegation';

const catalogDelegationRequestSchema = z.object({
  requestKind: z.string().trim().optional().describe('Тип запроса (например: консультация, выполнение).'),
  goal: z.string().min(1).describe('Цель запроса по каталогу.'),
  facts: z.array(z.string().min(1)).default([]).describe('Известные данные, релевантные запросу.'),
  constraints: z.array(z.string()).default([]).describe('Ограничения или условия.'),
  desiredOutcome: z.string().min(1).describe('Желаемый результат для пользователя.'),
});

export const delegateCatalogTool = tool(
  async (args: z.infer<typeof catalogDelegationRequestSchema>) => {
    const request: CatalogDelegationRequest = {
      requestKind: args.requestKind,
      goal: args.goal,
      facts: args.facts ?? [],
      constraints: args.constraints ?? [],
      desiredOutcome: args.desiredOutcome,
    };
    const prompt = renderCatalogDelegationRequestToPrompt(request);
    return runCatalogAgent(prompt);
  },
  {
    name: 'delegate_to_catalog_agent',
    description:
      'Передай связанный с каталогом запрос пользователя в catalog-agent: либо для фактического выполнения, либо для консультации о возможностях агентов, необходимых входных данных и сценариях по playbook. Укажи цель, известные данные, ограничения и желаемый результат.',
    schema: catalogDelegationRequestSchema,
  }
);
