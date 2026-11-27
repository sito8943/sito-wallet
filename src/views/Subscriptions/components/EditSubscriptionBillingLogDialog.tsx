import { FormDialog } from "@sito/dashboard-app";

import type { EditSubscriptionBillingLogDialogPropsType } from "../types";

import { SubscriptionBillingLogForm } from "./SubscriptionBillingLogForm";

export function EditSubscriptionBillingLogDialog(
  props: EditSubscriptionBillingLogDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <SubscriptionBillingLogForm {...props} />
    </FormDialog>
  );
}
