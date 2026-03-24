import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import {
  ActionType,
  FormDialogPropsType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

// lib
import { AccountDto } from "lib";

export interface AccountCardPropsType extends Omit<
  Partial<AccountDto>,
  "name"
> {
  actions: ActionType<AccountDto>[];
  onClick?: (id: number) => void;
  containerClassName?: string;
  showLastTransactions?: boolean;
  showTypeResume?: boolean;
  showCurrency?: boolean;
  name: string | ReactNode;
  hideDescription?: boolean;
}

export interface AccountFormType
  extends
    Omit<AccountDto, "deletedAt" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

export type AccountFormPropsType = FormDialogPropsType<AccountFormType>;

export type AddAccountDialogPropsType = FormDialogPropsType<AccountFormType>;

export type EditAccountDialogPropsType = FormDialogPropsType<AccountFormType>;

export interface AdjustBalanceFormType {
  newBalance: string;
  description: string;
}

export interface AdjustBalanceDialogPropsType extends TriggerFormDialogPropsType<AdjustBalanceFormType> {
  selectedAccount: AccountDto | null;
}

export enum AccountActions {
  ViewTransactions = "viewTransactions",
  AddTransaction = "addTransaction",
  SyncAccount = "syncAccount",
  AdjustBalance = "adjustBalance",
}
