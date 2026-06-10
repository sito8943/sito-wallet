import { BalanceHistoryGranularity } from "lib";
import type { BalanceHistoryPointDto } from "lib";

/** Parse an ISO date (YYYY-MM-DD) as local time to avoid TZ shifts. */
const parseLocal = (iso: string): Date => new Date(`${iso}T00:00:00`);

/** Short axis label: depends on granularity. */
export const formatAxisLabel = (
  point: BalanceHistoryPointDto,
  granularity: BalanceHistoryGranularity,
  locale: string,
): string => {
  const date = parseLocal(point.startDate);

  switch (granularity) {
    case BalanceHistoryGranularity.Year:
      return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);
    case BalanceHistoryGranularity.Month:
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        year: "2-digit",
      }).format(date);
    case BalanceHistoryGranularity.Day:
    default:
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
      }).format(date);
  }
};

/** Full tooltip title: range when bucket spans more than one day. */
export const formatTooltipTitle = (point: BalanceHistoryPointDto): string =>
  point.startDate === point.endDate
    ? point.startDate
    : `${point.startDate} – ${point.endDate}`;

export const cssVar = (name: string, fallback: string): string => {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};
