import { FormDialog } from "@sito/dashboard-app";

import { EditSubscriptionProviderDialogPropsType } from "../types";

import { SubscriptionProviderForm } from "./SubscriptionProviderForm";

export function EditSubscriptionProviderDialog(
  props: EditSubscriptionProviderDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <SubscriptionProviderForm {...props} />
    </FormDialog>
  );
}
