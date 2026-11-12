import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";

// lib
import { formatRewardsPoints } from "lib";

// types
import type { AccountRewardsChipPropsType } from "./types";

/** Points balance of a Card account with rewards (comes with the account list). */
export function AccountRewardsChip(props: AccountRewardsChipPropsType) {
  const { balance, rewardsName } = props;
  const { t, i18n } = useTranslation();

  const name = rewardsName ?? t("_entities:account.rewards.defaultName");

  return (
    <Chip
      className="account-card-rewards-chip"
      text={
        <>
          <FontAwesomeIcon icon={faGift} />
          <span className="account-card-balance-label">{`${name}: `}</span>
          <span>{formatRewardsPoints(balance, i18n.language)}</span>
        </>
      }
    />
  );
}
