import type { ProductAttributeRow, ProductDefaultAttributeRow } from './productToolSchemas';

export type ProductAttributeRemovalSelector = {
  attribute_id?: number;
  attribute_name?: string;
};

export function sameAttributeRow(a: ProductAttributeRow, b: ProductAttributeRow): boolean {
  if (a.id != null && b.id != null && a.id === b.id) {
    return true;
  }

  const leftName = a.name?.trim().toLowerCase();
  const rightName = b.name?.trim().toLowerCase();
  return leftName != null && rightName != null && leftName === rightName;
}

export function mergeAttributeOptions(existing: string[] | undefined, incoming: string[] | undefined): string[] | undefined {
  if (!incoming?.length) {
    return existing;
  }
  if (!existing?.length) {
    return [...incoming];
  }

  return [...new Set([...existing, ...incoming])];
}

export function mergeAttributeRows(existing: ProductAttributeRow, incoming: ProductAttributeRow): ProductAttributeRow {
  return {
    ...existing,
    ...incoming,
    options: mergeAttributeOptions(existing.options, incoming.options),
  };
}

export function appendProductAttributeRows(
  attributes: readonly ProductAttributeRow[],
  incoming: ProductAttributeRow,
): ProductAttributeRow[] {
  const existingIndex = attributes.findIndex((row) => sameAttributeRow(row, incoming));
  if (existingIndex < 0) {
    return [...attributes, incoming];
  }

  const nextAttributes = [...attributes];
  nextAttributes[existingIndex] = mergeAttributeRows(attributes[existingIndex], incoming);
  return nextAttributes;
}

export function upsertProductDefaultAttributes(
  defaults: readonly ProductDefaultAttributeRow[] | undefined,
  incoming: ProductAttributeRow,
  defaultOption: string | undefined,
): ProductDefaultAttributeRow[] | undefined {
  if (defaultOption == null || defaultOption.length === 0) {
    return undefined;
  }

  const nextDefaults = defaults ? [...defaults] : [];
  const existingIndex = nextDefaults.findIndex((row) => {
    if (incoming.id != null) {
      return row.id === incoming.id;
    }
    if (incoming.name != null) {
      return row.name != null && row.name === incoming.name;
    }
    return false;
  });
  const nextRow = {
    ...(incoming.id != null ? { id: incoming.id } : {}),
    ...(incoming.name != null ? { name: incoming.name } : {}),
    option: defaultOption,
  };

  if (existingIndex < 0) {
    return [...nextDefaults, nextRow];
  }

  nextDefaults[existingIndex] = nextRow;
  return nextDefaults;
}

function matchesAttributeSelector(
  row: Pick<ProductAttributeRow, 'id' | 'name'>,
  selector: ProductAttributeRemovalSelector,
): boolean {
  if (selector.attribute_id != null && row.id === selector.attribute_id) {
    return true;
  }
  if (selector.attribute_name != null && row.name != null) {
    return row.name.trim().toLowerCase() === selector.attribute_name.trim().toLowerCase();
  }
  return false;
}

export function removeProductAttributeRows(
  attributes: readonly ProductAttributeRow[],
  selector: ProductAttributeRemovalSelector,
): ProductAttributeRow[] {
  return attributes.filter((row) => !matchesAttributeSelector(row, selector));
}

export function removeProductDefaultAttributes(
  defaults: readonly ProductDefaultAttributeRow[] | undefined,
  selector: ProductAttributeRemovalSelector,
): ProductDefaultAttributeRow[] | undefined {
  if (!defaults) {
    return undefined;
  }

  return defaults.filter((row) => !matchesAttributeSelector(row, selector));
}
