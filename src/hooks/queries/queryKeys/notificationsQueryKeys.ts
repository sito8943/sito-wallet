import type { GetNotificationsDto } from "lib";

export const NotificationsQueryKeys = {
  all: () => ({
    queryKey: ["notifications"],
  }),
  list: (params: GetNotificationsDto) => ({
    queryKey: [...NotificationsQueryKeys.all().queryKey, "list", params],
  }),
};
