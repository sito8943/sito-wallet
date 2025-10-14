import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";
import { UseActionDialog } from "@sito/dashboard-app";

// types
import { FormDialogPropsType } from "components";
import {
  BaseEntityDto,
  CommonAccountDto,
  TransactionDto,
  ValidationError,
} from "lib";

export interface TransactionCardPropsType extends TransactionDto {
  actions: Action<TransactionDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface TransactionFormType
  extends Omit<
      TransactionDto,
      "currency" | "deleted" | "createdAt" | "updatedAt" | "user"
    >,
    FieldValues {}

export type TransactionFormPropsType = FormDialogPropsType<
  TransactionFormType,
  ValidationError
> & {
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
