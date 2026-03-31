export const SET_MODEL_CHAT_PRESETS = ['gpt-5.3-chat', 'gpt-5.4-mini', 'gpt-5.4'] as const;

const CALLBACK_PREFIX_MODEL = 'sm:m:';

export function parseSetModelModelCallbackData(data: string | undefined): string | null {
  if (!data?.startsWith(CALLBACK_PREFIX_MODEL)) {
    return null;
  }
  const model = data.slice(CALLBACK_PREFIX_MODEL.length);
  return SET_MODEL_CHAT_PRESETS.includes(model as (typeof SET_MODEL_CHAT_PRESETS)[number]) ? model : null;
}

export function buildSetModelModelCallbackData(model: (typeof SET_MODEL_CHAT_PRESETS)[number]): string {
  return `${CALLBACK_PREFIX_MODEL}${model}`;
}
