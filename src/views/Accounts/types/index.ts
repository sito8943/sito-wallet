import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";
import { ValidationError } from "@sito/dashboard-app";

// types
import { FormDialogPropsType } from "components";

// lib
import { AccountDto } from "lib";

export * from "./actions";

export interface AccountCardPropsType extends AccountDto {
  actions: Action<AccountDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface AccountFormType
  extends Omit<AccountDto, "deleted" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

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
