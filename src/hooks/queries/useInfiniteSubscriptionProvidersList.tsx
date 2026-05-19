import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { QueryParam } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type {
  FilterSubscriptionProviderDto,
  SubscriptionProviderDto,
} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultSubscriptionProvidersListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";
import type { UseFetchPropsType } from "./types";
import { SubscriptionProvidersQueryKeys } from "./queryKeys/subscriptionProvidersQueryKeys";

export function useInfiniteSubscriptionProvidersList(
  props: UseFetchPropsType<
    SubscriptionProviderDto,
    FilterSubscriptionProviderDto
  >,
) {
  const {
    filters = defaultSubscriptionProvidersListFilters,
    query = {} as Omit<QueryParam<SubscriptionProviderDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterSubscriptionProviderDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof SubscriptionProviderDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...SubscriptionProvidersQueryKeys.infiniteList(
      parsedQueries,
      parsedFilters,
    ),
    enabled: !!account?.id && !!subscriptionProvidersClient,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return await subscriptionProvidersClient.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
