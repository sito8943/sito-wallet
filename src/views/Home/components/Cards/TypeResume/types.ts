import { FieldValues } from "react-hook-form";

// lib
import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  DashboardDto,
  TransactionType,
  UpdateDashboardCardConfigDto,
} from "lib";

// components
import { DialogPropsType, FormPropsType } from "components";

export interface TransactionTypePropsType extends DashboardDto {
  onDelete: () => void;
}

export interface ConfigFormDialogPropsType<
  TFormType extends FieldValues,
  ValidationError extends Error
> extends FormPropsType<TFormType, ValidationError>,
    Omit<DialogPropsType, "title"> {}

export interface TypeResumeTypeFormType
  extends UpdateDashboardCardConfigDto,
    FieldValues {
  accounts: CommonAccountDto[];
  startDate: string;
  endDate: string;
  category: CommonTransactionCategoryDto[];
  type: TransactionType;
}
