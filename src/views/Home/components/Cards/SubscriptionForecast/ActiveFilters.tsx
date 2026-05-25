import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

// utils
import { formatRangeWindow } from "./utils";

import "../styles.css";

const PRESET_TO_KEY: Record<string, string> = {
  CURRENT_WEEK: "CurrentWeek",
  NEXT_WEEK: "NextWeek",
  LAST_WEEK: "LastWeek",
  CURRENT_MONTH: "CurrentMonth",
  NEXT_MONTH: "NextMonth",
  LAST_MONTH: "LastMonth",
  CURRENT_YEAR: "CurrentYear",
  NEXT_YEAR: "NextYear",
  LAST_YEAR: "LastYear",
};

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { range, from, to } = props;
  const { t, i18n } = useTranslation();

  const key = PRESET_TO_KEY[range] ?? "CurrentMonth";
  const label = t(`_entities:subscriptionRenewal.range.values.${key}`);
  const windowLabel = formatRangeWindow(range, from, to, i18n.language);

  return (
    <div className="dashboard-card-active-filters">
      <Chip
        text={
          <p
            data-tooltip-id="tooltip"
            data-tooltip-content={windowLabel || label}
          >
            {label}
          </p>
        }
      />
    </div>
  );
};
