// @sito/dashboard-app
import { FormDialog } from "@sito/dashboard-app";

// types
import type { EditProductDialogPropsType } from "../types";

// components
import { ProductForm } from "./ProductForm";

export function EditProductDialog(props: EditProductDialogPropsType) {
  return (
    <FormDialog {...props}>
      <ProductForm {...props} />
    </FormDialog>
  );
}
