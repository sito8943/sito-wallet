// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import { AddCurrencyDialogPropsType } from "../types";

// components
import { CurrencyForm } from "./CurrencyForm";

export function AddCurrencyDialog(props: AddCurrencyDialogPropsType) {
  return (
    <FormDialog {...props}>
      <CurrencyForm {...props} />
    </FormDialog>
  );
}
