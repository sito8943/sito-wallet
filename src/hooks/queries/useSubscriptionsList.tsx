import { useMemo } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { QueryResult, useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import {
  FilterSubscriptionDto,
  SubscriptionDto,
  applyHideDeletedEntitiesPreference,
  defaultSubscriptionsListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useProfile";
import { UseFetchPropsType } from "./types";
import { SubscriptionsQueryKeys } from "./queryKeys/subscriptionsQueryKeys";

export function useSubscriptionsList(
  props: UseFetchPropsType<SubscriptionDto, FilterSubscriptionDto>,
): UseQueryResult<QueryResult<SubscriptionDto>> {
  const { filters = defaultSubscriptionsListFilters } = props;
  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters) as Record<string, unknown>,
        hideDeletedEntities,
      ) as FilterSubscriptionDto,
    [filters, hideDeletedEntities],
  );

  return useQuery({
    ...SubscriptionsQueryKeys.list(normalizedFilters),
    enabled: !!account?.id && !!subscriptionsClient,
    queryFn: () => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionsClient.get(undefined, normalizedFilters);
    },
  });
}
