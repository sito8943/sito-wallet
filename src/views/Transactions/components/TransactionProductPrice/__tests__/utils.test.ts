import { describe, expect, it } from "vitest";

import type { TransactionProductDto } from "lib";

import { getProductPriceLines } from "../utils";

const line = (
  id: number,
  productId: number,
  quantity: number,
  unitPrice: number,
): TransactionProductDto => ({
  id,
  product: {
    id: productId,
    name: `p${productId}`,
  } as TransactionProductDto["product"],
  quantity,
  unitPrice,
});

describe("getProductPriceLines", () => {
  it("keeps only the lines of the product, with their total", () => {
    expect(
      getProductPriceLines(
        [line(1, 7, 2, 1.25), line(2, 8, 1, 3), line(3, 7, 0.5, 2.99)],
        7,
      ),
    ).toEqual([
      { id: 1, quantity: 2, unitPrice: 1.25, total: 2.5 },
      { id: 3, quantity: 0.5, unitPrice: 2.99, total: 1.5 },
    ]);
  });

  it("returns nothing without lines", () => {
    expect(getProductPriceLines(undefined, 7)).toEqual([]);
  });
});
