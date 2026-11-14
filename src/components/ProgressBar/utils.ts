import { PROGRESS_BAR_MAX, PROGRESS_BAR_MIN } from "./constants";

/** Percent kept inside 0–100; NaN/Infinity count as 0. */
export const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) return PROGRESS_BAR_MIN;
  return Math.min(PROGRESS_BAR_MAX, Math.max(PROGRESS_BAR_MIN, value));
};
