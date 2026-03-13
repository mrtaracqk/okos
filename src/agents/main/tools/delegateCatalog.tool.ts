import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { runCatalogAgent } from '../../catalog/catalog.agent';

export const delegateCatalogTool = tool(
  async ({ userRequest }: { userRequest: string }) => {
    return runCatalogAgent(userRequest);
  },
  {
    name: 'delegate_to_catalog_agent',
    description:
      'Send a catalog-related user request to the catalog-agent for playbook selection, worker orchestration, and WooCommerce catalog execution.',
    schema: z.object({
      userRequest: z.string().describe('The catalog-related user request that should be executed by the catalog-agent.'),
    }),
  }
);
