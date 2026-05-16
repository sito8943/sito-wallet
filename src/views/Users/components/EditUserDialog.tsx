import { FormDialog } from "@sito/dashboard-app";

import { EditUserDialogPropsType } from "../types";

import { UserForm } from "./UserForm";

export function EditUserDialog(props: EditUserDialogPropsType) {
  return (
    <FormDialog {...props}>
      <UserForm {...props} isEdit />
    </FormDialog>
  );
}
