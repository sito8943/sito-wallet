// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { AddProductDialogPropsType } from "../types";

// components
import { ProductForm } from "./ProductForm";

export function AddProductDialog(props: AddProductDialogPropsType) {
  return (
    <FormDialog {...props}>
      <ProductForm {...props} />
    </FormDialog>
  );
}
