import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// types
import { FormDialogPropsType } from "components";
import { TransactionDto, ValidationError } from "lib";

export interface TransactionCardPropsType extends TransactionDto {
  actions: Action<TransactionDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface TransactionFormType
  extends Omit<TransactionDto, "deleted" | "createdAt" | "updatedAt" | "user">,
    FieldValues {}

export type TransactionFormPropsType = FormDialogPropsType<
  TransactionFormType,
  ValidationError
>;

export type AddTransactionDialogPropsType = FormDialogPropsType<
  TransactionFormType,
  ValidationError
>;

export type EditTransactionDialogPropsType = FormDialogPropsType<
  TransactionFormType,
  ValidationError
>;
