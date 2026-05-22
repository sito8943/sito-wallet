// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddPrefabCategoriesDialogPropsType } from "../types";

// components
import { PrefabCategoriesForm } from "./PrefabCategoriesForm";

export function AddPrefabCategoriesDialog(
  props: AddPrefabCategoriesDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <PrefabCategoriesForm {...props} />
    </FormDialog>
  );
}
