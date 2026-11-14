import { useTranslation } from "react-i18next";

// lib
import { formatRewardsPoints } from "lib";

// types
import type { TransactionRewardsPointsPropsType } from "./types";

import "./styles.css";

/** Card reward points a transaction earned (computed by the backend). */
export function TransactionRewardsPoints(
  props: TransactionRewardsPointsPropsType,
) {
  const { points, rewardsName } = props;
  const { t, i18n } = useTranslation();

  if (points === null || points === undefined) return null;

  return (
    <span className="transaction-rewards-points">
      {t("_entities:transaction.rewardsPoints.label", {
        points: formatRewardsPoints(points, i18n.language),
        name: rewardsName || t("_entities:account.rewards.defaultName"),
      })}
    </span>
  );
}
