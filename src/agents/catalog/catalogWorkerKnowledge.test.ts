import { describe, expect, test } from 'bun:test';
import {
  CATALOG_WORKER_ENTRIES,
  CATALOG_WORKER_KNOWLEDGE,
  PLAN_WORKER_OWNERS,
} from './catalogWorkerKnowledge';
import { resolveCatalogWorkerId } from './contracts/catalogWorkerId';

describe('catalogWorkerKnowledge', () => {
  test('entries align with plan owners and knowledge map', () => {
    expect(PLAN_WORKER_OWNERS.length === CATALOG_WORKER_ENTRIES.length).toBe(true);
    for (const entry of CATALOG_WORKER_ENTRIES) {
      expect(PLAN_WORKER_OWNERS.includes(entry.id)).toBe(true);
      expect(CATALOG_WORKER_KNOWLEDGE[entry.id].id).toBe(entry.id);
      expect(entry.ownershipRules.length).toBeGreaterThan(0);
      expect(entry.lookupRules.length).toBeGreaterThan(0);
      expect(entry.blockerRules.length).toBeGreaterThan(0);
    }
  });

  test('resolveCatalogWorkerId handles non-worker owners', () => {
    expect(resolveCatalogWorkerId('catalog-agent')).toBeUndefined();
    expect(resolveCatalogWorkerId('category-worker')).toBe('category-worker');
  });

  test('product and variation workers separate ownership, lookup and blocker rules for research mode', () => {
    expect(CATALOG_WORKER_KNOWLEDGE['product-worker'].ownershipRules).toContain(
      'При создании variable product можно сразу передать initial attributes/default_attributes в products_create, если taxonomy уже подтверждена.'
    );
    expect(CATALOG_WORKER_KNOWLEDGE['product-worker'].ownershipRules).toContain(
      'На уже существующем товаре attributes/default_attributes меняй только через products_append_attribute и products_remove_attribute, не через products_update.'
    );
    expect(CATALOG_WORKER_KNOWLEDGE['product-worker'].lookupRules).toContain(
      'Lookup нужен только чтобы снять неопределённость перед твоим действием; не превращай его в самостоятельный workflow по созданию taxonomy, категорий или variation.'
    );
    expect(CATALOG_WORKER_KNOWLEDGE['product-worker'].blockerRules).toContain(
      'Если конечный шаг относится к variation, а не к родительскому товару, верни blocker на variation-worker.'
    );
    expect(CATALOG_WORKER_KNOWLEDGE['variation-worker'].lookupRules).toContain(
      'Lookup нужен только для подтверждения родителя, variation id и attribute context; не превращай его в самостоятельный workflow по созданию родителя или taxonomy.'
    );
    expect(CATALOG_WORKER_KNOWLEDGE['variation-worker'].blockerRules).toContain(
      'Если родительский товар или нужная taxonomy отсутствуют и для продолжения их надо создать либо подготовить, верни blocker на product-worker или attribute-worker.'
    );
  });
});
