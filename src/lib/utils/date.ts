import { DATE_ONLY_PATTERN, EMPTY_DATE_LABEL } from "./constants";

/**
 * Parses a user-facing date value. "YYYY-MM-DD" is read as a local date
 * (`new Date()` would read it as UTC midnight and show the previous day west
 * of UTC). Returns `null` for empty or invalid values.
 */
export const parseDisplayDate = (
  value: Date | string | null | undefined,
): Date | null => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string") {
    const match = DATE_ONLY_PATTERN.exec(value.trim());
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Date only ("Nov 17, 2026" / "17 nov 2026") in the app language. Use it for
 * due, renewal and deadline dates. Returns "-" for empty/invalid values.
 */
export const formatDate = (
  value: Date | string | null | undefined,
  locale: string,
): string => {
  const date = parseDisplayDate(value);
  if (!date) return EMPTY_DATE_LABEL;

  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
};

/**
 * Date and time ("Nov 17, 2026, 3:05 PM" / "17 nov 2026, 15:05") in the app
 * language. Use it for payment, paid-at and other event timestamps. Returns
 * "-" for empty/invalid values.
 */
export const formatDateTime = (
  value: Date | string | null | undefined,
  locale: string,
): string => {
  const date = parseDisplayDate(value);
  if (!date) return EMPTY_DATE_LABEL;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/**
 * Normalizes a raw value into a non-empty trimmed string suitable for a
 * `datetime-local` input, or `null` when absent/blank.
 */
export const parseOptionalDateTimeLocal = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

/**
 * Converts an ISO date string into the `YYYY-MM-DDTHH:mm` format expected by a
 * `datetime-local` input. Returns "" for empty values and a best-effort slice
 * when the value is not a valid date.
 */
export const toDateTimeLocal = (value?: string | null): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value.slice(0, 16) : "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/** Current local time formatted for a `datetime-local` input. */
export const nowDateTimeLocal = (): string => {
  return toDateTimeLocal(new Date().toISOString());
};
