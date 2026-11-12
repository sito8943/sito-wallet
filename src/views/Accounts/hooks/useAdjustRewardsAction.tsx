import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { ActionType } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";

// types
import { AccountActions } from "../types";
import type { UseAdjustRewardsActionProps } from "./types";

// utils
import { canAdjustRewards } from "./adjustRewardsMutation.utils";

// lib
import type { AccountDto } from "lib";

/** "Adjust points" on Card accounts with rewards; hidden on any other account. */
export const useAdjustRewardsAction = (props: UseAdjustRewardsActionProps) => {
  const { t } = useTranslation();

  const { onClick } = props;

  const action = useCallback(
    (record: AccountDto): ActionType<AccountDto> => {
      const available = canAdjustRewards(record);
      return {
        id: AccountActions.AdjustRewards,
        hidden: !available,
        disabled: !available,
        icon: <FontAwesomeIcon className="account-action-icon" icon={faGift} />,
        tooltip: t("_pages:accounts.actions.adjustRewards.text"),
        onClick: () => onClick(record),
      };
    },
    [onClick, t],
  );

  return {
    action,
  };
};
