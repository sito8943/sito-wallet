// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { EditCurrencyDialogPropsType } from "../types";

// components
import { CurrencyForm } from "./CurrencyForm";

export function EditCurrencyDialog(props: EditCurrencyDialogPropsType) {
  return (
    <FormDialog {...props}>
      <CurrencyForm {...props} />
    </FormDialog>
  );
}
