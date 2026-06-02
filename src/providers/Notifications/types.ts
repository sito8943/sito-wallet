import type { Message } from "@stomp/stompjs";
import type { TFunction } from "i18next";

import type { NotificationDto } from "lib";

export type NotificationSocketMessageDto = NotificationDto;

export interface NotificationSocketRuntime {
  showNotification: (payload: { message: string }) => void;
  invalidateNotifications: () => Promise<void>;
}

export interface HandleNotificationSocketMessageProps {
  frame: Message;
  runtime: NotificationSocketRuntime;
  fallbackMessage: string;
  t: TFunction;
  language: string;
}
