// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { AddSubscriptionProviderDialogPropsType } from "../types";

// components
import { SubscriptionProviderForm } from "./SubscriptionProviderForm";

export function AddSubscriptionProviderDialog(
  props: AddSubscriptionProviderDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <SubscriptionProviderForm {...props} />
    </FormDialog>
  );
}
