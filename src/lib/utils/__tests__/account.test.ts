import { describe, expect, it } from "vitest";

import type { CommonAccountDto } from "../../entities";
import { AccountType } from "../../entities/account/AccountType";
import { filterSavingAccounts, isSavingAccountType } from "../account";
import { parseNullableNumber } from "../number";

describe("isSavingAccountType", () => {
  it("recognises the enum value and the raw select string", () => {
    expect(isSavingAccountType(AccountType.Saving)).toBe(true);
    expect(isSavingAccountType("2")).toBe(true);
  });

  it("rejects other types and blanks", () => {
    expect(isSavingAccountType(AccountType.Card)).toBe(false);
    expect(isSavingAccountType("")).toBe(false);
    expect(isSavingAccountType(undefined)).toBe(false);
  });
});

describe("filterSavingAccounts", () => {
  it("keeps only saving accounts (and drops ones without a type)", () => {
    const accounts = [
      { id: 1, name: "Cash", currency: null, type: AccountType.Physical },
      { id: 2, name: "Savings", currency: null, type: AccountType.Saving },
      { id: 3, name: "Legacy", currency: null },
    ] as CommonAccountDto[];

    expect(filterSavingAccounts(accounts).map((a) => a.id)).toEqual([2]);
  });
});

describe("parseNullableNumber", () => {
  it("parses numbers and numeric strings", () => {
    expect(parseNullableNumber(2.5)).toBe(2.5);
    expect(parseNullableNumber("0")).toBe(0);
  });

  it("returns null for blank or invalid values", () => {
    expect(parseNullableNumber("")).toBeNull();
    expect(parseNullableNumber("  ")).toBeNull();
    expect(parseNullableNumber(null)).toBeNull();
    expect(parseNullableNumber(undefined)).toBeNull();
    expect(parseNullableNumber("abc")).toBeNull();
  });
});
