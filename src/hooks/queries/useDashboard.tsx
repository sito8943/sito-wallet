import { useQuery, UseQueryResult } from "@tanstack/react-query";

// providers
import { useLocalCache, useManager } from "providers";
import { QueryResult, useAuth } from "@sito/dashboard-app"

// types
import { UseFetchPropsType } from "./types.ts";

// lib
import { DashboardDto, Tables } from "lib";

export const DashboardsQueryKeys = {
  all: () => ({
    queryKey: ["dashboards"],
  }),
  list: () => ({
    queryKey: [...DashboardsQueryKeys.all().queryKey, "list"],
  }),
};

export function useDashboardsList(
  props: UseFetchPropsType<DashboardDto>
): UseQueryResult<QueryResult<DashboardDto>> {
  const { filters = { deletedAt: false as unknown as any } } = props;

  const manager = useManager();
  const { account } = useAuth();
  const { loadCache, updateCache } = useLocalCache();

  return useQuery({
    ...DashboardsQueryKeys.list(),
    enabled: !!account?.id,
    queryFn: async () => {
      try {
        const result = await manager.Dashboard.get(undefined, {
          ...filters,
          userId: account?.id,
        });

        updateCache(Tables.UserDashboardConfig, result.items);
        return result;
      } catch (error) {
        console.warn("API failed, loading dashboards from cache", error);
        const cached = loadCache(Tables.UserDashboardConfig);
        if (!cached || !Array.isArray(cached))
          throw new Error("No cached dashboards available");
        return {
          items: cached as unknown as DashboardDto,
          total: cached?.length,
        } as unknown as QueryResult<DashboardDto>;
      }
    },
  });
}
