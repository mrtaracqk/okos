import { describe, expect, test } from 'bun:test';
import { z } from 'zod';
import { createWooTool, modelSafeName } from '../../../../../services/woo/createWooTool';

describe('createWooTool', () => {
  test('modelSafeName replaces dots with underscores', () => {
    expect(modelSafeName('wc.v3.products_list')).toBe('wc_v3_products_list');
  });

  test('createWooTool returns tool with actualToolName and model-safe name', () => {
    const t = createWooTool({
      name: 'wc.v3.test_tool',
      description: 'Test.',
      requiresApproval: false,
      schema: z.object({}),
      run: async () => ({ ok: true }),
    });
    expect(t.name).toBe('wc_v3_test_tool');
    expect((t as { actualToolName: string }).actualToolName).toBe('wc.v3.test_tool');
  });

});
