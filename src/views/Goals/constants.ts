import { GoalStatus } from "lib";

export const GOAL_PHOTO_INPUT_ID = "goal-photo-input";
export const GOAL_NAME_MAX_LENGTH = 80;
export const GOAL_DESCRIPTION_MAX_LENGTH = 500;

/** Status tabs in display order. */
export const GOAL_STATUS_TABS: GoalStatus[] = [
  GoalStatus.Active,
  GoalStatus.Completed,
  GoalStatus.Cancelled,
];

export const DEFAULT_GOAL_STATUS_TAB = GoalStatus.Active;

/** Translation key of each tab (`_pages:goals.tabs.*`). */
export const GOAL_STATUS_TAB_KEYS: Record<GoalStatus, string> = {
  [GoalStatus.Active]: "active",
  [GoalStatus.Completed]: "completed",
  [GoalStatus.Cancelled]: "cancelled",
};
