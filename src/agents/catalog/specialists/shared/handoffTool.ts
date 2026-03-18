import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const workerHandoffDescription = 'Это graph handoff-инструмент. Внешний граф направляет вызов нужному воркеру.';

const workerHandoffSchema = z.object({
  mode: z
    .enum(['execute', 'consult'])
    .optional()
    .describe('Режим: execute — действие/чтение в зоне воркера, consult — консультационный ответ.'),
  objective: z
    .string()
    .describe('Локальная задача в зоне ответственности воркера. Не описывай общую цель и шаги других агентов.'),
  facts: z
    .string()
    .optional()
    .describe('Факты, идентификаторы и входные значения для выполнения. Можно несколькими строками.'),
  constraints: z
    .string()
    .optional()
    .describe('Ограничения или условия, которые воркер должен учесть.'),
  expectedOutput: z
    .string()
    .describe('Что именно вернуть: поля и формат. Без рекомендаций и инициативы.'),
  contextNotes: z
    .string()
    .optional()
    .describe('Краткая причина, зачем этот шаг сейчас. Без описания всего плана.'),
});

export function createCatalogWorkerHandoffTool(name: string, description: string) {
  return tool(async () => workerHandoffDescription, {
    name,
    description,
    schema: workerHandoffSchema,
  });
}
