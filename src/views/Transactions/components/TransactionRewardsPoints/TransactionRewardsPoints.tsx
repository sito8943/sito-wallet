import { useTranslation } from "react-i18next";

// types
import type { TransactionRewardsPointsPropsType } from "./types";

// utils
import { getRewardsPointsLabel } from "./utils";

import "./styles.css";

/** Card reward points a transaction earned (computed by the backend). */
export function TransactionRewardsPoints(
  props: TransactionRewardsPointsPropsType,
) {
  const { points, rewardsName } = props;
  const { t, i18n } = useTranslation();

  const label = getRewardsPointsLabel(t, i18n.language, points, rewardsName);
  if (!label) return null;

  return <span className="transaction-rewards-points">{label}</span>;
}
