import { useTranslation } from "react-i18next";

// lib
import { formatRewardsPoints } from "lib";

// types
import type { RewardsSummaryPropsType } from "./types";

// utils
import { formatCurrencyAmount } from "./utils";

import "./styles.css";

export const RewardsSummary = (props: RewardsSummaryPropsType) => {
  const { data, locale, currencySymbol } = props;
  const { t } = useTranslation();

  return (
    <div className="card-rewards-summary">
      <dl className="card-rewards-stats">
        <div className="card-rewards-stat">
          <dt>
            {t("_pages:home.dashboard.cardRewards.balance", {
              name: data.name ?? t("_entities:account.rewards.defaultName"),
            })}
          </dt>
          <dd className="card-rewards-stat-value">
            {formatRewardsPoints(data.balance, locale)}
            {data.balanceValue !== null && (
              <span className="card-rewards-stat-sub">
                {t("_pages:home.dashboard.cardRewards.value", {
                  value: formatCurrencyAmount(
                    data.balanceValue,
                    locale,
                    currencySymbol,
                  ),
                })}
              </span>
            )}
          </dd>
        </div>
        <div className="card-rewards-stat">
          <dt>{t("_pages:home.dashboard.cardRewards.thisMonth")}</dt>
          <dd className="card-rewards-stat-value positive">
            +{formatRewardsPoints(data.currentMonthEarned, locale)}
          </dd>
        </div>
        <div className="card-rewards-stat">
          <dt>{t("_pages:home.dashboard.cardRewards.eligibleSpent")}</dt>
          <dd className="card-rewards-stat-value">
            {formatCurrencyAmount(data.eligibleSpent, locale, currencySymbol)}
          </dd>
        </div>
      </dl>
    </div>
  );
};
