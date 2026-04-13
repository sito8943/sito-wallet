import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { ActionType } from "@sito/dashboard-app";

import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SubscriptionDto } from "lib";

import { SubscriptionAction } from "../types";
import { toSubscriptionStatus } from "../utils";
import { UseAddSubscriptionBillingLogActionProps } from "./types";

export function useAddSubscriptionBillingLogAction(
  props: UseAddSubscriptionBillingLogActionProps,
) {
  const { t } = useTranslation();
  const { hidden = false, onClick } = props;

  const action = useCallback(
    (record: SubscriptionDto): ActionType<SubscriptionDto> => {
      const status = toSubscriptionStatus(record.status);
      const isCanceled = status === "CANCELED";

      return {
        id: SubscriptionAction.AddBillingLog,
        hidden: hidden || !!record.deletedAt,
        disabled: !!record.deletedAt || isCanceled,
        icon: <FontAwesomeIcon icon={faFileInvoice} className="text-bg-primary" />,
        tooltip: isCanceled
          ? t("_pages:subscriptions.actions.billingLog.disabled")
          : t("_pages:subscriptions.actions.billingLog.text"),
        onClick: () => onClick(record),
      };
    },
    [hidden, onClick, t],
  );

  return {
    action,
  };
}
