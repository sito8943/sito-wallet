import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// types
import { FormDialogPropsType } from "components";
import { AccountDto, ValidationError } from "lib";

export interface AccountCardPropsType extends AccountDto {
  actions: Action<AccountDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface AccountFormType
  extends Omit<AccountDto, "deleted" | "createdAt" | "updatedAt">,
    FieldValues {}

export type AccountFormPropsType = FormDialogPropsType<
  AccountFormType,
  ValidationError
>;

export type AddAccountDialogPropsType = FormDialogPropsType<
  AccountFormType,
  ValidationError
>;

export type EditAccountDialogPropsType = FormDialogPropsType<
  AccountFormType,
  ValidationError
>;
