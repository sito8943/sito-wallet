import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// providers
import { useManager } from "providers";
import type { QueryResult } from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

// types
import type { UseFetchPropsType } from "./types.ts";

// lib
import type { DashboardDto, FilterDashboardDto } from "lib";
import { normalizeHardDeleteFilters } from "lib";
import { DashboardsQueryKeys } from "./queryKeys/dashboardsQueryKeys";

export { DashboardsQueryKeys };

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboardsList(
  props: UseFetchPropsType<DashboardDto, FilterDashboardDto>,
): UseQueryResult<QueryResult<DashboardDto>> {
  const { filters = {} } = props;
  const normalizedFilters = useMemo(
    () => normalizeHardDeleteFilters(filters) as FilterDashboardDto,
    [filters],
  );

  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...DashboardsQueryKeys.list(),
    enabled: !!account?.id,
    queryFn: () =>
      manager.Dashboard.get(undefined, { ...normalizedFilters }),
  });
}
