import { describe, expect, it } from "vitest";

import type { CommonCurrencyDto, CommonProductDto } from "lib";

import { getProductLastPricePrefill, receiptDraftToForm } from "..";

const updatedAt = new Date("2026-10-01T00:00:00Z");
const eur: CommonCurrencyDto = { id: 1, name: "Euro", symbol: "€", updatedAt };
const usd: CommonCurrencyDto = {
  id: 2,
  name: "Dollar",
  symbol: "$",
  updatedAt,
};

const milk = (overrides: Partial<CommonProductDto> = {}): CommonProductDto => ({
  id: 5,
  name: "Leche",
  updatedAt,
  lastUnitPrice: 0.89,
  lastUnitPriceCurrency: eur,
  ...overrides,
});

describe("getProductLastPricePrefill", () => {
  it("prefills the last price on an empty or zero line price", () => {
    for (const currentPrice of ["", 0, "0"]) {
      expect(
        getProductLastPricePrefill(milk(), {
          currentPrice,
          accountCurrency: eur,
        }),
      ).toBe(0.89);
    }
  });

  it("never overwrites a price the user typed", () => {
    expect(
      getProductLastPricePrefill(milk(), {
        currentPrice: "1.5",
        accountCurrency: eur,
      }),
    ).toBeUndefined();
  });

  it("replaces a price it prefilled before when the product changes", () => {
    expect(
      getProductLastPricePrefill(milk({ lastUnitPrice: 2 }), {
        currentPrice: 0.89,
        prefilledPrice: 0.89,
        accountCurrency: eur,
      }),
    ).toBe(2);
    expect(
      getProductLastPricePrefill(milk({ lastUnitPrice: 2 }), {
        currentPrice: "1",
        prefilledPrice: 0.89,
        accountCurrency: eur,
      }),
    ).toBeUndefined();
  });

  it("leaves the price when the product has no last price", () => {
    for (const lastUnitPrice of [null, undefined]) {
      expect(
        getProductLastPricePrefill(milk({ lastUnitPrice }), {
          currentPrice: "",
          accountCurrency: eur,
        }),
      ).toBeUndefined();
    }
    expect(
      getProductLastPricePrefill(null, { currentPrice: "" }),
    ).toBeUndefined();
  });

  it("skips a last price in another currency than the account", () => {
    expect(
      getProductLastPricePrefill(milk(), {
        currentPrice: "",
        accountCurrency: usd,
      }),
    ).toBeUndefined();
  });

  it("prefills when either currency is unknown", () => {
    expect(
      getProductLastPricePrefill(milk({ lastUnitPriceCurrency: null }), {
        currentPrice: "",
        accountCurrency: usd,
      }),
    ).toBe(0.89);
    expect(
      getProductLastPricePrefill(milk(), {
        currentPrice: "",
        accountCurrency: null,
      }),
    ).toBe(0.89);
  });

  it("keeps the price for a new product created in the picker", () => {
    expect(
      getProductLastPricePrefill(
        { id: 0, name: "Pan", updatedAt },
        { currentPrice: "", accountCurrency: eur },
      ),
    ).toBeUndefined();
  });
});

describe("receipt scan products", () => {
  it("keep the receipt price, not the product's last price", () => {
    const values = receiptDraftToForm(
      {
        parser: "consum",
        providerName: null,
        date: null,
        time: null,
        total: null,
        products: [{ name: "Leche", quantity: 1, unitPrice: 1.05 }],
        productsTotal: 1.05,
        matchesTotal: true,
        text: "",
      },
      { products: [milk()], purchaseProviders: [], currentDate: "" },
    );

    expect(values.products?.[0]?.unitPrice).toBe(1.05);
  });
});
