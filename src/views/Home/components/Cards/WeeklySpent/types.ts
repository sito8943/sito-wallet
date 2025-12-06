import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import { DialogPropsType, FormPropsType } from "@sito/dashboard-app";

// lib
import { CommonAccountDto, DashboardDto, UpdateDashboardCardConfigDto } from "lib";

export interface WeeklySpentPropsType extends DashboardDto {
  onDelete: () => void;
}

export interface ConfigFormDialogPropsType<
  TFormType extends FieldValues,
  ValidationError extends Error
> extends FormPropsType<TFormType, ValidationError>,
    Omit<DialogPropsType, "title"> {}

export interface WeeklySpentFormType
  extends UpdateDashboardCardConfigDto,
    FieldValues {
  accounts: CommonAccountDto[];
}

