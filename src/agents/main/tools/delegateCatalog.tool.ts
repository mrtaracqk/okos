import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { runCatalogAgent } from '../../catalog';

export const delegateCatalogTool = tool(
  async ({ userRequest }: { userRequest: string }) => {
    return runCatalogAgent(userRequest);
  },
  {
    name: 'delegate_to_catalog_agent',
    description:
      'Передай связанный с каталогом запрос пользователя в catalog-agent: либо для фактического выполнения, либо для консультации о возможностях агентов, необходимых входных данных и сценариях по playbook.',
    schema: z.object({
      userRequest: z.string().describe('Запрос пользователя по каталогу, который должен обработать catalog-agent.'),
    }),
  }
);
