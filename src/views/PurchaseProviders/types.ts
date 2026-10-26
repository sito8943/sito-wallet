import type { FieldValues } from "react-hook-form";

import type { FormDialogPropsType } from "@sito/dashboard-app";

import type {
  AddPurchaseProviderDto,
  PhotoFormValues,
  UpdatePurchaseProviderDto,
} from "lib";

export interface PurchaseProviderFormType extends FieldValues, PhotoFormValues {
  id: number;
  name: string;
}

export type PurchaseProviderFormPropsType =
  FormDialogPropsType<PurchaseProviderFormType>;

export type AddPurchaseProviderDialogPropsType =
  FormDialogPropsType<PurchaseProviderFormType>;

export type EditPurchaseProviderDialogPropsType =
  FormDialogPropsType<PurchaseProviderFormType>;

export interface CreatePurchaseProviderMutationDto {
  payload: AddPurchaseProviderDto;
  file: File | null;
}

export interface UpdatePurchaseProviderMutationDto {
  payload: UpdatePurchaseProviderDto;
  file: File | null;
}
