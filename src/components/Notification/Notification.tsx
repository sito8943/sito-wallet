import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

// provider
import { useNotification } from "providers";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClose,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";

// types
import { NotificationEnumType } from "lib";

// styles
import "./styles.css";

export function Notification() {
  const { t } = useTranslation();

  const { notification, removeNotification } = useNotification();

  const onClose = useCallback(
    (index?: number) => removeNotification(index),
    [removeNotification]
  );

  const renderIcon = useCallback((type: NotificationEnumType) => {
    switch (type) {
      case NotificationEnumType.error:
        return faWarning;
      default: // success
        return faCircleCheck;
    }
  }, []);

  const textColor = useCallback((type: NotificationEnumType) => {
    switch (type) {
      case NotificationEnumType.success:
        return "!text-success";
      case NotificationEnumType.error:
        return "!text-error";
      case NotificationEnumType.warning:
        return "!text-warning";
      default:
        return "!text-info";
    }
  }, []);

  const bgColor = useCallback((type: NotificationEnumType) => {
    switch (type) {
      case NotificationEnumType.success:
        return "bg-bg-success";
      case NotificationEnumType.error:
        return "bg-bg-error";
      case NotificationEnumType.warning:
        return "bg-bg-warning";
      default:
        return "bg-bg-info";
    }
  }, []);

  useEffect(() => {
    if (notification?.length) window.addEventListener("click", () => onClose());
    return () => {
      if (notification?.length)
        window.removeEventListener("click", () => onClose());
    };
  }, [notification, onClose]);

  return createPortal(
    <div
      className={`notification-portal ${notification?.length ? "w-screen h-screen" : ""}`}
    >
      {notification?.length
        ? notification?.map(({ id, type, message }, i) => (
            <div
              key={id}
              className={`apparition notification ${bgColor(type)}`}
            >
              <div className="flex gap-3 items-center">
                <FontAwesomeIcon
                  icon={renderIcon(type)}
                  className={`${textColor(type)}`}
                />
                <p className={`whitespace-nowrap ${textColor(type)}`}>
                  {message}
                </p>
              </div>
              <button
                type="button"
                name={t("_accessibility:buttons.closeNotification")}
                aria-label={t("_accessibility:ariaLabels.closeNotification")}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  className={`${textColor(type)} hover:text-red-400 cursor-pointer`}
                  onClick={() => onClose(i)}
                />
              </button>
            </div>
          ))
        : null}
    </div>,
    document.body
  );
}
