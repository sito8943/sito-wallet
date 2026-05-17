// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddAccountDialogPropsType } from "../types";

// components
import { AccountForm } from "./AccountForm";

export function AddAccountDialog(props: AddAccountDialogPropsType) {
  return (
    <FormDialog {...props}>
      <AccountForm {...props} />
    </FormDialog>
  );
}
