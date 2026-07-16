import { SortOrder } from "@sito/dashboard-app";

export const stringifyFilterValue = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
};

export const parseSortOrder = (value: unknown): SortOrder => {
  const parsed = typeof value === "string" ? value.toUpperCase() : "";
  return parsed === String(SortOrder.ASC) ? SortOrder.ASC : SortOrder.DESC;
};
