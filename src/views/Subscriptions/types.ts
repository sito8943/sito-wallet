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
}

export interface SubscriptionActivitySidebarPropsType {
  startsAt?: string | null;
  lastPaidAt?: string | null;
  nextRenewalAt?: string | null;
  billingLogs: SubscriptionBillingLogDto[];
  billingLogsLoading?: boolean;
  billingLogsError?: unknown;
}

export enum SubscriptionAction {
  AddBillingLog = "addBillingLog",
}
