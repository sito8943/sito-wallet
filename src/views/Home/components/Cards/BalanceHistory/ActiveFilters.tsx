import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

import "../styles.css";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { account, preset } = props;
  const { t } = useTranslation();

  return (
    <div className="dashboard-card-active-filters">
      {account && <Chip text={<p>{account.name}</p>} />}
      <Chip
        text={
          <p>{t(`_pages:home.dashboard.balanceHistory.presets.${preset}`)}</p>
        }
      />
    </div>
  );
};
