import { FieldValues } from "react-hook-form";

// @sito/dashboard
import {
  ActionType,
  BaseEntityDto,
  UseActionDialog,
  FormDialogPropsType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

// types
import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  TransactionDto,
} from "lib";

export interface TransactionCardPropsType extends TransactionDto {
  actions: ActionType<TransactionDto>[];
  onClick: (id: number) => void;
}

export interface TransactionFormType
  extends
    Omit<
      TransactionDto,
      "currency" | "deletedAt" | "createdAt" | "updatedAt" | "user"
    >,
    FieldValues {}

export type TransactionFormPropsType =
  FormDialogPropsType<TransactionFormType> & {
    lockCategory?: boolean;
    lockAccount?: boolean;
    account?: CommonAccountDto | null;
  };

export interface TriggerTransactionPropsType extends TransactionFormPropsType {
  openDialog: (id?: number) => void;
}

export type AddTransactionDialogPropsType = TriggerTransactionPropsType;

export type EditTransactionDialogPropsType = TriggerTransactionPropsType;

export type UseAddTransactionActionDialog<TDto extends BaseEntityDto> =
  UseActionDialog<TDto, TransactionFormType> & {
    lockCategory?: boolean;
    lockAccount?: boolean;
  };

export type UseAddTransactionDialogActionPropsType = {
  account: CommonAccountDto | null;
};

export interface AssignTransactionAccountFormType extends FieldValues {
  account: CommonAccountDto | null;
  transactionIds: number[];
}

export type AssignTransactionAccountDialogPropsType =
  TriggerFormDialogPropsType<AssignTransactionAccountFormType>;

export interface AssignTransactionCategoryFormType extends FieldValues {
  category: CommonTransactionCategoryDto | null;
  transactionIds: number[];
}

export type AssignTransactionCategoryDialogPropsType =
  TriggerFormDialogPropsType<AssignTransactionCategoryFormType>;

export enum TransactionActions {
  AssignAccount = "assignAccount",
  AssignCategory = "assignCategory",
}
