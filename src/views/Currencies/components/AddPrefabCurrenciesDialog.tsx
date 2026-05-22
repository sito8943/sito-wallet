// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddPrefabCurrenciesDialogPropsType } from "../types";

// components
import { PrefabCurrenciesForm } from "./PrefabCurrenciesForm";

export function AddPrefabCurrenciesDialog(
  props: AddPrefabCurrenciesDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <PrefabCurrenciesForm {...props} />
    </FormDialog>
  );
}
