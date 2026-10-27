import { describe, expect, it } from "vitest";

import type { SavingsProjectionDto } from "lib";
import { SavingsProjectionHorizon } from "lib/entities/account/SavingsProjectionHorizon";

import { SavingsProjectionViewState } from "../types";
import {
  formToDto,
  formatAmount,
  formatDeviation,
  formatMonthLabel,
  formatRate,
  getActiveFiltersCount,
  isNotConfiguredError,
  parseFormConfig,
  parseMonth,
  resolveHorizon,
  resolveViewState,
  shouldWarnAer,
  toAdjustBalanceAccount,
} from "../utils";
import { SAVINGS_PROJECTION_HORIZONS } from "../constants";

const projection = (
  overrides: Partial<SavingsProjectionDto> = {},
): SavingsProjectionDto => ({
  accountId: 1,
  startDate: "2026-10-27",
  endDate: "2027-10-27",
  startBalance: 1000,
  startAccrued: 0.08,
  endBalance: 1029.4,
  endAccrued: 0.08,
  totalInterest: 29.4,
  interestRate: 2.86,
  aer: 2.9,
  effectiveAnnualRate: 2.9009,
  aerDeviation: 0.0009,
  aerMatches: true,
  points: [
    {
      month: "2026-10",
      openingBalance: 1000,
      accrued: 0.39,
      credited: 0.39,
      closingBalance: 1000.39,
      accruedPending: 0.08,
    },
  ],
  ...overrides,
});

describe("horizons", () => {
  it("lists the contract horizons in order", () => {
    expect(SAVINGS_PROJECTION_HORIZONS).toEqual([
      "1M",
      "3M",
      "6M",
      "1Y",
      "3Y",
      "5Y",
      "10Y",
    ]);
  });

  it("keeps valid horizons and defaults unknown ones to 1Y", () => {
    expect(resolveHorizon("5Y")).toBe(SavingsProjectionHorizon.FiveYears);
    expect(resolveHorizon(undefined)).toBe(SavingsProjectionHorizon.OneYear);
    expect(resolveHorizon("12M")).toBe(SavingsProjectionHorizon.OneYear);
  });
});

describe("card config", () => {
  it("round-trips account and horizon through the stored JSON", () => {
    const account = {
      id: 4,
      name: "Savings",
      currency: { id: 1, name: "GBP", symbol: "£" },
      type: 2,
    };
    const dto = formToDto({
      id: 9,
      userId: 3,
      account,
      horizon: SavingsProjectionHorizon.ThreeYears,
      showFiltersAsBadge: true,
    });

    expect(dto.id).toBe(9);
    expect(dto.userId).toBe(3);
    expect(parseFormConfig(dto.config)).toEqual({
      account,
      horizon: SavingsProjectionHorizon.ThreeYears,
      showFiltersAsBadge: true,
    });
  });

  it("defaults empty or broken config", () => {
    expect(parseFormConfig(null)).toEqual({
      account: null,
      horizon: SavingsProjectionHorizon.OneYear,
      showFiltersAsBadge: false,
    });
    expect(parseFormConfig('{"horizon":"bad"}').horizon).toBe(
      SavingsProjectionHorizon.OneYear,
    );
  });

  it("counts the horizon plus the account when set", () => {
    const base = parseFormConfig(null);
    expect(getActiveFiltersCount(base)).toBe(1);
    expect(
      getActiveFiltersCount({
        ...base,
        account: { id: 1, name: "S", currency: null },
      }),
    ).toBe(2);
  });
});

describe("resolveViewState", () => {
  it("asks to configure when no account is selected", () => {
    expect(resolveViewState({ isLoading: false, error: null })).toBe(
      SavingsProjectionViewState.NoAccount,
    );
  });

  it("maps a 400 to the not-configured state", () => {
    const error = Object.assign(new Error("bad"), { status: 400 });
    expect(isNotConfiguredError(error)).toBe(true);
    expect(resolveViewState({ accountId: 1, isLoading: false, error })).toBe(
      SavingsProjectionViewState.NotConfigured,
    );
  });

  it("treats other failures as generic errors", () => {
    const error = Object.assign(new Error("boom"), { status: 500 });
    expect(isNotConfiguredError(error)).toBe(false);
    expect(resolveViewState({ accountId: 1, isLoading: false, error })).toBe(
      SavingsProjectionViewState.Error,
    );
  });

  it("distinguishes loading, empty and ready", () => {
    expect(
      resolveViewState({ accountId: 1, isLoading: true, error: null }),
    ).toBe(SavingsProjectionViewState.Loading);
    expect(
      resolveViewState({
        accountId: 1,
        isLoading: false,
        error: null,
        data: projection({ points: [] }),
      }),
    ).toBe(SavingsProjectionViewState.Empty);
    expect(
      resolveViewState({
        accountId: 1,
        isLoading: false,
        error: null,
        data: projection(),
      }),
    ).toBe(SavingsProjectionViewState.Ready);
  });
});

describe("shouldWarnAer", () => {
  it("warns only when an AER is set and does not match", () => {
    expect(shouldWarnAer(projection())).toBe(false);
    expect(shouldWarnAer(projection({ aerMatches: false }))).toBe(true);
    expect(
      shouldWarnAer(
        projection({ aer: null, aerDeviation: null, aerMatches: false }),
      ),
    ).toBe(false);
  });
});

describe("formatting", () => {
  it("formats amounts with 2 decimals by default and more on demand", () => {
    expect(formatAmount(1029.4, "en")).toBe("1,029.40");
    expect(formatAmount(0.0784, "en", 6)).toBe("0.0784");
    expect(formatAmount(1029.4, "es")).toBe("1029,40");
  });

  it("formats rates and deviations", () => {
    expect(formatRate(2.9009, "en")).toBe("2.9009 %");
    expect(formatRate(2.9, "en")).toBe("2.90 %");
    expect(formatDeviation(0.0009, "en")).toBe("+0.0009");
    expect(formatDeviation(-0.05, "en")).toBe("-0.05");
  });

  it("parses YYYY-MM as the 1st of the month in local time", () => {
    const date = parseMonth("2027-02");
    expect(date.getFullYear()).toBe(2027);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(1);
  });

  it("formats month labels", () => {
    expect(formatMonthLabel("2026-10", "en")).toBe("Oct 26");
    expect(formatMonthLabel("2026-10", "en", "long")).toBe("October 2026");
  });
});

describe("toAdjustBalanceAccount", () => {
  const account = {
    id: 4,
    name: "Savings",
    currency: null,
    updatedAt: new Date(),
  };

  it("uses the projection's start balance as the current balance", () => {
    const data = { startBalance: 1000.5 } as SavingsProjectionDto;
    expect(toAdjustBalanceAccount(account, data)).toEqual({
      id: 4,
      currency: null,
      balance: 1000.5,
    });
  });

  it("returns null without an account or projection", () => {
    expect(toAdjustBalanceAccount(null, undefined)).toBeNull();
    expect(toAdjustBalanceAccount(account, undefined)).toBeNull();
  });
});
