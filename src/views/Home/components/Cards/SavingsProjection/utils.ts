import type {
  SavingsProjectionDto,
  SavingsProjectionHorizon,
  UpdateDashboardCardConfigDto,
} from "lib";

// types
import {
  SavingsProjectionViewState,
  type ResolveViewStateArgs,
  type SavingsProjectionFormType,
} from "./types";

// constants
import {
  AMOUNT_DECIMALS,
  DEFAULT_SAVINGS_PROJECTION_HORIZON,
  NOT_CONFIGURED_STATUS,
  RATE_MAX_DECIMALS,
  SAVINGS_PROJECTION_HORIZONS,
  defaultConfig,
} from "./constants";

export const formToDto = (
  data: SavingsProjectionFormType,
): UpdateDashboardCardConfigDto => ({
  userId: data.userId,
  id: data.id,
  config: JSON.stringify({
    account: data.account,
    horizon: data.horizon,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
  }),
});

/** Falls back to the default horizon for missing/unknown stored values. */
export const resolveHorizon = (value: unknown): SavingsProjectionHorizon =>
  SAVINGS_PROJECTION_HORIZONS.find((horizon) => horizon === value) ??
  DEFAULT_SAVINGS_PROJECTION_HORIZON;

export const parseFormConfig = (
  cfg?: string | null,
): SavingsProjectionFormType => {
  try {
    const parsed = (cfg ? JSON.parse(cfg) : {}) as SavingsProjectionFormType;
    return {
      ...defaultConfig,
      ...parsed,
      horizon: resolveHorizon(parsed.horizon),
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (
  formConfig: SavingsProjectionFormType,
): number => 1 + (formConfig.account ? 1 : 0);

/** 400 = account is not Saving or has no interest rate configured. */
export const isNotConfiguredError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  error.status === NOT_CONFIGURED_STATUS;

export const resolveViewState = ({
  accountId,
  isLoading,
  error,
  data,
}: ResolveViewStateArgs): SavingsProjectionViewState => {
  if (!accountId) return SavingsProjectionViewState.NoAccount;
  if (isLoading) return SavingsProjectionViewState.Loading;
  if (error)
    return isNotConfiguredError(error)
      ? SavingsProjectionViewState.NotConfigured
      : SavingsProjectionViewState.Error;
  if (!data?.points.length) return SavingsProjectionViewState.Empty;
  return SavingsProjectionViewState.Ready;
};

/** Warn only when an AER was declared and the configuration misses it. */
export const shouldWarnAer = (data: SavingsProjectionDto): boolean =>
  data.aer !== null && data.aer !== undefined && !data.aerMatches;

export const formatAmount = (
  value: number,
  locale: string,
  maxDecimals = AMOUNT_DECIMALS,
): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: AMOUNT_DECIMALS,
    maximumFractionDigits: Math.max(maxDecimals, AMOUNT_DECIMALS),
  }).format(value);

/** Percentage with up to 4 decimals, e.g. "2.9009 %" (value already in %). */
export const formatRate = (value: number, locale: string): string =>
  `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: RATE_MAX_DECIMALS,
  }).format(value)} %`;

/** Signed percentage points, e.g. "+0.0009". */
export const formatDeviation = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: RATE_MAX_DECIMALS,
    signDisplay: "exceptZero",
  }).format(value);

/** "YYYY-MM" → local Date on the 1st (avoids TZ shifts). */
export const parseMonth = (month: string): Date => {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(year, (monthIndex || 1) - 1, 1);
};

/** Axis label: "Oct 26" / long title: "October 2026". */
export const formatMonthLabel = (
  month: string,
  locale: string,
  variant: "short" | "long" = "short",
): string =>
  new Intl.DateTimeFormat(
    locale,
    variant === "short"
      ? { month: "short", year: "2-digit" }
      : { month: "long", year: "numeric" },
  ).format(parseMonth(month));

/** "YYYY-MM-DD" → "Sat, 1 Nov" (local time). */
export const formatDayLabel = (date: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(new Date(`${date}T00:00:00`));
