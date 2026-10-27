import { SortOrder } from "@sito/dashboard-app";

import type { PersistedTableSortingDefaults } from "lib";

/** Newest first by transaction date, on mobile and desktop. */
export const TRANSACTIONS_DEFAULT_SORTING: PersistedTableSortingDefaults = {
  sortingBy: "date",
  sortingOrder: SortOrder.DESC,
};
