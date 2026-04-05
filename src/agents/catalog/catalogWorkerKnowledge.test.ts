import { describe, expect, test } from 'bun:test';
import {
  CATALOG_FOREMAN_SPECIALIST_SUMMARIES,
  CATALOG_WORKER_CONTRACTS,
  CATALOG_WORKER_ENTRIES,
} from './specialists/specs';
import { CATALOG_WORKER_IDS, resolveCatalogWorkerId } from '../../contracts/catalogExecutionOwners';

describe('catalogWorkerContracts', () => {
  test('entries align with plan owners and contract map', () => {
    expect(CATALOG_WORKER_IDS.length === CATALOG_WORKER_ENTRIES.length).toBe(true);
    for (const entry of CATALOG_WORKER_ENTRIES) {
      expect(CATALOG_WORKER_IDS.includes(entry.id)).toBe(true);
      expect(CATALOG_WORKER_CONTRACTS[entry.id].id).toBe(entry.id);
      expect(entry.responsibility.length).toBeGreaterThan(0);
      expect(entry.toolUsage.length).toBeGreaterThan(0);
      expect(entry.blockerRules.length).toBeGreaterThan(0);
      expect(CATALOG_FOREMAN_SPECIALIST_SUMMARIES[entry.id].routingSummary.length).toBeGreaterThan(0);
    }
  });

  test('resolveCatalogWorkerId handles non-worker owners', () => {
    expect(resolveCatalogWorkerId('catalog-agent')).toBeUndefined();
    expect(resolveCatalogWorkerId('category-worker')).toBe('category-worker');
  });

  test('product and variation workers separate responsibility, tool usage and blocker rules for research mode', () => {
    expect(CATALOG_WORKER_CONTRACTS['product-worker'].workflow).toContain(
      'При создании variable product можно сразу передать initial attributes/default_attributes в products_create, если taxonomy уже подтверждена.'
    );
    expect(CATALOG_WORKER_CONTRACTS['product-worker'].workflow).toContain(
      'На уже существующем товаре attributes/default_attributes меняй только через products_append_attribute и products_remove_attribute, не через products_update.'
    );
    expect(CATALOG_WORKER_CONTRACTS['product-worker'].toolUsage).toContain(
      'Если во входе есть permalink или URL товара, передавай url в products_list: tool сам извлечёт slug и выполнит точный lookup по slug.'
    );
    expect(CATALOG_WORKER_CONTRACTS['product-worker'].toolUsage).toContain(
      'Lookup нужен только чтобы снять неопределённость перед твоим действием; не превращай его в самостоятельный workflow по созданию taxonomy, категорий или variation.'
    );
    expect(CATALOG_WORKER_CONTRACTS['product-worker'].blockerRules).toContain(
      'Если конечный шаг относится к variation, а не к родительскому товару, верни blocker на variation-worker.'
    );
    expect(CATALOG_WORKER_CONTRACTS['variation-worker'].toolUsage).toContain(
      'Lookup нужен только для подтверждения родителя, variation id и attribute context; не превращай его в самостоятельный workflow по созданию родителя или taxonomy.'
    );
    expect(CATALOG_WORKER_CONTRACTS['variation-worker'].blockerRules).toContain(
      'Если родительский товар или нужная taxonomy отсутствуют и для продолжения их надо создать либо подготовить, верни blocker на product-worker или attribute-worker.'
    );
    expect(CATALOG_FOREMAN_SPECIALIST_SUMMARIES['variation-worker'].routingSummary).toContain(
      'Изменения родительского товара ведёт product-worker; если для variation не хватает родителя или глобальной taxonomy, сначала вызывается product-worker или attribute-worker.'
    );
  });
});
