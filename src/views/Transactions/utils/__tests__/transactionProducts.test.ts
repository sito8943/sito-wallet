import { describe, expect, it } from "vitest";

import type { TransactionDto } from "lib";

import {
  dtoToForm,
  findProductByNameOrAlias,
  emptyTransaction,
  formToDto,
  formatTransactionAmount,
  getTransactionProductErrorKeys,
  getTransactionProductsAmount,
  getTransactionProductsTotal,
  isTransactionProductComplete,
  newProductOption,
  newPurchaseProviderOption,
  purchaseProviderToDto,
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

describe("new products typed in the form", () => {
  it("are sent by name so the backend creates them", () => {
    expect(
      transactionProductsFormToDto([
        { product: newProductOption(" Bread "), quantity: "", unitPrice: "2" },
        { product: milk, quantity: 1, unitPrice: 1 },
      ]),
    ).toEqual([
      { productName: "Bread", quantity: undefined, unitPrice: 2 },
      { productId: 5, quantity: 1, unitPrice: 1 },
    ]);
  });
});

describe("getTransactionProductsAmount", () => {
  it("rounds the products total to cents", () => {
    expect(
      getTransactionProductsAmount([
        { product: milk, quantity: "3", unitPrice: "0.1" },
        { product: milk, quantity: "", unitPrice: "1.005" },
      ]),
    ).toBe(1.31);
  });
});

describe("purchaseProviderToDto", () => {
  it("sends a new provider by name and an existing one by id", () => {
    expect(
      purchaseProviderToDto(newPurchaseProviderOption(" Vivari ")),
    ).toEqual({ purchaseProviderId: null, purchaseProviderName: "Vivari" });
    expect(
      purchaseProviderToDto({ id: 3, name: "Store", updatedAt: new Date() }),
    ).toEqual({ purchaseProviderId: 3 });
    expect(purchaseProviderToDto(null)).toEqual({ purchaseProviderId: null });
  });
});

describe("formatTransactionAmount", () => {
  it("shows two decimals in the user's locale, without float noise", () => {
    expect(formatTransactionAmount(28.659999999999997, "es")).toBe("28,66");
    expect(formatTransactionAmount(3, "en")).toBe("3.00");
  });
});

describe("findProductByNameOrAlias", () => {
  const smoothie = { id: 7, name: "SMOOTHIE BOWL", alias: "Smoothie" };
  const products = [milk, smoothie].map((product) => ({
    ...product,
    updatedAt: new Date(),
  }));

  it("matches by alias or name, ignoring case and spaces", () => {
    expect(findProductByNameOrAlias(products, " smoothie ")?.id).toBe(7);
    expect(findProductByNameOrAlias(products, "smoothie bowl")?.id).toBe(7);
    expect(findProductByNameOrAlias(products, "MILK")?.id).toBe(5);
  });

  it("returns undefined for partial or unknown names", () => {
    expect(findProductByNameOrAlias(products, "smoo")).toBeUndefined();
    expect(findProductByNameOrAlias(products, "Bread")).toBeUndefined();
  });
});
