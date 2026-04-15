import { FieldValues } from "react-hook-form";

import { ActionType, FormDialogPropsType } from "@sito/dashboard-app";

import {
  AddSubscriptionProviderDto,
  SubscriptionProviderDto,
  UpdateSubscriptionProviderDto,
} from "lib";

export interface SubscriptionProviderCardPropsType extends SubscriptionProviderDto {
  actions: ActionType<SubscriptionProviderDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export interface SubscriptionProviderFormType extends FieldValues {
  id: number;
  name: string;
  description: string;
  website: string;
  photo: string;
  file: File | null;
  removePhoto: boolean;
  enabled: boolean;
}

export type SubscriptionProviderFormPropsType =
  FormDialogPropsType<SubscriptionProviderFormType>;

export type AddSubscriptionProviderDialogPropsType =
  FormDialogPropsType<SubscriptionProviderFormType>;

export type EditSubscriptionProviderDialogPropsType =
  FormDialogPropsType<SubscriptionProviderFormType>;

export interface CreateSubscriptionProviderMutationDto {
  payload: AddSubscriptionProviderDto;
  file: File | null;
}

export interface UpdateSubscriptionProviderMutationDto {
  payload: UpdateSubscriptionProviderDto;
  file: File | null;
  removePhoto: boolean;
}
