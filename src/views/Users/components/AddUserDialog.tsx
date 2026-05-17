import { FormDialog } from "@sito/dashboard-app";

import type { AddUserDialogPropsType } from "../types";

import { UserForm } from "./UserForm";

export function AddUserDialog(props: AddUserDialogPropsType) {
  return (
    <FormDialog {...props}>
      <UserForm {...props} />
    </FormDialog>
  );
}
