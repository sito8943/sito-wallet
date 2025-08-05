import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// types
import { FormDialogPropsType } from "components";
import { BaseEntityDto, TransactionDto, ValidationError } from "lib";
import { UseActionDialog } from "hooks";

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
> & {
  lockCategory?: boolean;
  lockAccount?: boolean;
};

export type AddTransactionDialogPropsType = TransactionFormPropsType;

export type EditTransactionDialogPropsType = TransactionFormPropsType;

export type UseAddTransactionActionDialog<TDto extends BaseEntityDto> =
  UseActionDialog<TDto, TransactionFormType> & {
    lockCategory?: boolean;
    lockAccount?: boolean;
  };
