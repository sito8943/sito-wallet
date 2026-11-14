import type { FieldValues } from "react-hook-form";

// lib
import type { GoalDto, UpdateDashboardCardConfigDto } from "lib";
import type { DashboardCardItemPropsType } from "../types";

export type { ConfigFormDialogPropsType } from "../types";

export type GoalsCardPropsType = DashboardCardItemPropsType;

/** Goal picked in the config (stored with its name for display). */
export type GoalsCardGoalOption = Pick<GoalDto, "id" | "name">;

/** Card config persisted (as JSON) in the dashboard card `config` column. */
export interface GoalsCardFormType
  extends
    Omit<UpdateDashboardCardConfigDto, "config" | "userId" | "id">,
    FieldValues {
  /** Empty: every active goal. */
  goals: GoalsCardGoalOption[];
}

export type GoalsCardRowPropsType = {
  goal: GoalDto;
  locale: string;
};
