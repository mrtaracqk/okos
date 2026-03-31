import { describe, expect, test } from 'bun:test';
import { parseWpCollectionHeaders } from './wpCollectionHeaders';

describe('parseWpCollectionHeaders', () => {
  test('reads X-WP-Total and X-WP-TotalPages', () => {
    const h = new Headers();
    h.set('X-WP-Total', '125');
    h.set('X-WP-TotalPages', '7');
    expect(parseWpCollectionHeaders(h)).toEqual({ total: 125, total_pages: 7 });
  });

  test('returns empty object when headers missing or invalid', () => {
    expect(parseWpCollectionHeaders(new Headers())).toEqual({});
    const h = new Headers();
    h.set('X-WP-Total', 'nope');
    expect(parseWpCollectionHeaders(h)).toEqual({});
  });
});
