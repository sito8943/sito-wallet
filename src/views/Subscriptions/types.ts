import { Control, FieldValues, UseFormSetValue } from "react-hook-form";

import { ActionType, TriggerFormDialogPropsType } from "@sito/dashboard-app";

import {
  CommonAccountDto,
  CommonCurrencyDto,
  CommonSubscriptionProviderDto,
  FormMode,
  SubscriptionBillingUnit,
  SubscriptionDto,
  SubscriptionStatus,
} from "lib";

export interface SubscriptionCardPropsType extends SubscriptionDto {
  actions: ActionType<SubscriptionDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export interface SubscriptionFormType extends FieldValues {
  id: number;
  name: string;
  description: string;
  provider: CommonSubscriptionProviderDto | null;
  account: CommonAccountDto | null;
  currency: CommonCurrencyDto | null;
  amount: string;
  billingFrequency: string;
  billingUnit: SubscriptionBillingUnit;
  startsAt: string;
  endsAt: string;
  lastPaidAt: string;
  status: SubscriptionStatus;
  autoCreateTransaction: boolean;
  notificationEnabled: boolean;
  notificationDaysBefore: string;
}

export interface SubscriptionFormPropsType {
  control: Control<SubscriptionFormType>;
  isLoading?: boolean;
  setValue: UseFormSetValue<SubscriptionFormType>;
  mode: FormMode;
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
