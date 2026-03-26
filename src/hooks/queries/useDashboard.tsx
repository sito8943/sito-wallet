import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import {
  DashboardDto,
  FilterDashboardDto,
  normalizeHardDeleteFilters,
} from "lib";

export const DashboardsQueryKeys = {
  all: () => ({
    queryKey: ["dashboards"],
  }),
  list: () => ({
    queryKey: [...DashboardsQueryKeys.all().queryKey, "list"],
  }),
};

export function useDashboardsList(
  props: UseFetchPropsType<DashboardDto, FilterDashboardDto>
): UseQueryResult<QueryResult<DashboardDto>> {
  const { filters = {} } = props;
  const normalizedFilters = useMemo(
    () => normalizeHardDeleteFilters(filters) as FilterDashboardDto,
    [filters],
  );

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...DashboardsQueryKeys.list(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Dashboard.get(undefined, {
          ...normalizedFilters,
        });

        offlineManager.Dashboard.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading dashboards from IndexedDB", error);
        return await offlineManager.Dashboard.get(undefined, {
          ...normalizedFilters,
        });
      }
    },
  });
}
