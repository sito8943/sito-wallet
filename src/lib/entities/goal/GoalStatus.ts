export enum GoalStatus {
  Active = 0,
  Completed = 1,
  Cancelled = 2,
}

export const GOAL_STATUSES: GoalStatus[] = [
  GoalStatus.Active,
  GoalStatus.Completed,
  GoalStatus.Cancelled,
];

/**
 * Maps the numeric enum to the backend/i18n string name.
 */
export const GOAL_STATUS_NAME: Record<GoalStatus, string> = {
  [GoalStatus.Active]: "ACTIVE",
  [GoalStatus.Completed]: "COMPLETED",
  [GoalStatus.Cancelled]: "CANCELLED",
};
