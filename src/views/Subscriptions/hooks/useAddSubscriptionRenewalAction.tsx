import { useCallback } from "react";

import { classNames } from "@sito/dashboard-app";
import type { ActionType } from "@sito/dashboard-app";
import { useTranslation } from "@sito/dashboard-app";

import { faAdd, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SubscriptionDto } from "lib";

import { SubscriptionAction } from "../types";
import { toSubscriptionStatus } from "../utils";
import type { UseAddSubscriptionRenewalActionProps } from "./types";

import "./styles.css";

export function useAddSubscriptionRenewalAction(
  props: UseAddSubscriptionRenewalActionProps,
) {
  const { t } = useTranslation();
  const { hidden = false, isLoading = false, onClick } = props;

  const action = useCallback(
    (record: SubscriptionDto): ActionType<SubscriptionDto> => {
      const status = toSubscriptionStatus(record.status);
      const isCanceled = status === "CANCELED";

      return {
        id: SubscriptionAction.AddRenewal,
        hidden: hidden || !!record.deletedAt,
        disabled: !!record.deletedAt || isCanceled || isLoading,
        icon: (
          <FontAwesomeIcon
            icon={isLoading ? faCircleNotch : faAdd}
            className={classNames(
              "subscription-action-icon",
              isLoading && "rotate",
            )}
          />
        ),
        tooltip: isCanceled
          ? t("_pages:subscriptions.actions.renewal.disabled")
          : t("_pages:subscriptions.actions.renewal.text"),
        onClick: () => onClick(record),
      };
    },
    [hidden, isLoading, onClick, t],
  );

  return {
    action,
  };
}
