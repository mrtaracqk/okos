import { describe, expect, test } from 'bun:test';
import { getCatalogWorkerPrompt, PROMPTS } from './prompts';
import { CATALOG_SPECIALIST_SPECS } from './agents/catalog/specialists/specs';

function expectAll(text: string, snippets: string[]) {
  for (const snippet of snippets) {
    expect(text).toContain(snippet);
  }
}

function expectNone(text: string, snippets: string[]) {
  for (const snippet of snippets) {
    expect(text).not.toContain(snippet);
  }
}

describe('catalog prompt surface invariants', () => {
  test('foreman prompt is assembled from compact operational sections and policy helpers', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('Playbook: demo');

    expectAll(prompt, [
      '## Роль',
      '## Общие правила',
      '## Зона и границы',
      '## Routing Policy',
      '## Консультации',
      '## Возможности воркеров (инструменты)',
      '## Схема каталога',
      '## Рабочий порядок',
      '## Перепланирование',
      '## Playbook',
      '## Итог',
      'catalog_execution_v3',
      'plan_update',
      'completed_step.worker_result',
      'next_step.tool',
    ]);

    expectNone(prompt, [
      '**Дата и время:**',
      '## Слой данных и что делать после шага воркера',
      '## План: `new_execution_plan`, `approve_step`, `finish_execution_plan`',
      '## Делегирование воркерам',
      '### Поведение',
      '### Неточные пользовательские формулировки',
    ]);
  });

  test('foreman prompt marks worker_result as canonical runtime result', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('Playbook: demo');

    expect(prompt).toContain('`completed_step.worker_result` — канонический structured result последнего шага');
    expect(prompt).toContain('если `completed_step.worker_result=null`, используй `completed_step.protocol_error`');
    expect(prompt).not.toContain('`completed_step.highlights`');
  });

  test('worker prompts keep only the operating contract and do not embed foreman orchestration surfaces', () => {
    for (const spec of CATALOG_SPECIALIST_SPECS) {
      const prompt = getCatalogWorkerPrompt(spec.id);

      expectAll(prompt, [
        `Ты — **${spec.id}**`,
        '## Роль',
        '## Результат',
        '## Рабочий протокол',
        '## Общие правила tools',
        '## Зона ответственности',
        '## Порядок действий',
        '## Использование tools',
        '## Консультации',
        '## Blockers и завершение',
        '## Формат завершения',
        'report_worker_result',
      ]);

      expect(prompt).toContain(spec.worker.responsibility[0] ?? '');
      expect(prompt).toContain(spec.worker.toolUsage[0] ?? '');
      expect(prompt).toContain(spec.foreman.consultationSummary?.[0] ?? '');
      expect(prompt).not.toContain('**Дата и время:**');
      expect(prompt).toContain('Для выполнения шага используй доступные тебе tools;');

      expectNone(prompt, [
        'catalog_execution_v3',
        'plan_update',
        'next_step.tool',
        'inspect_catalog_playbook',
        'finish_execution_plan.summary',
        'Playbook:',
        '## Вход задачи',
        '## Как работать',
        '## Итог шага',
        '## Lookup И Research',
      ]);
    }
  });
});
