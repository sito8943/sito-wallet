import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useManager, useOfflineManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app";

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import { DashboardDto, FilterDashboardDto } from "lib";

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
  const { filters = { deletedAt: false as unknown as FilterDashboardDto["deletedAt"] } } = props;

  const manager = useManager();
  const offlineManager = useOfflineManager();
  const { account } = useAuth();

  return useQuery({
    ...DashboardsQueryKeys.list(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Dashboard.get(undefined, {
          ...filters,
        });

        offlineManager.Dashboard.seed(result.items).catch(() => {});
        return result;
      } catch (error) {
        console.warn("API failed, loading dashboards from IndexedDB", error);
        return await offlineManager.Dashboard.get(undefined, {
          ...filters,
        });
      }
    },
  });
}
