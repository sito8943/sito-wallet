import {
  DEFAULT_SAVINGS_DEPOSIT_DAY,
  SAVINGS_DEPOSIT_DAY_MAX,
  SAVINGS_DEPOSIT_DAY_MIN,
  SavingsProjectionHorizon,
} from "lib";
import type { SavingsProjectionFormType } from "./types";

/** Horizon presets in display order. */
export const SAVINGS_PROJECTION_HORIZONS: SavingsProjectionHorizon[] = [
  SavingsProjectionHorizon.OneMonth,
  SavingsProjectionHorizon.ThreeMonths,
  SavingsProjectionHorizon.SixMonths,
  SavingsProjectionHorizon.OneYear,
  SavingsProjectionHorizon.ThreeYears,
  SavingsProjectionHorizon.FiveYears,
  SavingsProjectionHorizon.TenYears,
];

export const DEFAULT_SAVINGS_PROJECTION_HORIZON =
  SavingsProjectionHorizon.OneYear;

export const defaultConfig: SavingsProjectionFormType = {
  account: null,
  horizon: DEFAULT_SAVINGS_PROJECTION_HORIZON,
  monthlyDeposit: null,
  depositDay: DEFAULT_SAVINGS_DEPOSIT_DAY,
  showFiltersAsBadge: false,
};

/** Deposit day options for the config dialog (1–31). */
export const SAVINGS_DEPOSIT_DAYS: number[] = Array.from(
  { length: SAVINGS_DEPOSIT_DAY_MAX - SAVINGS_DEPOSIT_DAY_MIN + 1 },
  (_, index) => SAVINGS_DEPOSIT_DAY_MIN + index,
);

/** HTTP status the backend returns for non-Saving / rate-less accounts. */
export const NOT_CONFIGURED_STATUS = 400;

/** Decimals shown for amounts; daily accruals keep more precision. */
export const AMOUNT_DECIMALS = 2;
export const ACCRUED_MAX_DECIMALS = 6;
export const RATE_MAX_DECIMALS = 4;
