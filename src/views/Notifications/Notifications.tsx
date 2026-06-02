import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Error as ErrorView,
  Loading,
  Page,
  useNotification,
} from "@sito/dashboard-app";
import { useTranslation } from "react-i18next";

import {
  NotificationsQueryKeys,
  useMobileNavbar,
  useNotificationsList,
} from "hooks";
import { useManager } from "providers";
import type { GetNotificationsDto, NotificationDto } from "lib";

import { NotificationListItem } from "./components";
import { DEFAULT_NOTIFICATIONS_QUERY } from "./constants";
import type { NotificationsFilterMode } from "./types";
import {
  getUnreadNotificationIds,
  toRenderableNotificationError,
} from "./utils";
import "./styles.css";

const EMPTY_NOTIFICATIONS: NotificationDto[] = [];

export function Notifications() {
  const { t } = useTranslation();
  const manager = useManager();
  const notificationsClient =
    "Notifications" in manager ? manager.Notifications : null;
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();
  const [filterMode, setFilterMode] = useState<NotificationsFilterMode>("all");

  const title = t("_pages:notifications.title");

  useMobileNavbar(title);

  const queryParams = useMemo<GetNotificationsDto>(
    () => ({
      query: DEFAULT_NOTIFICATIONS_QUERY,
      unread: filterMode === "unread" ? true : undefined,
    }),
    [filterMode],
  );

  const notificationsQuery = useNotificationsList(queryParams);
  const notifications = notificationsQuery.data?.items ?? EMPTY_NOTIFICATIONS;
  const unreadNotificationIds = useMemo(
    () => getUnreadNotificationIds(notifications),
    [notifications],
  );

  const markAsReadMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      if (!notificationsClient) {
        throw new Error("notifications.featureUnavailable");
      }

      return await notificationsClient.markAsRead({ ids });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: NotificationsQueryKeys.all().queryKey,
      });
    },
    onError: (error) => {
      const renderableError = toRenderableNotificationError(
        error,
        t("_accessibility:errors.500"),
      );

      showErrorNotification({
        message: renderableError.message,
      });
    },
  });

  const markAllAsRead = () => {
    if (!unreadNotificationIds.length || markAsReadMutation.isPending) return;

    markAsReadMutation.mutate(unreadNotificationIds);
  };

  const markNotificationAsRead = (notificationId: number) => {
    if (markAsReadMutation.isPending) return;

    markAsReadMutation.mutate([notificationId]);
  };

  return (
    <Page
      title={title}
      isLoading={notificationsQuery.isLoading}
      queryKey={NotificationsQueryKeys.all().queryKey}
    >
      {notificationsQuery.error ? (
        <ErrorView
          error={toRenderableNotificationError(
            notificationsQuery.error,
            t("_accessibility:errors.500"),
          )}
        />
      ) : notificationsQuery.isLoading && !notifications.length ? (
        <div className="notifications-empty">
          <Loading />
        </div>
      ) : (
        <div className="notifications-view">
          <div className="notifications-toolbar">
            <div className="notifications-filter-group">
              <Button
                type="button"
                color="primary"
                variant={filterMode === "all" ? "submit" : "text"}
                onClick={() => setFilterMode("all")}
                aria-pressed={filterMode === "all"}
              >
                {t("_pages:notifications.filters.all")}
              </Button>
              <Button
                type="button"
                color="primary"
                variant={filterMode === "unread" ? "submit" : "text"}
                onClick={() => setFilterMode("unread")}
                aria-pressed={filterMode === "unread"}
              >
                {t("_pages:notifications.filters.unread")}
              </Button>
            </div>

            {unreadNotificationIds.length ? (
              <Button
                type="button"
                variant="outlined"
                onClick={markAllAsRead}
                disabled={markAsReadMutation.isPending}
              >
                {t("_pages:notifications.actions.markAllRead")}
              </Button>
            ) : null}
          </div>

          {notifications.length ? (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                  isMarkingRead={markAsReadMutation.isPending}
                  onMarkAsRead={markNotificationAsRead}
                />
              ))}
            </ul>
          ) : (
            <div className="notifications-empty">
              {t("_pages:notifications.empty")}
            </div>
          )}
        </div>
      )}
    </Page>
  );
}
