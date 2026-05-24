import type { UpdateDashboardCardConfigDto } from "lib";
import type { SubscriptionForecastFormType } from "./types";

export const formToDto = (
  data: SubscriptionForecastFormType,
): UpdateDashboardCardConfigDto => {
  const stringified = JSON.stringify({
    range: data.range,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
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
