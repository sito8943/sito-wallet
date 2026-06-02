import type { NotificationDto } from "lib";

export type NotificationsFilterMode = "all" | "unread";

export interface NotificationListItemPropsType {
  notification: NotificationDto;
  isMarkingRead: boolean;
  onMarkAsRead: (notificationId: number) => void;
}
