import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getCatalogPlaybookIds, getCatalogPlaybookInstructions } from '../playbooks';

export const inspectCatalogPlaybookTool = tool(
  async ({ playbookId }: { playbookId: string }) => {
    const instructions = getCatalogPlaybookInstructions(playbookId);

    if (!instructions) {
      return `Неизвестный playbook "${playbookId}". Доступные playbook: ${getCatalogPlaybookIds().join(', ')}`;
    }

    return instructions;
  },
  {
    name: 'inspect_catalog_playbook',
    description: 'Загрузи полные инструкции конкретного catalog playbook, когда нужны детали исполнения.',
    schema: z.object({
      playbookId: z.enum(getCatalogPlaybookIds() as [string, ...string[]]).describe('ID catalog playbook для просмотра.'),
    }),
  }
);
