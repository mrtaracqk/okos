import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getCatalogPlaybookIds, getCatalogPlaybookInstructions } from '../../../playbooks';

const catalogPlaybookIdSchema = z.enum(getCatalogPlaybookIds() as [string, ...string[]]);

export const inspectCatalogPlaybookInputSchema = z.object({
  playbookId: catalogPlaybookIdSchema.describe('ID catalog playbook для просмотра.'),
});

export const inspectCatalogPlaybookTool = tool(
  async ({ playbookId }: { playbookId: string }) => {
    const normalizedPlaybookId = playbookId.trim();
    const instructions = getCatalogPlaybookInstructions(normalizedPlaybookId);

    if (!instructions) {
      return `Неизвестный playbook "${normalizedPlaybookId}". Доступные playbook: ${getCatalogPlaybookIds().join(', ')}`;
    }

    return instructions;
  },
  {
    name: 'inspect_catalog_playbook',
    description: 'Загрузи полные инструкции конкретного catalog playbook, когда нужны детали исполнения.',
    schema: inspectCatalogPlaybookInputSchema,
  }
);
