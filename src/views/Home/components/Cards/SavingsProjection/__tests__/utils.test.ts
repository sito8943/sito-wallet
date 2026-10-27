import { describe, expect, it } from "vitest";

import type { SavingsProjectionDto } from "lib";
import { SavingsProjectionHorizon } from "lib/entities/account/SavingsProjectionHorizon";

import { SavingsProjectionViewState } from "../types";
import {
  formToDto,
  formatAmount,
  formatDepositAmount,
  formatDeviation,
  formatMonthLabel,
  formatRate,
  getActiveFiltersCount,
  hasDailyDeposits,
  hasDeposits,
  isNotConfiguredError,
  parseFormConfig,
  parseMonth,
  resolveHorizon,
  resolveViewState,
  shouldWarnAer,
  toAdjustBalanceAccount,
} from "../utils";
import {
  SAVINGS_DEPOSIT_DAYS,
  SAVINGS_PROJECTION_HORIZONS,
} from "../constants";

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
  monthlyDeposit: 0,
  depositDay: 1,
  totalDeposits: 0,
  points: [
    {
      month: "2026-10",
      openingBalance: 1000,
      accrued: 0.39,
      credited: 0.39,
      deposited: 0,
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
      monthlyDeposit: 50,
      depositDay: 15,
      showFiltersAsBadge: true,
    });

    expect(dto.id).toBe(9);
    expect(dto.userId).toBe(3);
    expect(parseFormConfig(dto.config)).toEqual({
      account,
      horizon: SavingsProjectionHorizon.ThreeYears,
      monthlyDeposit: 50,
      depositDay: 15,
      showFiltersAsBadge: true,
    });
  });

  it("stores no deposit for empty, zero or negative amounts", () => {
    const base = parseFormConfig(null);
    for (const monthlyDeposit of [null, 0, -10]) {
      const config = JSON.parse(
        formToDto({ ...base, monthlyDeposit, depositDay: 40 }).config,
      ) as Record<string, unknown>;
      expect(config.monthlyDeposit).toBeNull();
      expect(config.depositDay).toBe(1);
    }
  });

  it("sanitises stored deposit values", () => {
    expect(
      parseFormConfig('{"monthlyDeposit":"25.5","depositDay":31}'),
    ).toMatchObject({ monthlyDeposit: 25.5, depositDay: 31 });
    expect(
      parseFormConfig('{"monthlyDeposit":-3,"depositDay":0}'),
    ).toMatchObject({ monthlyDeposit: null, depositDay: 1 });
  });

  it("defaults empty or broken config", () => {
    expect(parseFormConfig(null)).toEqual({
      account: null,
      horizon: SavingsProjectionHorizon.OneYear,
      monthlyDeposit: null,
      depositDay: 1,
      showFiltersAsBadge: false,
    });
    expect(parseFormConfig("{broken").monthlyDeposit).toBeNull();
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

  it("counts the monthly deposit only when an amount > 0 is set", () => {
    const base = parseFormConfig(null);
    expect(getActiveFiltersCount({ ...base, monthlyDeposit: 0 })).toBe(1);
    expect(getActiveFiltersCount({ ...base, monthlyDeposit: 50 })).toBe(2);
  });

  it("offers deposit days 1 to 31", () => {
    expect(SAVINGS_DEPOSIT_DAYS).toHaveLength(31);
    expect(SAVINGS_DEPOSIT_DAYS[0]).toBe(1);
    expect(SAVINGS_DEPOSIT_DAYS[30]).toBe(31);
  });
});

describe("deposits", () => {
  it("shows the deposits stat only when something was deposited", () => {
    expect(hasDeposits(projection())).toBe(false);
    expect(hasDeposits(projection({ totalDeposits: 600 }))).toBe(true);
  });

  it("shows the daily deposit column only when a day has one", () => {
    const day = {
      date: "2026-11-01",
      openingBalance: 1000,
      earningBalance: 1000,
      accrued: 0.08,
      credited: 0,
      deposited: 0,
      closingBalance: 1000,
      accruedPending: 0.08,
    };
    expect(hasDailyDeposits(undefined)).toBe(false);
    expect(hasDailyDeposits({ month: "2026-11", days: [day] })).toBe(false);
    expect(
      hasDailyDeposits({
        month: "2026-11",
        days: [day, { ...day, date: "2026-11-02", deposited: 50 }],
      }),
    ).toBe(true);
  });

  it("formats the signed deposit amount with its currency", () => {
    expect(formatDepositAmount(50, "en", "€")).toBe("+50.00 €");
    expect(formatDepositAmount(50, "en", "")).toBe("+50.00");
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
