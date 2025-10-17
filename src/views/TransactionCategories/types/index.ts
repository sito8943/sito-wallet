import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";
import { ValidationError, FormDialogPropsType } from "@sito/dashboard-app";

// lib
import { TransactionCategoryDto } from "lib";

export * from "./actions";

export interface TransactionCategoryCardPropsType
  extends TransactionCategoryDto {
  actions: Action<TransactionCategoryDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface TransactionCategoryFormType
  extends Omit<
      TransactionCategoryDto,
      "deleted" | "createdAt" | "updatedAt" | "user"
    >,
    FieldValues {
  userId: number;
}

export type TransactionCategoryFormPropsType = FormDialogPropsType<
  TransactionCategoryFormType,
  ValidationError
>;

export type AddTransactionCategoryDialogPropsType = FormDialogPropsType<
  TransactionCategoryFormType,
  ValidationError
>;

export type EditTransactionCategoryDialogPropsType = FormDialogPropsType<
  TransactionCategoryFormType,
  ValidationError
>;
