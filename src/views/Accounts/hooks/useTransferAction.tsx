import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ActionType } from "@sito/dashboard-app";

import { useFeatureFlags } from "providers";

import type { AccountDto } from "lib";

import { AccountActions } from "../types";
import type { UseTransferActionProps } from "./types";

export function useTransferAction(props: UseTransferActionProps) {
  const { onClick, canTransfer, hidden = false } = props;
  const { t } = useTranslation();
  const { isFeatureEnabled } = useFeatureFlags();
  const transactionsEnabled = isFeatureEnabled("transactionsEnabled");

  const action = useCallback(
    (record: AccountDto): ActionType<AccountDto> => {
      const hasDestination = canTransfer(record);

      return {
        id: AccountActions.Transfer,
        hidden: hidden || !!record.deletedAt || !transactionsEnabled,
        disabled:
          !!record.deletedAt || !transactionsEnabled || !hasDestination,
        icon: (
          <FontAwesomeIcon
            className="account-action-icon"
            icon={faArrowRightArrowLeft}
          />
        ),
        tooltip: hasDestination
          ? t("_pages:accounts.actions.transfer.text")
          : t("_pages:accounts.actions.transfer.unavailable"),
        onClick: () => onClick(record),
      };
    },
    [canTransfer, hidden, onClick, t, transactionsEnabled],
  );

  return { action };
}
