import type { SavingsProjectionPointDto } from "lib";

/** Point radius: dense horizons (> 1 year of months) hide the dots. */
export const getPointRadius = (points: SavingsProjectionPointDto[]): number =>
  points.length > 13 ? 0 : 3;
