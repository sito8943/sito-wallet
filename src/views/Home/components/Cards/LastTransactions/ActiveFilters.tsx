import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

import "../styles.css";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { account, categories, limit } = props;
  const { t } = useTranslation();

  return (
    <div className="dashboard-card-active-filters">
      <Chip
        text={
          <p>
            {t("_pages:home.dashboard.lastTransactions.limitChip", { limit })}
          </p>
        }
      />
      {account && <Chip text={<p>{account.name}</p>} />}
      {categories.map((category) => (
        <Chip key={category.id} text={<p>{category.name}</p>} />
      ))}
    </div>
  );
};
