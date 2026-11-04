import type { CommonProductDto } from "../entities";

/**
 * Product label for pickers: the alias first, then the receipt name, so
 * typing either finds it. Without alias, just the name.
 */
export const getProductLabel = (
  product: Pick<CommonProductDto, "name" | "alias">,
): string =>
  product.alias ? `${product.alias} (${product.name})` : product.name;

const labeledProducts = new WeakMap<object, object>();

/**
 * The product with `name` swapped for its picker label. Cached per product so
 * the same form value always yields the same object: the autocomplete resyncs
 * its text whenever `value` changes identity, which wiped what the user was
 * typing on every re-render.
 */
export const withProductLabel = <
  T extends Pick<CommonProductDto, "name" | "alias">,
>(
  product: T,
): T => {
  const cached = labeledProducts.get(product);
  if (cached) return cached as T;
  const labeled = { ...product, name: getProductLabel(product) };
  labeledProducts.set(product, labeled);
  return labeled;
};
