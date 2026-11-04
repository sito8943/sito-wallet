import { COUNT_BADGE_MAX } from "./constants";

/** "+99" past the max, the number otherwise; null when there is nothing to show. */
export const formatBadgeCount = (count: number | undefined): string | null => {
  if (!count || count <= 0) return null;
  return count > COUNT_BADGE_MAX ? `+${COUNT_BADGE_MAX}` : String(count);
};
