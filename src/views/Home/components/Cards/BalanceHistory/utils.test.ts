import { describe, expect, it } from "vitest";

import type { CommonAccountDto } from "lib";

import { BalanceHistoryPreset } from "./types";
import { filterAccountsByCurrency, formToDto, parseFormConfig } from "./utils";

const account = (id: number, currencyId: number): CommonAccountDto =>
  ({
    id,
    name: `Account ${id}`,
    currency: { id: currencyId, name: "EUR", symbol: "€" },
  }) as CommonAccountDto;

describe("BalanceHistory utils", () => {
  it("migrates the legacy single-account config to accounts[]", () => {
    const legacy = JSON.stringify({ account: account(1, 1), preset: "3M" });

    const parsed = parseFormConfig(legacy);

    expect(parsed.accounts.map((a) => a.id)).toEqual([1]);
    expect(parsed.preset).toBe(BalanceHistoryPreset.Quarter);
    expect(parsed).not.toHaveProperty("account");
  });

  it("returns no accounts for an empty config", () => {
    expect(parseFormConfig(null).accounts).toEqual([]);
  });

  it("round-trips accounts through formToDto", () => {
    const form = parseFormConfig(null);
    form.accounts = [account(1, 1), account(2, 1)];

    const parsed = parseFormConfig(formToDto(form).config);

    expect(parsed.accounts.map((a) => a.id)).toEqual([1, 2]);
  });

  it("only offers accounts with the currency of the first selected", () => {
    const options = [account(1, 1), account(2, 1), account(3, 2)];

    expect(filterAccountsByCurrency(options, [])).toHaveLength(3);
    expect(
      filterAccountsByCurrency(options, [options[0]]).map((a) => a.id),
    ).toEqual([1, 2]);
  });
});
