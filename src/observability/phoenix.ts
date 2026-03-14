import { register } from '@arizeai/phoenix-otel';
import { LangChainInstrumentation } from '@arizeai/openinference-instrumentation-langchain';
import * as CallbackManagerModule from '@langchain/core/callbacks/manager';

let initialized = false;

function isBunRuntime() {
  return typeof Bun !== 'undefined' || typeof process.versions?.bun === 'string';
}

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}

export function isPhoenixTracingEnabled() {
  return process.env.PHOENIX_ENABLED === 'true';
}

export function initPhoenix() {
  if (initialized || !isPhoenixTracingEnabled()) {
    return initialized;
  }

  try {
    register({
      projectName: process.env.PHOENIX_PROJECT_NAME?.trim() || 'op-bot-local',
      url: process.env.PHOENIX_COLLECTOR_ENDPOINT?.trim() || 'http://localhost:6006',
      batch: process.env.NODE_ENV === 'production',
    });

    initialized = true;
  } catch (error) {
    console.error('Failed to initialize Phoenix tracing exporter:', formatErrorMessage(error));
    return initialized;
  }

  if (isBunRuntime()) {
    console.log(
      'Phoenix tracing is enabled. LangChain auto-instrumentation is skipped under Bun; manual spans remain active.'
    );
    return initialized;
  }

  try {
    const instrumentation = new LangChainInstrumentation();
    instrumentation.manuallyInstrument(CallbackManagerModule);
    console.log('Phoenix tracing is enabled.');
  } catch (error) {
    console.warn(
      'Phoenix tracing exporter is enabled, but LangChain auto-instrumentation was skipped:',
      formatErrorMessage(error)
    );
  }

  return initialized;
}

initPhoenix();
