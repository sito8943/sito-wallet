// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { EditSubscriptionProviderDialogPropsType } from "../types";

// components
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
