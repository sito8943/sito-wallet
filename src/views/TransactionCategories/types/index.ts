import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import { ActionType, FormDialogPropsType } from "@sito/dashboard-app";

// lib
import { TransactionCategoryDto } from "lib";

export * from "./actions";

export interface TransactionCategoryCardPropsType extends TransactionCategoryDto {
  actions: ActionType<TransactionCategoryDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export interface TransactionCategoryFormType
  extends
    Omit<
      TransactionCategoryDto,
      "deletedAt" | "createdAt" | "updatedAt" | "user"
    >,
    FieldValues {
  userId: number;
}

export type TransactionCategoryFormPropsType =
  FormDialogPropsType<TransactionCategoryFormType>;

export type AddTransactionCategoryDialogPropsType =
  FormDialogPropsType<TransactionCategoryFormType>;

export type EditTransactionCategoryDialogPropsType =
  FormDialogPropsType<TransactionCategoryFormType>;
