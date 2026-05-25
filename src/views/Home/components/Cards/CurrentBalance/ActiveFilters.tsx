// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// types
import type { ActiveFiltersPropsType } from "./types";

import "../styles.css";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { account } = props;

  if (!account) return null;

  return (
    <div className="dashboard-card-active-filters">
      <Chip text={<p>{account.name}</p>} />
    </div>
  );
};
