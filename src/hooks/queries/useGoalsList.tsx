import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { QueryResult } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { FilterGoalDto, GoalDto } from "lib";
import { applyHideDeletedEntitiesPreference, defaultGoalsListQuery } from "lib";

import { useHideDeletedEntitiesPreference } from "./useHideDeletedEntitiesPreference";
import type { UseFetchPropsType } from "./types";
import { GoalsQueryKeys } from "./queryKeys/goalsQueryKeys";

/**
 * Goals list (one page, nearest deadline first). Same filters share the
 * cache, so the page and the dashboard card reuse one request.
 */
export function useGoalsList(
  props: UseFetchPropsType<GoalDto, FilterGoalDto> = {},
): UseQueryResult<QueryResult<GoalDto>> {
  const { filters, query = defaultGoalsListQuery } = props;
  const manager = useManager();
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const normalizedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(filters ?? {}, hideDeletedEntities),
    [filters, hideDeletedEntities],
  );

  return useQuery({
    placeholderData: keepPreviousData,
    ...GoalsQueryKeys.list(query, normalizedFilters),
    enabled: !!account?.id,
    queryFn: () => manager.Goals.get(query, normalizedFilters),
  });
}
