// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddPrefabAccountsDialogPropsType } from "../types";

// components
import { PrefabAccountsForm } from "./PrefabAccountsForm";

export function AddPrefabAccountsDialog(
  props: AddPrefabAccountsDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <PrefabAccountsForm {...props} />
    </FormDialog>
  );
}
