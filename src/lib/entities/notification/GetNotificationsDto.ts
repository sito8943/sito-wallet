import type { QueryParam } from "@sito/dashboard-app";

import type { FilterNotificationDto } from "./FilterNotificationDto";
import type { NotificationDto } from "./NotificationDto";

export interface GetNotificationsDto {
  query?: QueryParam<NotificationDto>;
  filters?: FilterNotificationDto;
  unread?: boolean;
}
