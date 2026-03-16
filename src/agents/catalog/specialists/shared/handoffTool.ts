import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const workerHandoffDescription = 'Это graph handoff-инструмент. Внешний граф направляет вызов нужному воркеру.';

const workerHandoffSchema = z.object({
  mode: z
    .enum(['execute', 'consult'])
    .optional()
    .describe('Режим локальной задачи: "execute" для фактического действия или чтения данных, "consult" для консультационного ответа в зоне воркера.'),
  whatToDo: z
    .string()
    .describe('Только локальное действие в зоне ответственности воркера. Не описывай общую цель и следующие шаги других агентов.'),
  dataForExecution: z
    .string()
    .optional()
    .describe('Все факты, идентификаторы и входные значения, нужные воркеру для выполнения.'),
  whyNow: z
    .string()
    .describe('Короткая причина, зачем нужен именно этот шаг сейчас. Без описания всего плана.'),
  whatToReturn: z
    .string()
    .describe('Определи, какие поля и в каком формате воркер должен вернуть. Без рекомендаций и инициативы.'),
});

export function createCatalogWorkerHandoffTool(name: string, description: string) {
  return tool(async () => workerHandoffDescription, {
    name,
    description,
    schema: workerHandoffSchema,
  });
}
