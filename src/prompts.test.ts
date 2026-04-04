import { describe, expect, test } from 'bun:test';
import { getCatalogWorkerPrompt, PROMPTS } from './prompts';
import { getCatalogWorkerRuntimeTools } from './agents/catalog/specialists/specs';

describe('catalog prompts stage 4-5', () => {
  test('tells foreman to start with the final owner and keep lookup inside owner steps', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('playbooks');

    expect(prompt).toContain(
      'Для create/update товара или variation сначала планируй owner-а этого конечного действия'
    );
    expect(prompt).toContain('если конечный шаг — создать товар или обновить его categories, сначала product-worker');
    expect(prompt).toContain('Если конечный шаг — создать, найти или обновить конкретную variation, сначала variation-worker');
    expect(prompt).toContain('Не разбивай её на микрошаги вроде «найди category_id»');
    expect(prompt).toContain('**Artifacts** из последнего успешного шага runtime может передать только в **следующий** шаг как `upstreamArtifacts`.');
    expect(prompt).toContain('planContext');
    expect(prompt).toContain('catalog_execution_v3');
    expect(prompt).toContain('next_step.tool');
    expect(prompt).toContain('completed_step.highlights');
    expect(prompt).toContain('plan_update');
    expect(prompt).not.toContain('structured payload WORKER_RESULT');
  });

  test('renders product-worker prompt with explicit ownership, lookup and blocker guardrails', () => {
    const prompt = getCatalogWorkerPrompt(
      'product-worker',
      getCatalogWorkerRuntimeTools('product-worker').map((tool) => tool.name)
    );

    expect(prompt).toContain(
      'При создании variable product можно сразу передать initial attributes/default_attributes в products_create, если taxonomy уже подтверждена.'
    );
    expect(prompt).toContain(
      'На уже существующем товаре attributes/default_attributes меняй только через products_append_attribute и products_remove_attribute, не через products_update.'
    );
    expect(prompt).toContain(
      'Рабочий порядок: 1) если входа уже достаточно, выполняй свой шаг; 2) если не хватает только подтверждения id/сущности'
    );
    expect(prompt).toContain('Если во входе есть `upstreamArtifacts`, считай их machine-readable контекстом от предыдущего шага');
    expect(prompt).toContain('Lookup не раскрывай в отдельный workflow по созданию taxonomy, категорий, parent product или variation.');
    expect(prompt).toContain('## Зона Ответственности');
    expect(prompt).toContain('## Lookup И Research');
    expect(prompt).toContain('## Когда Вернуть Blocker Или Failed');
  });

  test('renders variation-worker prompt with anti-loop lookup wording', () => {
    const prompt = getCatalogWorkerPrompt(
      'variation-worker',
      getCatalogWorkerRuntimeTools('variation-worker').map((tool) => tool.name)
    );

    expect(prompt).toContain('если после 1-2 точечных lookup неопределённость не снята, не зацикливайся');
    expect(prompt).toContain('Lookup нужен только для подтверждения родителя, variation id и attribute context');
    expect(prompt).toContain('Если конечный шаг относится к родительскому товару, а не к variation, верни blocker на product-worker.');
  });

  test('cleans up the foreman consultation wording about site admin fallback', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('playbooks');

    expect(prompt).toContain('В ответе опирайся на свои возможности и возможности команды.');
    expect(prompt).toContain(
      'Не отправляй пользователя в админку сайта по умолчанию. Исключения: пользователь явно спрашивает именно про сайт или ты точно знаешь, что команда это не умеет.'
    );
  });

  test('tells foreman to resolve human wording and fuzzy entity names on its own', () => {
    const prompt = PROMPTS.CATALOG_AGENT.SYSTEM('playbooks');

    expect(prompt).toContain('### Неточные пользовательские формулировки');
    expect(prompt).toContain(
      'Пользователь часто формулирует запрос по-человечески: без id, с неполными или неточными названиями, не зная технических особенностей.'
    );
    expect(prompt).toContain('Считай это нормой и сам выясняй нужные сущности по контексту и через доступные lookup/read.');
    expect(prompt).toContain('Пользователь прислал ссылку на товар вместо id');
    expect(prompt).toContain('Пользователь написал неточный термин или бытовое название сущности');
  });
});
