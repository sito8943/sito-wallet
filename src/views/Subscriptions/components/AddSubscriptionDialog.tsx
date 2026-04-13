import { FormDialog } from "@sito/dashboard-app";

import { AddSubscriptionDialogPropsType } from "../types";

import { SubscriptionForm } from "./SubscriptionForm";

export function AddSubscriptionDialog(props: AddSubscriptionDialogPropsType) {
  return (
    <FormDialog {...props}>
      <SubscriptionForm {...props} />
    </FormDialog>
  );
}
