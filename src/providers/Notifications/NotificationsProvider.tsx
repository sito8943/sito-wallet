import { useEffect, useMemo } from "react";
import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth, useNotification } from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import { NotificationsQueryKeys } from "hooks/queries/queryKeys/notificationsQueryKeys";
import { useOnlineStatus } from "hooks/useOnlineStatus";

import type { BasicProviderPropTypes } from "../types";

import {
  buildNotificationsSocketUrl,
  handleNotificationSocketMessage,
} from "./utils";

export function NotificationsProvider({ children }: BasicProviderPropTypes) {
  const { account } = useAuth();
  const { showNotification } = useNotification();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  const socketUrl = useMemo(() => buildNotificationsSocketUrl(), []);

  useEffect(() => {
    if (!account?.id || !account.token || !isOnline) return;

    const client = new Client({
      brokerURL: socketUrl,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${account.token}`,
      },
      onConnect: () => {
        client.subscribe("/user/queue/notifications", (frame) => {
          handleNotificationSocketMessage({
            frame,
            runtime: {
              showNotification,
              invalidateNotifications: async () => {
                await queryClient.invalidateQueries({
                  queryKey: NotificationsQueryKeys.all().queryKey,
                });
              },
            },
            fallbackMessage: t("_pages:notifications.messages.newNotification"),
            t,
            language: i18n.language,
          }).catch(() => {});
        });
      },
      onStompError: (frame) => {
        console.error("Notifications socket error:", frame.headers.message);
      },
      onWebSocketError: (event) => {
        console.error("Notifications websocket error:", event);
      },
    });

    client.activate();

    return () => {
      client.deactivate().catch(() => {});
    };
  }, [
    account?.id,
    account?.token,
    isOnline,
    queryClient,
    showNotification,
    socketUrl,
    i18n.language,
    t,
  ]);

  return <>{children}</>;
}
