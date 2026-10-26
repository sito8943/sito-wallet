import { describe, expect, it } from "vitest";

import type { TransactionDto } from "lib";

import {
  dtoToForm,
  emptyTransaction,
  formToDto,
  getTransactionProductErrorKeys,
  getTransactionProductsTotal,
  isTransactionProductComplete,
  transactionProductsFormToDto,
} from "..";

const milk = { id: 5, name: "Milk" };

describe("transaction products form mapping", () => {
  it("sends provider id and product lines, parsing string inputs", () => {
    const dto = formToDto({
      ...emptyTransaction(),
      purchaseProvider: { id: 3, name: "Supermarket" },
      products: [{ product: milk, quantity: "2", unitPrice: "1.25" }],
    });

    expect(dto.purchaseProviderId).toBe(3);
    expect(dto.products).toEqual([
      { productId: 5, quantity: 2, unitPrice: 1.25 },
    ]);
    expect(dto).not.toHaveProperty("purchaseProvider");
  });

  it("sends explicit clears when nothing is selected", () => {
    const dto = formToDto(emptyTransaction());

    expect(dto.purchaseProviderId).toBeNull();
    expect(dto.products).toEqual([]);
  });

  it("drops rows without product and leaves blank quantity to the backend", () => {
    expect(
      transactionProductsFormToDto([
        { product: null, quantity: 1, unitPrice: 2 },
        { product: milk, quantity: "", unitPrice: 3 },
      ]),
    ).toEqual([{ productId: 5, quantity: undefined, unitPrice: 3 }]);
  });

  it("loads provider and products from the API dto", () => {
    const form = dtoToForm({
      id: 1,
      auto: false,
      amount: 10,
      description: null,
      account: null,
      date: "2026-10-26T10:00:00",
      purchaseProvider: { id: 3, name: "Supermarket" },
      products: [{ id: 9, product: milk, quantity: 2, unitPrice: 1.25 }],
    } as TransactionDto);

    expect(form.purchaseProvider).toEqual({ id: 3, name: "Supermarket" });
    expect(form.products).toEqual([
      { product: milk, quantity: 2, unitPrice: 1.25 },
    ]);
  });

  it("totals quantity times unit price, defaulting blank quantity to 1", () => {
    expect(
      getTransactionProductsTotal([
        { product: milk, quantity: "2", unitPrice: "1.25" },
        { product: milk, quantity: "", unitPrice: 3 },
      ]),
    ).toBe(5.5);
  });
});

describe("isTransactionProductComplete", () => {
  it("needs a product and a non-negative price", () => {
    expect(
      isTransactionProductComplete({
        product: milk,
        quantity: 1,
        unitPrice: "0",
      }),
    ).toBe(true);
    expect(
      isTransactionProductComplete({
        product: null,
        quantity: 1,
        unitPrice: 2,
      }),
    ).toBe(false);
    expect(
      isTransactionProductComplete({
        product: milk,
        quantity: 1,
        unitPrice: "",
      }),
    ).toBe(false);
    expect(
      isTransactionProductComplete({
        product: milk,
        quantity: 1,
        unitPrice: -1,
      }),
    ).toBe(false);
  });
});

describe("getTransactionProductErrorKeys", () => {
  it("lists each missing field", () => {
    expect(
      getTransactionProductErrorKeys({
        product: null,
        quantity: 1,
        unitPrice: "",
      }),
    ).toEqual([
      "_entities:transaction.products.product.required",
      "_entities:transaction.products.unitPrice.required",
    ]);
    expect(
      getTransactionProductErrorKeys({
        product: milk,
        quantity: 1,
        unitPrice: 3,
      }),
    ).toEqual([]);
  });
});
