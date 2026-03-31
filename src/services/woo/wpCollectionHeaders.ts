/**
 * WordPress REST API collection responses expose totals in headers, not in JSON.
 * @see https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
 */
export type WpCollectionHeaderMeta = {
  total?: number;
  total_pages?: number;
};

export function parseWpCollectionHeaders(headers: Headers): WpCollectionHeaderMeta {
  const totalRaw = headers.get('X-WP-Total') ?? headers.get('x-wp-total');
  const pagesRaw = headers.get('X-WP-TotalPages') ?? headers.get('x-wp-totalpages');
  const total =
    totalRaw != null && totalRaw !== '' ? Number.parseInt(totalRaw, 10) : Number.NaN;
  const total_pages =
    pagesRaw != null && pagesRaw !== '' ? Number.parseInt(pagesRaw, 10) : Number.NaN;
  const out: WpCollectionHeaderMeta = {};
  if (Number.isFinite(total)) {
    out.total = total;
  }
  if (Number.isFinite(total_pages)) {
    out.total_pages = total_pages;
  }
  return out;
}
