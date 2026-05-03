import type { Control, FieldValues, UseFormSetValue } from "react-hook-form";

import type {
  ActionType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

import type { CommonCurrencyDto, FormMode, SubscriptionDto } from "lib";

export interface SubscriptionCardPropsType extends SubscriptionDto {
  actions: ActionType<SubscriptionDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export interface SubscriptionFormType
  extends FieldValues, Omit<SubscriptionDto, "createdAt" | "updatedAt"> {}

export interface SubscriptionFormPropsType {
  control: Control<SubscriptionFormType>;
  isLoading?: boolean;
  setValue: UseFormSetValue<SubscriptionFormType>;
  mode?: FormMode;
}

export interface SubscriptionBillingLogFormType extends FieldValues {
  subscriptionId: number;
  amount: string;
  paidAt: string;
  currency: CommonCurrencyDto | null;
  note: string;
}

export interface AddSubscriptionBillingLogDialogPropsType extends TriggerFormDialogPropsType<SubscriptionBillingLogFormType> {
  selectedSubscription: SubscriptionDto | null;
}

export enum SubscriptionAction {
  AddBillingLog = "addBillingLog",
}
