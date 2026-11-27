import type { Control, FieldValues, UseFormSetValue } from "react-hook-form";

import type {
  ActionType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

import type {
  SubscriptionBillingLogDto,
  CommonCurrencyDto,
  CommonTransactionCategoryDto,
  FormMode,
  SubscriptionDto,
} from "lib";

export interface SubscriptionCardPropsType extends SubscriptionDto {
  actions: ActionType<SubscriptionDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
}

export interface SubscriptionFormType
  extends
    FieldValues,
    Omit<
      SubscriptionDto,
      "createdAt" | "updatedAt" | "category" | "categories"
    > {
  categories: CommonTransactionCategoryDto[];
}

export interface SubscriptionFormPropsType {
  control?: Control<SubscriptionFormType>;
  isLoading?: boolean;
  setValue?: UseFormSetValue<SubscriptionFormType>;
  mode?: FormMode;
  onCreateProvider?: (inputValue: string) => void;
  onCreateCurrency?: (inputValue: string) => void;
  onCreatePurchaseProvider?: (inputValue: string) => void;
}

export interface SubscriptionBillingLogFormType extends FieldValues {
  subscriptionId: number;
  amount: string;
  paidAt: string;
  currency: CommonCurrencyDto | null;
  note: string;
  autoCreateTransaction: boolean;
}

export interface AddSubscriptionBillingLogDialogPropsType extends TriggerFormDialogPropsType<SubscriptionBillingLogFormType> {
  selectedSubscription: SubscriptionDto | null;
  /** Editing keeps the loaded values and hides create-only fields. */
  editingBillingLog?: boolean;
}

export type EditSubscriptionBillingLogDialogPropsType =
  AddSubscriptionBillingLogDialogPropsType;

export interface SubscriptionActivitySidebarPropsType {
  startsAt?: string | null;
  lastPaidAt?: string | null;
  nextRenewalAt?: string | null;
  billingLogs: SubscriptionBillingLogDto[];
  billingLogsLoading?: boolean;
  billingLogsError?: unknown;
  onBillingLogClick?: (transactionId: number) => void;
  onEditBillingLog?: (log: SubscriptionBillingLogDto) => void;
  onDeleteBillingLog?: (log: SubscriptionBillingLogDto) => void;
}

export interface SubscriptionBillingLogItemPropsType {
  log: SubscriptionBillingLogDto;
  onClick?: (transactionId: number) => void;
  onEdit?: (log: SubscriptionBillingLogDto) => void;
  onDelete?: (log: SubscriptionBillingLogDto) => void;
}

export enum SubscriptionAction {
  AddBillingLog = "addBillingLog",
}
