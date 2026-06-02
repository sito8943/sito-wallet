import type { NotificationPayload } from "./NotificationPayload";
import type { NotificationType } from "./NotificationType";

export interface NotificationDto {
  id: number;
  type: NotificationType;
  titleKey: string;
  messageKey: string;
  payload?: NotificationPayload | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}
