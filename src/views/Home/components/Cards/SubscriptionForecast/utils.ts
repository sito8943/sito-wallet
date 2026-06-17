import type { CommonCurrencyDto, UpdateDashboardCardConfigDto } from "lib";
import { RenewalRangePreset } from "lib";
import type { SubscriptionForecastFormType } from "./types";

export const defaultConfig: SubscriptionForecastFormType = {
  range: RenewalRangePreset.CurrentMonth,
  showFiltersAsBadge: false,
};

export const formToDto = (
  data: SubscriptionForecastFormType,
): UpdateDashboardCardConfigDto => {
  const stringified = JSON.stringify({
    range: data.range,
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
): SubscriptionForecastFormType => {
  try {
    const parsed = (
      cfg ? JSON.parse(cfg) : {}
    ) as Partial<SubscriptionForecastFormType>;
    return {
      range: parsed.range ?? defaultConfig.range,
      showFiltersAsBadge:
        parsed.showFiltersAsBadge ?? defaultConfig.showFiltersAsBadge,
    };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (): number => 1;

export const resolveCurrency = (
  currencies: CommonCurrencyDto[] | undefined,
  currencyName: string | null,
): { name: string; symbol: string } => {
  if (!currencyName) return { name: "", symbol: "" };
  const match = currencies?.find((currency) => currency.name === currencyName);
  return { name: currencyName, symbol: match?.symbol ?? "" };
};

export const resolveTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
};

const isYearPreset = (range: string) => range.endsWith("YEAR");
const isMonthPreset = (range: string) => range.endsWith("MONTH");

export const formatRangeWindow = (
  range: string,
  from: string | undefined,
  to: string | undefined,
  locale: string,
): string => {
  if (!from || !to) return "";

  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return "";
  }

  if (isYearPreset(range)) {
    return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(
      fromDate,
    );
  }

  if (isMonthPreset(range)) {
    return new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(fromDate);
  }

  const dayMonth = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });
  const fullEnd = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${dayMonth.format(fromDate)} – ${fullEnd.format(toDate)}`;
};
