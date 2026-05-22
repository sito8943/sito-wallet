// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddPrefabSubscriptionProvidersDialogPropsType } from "../types";

// components
import { PrefabSubscriptionProvidersForm } from "./PrefabSubscriptionProvidersForm";

export function AddPrefabSubscriptionProvidersDialog(
  props: AddPrefabSubscriptionProvidersDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <PrefabSubscriptionProvidersForm {...props} />
    </FormDialog>
  );
}
