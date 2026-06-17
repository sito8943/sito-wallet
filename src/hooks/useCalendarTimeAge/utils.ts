import { HOUR_IN_MS, MINUTE_IN_MS } from "./constants";
import type { FormatCalendarTimeAgeOptionsType } from "./types";

const isSameLocalDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const isYesterday = (date: Date, now: Date): boolean => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return isSameLocalDay(date, yesterday);
};

const isSpanishLanguage = (language: string): boolean =>
  language.toLowerCase().startsWith("es");

const formatRelativeCount = (
  value: number,
  singular: string,
  plural: string,
  ago: string,
  language: string,
): string => {
  const label = value === 1 ? singular : plural;

  if (isSpanishLanguage(language)) {
    return `${ago} ${value} ${label}`;
  }

  return `${value} ${label} ${ago}`;
};

const formatAbsoluteDate = (date: Date, language: string): string =>
  date.toLocaleDateString(language || "es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const formatCalendarTimeAge = (
  date: Date,
  options: FormatCalendarTimeAgeOptionsType,
): string => {
  if (Number.isNaN(date.getTime())) return "";

  const { language, labels, now = new Date() } = options;
  const diffInMs = now.getTime() - date.getTime();

  if (diffInMs < 0) {
    return formatAbsoluteDate(date, language);
  }

  if (isSameLocalDay(date, now)) {
    if (diffInMs < MINUTE_IN_MS) {
      return labels.justNow;
    }

    const minutes = Math.floor(diffInMs / MINUTE_IN_MS);

    if (minutes < 60) {
      return formatRelativeCount(
        minutes,
        labels.minute,
        labels.minutes,
        labels.ago,
        language,
      );
    }

    const hours = Math.floor(diffInMs / HOUR_IN_MS);

    return formatRelativeCount(
      hours,
      labels.hour,
      labels.hours,
      labels.ago,
      language,
    );
  }

  if (isYesterday(date, now)) {
    return labels.yesterday;
  }

  return formatAbsoluteDate(date, language);
};

