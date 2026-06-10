import { BalanceHistoryGranularity } from "lib";
import type { BalanceHistoryFormType, PresetDef } from "./types";
import { BalanceHistoryPreset } from "./types";

export const BALANCE_HISTORY_PRESETS: Record<BalanceHistoryPreset, PresetDef> =
  {
    [BalanceHistoryPreset.Week]: {
      granularity: BalanceHistoryGranularity.Day,
      days: 7,
    },
    [BalanceHistoryPreset.Month]: {
      granularity: BalanceHistoryGranularity.Day,
      days: 30,
    },
    [BalanceHistoryPreset.Quarter]: {
      granularity: BalanceHistoryGranularity.Month,
      days: 90,
    },
    [BalanceHistoryPreset.Year]: {
      granularity: BalanceHistoryGranularity.Month,
      days: 365,
    },
    [BalanceHistoryPreset.Ytd]: {
      granularity: BalanceHistoryGranularity.Month,
    },
  };

export const DEFAULT_BALANCE_HISTORY_PRESET = BalanceHistoryPreset.Month;

export const defaultConfig: BalanceHistoryFormType = {
  account: null,
  preset: DEFAULT_BALANCE_HISTORY_PRESET,
};
