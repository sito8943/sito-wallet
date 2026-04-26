import { SortOrder } from "@sito/dashboard-app";

export const parseSortOrder = (value: unknown): SortOrder => {
  const parsed = String(value ?? "").toUpperCase();
  return parsed === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC;
};
