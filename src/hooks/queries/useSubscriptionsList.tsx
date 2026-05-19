import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { QueryResult } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { FilterSubscriptionDto, SubscriptionDto } from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultSubscriptionsListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";
import type { UseFetchPropsType } from "./types";
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
        normalizeListFilters(filters),
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
