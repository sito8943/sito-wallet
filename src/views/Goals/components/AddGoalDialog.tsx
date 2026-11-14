// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddGoalDialogPropsType } from "../types";

// components
import { GoalForm } from "./GoalForm";

export function AddGoalDialog(props: AddGoalDialogPropsType) {
  return (
    <FormDialog {...props}>
      <GoalForm {...props} />
    </FormDialog>
  );
}
