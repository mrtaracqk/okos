import { describe, expect, test } from 'bun:test';
import { getWooCommerceTransportService } from '../../../../services/woocommerceTransport';
import { createGeneratedTransportTools } from './generatedTransportTools';

describe('createGeneratedTransportTools', () => {
  test('uses response truncation by default and lets tools disable it explicitly', async () => {
    const transportService = getWooCommerceTransportService() as {
      callTool: (
        name: string,
        args: Record<string, unknown>,
        options?: { truncateResponse?: boolean }
      ) => Promise<unknown>;
    };
    const originalCallTool = transportService.callTool;
    const calls: Array<{
      name: string;
      args: Record<string, unknown>;
      options?: { truncateResponse?: boolean };
    }> = [];

    transportService.callTool = async (name, args, options) => {
      calls.push({ name, args, options });
      return {
        ok: true,
        tool: name,
        text: 'ok',
        structured: null,
        content: [],
      };
    };

    try {
      const tools = createGeneratedTransportTools('product-worker');
      const listProductsTool = tools.find((tool) => tool.actualToolName === 'wc.v3.products_list') as
        | { invoke: (args: Record<string, unknown>) => Promise<unknown> }
        | undefined;

      expect(listProductsTool).toBeDefined();

      await listProductsTool!.invoke({});
      await listProductsTool!.invoke({
        disableResponseTruncation: true,
      });

      expect(calls).toHaveLength(2);
      expect(calls[0]).toEqual({
        name: 'wc.v3.products_list',
        args: {},
        options: { truncateResponse: true },
      });
      expect(calls[1]).toEqual({
        name: 'wc.v3.products_list',
        args: {},
        options: { truncateResponse: false },
      });
    } finally {
      transportService.callTool = originalCallTool;
    }
  });
});
