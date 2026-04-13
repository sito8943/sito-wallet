import { FormDialog } from "@sito/dashboard-app";

import { EditSubscriptionDialogPropsType } from "../types";

import { SubscriptionForm } from "./SubscriptionForm";

export function EditSubscriptionDialog(props: EditSubscriptionDialogPropsType) {
  return (
    <FormDialog {...props}>
      <SubscriptionForm {...props} />
    </FormDialog>
  );
}
