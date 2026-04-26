export const DashboardsQueryKeys = {
  all: () => ({
    queryKey: ["dashboards"],
  }),
  list: () => ({
    queryKey: [...DashboardsQueryKeys.all().queryKey, "list"],
  }),
};
