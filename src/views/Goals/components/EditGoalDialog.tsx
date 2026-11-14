// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { EditGoalDialogPropsType } from "../types";

// components
import { GoalForm } from "./GoalForm";

export function EditGoalDialog(props: EditGoalDialogPropsType) {
  return (
    <FormDialog {...props}>
      <GoalForm {...props} />
    </FormDialog>
  );
}
