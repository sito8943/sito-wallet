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
