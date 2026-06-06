import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { QueryParam } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { DebtDto, FilterDebtDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultDebtsListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";
import type { UseFetchPropsType } from "./types";
import { DebtsQueryKeys } from "./queryKeys/debtsQueryKeys";

export function useInfiniteDebtsList(
  props: UseFetchPropsType<DebtDto, FilterDebtDto>,
) {
  const {
    filters = defaultDebtsListFilters,
    query = {} as Omit<QueryParam<DebtDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterDebtDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof DebtDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...DebtsQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id && !!debtsClient,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!debtsClient) {
        throw new Error("debts.featureDisabled");
      }

      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return await debtsClient.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
