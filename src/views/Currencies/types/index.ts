import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// types
import { FormDialogPropsType } from "components";
import { CurrencyDto, ValidationError } from "lib";

export interface CurrencyCardPropsType extends CurrencyDto {
  actions: Action<CurrencyDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface CurrencyFormType
  extends Omit<CurrencyDto, "deleted" | "createdAt" | "updatedAt">,
    FieldValues {}

export type CurrencyFormPropsType = FormDialogPropsType<
  CurrencyFormType,
  ValidationError
>;

export type AddCurrencyDialogPropsType = FormDialogPropsType<
  CurrencyFormType,
  ValidationError
>;

export type EditCurrencyDialogPropsType = FormDialogPropsType<
  CurrencyFormType,
  ValidationError
>;
