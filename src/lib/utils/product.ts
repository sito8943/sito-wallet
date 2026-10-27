import type { CommonProductDto } from "../entities";

/**
 * Product label for pickers: the alias first, then the receipt name, so
 * typing either finds it. Without alias, just the name.
 */
export const getProductLabel = (
  product: Pick<CommonProductDto, "name" | "alias">,
): string =>
  product.alias ? `${product.alias} (${product.name})` : product.name;
