import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { getCatalogPlaybookIds, getCatalogPlaybookTemplate } from '../../../playbooks';

const catalogPlaybookIdSchema = z.enum(getCatalogPlaybookIds() as [string, ...string[]]);

export const inspectCatalogPlaybookInputSchema = z.object({
  playbookId: catalogPlaybookIdSchema.describe('ID catalog playbook для просмотра.'),
});

export const inspectCatalogPlaybookTool = tool(
  async ({ playbookId }: { playbookId: string }) => {
    const normalizedPlaybookId = playbookId.trim();
    const template = getCatalogPlaybookTemplate(normalizedPlaybookId);

    if (!template) {
      return `Неизвестный playbook "${normalizedPlaybookId}". Доступные playbook: ${getCatalogPlaybookIds().join(', ')}`;
    }

    return template;
  },
  {
    name: 'inspect_catalog_playbook',
    description: 'Вернуть короткий decision template конкретного catalog playbook по `playbookId`.',
    schema: inspectCatalogPlaybookInputSchema,
  }
);
