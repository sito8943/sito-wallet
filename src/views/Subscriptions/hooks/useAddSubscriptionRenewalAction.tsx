import { useCallback } from "react";

import type { ActionType} from "@sito/dashboard-app";
import { useTranslation } from "@sito/dashboard-app";

import {
  faAdd,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SubscriptionDto } from "lib";

import { SubscriptionAction } from "../types";
import { toSubscriptionStatus } from "../utils";
import type { UseAddSubscriptionRenewalActionProps } from "./types";

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
            className={`text-bg-primary ${isLoading ? "rotate" : ""}`}
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
