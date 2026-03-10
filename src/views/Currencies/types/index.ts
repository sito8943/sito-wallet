import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import {
  ActionType,
  FormDialogPropsType,
} from "@sito/dashboard-app";

// lib
import { CurrencyDto } from "lib";

export interface CurrencyCardPropsType extends CurrencyDto {
  actions: ActionType<CurrencyDto>[];
  onClick: (id: number) => void;
}

export interface CurrencyFormType
  extends Omit<CurrencyDto, "deletedAt" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

export type CurrencyFormPropsType = FormDialogPropsType<CurrencyFormType>;

export type AddCurrencyDialogPropsType = FormDialogPropsType<CurrencyFormType>;

export type EditCurrencyDialogPropsType = FormDialogPropsType<CurrencyFormType>;
