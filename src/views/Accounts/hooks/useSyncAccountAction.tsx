import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { ActionType } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

// types
import type { UseSingleActionPropTypes } from "@sito/dashboard-app";
import { AccountActions } from "../types";

// lib
import type { AccountDto } from "lib";

export const useSyncAccountAction = (
  props: UseSingleActionPropTypes<number>,
) => {
  const { t } = useTranslation();

  const { hidden = false, onClick, isLoading } = props;

  const action = useCallback(
    (record: AccountDto): ActionType<AccountDto> => ({
      id: AccountActions.SyncAccount,
      hidden: !!record.deletedAt || hidden,
      disabled: !!record.deletedAt,
      icon: (
        <FontAwesomeIcon
          className={`text-bg-primary ${isLoading ? "rotate" : ""}`}
          icon={isLoading ? faCircleNotch : faArrowsRotate}
        />
      ),
      tooltip: t("_pages:accounts.actions.sync.text"),
      onClick: () => onClick(record.id),
    }),
    [hidden, isLoading, onClick, t],
  );

  return {
    action,
  };
};
