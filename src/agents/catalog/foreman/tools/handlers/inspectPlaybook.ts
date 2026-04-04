import {
  buildTraceAttributes,
  formatTraceText,
  runToolSpan,
} from '../../../../../observability/traceContext';
import {
  inspectCatalogPlaybookInputSchema,
  inspectCatalogPlaybookTool,
} from '../definitions/inspectPlaybookTool';
import { toolReply } from '../protocol';
import { type CatalogToolCall, type CatalogToolExecutionResult } from '../types';

export async function handleInspectPlaybookToolCall(toolCall: CatalogToolCall): Promise<CatalogToolExecutionResult> {
  const parsedArgs = inspectCatalogPlaybookInputSchema.safeParse(toolCall.args ?? {});
  const playbookId = parsedArgs.success ? parsedArgs.data.playbookId : '';

  return runToolSpan(
    'catalog_agent.inspect_playbook',
    async () => {
      if (!parsedArgs.success) {
        return {
          toolMessage: toolReply(
            toolCall,
            `Сбой inspect_catalog_playbook: ${parsedArgs.error.issues[0]?.message ?? 'некорректные аргументы.'}`
          ),
        };
      }

      const content = await inspectCatalogPlaybookTool.invoke({ playbookId });
      return {
        toolMessage: toolReply(toolCall, typeof content === 'string' ? content : JSON.stringify(content)),
      };
    },
    {
      attributes: buildTraceAttributes({
        'catalog.playbook_id': playbookId || '(empty)',
      }),
      mapResultAttributes: ({ toolMessage }) =>
        buildTraceAttributes({
          'output.value': formatTraceText(toolMessage.content, 1000),
        }),
      statusMessage: () => (!parsedArgs.success ? 'invalid inspect_catalog_playbook arguments' : undefined),
    }
  );
}
