import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import type {
  ActionType,
  ConfirmationDialogPropsType,
  FormDialogPropsType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

// lib
import type {
  AccountDto,
  AccountInterestConfigDto,
  AccountRewardsConfigDto,
  AccountRewardsDto,
  AdjustRewardsMode,
  CommonAccountDto,
} from "lib";

export interface AccountCardPropsType extends Omit<
  Partial<AccountDto>,
  "name"
> {
  actions: ActionType<AccountDto>[];
  onClick?: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
  containerClassName?: string;
  showLastTransactions?: boolean;
  showTypeResume?: boolean;
  showCurrency?: boolean;
  name: string | ReactNode;
  hideDescription?: boolean;
}

/** Raw form value: inputs/selects emit strings, DTOs bring numbers. */
export type AccountInterestFormValue = number | string | null | undefined;

/** Interest fields as held by the account form (coerced on submit). */
export type AccountInterestFormType = {
  [K in keyof AccountInterestConfigDto]?: AccountInterestFormValue;
};

/** Raw rewards value: inputs/selects emit strings, DTOs bring numbers. */
export type AccountRewardsFormValue = number | string | null | undefined;

/** Rewards fields as held by the account form (coerced on submit). */
export type AccountRewardsFormType = {
  [K in keyof AccountRewardsConfigDto]?: AccountRewardsFormValue;
};

export interface AccountFormType
  extends
    Omit<
      AccountDto,
      | "deletedAt"
      | "createdAt"
      | "updatedAt"
      | "user"
      | keyof AccountInterestConfigDto
      | keyof AccountRewardsConfigDto
    >,
    AccountInterestFormType,
    AccountRewardsFormType,
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

/** What the adjust-balance dialog needs; callers without a full AccountDto
 * (e.g. dashboard cards) can pass just these. */
export type AdjustBalanceAccountType = Pick<
  AccountDto,
  "id" | "balance" | "currency"
>;

export interface AdjustBalanceDialogPropsType extends TriggerFormDialogPropsType<AdjustBalanceFormType> {
  confirmationProps?: ConfirmationDialogPropsType;
  selectedAccount: AdjustBalanceAccountType | null;
}

export interface AdjustRewardsFormType extends FieldValues {
  mode: AdjustRewardsMode;
  /** Points to add/redeem (Delta) or the bank's balance (Balance). */
  amount: string;
}

/** What the adjust-points dialog needs: the account and its rewards data. */
export type AdjustRewardsAccountType = {
  id: number;
  rewards: Pick<AccountRewardsDto, "name" | "balance" | "earned">;
};

export interface AdjustRewardsDialogPropsType extends TriggerFormDialogPropsType<AdjustRewardsFormType> {
  selectedAccount: AdjustRewardsAccountType | null;
}

export interface TransferFormType extends FieldValues {
  destinationAccount: CommonAccountDto | null;
  amount: string;
  date: string;
  description: string;
}

export interface TransferDialogPropsType extends FormDialogPropsType<TransferFormType> {
  sourceAccount: AccountDto | null;
  accounts: CommonAccountDto[];
}

export enum AccountActions {
  ViewTransactions = "viewTransactions",
  AddTransaction = "addTransaction",
  SyncAccount = "syncAccount",
  AdjustBalance = "adjustBalance",
  Transfer = "transfer",
}
