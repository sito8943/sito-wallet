import { useEffect, useRef, useCallback } from "react";
import { useTableOptions } from "@sito/dashboard-app";

import { saveTableOptions, loadTableOptions } from "lib";

/**
 * Persists table filters and sorting per view+tab in localStorage.
 * Restores saved state when the active tab changes.
 */
export function usePersistedTableOptions(
  view: string,
  tabId: string | number | undefined,
) {
  const {
    filters,
    sortingBy,
    sortingOrder,
    setSortingBy,
    setSortingOrder,
    onFilterApply,
    clearFilters,
    setCurrentPage,
  } = useTableOptions();

  const prevTabId = useRef<string | number | undefined>(undefined);
  const isRestoring = useRef(false);

  // Save current state before switching tabs
  const saveCurrentState = useCallback(
    (id: string | number) => {
      saveTableOptions(view, id, {
        sortingBy,
        sortingOrder,
        filters,
      });
    },
    [view, sortingBy, sortingOrder, filters],
  );

  // Restore state for a tab
  const restoreState = useCallback(
    (id: string | number) => {
      const saved = loadTableOptions(view, id);
      isRestoring.current = true;

      if (saved) {
        setSortingBy(saved.sortingBy);
        setSortingOrder(
          saved.sortingOrder as Parameters<typeof setSortingOrder>[0],
        );

        // Rebuild filters in the format onFilterApply expects
        const filtersForApply = Object.entries(saved.filters).reduce(
          (acc, [key, value]) => {
            acc[key] = { value };
            return acc;
          },
          {} as Record<string, { value: unknown }>,
        );
        onFilterApply(filtersForApply);
      } else {
        // No saved state — reset to defaults
        setSortingBy("id");
        setSortingOrder("DESC" as Parameters<typeof setSortingOrder>[0]);
        clearFilters();
      }

      setCurrentPage(0);
      isRestoring.current = false;
    },
    [
      view,
      setSortingBy,
      setSortingOrder,
      onFilterApply,
      clearFilters,
      setCurrentPage,
    ],
  );

  // Handle tab change: save old tab state, restore new tab state
  useEffect(() => {
    if (tabId === undefined) return;

    const prev = prevTabId.current;

    if (prev !== undefined && prev !== tabId) {
      saveCurrentState(prev);
      restoreState(tabId);
    } else if (prev === undefined) {
      // First mount — restore if there's saved state
      restoreState(tabId);
    }

    prevTabId.current = tabId;
  }, [tabId, saveCurrentState, restoreState]);

  // Persist on every filter/sort change (debounced by React batching)
  useEffect(() => {
    if (tabId === undefined || isRestoring.current) return;
    saveCurrentState(tabId);
  }, [tabId, saveCurrentState]);
}
