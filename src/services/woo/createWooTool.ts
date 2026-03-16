import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import type { WooClient } from '../woo-sdk/src/client';
import { executeWooTool } from './wooToolExecutor';

export function modelSafeName(name: string): string {
  return name.replace(/\./g, '_');
}

export type CreateWooToolSpec<T> = {
  name: string;
  description: string;
  schema: z.ZodType<T>;
  requiresApproval: boolean;
  run: (input: T, ctx: { client: WooClient }) => Promise<unknown>;
};

export type WooTool = ReturnType<typeof tool> & { actualToolName: string };

export function createWooTool<T>(spec: CreateWooToolSpec<T>): WooTool {
  const safeName = modelSafeName(spec.name);

  const wooTool = tool(
    async (rawArgs: Record<string, unknown>) => {
      const parsed = spec.schema.safeParse(rawArgs ?? {});
      if (!parsed.success) {
        return {
          ok: false as const,
          tool: spec.name,
          text: parsed.error.message,
          structured: null,
          content: [],
          error: {
            source: 'woo-tool' as const,
            message: parsed.error.message,
            retryable: false,
          },
        };
      }

      return executeWooTool({
        toolName: spec.name,
        args: parsed.data as Record<string, unknown>,
        requiresApproval: spec.requiresApproval,
        run: (client) => spec.run(parsed.data as T, { client }),
      });
    },
    {
      name: safeName,
      description: spec.description,
      schema: spec.schema,
    }
  );

  return Object.assign(wooTool, { actualToolName: spec.name }) as WooTool;
}
