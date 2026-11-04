import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type CountBadgeIconPropsType = {
  icon: IconDefinition;
  /** Hidden when missing or 0. */
  count?: number;
};
