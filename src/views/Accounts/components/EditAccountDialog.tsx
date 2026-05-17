// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { EditAccountDialogPropsType } from "../types";

// components
import { AccountForm } from "./AccountForm";

export function EditAccountDialog(props: EditAccountDialogPropsType) {
  return (
    <FormDialog {...props}>
      <AccountForm {...props} />
    </FormDialog>
  );
}
