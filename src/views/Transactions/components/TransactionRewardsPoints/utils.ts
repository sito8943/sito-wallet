import type { TFunction } from "i18next";

// lib
import { formatRewardsPoints } from "lib";

/**
 * "+4 RevPoints" for the points a transaction earned (program name falls
 * back to the default points name). undefined when it earns none.
 */
export const getRewardsPointsLabel = (
  t: TFunction,
  language: string,
  points: number | null | undefined,
  rewardsName: string | null | undefined,
): string | undefined => {
  if (points === null || points === undefined) return undefined;

  return t("_entities:transaction.rewardsPoints.label", {
    points: formatRewardsPoints(points, language),
    name: rewardsName || t("_entities:account.rewards.defaultName"),
  });
};
