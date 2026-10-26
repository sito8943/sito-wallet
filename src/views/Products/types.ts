import type { FieldValues } from "react-hook-form";

import type { FormDialogPropsType } from "@sito/dashboard-app";

export interface ProductFormType extends FieldValues {
  id: number;
  name: string;
}

export type ProductFormPropsType = FormDialogPropsType<ProductFormType>;

export type AddProductDialogPropsType = FormDialogPropsType<ProductFormType>;

export type EditProductDialogPropsType = FormDialogPropsType<ProductFormType>;
