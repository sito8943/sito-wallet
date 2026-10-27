import { SavingsProjectionHorizon } from "lib";
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
  showFiltersAsBadge: false,
};

/** HTTP status the backend returns for non-Saving / rate-less accounts. */
export const NOT_CONFIGURED_STATUS = 400;

/** Decimals shown for amounts; daily accruals keep more precision. */
export const AMOUNT_DECIMALS = 2;
export const ACCRUED_MAX_DECIMALS = 6;
export const RATE_MAX_DECIMALS = 4;
