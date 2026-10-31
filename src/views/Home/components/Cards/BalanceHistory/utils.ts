import type {
  BalanceHistoryGranularity,
  CommonAccountDto,
  UpdateDashboardCardConfigDto,
} from "lib";
import {
  BalanceHistoryPreset,
  type BalanceHistoryFormType,
  type BalanceHistoryRange,
  type StoredBalanceHistoryConfigType,
} from "./types";
import {
  BALANCE_HISTORY_PRESETS,
  DEFAULT_BALANCE_HISTORY_PRESET,
} from "./constants";
import { defaultConfig } from "./constants";

export const formToDto = (
  data: BalanceHistoryFormType,
): UpdateDashboardCardConfigDto => {
  const stringified = JSON.stringify({
    accounts: data.accounts ?? [],
    preset: data.preset,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};

export const parseFormConfig = (
  cfg?: string | null,
): BalanceHistoryFormType => {
  try {
    const { account, ...parsed } = (
      cfg ? JSON.parse(cfg) : {}
    ) as StoredBalanceHistoryConfigType;
    const accounts = parsed.accounts ?? (account ? [account] : []);
    return { ...defaultConfig, ...parsed, accounts };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: BalanceHistoryFormType,
): number => 1 + (formConfig.accounts.length ? 1 : 0);

/**
 * Accounts are merged as one balance, so once one is picked only accounts
 * with the same currency can join it.
 */
export const filterAccountsByCurrency = (
  options: CommonAccountDto[],
  selected: CommonAccountDto[] | null | undefined,
): CommonAccountDto[] => {
  const currencyId = selected?.[0]?.currency?.id;
  if (currencyId === undefined) return options;
  return options.filter((option) => option.currency?.id === currencyId);
};

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

export const presetToRange = (
  preset: BalanceHistoryPreset,
): BalanceHistoryRange => {
  const today = new Date();
  const to = new Date(today);
  to.setHours(0, 0, 0, 0);

  const def = BALANCE_HISTORY_PRESETS[preset];

  if (preset === BalanceHistoryPreset.Ytd) {
    const from = new Date(today.getFullYear(), 0, 1);
    return { from: toYMD(from), to: toYMD(to) };
  }

  const from = new Date(to);
  from.setDate(from.getDate() - (def.days ?? 30));
  return { from: toYMD(from), to: toYMD(to) };
};

export const presetGranularity = (
  preset: BalanceHistoryPreset,
): BalanceHistoryGranularity => BALANCE_HISTORY_PRESETS[preset].granularity;

export const resolvePreset = (
  preset: BalanceHistoryPreset | undefined,
): BalanceHistoryPreset => preset ?? DEFAULT_BALANCE_HISTORY_PRESET;
