import { FormDialog } from "@sito/dashboard-app";

import { AddSubscriptionBillingLogDialogPropsType } from "../types";

import { SubscriptionBillingLogForm } from "./SubscriptionBillingLogForm";

export function AddSubscriptionBillingLogDialog(
  props: AddSubscriptionBillingLogDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <SubscriptionBillingLogForm {...props} />
    </FormDialog>
  );
}
