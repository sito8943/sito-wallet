import type { Message } from "@stomp/stompjs";

import {
  getNotificationMessage,
  getNotificationTitle,
} from "../../lib/entities/notification/utils";
import type { NotificationDto } from "../../lib/entities/notification/NotificationDto";

import { config } from "../../config";

import type { HandleNotificationSocketMessageProps } from "./types";

export const buildNotificationsSocketUrl = (): string => {
  const socketUrl = new URL(config.serverUrl);

  socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";
  socketUrl.pathname = "/ws";
  socketUrl.search = "";
  socketUrl.hash = "";

  return socketUrl.toString();
};

const parseSocketMessageBody = (frame: Message): NotificationDto | null => {
  try {
    return JSON.parse(frame.body) as NotificationDto;
  } catch {
    return null;
  }
};

export const getSocketNotificationMessage = (
  notification: NotificationDto | null,
  t: HandleNotificationSocketMessageProps["t"],
  language: string,
  fallbackMessage: string,
): string => {
  if (!notification) return fallbackMessage;

  const title = getNotificationTitle({
    notification,
    t,
    language,
    fallback: "",
  }).trim();
  const message = getNotificationMessage({
    notification,
    t,
    language,
    fallback: fallbackMessage,
  }).trim();

  if (title && message) return `${title}: ${message}`;
  if (message) return message;
  if (title) return title;

  return fallbackMessage;
};

export const handleNotificationSocketMessage = async ({
  frame,
  runtime,
  fallbackMessage,
  t,
  language,
}: HandleNotificationSocketMessageProps): Promise<void> => {
  const notification = parseSocketMessageBody(frame);

  runtime.showNotification({
    message: getSocketNotificationMessage(
      notification,
      t,
      language,
      fallbackMessage,
    ),
  });

  await runtime.invalidateNotifications();
};
