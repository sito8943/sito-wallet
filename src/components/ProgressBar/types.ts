export type ProgressBarVariant = "primary" | "success" | "warning" | "error";

export type ProgressBarPropsType = {
  /** Percent (0–100); out-of-range or invalid values are clamped. */
  value: number;
  variant?: ProgressBarVariant;
  /** Accessible name of the bar. */
  label?: string;
  className?: string;
};
