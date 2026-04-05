import { describe, expect, test } from 'bun:test';
import { getCatalogPlaybookIds, getCatalogPlaybookTemplate, renderPlaybookIndexForPrompt } from './index';

const PLAYBOOK_RUNTIME_MARKERS = [
  'catalog_execution_v3',
  'plan_update',
  'completed_step.worker_result',
  'next_step.tool',
  'report_worker_result',
  'finish_catalog_turn.summary',
];

describe('catalog playbook surface invariants', () => {
  test('prompt index renders one compact entry per known playbook', () => {
    const index = renderPlaybookIndexForPrompt();
    const ids = getCatalogPlaybookIds();

    expect(index.match(/^Playbook:/gm)?.length).toBe(ids.length);

    for (const id of ids) {
      expect(index).toContain(`Playbook: ${id}`);
      expect(index).toContain('Сводка:');
      expect(index).toContain('Порядок воркеров:');
    }
  });

  test('detailed playbooks render short decision templates without leaking runtime execution protocol', () => {
    for (const id of getCatalogPlaybookIds()) {
      const template = getCatalogPlaybookTemplate(id);

      expect(template).toBeDefined();
      expect(template).toContain(`Playbook: ${id}`);
      expect(template).toContain('Сводка:');
      expect(template).toContain('Порядок воркеров:');
      expect(template).toContain('Когда использовать:');
      expect(template).toContain('Сигналы входа:');
      expect(template).toContain('Скелет плана:');
      expect(template).toContain('Fallbacks:');
      expect(template).toContain('Готово когда:');

      for (const marker of PLAYBOOK_RUNTIME_MARKERS) {
        expect(template).not.toContain(marker);
      }
    }
  });

  test('playbooks stay concise and keep only scenario-specific skeletons', () => {
    const simpleProduct = getCatalogPlaybookTemplate('add-simple-product');
    const variableProduct = getCatalogPlaybookTemplate('add-variable-product');
    const variation = getCatalogPlaybookTemplate('add-product-variation');

    expect(simpleProduct).toContain(
      'Порядок воркеров: product-worker -> category-worker (fallback) -> product-worker (retry)'
    );
    expect(variableProduct).toContain(
      'Порядок воркеров: product-worker -> category-worker / attribute-worker (fallback) -> product-worker (retry) -> variation-worker'
    );
    expect(variation).toContain(
      'Порядок воркеров: variation-worker -> product-worker / attribute-worker (fallback) -> variation-worker (retry)'
    );

    for (const template of [simpleProduct, variableProduct, variation]) {
      expect(template).not.toContain('Канонические инструкции:');
      expect(template).not.toContain('Ожидаемый результат');
      expect(template).not.toContain('Принцип routing');
    }
  });
});
