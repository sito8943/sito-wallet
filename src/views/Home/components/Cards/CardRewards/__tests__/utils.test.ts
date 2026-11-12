import { describe, expect, it } from "vitest";

import type { AccountRewardsDto, CommonAccountDto } from "lib";

import { CardRewardsViewState } from "../types";
import {
  formToDto,
  formatCurrencyAmount,
  getActiveFiltersCount,
  hasRewardsActivity,
  isNotConfiguredError,
  parseFormConfig,
  resolveConfigAccountId,
  resolveViewState,
  toAdjustRewardsAccount,
} from "../utils";
import { defaultConfig } from "../constants";

const account = {
  id: 4,
  name: "Revolut",
  currency: { id: 1, name: "EUR", symbol: "€" },
} as unknown as CommonAccountDto;

const rewards = (
  overrides: Partial<AccountRewardsDto> = {},
): AccountRewardsDto => ({
  accountId: 4,
  name: "RevPoints",
  earned: 900,
  adjustment: -100,
  balance: 800,
  pointValue: 0.01,
  balanceValue: 8,
  currentMonthEarned: 42,
  eligibleSpent: 3600,
  history: [
    { month: "2026-10", spent: 0, earned: 0 },
    { month: "2026-11", spent: 168, earned: 42 },
  ],
  ...overrides,
});

describe("card rewards config", () => {
  it("stores the contract's accountId with the picked account", () => {
    const dto = formToDto({
      ...defaultConfig,
      account,
      showFiltersAsBadge: true,
      id: 3,
      userId: 1,
    });

    expect(dto.id).toBe(3);
    expect(JSON.parse(dto.config ?? "{}")).toEqual({
      accountId: 4,
      account: JSON.parse(JSON.stringify(account)),
      showFiltersAsBadge: true,
    });
  });

  it("round-trips through parseFormConfig", () => {
    const dto = formToDto({ ...defaultConfig, account, id: 3, userId: 1 });
    const parsed = parseFormConfig(dto.config);

    expect(parsed.accountId).toBe(4);
    expect(parsed.account?.id).toBe(4);
  });

  it("reads a bare { accountId } config", () => {
    const parsed = parseFormConfig(JSON.stringify({ accountId: 7 }));

    expect(parsed.accountId).toBe(7);
    expect(parsed.account).toBeNull();
  });

  it("falls back to the default config for empty or broken JSON", () => {
    expect(parseFormConfig(null)).toEqual(defaultConfig);
    expect(parseFormConfig("{oops")).toEqual(defaultConfig);
  });

  it("prefers accountId over the stored account", () => {
    expect(resolveConfigAccountId({ accountId: 9, account })).toBe(9);
    expect(resolveConfigAccountId({ account })).toBe(4);
    expect(resolveConfigAccountId({})).toBeNull();
  });

  it("counts the account as the only filter", () => {
    expect(getActiveFiltersCount(defaultConfig)).toBe(0);
    expect(getActiveFiltersCount({ ...defaultConfig, accountId: 4 })).toBe(1);
  });
});

describe("resolveViewState", () => {
  it("walks through the card states", () => {
    expect(
      resolveViewState({ isLoading: false, error: null, data: undefined }),
    ).toBe(CardRewardsViewState.NoAccount);
    expect(
      resolveViewState({ accountId: 4, isLoading: true, error: null }),
    ).toBe(CardRewardsViewState.Loading);
    expect(
      resolveViewState({
        accountId: 4,
        isLoading: false,
        error: { status: 400 },
      }),
    ).toBe(CardRewardsViewState.NotConfigured);
    expect(
      resolveViewState({
        accountId: 4,
        isLoading: false,
        error: { status: 500 },
      }),
    ).toBe(CardRewardsViewState.Error);
    expect(
      resolveViewState({
        accountId: 4,
        isLoading: false,
        error: null,
        data: rewards(),
      }),
    ).toBe(CardRewardsViewState.Ready);
  });

  it("only treats 400 as not configured", () => {
    expect(isNotConfiguredError({ status: 400 })).toBe(true);
    expect(isNotConfiguredError({ status: 404 })).toBe(false);
    expect(isNotConfiguredError(new Error("x"))).toBe(false);
  });
});

describe("hasRewardsActivity", () => {
  it("is true when some month had spend or points", () => {
    expect(hasRewardsActivity(rewards())).toBe(true);
    expect(
      hasRewardsActivity(
        rewards({ history: [{ month: "2026-11", spent: 0, earned: 0 }] }),
      ),
    ).toBe(false);
  });
});

describe("formatCurrencyAmount", () => {
  it("adds the symbol only when there is one", () => {
    expect(formatCurrencyAmount(8, "en", "€")).toBe("8.00 €");
    expect(formatCurrencyAmount(8, "en", "")).toBe("8.00");
  });
});

describe("toAdjustRewardsAccount", () => {
  it("builds the dialog account from the card data", () => {
    expect(toAdjustRewardsAccount(4, rewards())).toEqual({
      id: 4,
      rewards: { name: "RevPoints", balance: 800, earned: 900 },
    });
  });

  it("is null without account or data", () => {
    expect(toAdjustRewardsAccount(undefined, rewards())).toBeNull();
    expect(toAdjustRewardsAccount(4, undefined)).toBeNull();
  });
});
