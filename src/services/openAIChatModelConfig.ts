const DEFAULT_OPENAI_CHAT_MODEL_NAME = 'gpt-4o';
const OPENAI_PROVIDER_PREFIX = /^openai\//i;

export function normalizeOpenAIChatModelName(modelName: string): string {
  return modelName.trim().replace(OPENAI_PROVIDER_PREFIX, '').trim();
}

export class OpenAIChatModelConfig {
  private readonly defaultModelName: string;
  private currentModelName: string;

  constructor(defaultModelName = process.env.OPENAI_MODEL_NAME || DEFAULT_OPENAI_CHAT_MODEL_NAME) {
    const normalizedDefaultModelName = normalizeOpenAIChatModelName(defaultModelName) || DEFAULT_OPENAI_CHAT_MODEL_NAME;
    this.defaultModelName = normalizedDefaultModelName;
    this.currentModelName = normalizedDefaultModelName;
  }

  getDefaultModelName() {
    return this.defaultModelName;
  }

  getCurrentModelName() {
    return this.currentModelName;
  }

  setCurrentModelName(modelName: string) {
    const normalizedModelName = normalizeOpenAIChatModelName(modelName);
    if (!normalizedModelName) {
      throw new Error('Имя модели не задано. Использование: /set_model <model>');
    }

    this.currentModelName = normalizedModelName;
    return this.currentModelName;
  }
}

export const openAIChatModelConfig = new OpenAIChatModelConfig();
