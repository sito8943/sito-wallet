import { FieldValues } from "react-hook-form";

import {
  ActionType,
  FormDialogPropsType,
  TriggerFormDialogPropsType,
} from "@sito/dashboard-app";

import {
  CommonCurrencyDto,
  CommonSubscriptionProviderDto,
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
  currency: CommonCurrencyDto | null;
  amount: string;
  billingFrequency: string;
  billingUnit: SubscriptionBillingUnit;
  startsAt: string;
  lastPaidAt: string;
  status: SubscriptionStatus;
  notificationEnabled: boolean;
  notificationDaysBefore: string;
}

export type SubscriptionFormPropsType = FormDialogPropsType<SubscriptionFormType>;

export type AddSubscriptionDialogPropsType = FormDialogPropsType<SubscriptionFormType>;

export type EditSubscriptionDialogPropsType = FormDialogPropsType<SubscriptionFormType>;

export interface SubscriptionBillingLogFormType extends FieldValues {
  subscriptionId: number;
  amount: string;
  paidAt: string;
  currency: CommonCurrencyDto | null;
  note: string;
}

export interface AddSubscriptionBillingLogDialogPropsType
  extends TriggerFormDialogPropsType<SubscriptionBillingLogFormType> {
  selectedSubscription: SubscriptionDto | null;
}

export enum SubscriptionAction {
  AddBillingLog = "addBillingLog",
}
