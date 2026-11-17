import { describe, expect, it } from "vitest";

import { formatAmount } from "../money";

describe("formatAmount", () => {
  it("groups thousands and fixes two decimals in Spanish", () => {
    expect(formatAmount(1234.5, "es")).toBe("1.234,50");
    expect(formatAmount(1234567.891, "es")).toBe("1.234.567,89");
    expect(formatAmount(12, "es")).toBe("12,00");
  });

  it("groups thousands and fixes two decimals in English", () => {
    expect(formatAmount(1234.5, "en")).toBe("1,234.50");
    expect(formatAmount(0.1 + 0.2, "en")).toBe("0.30");
    expect(formatAmount(-42, "en")).toBe("-42.00");
  });

  it("accepts numeric strings and falls back to 0 for invalid values", () => {
    expect(formatAmount("99.9", "en")).toBe("99.90");
    expect(formatAmount(null, "en")).toBe("0.00");
    expect(formatAmount(undefined, "es")).toBe("0,00");
    expect(formatAmount(Number.NaN, "en")).toBe("0.00");
    expect(formatAmount("abc", "en")).toBe("0.00");
  });

  it("can widen the decimals but never below two", () => {
    expect(formatAmount(0.12345, "en", { maximumFractionDigits: 4 })).toBe(
      "0.1235",
    );
    expect(formatAmount(1.5, "en", { maximumFractionDigits: 4 })).toBe("1.50");
    expect(formatAmount(1.555, "en", { maximumFractionDigits: 0 })).toBe(
      "1.56",
    );
  });
});
