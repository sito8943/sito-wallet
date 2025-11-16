import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

// types
import { UseSingleActionPropTypes } from "@sito/dashboard-app";
import { AccountActions } from "../types";

// lib
import { AccountDto } from "lib";

export const useSyncAccountAction = (
  props: UseSingleActionPropTypes<number>
) => {
  const { t } = useTranslation();

  const { hidden = false, onClick, isLoading } = props;

  const action = useCallback(
    (record: AccountDto): ActionType<AccountDto> => ({
      id: AccountActions.SyncAccount,
      hidden: record.deleted || hidden,
      disabled: record.deleted,
      icon: (
        <FontAwesomeIcon
          className={`text-bg-primary ${isLoading ? "rotate" : ""}`}
          icon={isLoading ? faCircleNotch : faRotateLeft}
        />
      ),
      tooltip: t("_pages:accounts.actions.sync.text"),
      onClick: () => onClick(record.id),
    }),
    [hidden, isLoading, onClick, t]
  );

  return {
    action,
  };
};
