// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddPurchaseProviderDialogPropsType } from "../types";

// components
import { PurchaseProviderForm } from "./PurchaseProviderForm";

export function AddPurchaseProviderDialog(
  props: AddPurchaseProviderDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <PurchaseProviderForm {...props} />
    </FormDialog>
  );
}
