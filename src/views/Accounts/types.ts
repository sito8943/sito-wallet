import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import {
  ActionType,
  FormDialogPropsType,
} from "@sito/dashboard-app";

// lib
import { AccountDto } from "lib";

export interface AccountCardPropsType extends AccountDto {
  actions: ActionType<AccountDto>[];
  onClick: (id: number) => void;
}

export interface AccountFormType
  extends Omit<AccountDto, "deletedAt" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

export type AccountFormPropsType = FormDialogPropsType<AccountFormType>;

export type AddAccountDialogPropsType = FormDialogPropsType<AccountFormType>;

export type EditAccountDialogPropsType = FormDialogPropsType<AccountFormType>;

export enum AccountActions {
  ViewTransactions = "viewTransactions",
  AddTransaction = "addTransaction",
  SyncAccount = "syncAccount",
}
