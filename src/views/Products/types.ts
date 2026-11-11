import type { FieldValues } from "react-hook-form";

import type { FormDialogPropsType } from "@sito/dashboard-app";

import type { AddProductDto, PhotoFormValues, UpdateProductDto } from "lib";

export interface ProductFormType extends FieldValues, PhotoFormValues {
  id: number;
  name: string;
  alias: string;
}

export type ProductFormPropsType = FormDialogPropsType<ProductFormType>;

export type AddProductDialogPropsType = FormDialogPropsType<ProductFormType>;

export type EditProductDialogPropsType = FormDialogPropsType<ProductFormType>;

export interface CreateProductMutationDto {
  payload: AddProductDto;
  file: File | null;
}

export interface UpdateProductMutationDto {
  payload: UpdateProductDto;
  file: File | null;
}
