import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

// types
import type { ProjectionSummaryPropsType } from "./types";

// utils
import {
  formatAmount,
  formatDeviation,
  formatRate,
  shouldWarnAer,
} from "./utils";

import "./styles.css";

export const ProjectionSummary = (props: ProjectionSummaryPropsType) => {
  const { data, locale, currencySymbol } = props;
  const { t } = useTranslation();

  const hasAer = data.aer !== null && data.aer !== undefined;

  return (
    <div className="savings-projection-summary">
      <dl className="savings-projection-stats">
        <div className="savings-projection-stat">
          <dt>{t("_pages:home.dashboard.savingsProjection.totalInterest")}</dt>
          <dd className="savings-projection-stat-value positive">
            +{formatAmount(data.totalInterest, locale)} {currencySymbol}
          </dd>
        </div>
        <div className="savings-projection-stat">
          <dt>{t("_pages:home.dashboard.savingsProjection.endBalance")}</dt>
          <dd className="savings-projection-stat-value">
            {formatAmount(data.endBalance, locale)} {currencySymbol}
          </dd>
        </div>
        <div className="savings-projection-stat">
          <dt>{t("_pages:home.dashboard.savingsProjection.effectiveRate")}</dt>
          <dd className="savings-projection-stat-value">
            {formatRate(data.effectiveAnnualRate, locale)}
            {hasAer && (
              <span className="savings-projection-stat-sub">
                {t("_pages:home.dashboard.savingsProjection.vsAer", {
                  aer: formatRate(data.aer ?? 0, locale),
                })}
              </span>
            )}
          </dd>
        </div>
      </dl>
      {shouldWarnAer(data) && (
        <p className="savings-projection-warning" role="alert">
          <FontAwesomeIcon icon={faWarning} />
          {t("_pages:home.dashboard.savingsProjection.aerMismatch", {
            effective: formatRate(data.effectiveAnnualRate, locale),
            aer: formatRate(data.aer ?? 0, locale),
            deviation: formatDeviation(data.aerDeviation ?? 0, locale),
          })}
        </p>
      )}
    </div>
  );
};
