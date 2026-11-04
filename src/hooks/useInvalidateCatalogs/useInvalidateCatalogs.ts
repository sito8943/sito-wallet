import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  CurrenciesQueryKeys,
  ProductsQueryKeys,
  PurchaseProvidersQueryKeys,
  SubscriptionProvidersQueryKeys,
  TransactionCategoriesQueryKeys,
} from "../queries";

/**
 * Refetches every catalog. Saving with another user's public item clones it
 * into the caller's account, so the clone must show up in pickers and lists.
 */
export function useInvalidateCatalogs() {
  const queryClient = useQueryClient();

  return useCallback(async (): Promise<void> => {
    await Promise.all(
      [
        CurrenciesQueryKeys.all(),
        TransactionCategoriesQueryKeys.all(),
        ProductsQueryKeys.all(),
        PurchaseProvidersQueryKeys.all(),
        SubscriptionProvidersQueryKeys.all(),
      ].map((key) => queryClient.invalidateQueries(key)),
    );
  }, [queryClient]);
}
