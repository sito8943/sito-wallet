import { FieldValues } from "react-hook-form";

// types
import { ActionPropsType, FormDialogPropsType } from "components";
import { WalletDto, ValidationError } from "lib";

export interface WalletCardPropsType extends WalletDto {
  actions: ActionPropsType[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface WalletFormType
  extends Omit<WalletDto, "deleted" | "createdAt" | "updatedAt">,
    FieldValues {}

export type WalletFormPropsType = FormDialogPropsType<
  WalletFormType,
  ValidationError
>;

export type AddWalletDialogPropsType = FormDialogPropsType<
  WalletFormType,
  ValidationError
>;

export type EditWalletDialogPropsType = FormDialogPropsType<
  WalletFormType,
  ValidationError
>;
