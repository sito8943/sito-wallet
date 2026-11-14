import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";

// lib
import { formatRewardsPoints } from "lib";

// types
import type { TransactionRewardsPointsPropsType } from "./types";

import "./styles.css";

/** Card reward points a transaction earned (computed by the backend). */
export function TransactionRewardsPoints(
  props: TransactionRewardsPointsPropsType,
) {
  const { points } = props;
  const { t, i18n } = useTranslation();

  if (points === null || points === undefined) return null;

  const label = t("_entities:transaction.rewardsPoints.label", {
    points: formatRewardsPoints(points, i18n.language),
  });

  return (
    <span
      className="transaction-rewards-points"
      aria-label={t("_entities:transaction.rewardsPoints.aria", {
        points: formatRewardsPoints(points, i18n.language),
      })}
    >
      <FontAwesomeIcon icon={faGift} aria-hidden />
      {label}
    </span>
  );
}
