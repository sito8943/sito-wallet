import type { Control, FieldValues, UseFormSetValue } from "react-hook-form";

import type {
  ActionType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

import type {
  CommonAccountDto,
  CommonCurrencyDto,
  CommonTransactionCategoryDto,
  DebtDirection,
  DebtDto,
  DebtPaymentDto,
  FormMode,
} from "lib";

export interface DebtCardPropsType extends DebtDto {
  actions: ActionType<DebtDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
}

export interface DebtFormType extends FieldValues {
  id: number;
  counterpartyName: string;
  counterpartyContact: string;
  title: string;
  description: string;
  direction: DebtDirection;
  originalAmount: string;
  currency: CommonCurrencyDto | null;
  issuedAt: string;
  dueAt: string;
}

export interface DebtFormPropsType {
  control?: Control<DebtFormType>;
  isLoading?: boolean;
  setValue?: UseFormSetValue<DebtFormType>;
  mode?: FormMode;
}

export interface DebtPaymentFormType extends FieldValues {
  debtId: number;
  amount: string;
  paidAt: string;
  note: string;
  autoCreateTransaction: boolean;
  account: CommonAccountDto | null;
  category: CommonTransactionCategoryDto | null;
}

export interface AddDebtPaymentDialogPropsType extends TriggerFormDialogPropsType<DebtPaymentFormType> {
  selectedDebt: DebtDto | null;
}

export interface DebtActivitySidebarPropsType {
  issuedAt?: string | null;
  dueAt?: string | null;
  originalAmount?: number;
  pendingAmount?: number;
  currency?: CommonCurrencyDto | null;
  payments: DebtPaymentDto[];
  paymentsLoading?: boolean;
  paymentsError?: unknown;
  onDeletePayment?: (payment: DebtPaymentDto) => void;
}

export enum DebtAction {
  AddPayment = "addPayment",
  Cancel = "cancel",
}
