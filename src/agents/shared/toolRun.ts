export type ToolRun = {
  toolName: string;
  args: Record<string, unknown>;
  status: 'completed' | 'failed';
  structured: Record<string, unknown> | null;
  error?: {
    source?: string;
    message: string;
    code?: string;
    type?: string;
    retryable?: boolean;
  };
};
