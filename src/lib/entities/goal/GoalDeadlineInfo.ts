/** How a goal stands against its deadline (derived from `daysLeft`). */
export type GoalDeadlineKind = "none" | "left" | "today" | "overdue";

export interface GoalDeadlineInfo {
  kind: GoalDeadlineKind;
  /** Days until (`left`) or since (`overdue`) the deadline; 0 otherwise. */
  days: number;
}
