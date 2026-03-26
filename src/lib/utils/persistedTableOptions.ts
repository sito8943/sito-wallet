import { fromLocal, removeFromLocal, toLocal } from "@sito/dashboard-app";

import { config } from "../../config";
import { normalizeListFilters } from "./filterNormalization";

export type PersistedTableState = {
  sortingBy: string;
  sortingOrder: string;
  filters: Record<string, unknown>;
};

const buildKey = (view: string, tabId: string | number): string =>
  `${config.tableOptions}:${view}:${tabId}`;

export const saveTableOptions = (
  view: string,
  tabId: string | number,
  state: PersistedTableState,
): void => {
  toLocal(buildKey(view, tabId), {
    ...state,
    filters: normalizeListFilters(state.filters),
  });
};

export const loadTableOptions = (
  view: string,
  tabId: string | number,
): PersistedTableState | null => {
  const raw = fromLocal(buildKey(view, tabId), "object");
  if (!raw || typeof raw !== "object") return null;

  const parsed = raw as PersistedTableState;

  return {
    ...parsed,
    filters: normalizeListFilters(parsed.filters),
  };
};

export const clearAllTableOptions = (): void => {
  const prefix = config.tableOptions;
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => removeFromLocal(key));
};
