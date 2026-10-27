// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { EditPurchaseProviderDialogPropsType } from "../types";

// components
import { PurchaseProviderForm } from "./PurchaseProviderForm";

export function EditPurchaseProviderDialog(
  props: EditPurchaseProviderDialogPropsType,
) {
  return (
    <FormDialog {...props}>
      <PurchaseProviderForm {...props} />
    </FormDialog>
  );
}
