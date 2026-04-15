// @sito/dashboard
import { FormDialog } from "@sito/dashboard-app";

// types
import { AddDashboardDialogPropsType } from "../../types";

import { AddDashboardCardForm } from "./AddDashboardCardForm";

export function AddDashboardCardDialog(props: AddDashboardDialogPropsType) {
  return (
    <FormDialog {...props}>
      <AddDashboardCardForm {...props} />
    </FormDialog>
  );
}
