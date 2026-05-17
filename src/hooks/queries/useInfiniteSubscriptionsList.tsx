import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { QueryParam} from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type {
  FilterSubscriptionDto,
  SubscriptionDto} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultSubscriptionsListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useProfile";
import type { UseFetchPropsType } from "./types";
import { SubscriptionsQueryKeys } from "./queryKeys/subscriptionsQueryKeys";

export function useInfiniteSubscriptionsList(
  props: UseFetchPropsType<SubscriptionDto, FilterSubscriptionDto>,
) {
  const {
    filters = defaultSubscriptionsListFilters,
    query = {} as Omit<QueryParam<SubscriptionDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterSubscriptionDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof SubscriptionDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...SubscriptionsQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id && !!subscriptionsClient,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return await subscriptionsClient.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
