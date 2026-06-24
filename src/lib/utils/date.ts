/**
 * Formats an ISO date string for display using the user's locale.
 * Returns "-" for empty values and the raw value when it is not a valid date.
 */
export const formatDateTime = (value?: string | null): string => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
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
