import { FormDialog } from "@sito/dashboard-app";

import { AddSubscriptionProviderDialogPropsType } from "../types";

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
