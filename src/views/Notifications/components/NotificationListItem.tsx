import { useTranslation } from "react-i18next";
import { Button, classNames, useTimeAge } from "@sito/dashboard-app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faWarning } from "@fortawesome/free-solid-svg-icons";

import {
  getNotificationMessage,
  getNotificationTitle,
} from "../../../lib/entities/notification/utils";

import type { NotificationListItemPropsType } from "../types";
import { isNotificationUnread } from "../utils";

export function NotificationListItem(props: NotificationListItemPropsType) {
  const { notification, isMarkingRead, onMarkAsRead } = props;
  const { t, i18n } = useTranslation();
  const { timeAge } = useTimeAge();

  const unread = isNotificationUnread(notification);
  const createdAt = new Date(notification.createdAt);
  const title = getNotificationTitle({
    notification,
    t,
    language: i18n.language,
    fallback: t("_pages:notifications.messages.unknownTitle"),
  });
  const message = getNotificationMessage({
    notification,
    t,
    language: i18n.language,
    fallback: t("_pages:notifications.messages.unknownMessage"),
  });

  return (
    <li
      className={classNames(
        "notifications-item",
        unread && "notifications-item-unread",
      )}
    >
      <div className="notifications-item-icon">
        <FontAwesomeIcon icon={unread ? faWarning : faCheckCircle} />
      </div>

      <div className="notifications-item-content">
        <div className="notifications-item-header">
          <div className="notifications-item-title-group">
            <h2 className="notifications-item-title">{title}</h2>
            <span
              className={classNames(
                "notifications-item-status",
                unread
                  ? "notifications-item-status-unread"
                  : "notifications-item-status-read",
              )}
            >
              {unread
                ? t("_pages:notifications.status.unread")
                : t("_pages:notifications.status.read")}
            </span>
          </div>

          <p className="notifications-item-date">{timeAge(createdAt)}</p>
        </div>

        <p className="notifications-item-message">{message}</p>

        {unread ? (
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => onMarkAsRead(notification.id)}
            disabled={isMarkingRead}
            className="notifications-mark-read-btn"
          >
            {t("_pages:notifications.actions.markAsRead")}
          </Button>
        ) : null}
      </div>
    </li>
  );
}
