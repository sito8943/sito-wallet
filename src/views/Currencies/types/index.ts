import type { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import type { ActionType, FormDialogPropsType } from "@sito/dashboard-app";

// lib
import type { AddCurrencyDto, CurrencyDto } from "lib";

export interface PrefabCurrenciesFormType extends FieldValues {
  codes: string[];
}

export interface PrefabCurrenciesPayload {
  items: AddCurrencyDto[];
  codes: string[];
}

export type AddPrefabCurrenciesDialogPropsType =
  FormDialogPropsType<PrefabCurrenciesFormType>;

export interface CurrencyCardPropsType extends CurrencyDto {
  actions: ActionType<CurrencyDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export interface CurrencyFormType
  extends
    Omit<CurrencyDto, "deletedAt" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

export type CurrencyFormPropsType = FormDialogPropsType<CurrencyFormType>;

export type AddCurrencyDialogPropsType = FormDialogPropsType<CurrencyFormType>;

export type EditCurrencyDialogPropsType = FormDialogPropsType<CurrencyFormType>;
