import { FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";
import { ValidationError, FormDialogPropsType } from "@sito/dashboard-app";

// lib
import { DashboardDto } from "lib";

export interface DashboardCardPropsType extends DashboardDto {
  actions: Action<DashboardDto>[];
  onClick: (id: number) => void;
  deleted: boolean;
}

export interface DashboardFormType
  extends Omit<DashboardDto, "deleted" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

export type DashboardFormPropsType = FormDialogPropsType<
  DashboardFormType,
  ValidationError
>;

export type AddDashboardDialogPropsType = FormDialogPropsType<
  DashboardFormType,
  ValidationError
>;

export type EditDashboardDialogPropsType = FormDialogPropsType<
  DashboardFormType,
  ValidationError
>;
