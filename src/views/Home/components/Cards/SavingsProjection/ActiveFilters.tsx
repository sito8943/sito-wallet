import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

// utils
import { formatDepositAmount } from "./utils";

import "../styles.css";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { account, horizon, monthlyDeposit, depositDay } = props;
  const { t, i18n } = useTranslation();

  return (
    <div className="dashboard-card-active-filters">
      {account && <Chip text={<p>{account.name}</p>} />}
      <Chip
        text={
          <p>
            {t(`_pages:home.dashboard.savingsProjection.horizons.${horizon}`)}
          </p>
        }
      />
      {monthlyDeposit !== null && monthlyDeposit > 0 && (
        <Chip
          text={
            <p>
              {t("_pages:home.dashboard.savingsProjection.depositFilter", {
                amount: formatDepositAmount(
                  monthlyDeposit,
                  i18n.language,
                  account?.currency?.symbol ?? "",
                ),
                day: depositDay,
              })}
            </p>
          }
        />
      )}
    </div>
  );
};
