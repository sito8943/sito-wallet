// @sito/dashboard-app
import { classNames } from "@sito/dashboard-app";

// constants
import { PROGRESS_BAR_MAX, PROGRESS_BAR_MIN } from "./constants";

// utils
import { clampPercent } from "./utils";

// types
import type { ProgressBarPropsType } from "./types";

import "./styles.css";

export function ProgressBar(props: ProgressBarPropsType) {
  const { value, variant = "primary", label, className } = props;
  const percent = clampPercent(value);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={PROGRESS_BAR_MIN}
      aria-valuemax={PROGRESS_BAR_MAX}
      aria-valuenow={percent}
      className={classNames("progress-bar", className)}
    >
      <div
        className={classNames(
          "progress-bar-fill",
          `progress-bar-fill--${variant}`,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
