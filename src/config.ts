import { type BindToolsInput } from '@langchain/core/language_models/chat_models';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI } from '@langchain/openai';
import { RedisService } from './services/redis';
import { createOpenAIChatModelConfigFromEnv } from './services/openAIChatModelConfig';

export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const redisService = new RedisService();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

type ModelProvider = 'google' | 'groq' | 'openai';
export const MODEL_PROVIDER = (process.env.MODEL_PROVIDER || 'openai') as ModelProvider;
export const MODEL_UTILITY_PROVIDER = (process.env.MODEL_UTILITY_PROVIDER || MODEL_PROVIDER) as ModelProvider;
export const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL?.trim() || undefined;

export const openAIChatModelConfig = createOpenAIChatModelConfigFromEnv();

type ChatModelInstance = ChatOpenAI | ChatGoogleGenerativeAI | ChatGroq;

function requireOpenAIApiKey(): string {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error('OPENAI_API_KEY is required in environment variables');
  }
  return key;
}

function requireOpenAIUtilityModelName(): string {
  const name = process.env.OPENAI_UTILITY_MODEL_NAME?.trim();
  if (!name) {
    throw new Error('OPENAI_UTILITY_MODEL_NAME is required in environment variables');
  }
  return name;
}

function createOpenAIModel(modelName: string, temperature: number) {
  return new ChatOpenAI({
    apiKey: requireOpenAIApiKey(),
    modelName,
    temperature,
    maxRetries: 3,
    supportsStrictToolCalling: false,
    ...(OPENAI_BASE_URL
      ? {
          configuration: {
            baseURL: OPENAI_BASE_URL,
          },
        }
      : {}),
  });
}

export function createOpenAITokenCounter(modelName = openAIChatModelConfig.getCurrentModelName()) {
  return new ChatOpenAI({
    apiKey: requireOpenAIApiKey(),
    modelName,
    ...(OPENAI_BASE_URL
      ? {
          configuration: {
            baseURL: OPENAI_BASE_URL,
          },
        }
      : {}),
  });
}

function createChatModel(type: 'chat' | 'utility') {
  const modelName = type === 'chat' ? openAIChatModelConfig.getCurrentModelName() : requireOpenAIUtilityModelName();
  const temperature = 0.3;

  return createOpenAIModel(modelName, temperature);
}

function getChatModelInstance() {
  return createChatModel('chat');
}

function getModelName(model: ChatModelInstance) {
  return 'modelName' in model ? model.modelName : model.model;
}

export const chatModel = {
  bindTools(tools: BindToolsInput[]) {
    return getChatModelInstance().bindTools(tools);
  },
  get provider() {
    return MODEL_PROVIDER;
  },
  get modelName() {
    return getModelName(getChatModelInstance());
  },
  get model() {
    return getModelName(getChatModelInstance());
  },
};
export const classifierModel = createChatModel('utility');

export const CHAT_CONFIG = {
  messagesToKeep: 20, // Number of recent messages to keep in context
  messageCooldownSeconds: 3,
} as const;

export const QUEUE_CONFIG = {
  maxJobsPerUser: 1, // Only 1 job at a time per user
  jobsPer5Seconds: 1, // Rate limit per user
  retryAttempts: 3, // Number of retry attempts for failed jobs
  removeOnComplete: true, // Remove completed jobs
  removeOnFail: 100, // Keep the last 100 failed jobs
} as const;

export const STICKER = {
  CALM_DOWN: ['CAACAgEAAxkBAAOMZ1-PTzHWqvt_DRwwUxlL-oBtLE4AAs8BAAI4DoIRnu4VKzeS-Og2BA'],
  WRITING: ['CAACAgIAAxkBAAOSZ1-RSUrBUu3yQVTPY2eSVpxjQfEAAscKAAL8ZQFK3xJDDRnCQEE2BA'],
  WAIT: [
    'CAACAgIAAxkBAAOUZ1-RvLfRDcMh9_KjpGr8q_uyU30AAiwAAyRxYhrFIOYD73j85DYE',
    'CAACAgEAAxkBAAICFWdiTp_D2k3ECqJHkpaD777pvLVUAAIDAwAC54zYRtJM1QZbUVMyNgQ',
  ],
  SEARCHING: [
    'CAACAgIAAxkBAAIBU2dgEbkFtLnf4or-dlN5C5pCjWDtAAJWAAMNttIZ3DOhnyotnbI2BA',
    'CAACAgIAAxkBAAICDGdiTZEtMhBguqreSW-UZFnmAAFMjgAC-BIAAlo16Uhs4hFMpJkFTjYE',
    'CAACAgIAAxkBAAICDmdiTcG5Uhr_eicBbOO8FK4mkVNPAALHCwACQGeYSn4PPWF3xE_4NgQ',
    'CAACAgIAAxkBAAICEWdiTfRpQ3hKcY_GKnGZQtFBFKSTAAIsFAAClguISc28MED3qvgaNgQ',
    'CAACAgIAAxkBAAICE2diTfim7FTOkFw_DzldrkudHoi7AAIlDwACS5ORSOscHL4fo5kKNgQ',
  ],
};
