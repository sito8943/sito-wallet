import { describe, expect, it } from "vitest";

import type { ReceiptDraftDto } from "lib";

import { getReceiptScanErrorKey, receiptDraftToForm } from "..";

const updatedAt = new Date("2026-10-01T00:00:00Z");
const milk = { id: 5, name: "Leche", updatedAt };
const consum = { id: 3, name: "Consum", updatedAt };

const draft = (overrides: Partial<ReceiptDraftDto> = {}): ReceiptDraftDto => ({
  parser: "consum",
  providerName: "CONSUM",
  date: "2026-10-26",
  total: 2.98,
  products: [
    { name: "leche ", quantity: 2, unitPrice: 0.89 },
    { name: "PAN", quantity: null, unitPrice: 1.2 },
  ],
  productsTotal: 2.98,
  matchesTotal: true,
  text: "",
  ...overrides,
});

describe("receiptDraftToForm", () => {
  it("matches known catalog items by name and creates the rest", () => {
    const values = receiptDraftToForm(draft(), {
      products: [milk],
      purchaseProviders: [consum],
      currentDate: "2026-10-27T21:40",
    });

    expect(values.amount).toBe(2.98);
    expect(values.date).toBe("2026-10-26T21:40");
    expect(values.purchaseProvider).toBe(consum);
    expect(values.products).toEqual([
      { product: milk, quantity: 2, unitPrice: 0.89 },
      {
        product: expect.objectContaining({ id: 0, name: "PAN" }),
        quantity: 1,
        unitPrice: 1.2,
      },
    ]);
  });

  it("only fills what the receipt had", () => {
    const values = receiptDraftToForm(
      draft({ providerName: null, date: null, products: [], total: 4.5 }),
      { products: [], purchaseProviders: [], currentDate: "" },
    );

    expect(values).toEqual({ amount: 4.5 });
  });
});

describe("getReceiptScanErrorKey", () => {
  it("maps backend receipt codes and falls back to a generic message", () => {
    expect(
      getReceiptScanErrorKey({ status: 400, message: "receipt.unreadable" }),
    ).toBe("_pages:transactions.receipt.errors.unreadable");
    expect(getReceiptScanErrorKey(new Error("boom"))).toBe(
      "_pages:transactions.receipt.errors.generic",
    );
  });
});
