const OPENAI_PROVIDER_PREFIX = /^openai\//i;

export function normalizeOpenAIChatModelName(modelName: string): string {
  return modelName.trim().replace(OPENAI_PROVIDER_PREFIX, '').trim();
}

export class OpenAIChatModelConfig {
  private readonly defaultModelName: string;
  private currentModelName: string;

  constructor(defaultModelName: string) {
    const normalizedDefaultModelName = normalizeOpenAIChatModelName(defaultModelName);
    if (!normalizedDefaultModelName) {
      throw new Error('OPENAI_MODEL_NAME is invalid or empty after normalization');
    }
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
      throw new Error('Имя модели не задано после нормализации.');
    }

    this.currentModelName = normalizedModelName;
    return this.currentModelName;
  }
}

export function createOpenAIChatModelConfigFromEnv(): OpenAIChatModelConfig {
  const raw = process.env.OPENAI_MODEL_NAME?.trim();
  if (!raw) {
    throw new Error('OPENAI_MODEL_NAME is required in environment variables');
  }
  return new OpenAIChatModelConfig(raw);
}
