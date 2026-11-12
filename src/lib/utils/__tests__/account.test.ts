import { describe, expect, it } from "vitest";

import type { CommonAccountDto } from "../../entities";
import { AccountType } from "../../entities/account/AccountType";
import {
  filterRewardsAccounts,
  filterSavingAccounts,
  hasRewardsConfigured,
  isCardAccountType,
  isSavingAccountType,
  supportsBankName,
} from "../account";
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

describe("supportsBankName", () => {
  it("allows a bank on Card and Saving accounts only", () => {
    expect(supportsBankName(AccountType.Card)).toBe(true);
    expect(supportsBankName(AccountType.Saving)).toBe(true);
    expect(supportsBankName("2")).toBe(true);
    expect(supportsBankName(AccountType.Physical)).toBe(false);
  });
});

describe("isCardAccountType", () => {
  it("recognises the enum value and the raw select string", () => {
    expect(isCardAccountType(AccountType.Card)).toBe(true);
    expect(isCardAccountType("1")).toBe(true);
  });

  it("rejects other types and blanks", () => {
    expect(isCardAccountType(AccountType.Saving)).toBe(false);
    expect(isCardAccountType(AccountType.Physical)).toBe(false);
    expect(isCardAccountType("")).toBe(false);
    expect(isCardAccountType(undefined)).toBe(false);
  });
});

describe("filterRewardsAccounts", () => {
  it("keeps only card accounts with rewards configured", () => {
    const accounts = [
      { id: 1, name: "Cash", currency: null, type: AccountType.Physical },
      {
        id: 2,
        name: "Revolut",
        currency: null,
        type: AccountType.Card,
        rewardsConfigured: true,
      },
      { id: 3, name: "Caixa", currency: null, type: AccountType.Card },
      { id: 4, name: "Legacy", currency: null, rewardsConfigured: true },
    ] as unknown as CommonAccountDto[];

    expect(filterRewardsAccounts(accounts).map((a) => a.id)).toEqual([2]);
  });
});

describe("hasRewardsConfigured", () => {
  it("requires a card with both spend unit and points per unit", () => {
    expect(
      hasRewardsConfigured({
        type: AccountType.Card,
        rewardsSpendUnit: 10,
        rewardsPointsPerUnit: 1,
      }),
    ).toBe(true);
  });

  it("is false when either value is missing", () => {
    expect(
      hasRewardsConfigured({ type: AccountType.Card, rewardsSpendUnit: 10 }),
    ).toBe(false);
    expect(
      hasRewardsConfigured({
        type: AccountType.Card,
        rewardsSpendUnit: null,
        rewardsPointsPerUnit: 1,
      }),
    ).toBe(false);
  });

  it("is false for non-card accounts", () => {
    expect(
      hasRewardsConfigured({
        type: AccountType.Saving,
        rewardsSpendUnit: 10,
        rewardsPointsPerUnit: 1,
      }),
    ).toBe(false);
  });
});
