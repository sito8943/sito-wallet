// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// types
import { ActiveFiltersPropsType } from "./types";

export const ActiveFilters = (props: ActiveFiltersPropsType) => {
  const { account } = props;

  if (!account) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center justify-start">
      <Chip text={<p>{account.name}</p>} />
    </div>
  );
};
