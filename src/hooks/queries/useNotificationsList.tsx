import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type { GetNotificationsDto, NotificationsListDto } from "lib";

import { NotificationsQueryKeys } from "./queryKeys/notificationsQueryKeys";

export function useNotificationsList(
  params: GetNotificationsDto,
): UseQueryResult<NotificationsListDto> {
  const manager = useManager();
  const notificationsClient =
    "Notifications" in manager ? manager.Notifications : null;
  const { account } = useAuth();

  return useQuery({
    ...NotificationsQueryKeys.list(params),
    enabled: !!account?.id && !!notificationsClient,
    queryFn: async () => {
      if (!notificationsClient) {
        throw new Error("notifications.featureUnavailable");
      }

      return await notificationsClient.getAll(params);
    },
  });
}
