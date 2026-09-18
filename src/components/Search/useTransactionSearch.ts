import { useQuery } from "@tanstack/react-query";
import { SortOrder, useAuth } from "@sito/dashboard-app";
import { useFeatureFlags, useManager } from "providers";
import { applyHideDeletedEntitiesPreference } from "lib";
import { TransactionsQueryKeys } from "../../hooks/queries/queryKeys/transactionsQueryKeys";
import { useHideDeletedEntitiesPreference } from "../../hooks/queries/useHideDeletedEntitiesPreference";

export function useTransactionSearch(description: string, active: boolean) {
  const manager = useManager();
  const { account } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();
  const enabled =
    active &&
    !!description &&
    !!account?.id &&
    isFeatureEnabled("transactionsEnabled");
  const query = {
    currentPage: 0,
    pageSize: 10,
    sortingBy: "date" as const,
    sortingOrder: SortOrder.DESC,
  };
  const filters = applyHideDeletedEntitiesPreference(
    { description },
    hideDeletedEntities,
  );
  const result = useQuery({
    queryKey: [
      ...TransactionsQueryKeys.list(query, filters).queryKey,
      "global-search",
      account?.id,
    ],
    enabled,
    queryFn: () => manager.Transactions.get(query, filters),
  });

  return {
    items: enabled ? (result.data?.items ?? []) : [],
    isLoading: enabled && result.isFetching,
    isError: enabled && result.isError,
  };
}
