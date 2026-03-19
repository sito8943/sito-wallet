import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { ActionType } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

// types
import { AccountActions } from "../types";

// lib
import { AccountDto } from "lib";

interface UseAdjustBalanceActionProps {
  onClick: (record: AccountDto) => void;
  hidden?: boolean;
}

export const useAdjustBalanceAction = (
  props: UseAdjustBalanceActionProps
) => {
  const { t } = useTranslation();

  const { hidden = false, onClick } = props;

  const action = useCallback(
    (record: AccountDto): ActionType<AccountDto> => ({
      id: AccountActions.AdjustBalance,
      hidden: !!record.deletedAt || hidden,
      disabled: !!record.deletedAt,
      icon: (
        <FontAwesomeIcon
          className="text-bg-primary"
          icon={faScaleBalanced}
        />
      ),
      tooltip: t("_pages:accounts.actions.adjustBalance.text"),
      onClick: () => onClick(record),
    }),
    [hidden, onClick, t]
  );

  return {
    action,
  };
};
