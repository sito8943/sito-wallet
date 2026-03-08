import { FieldValues } from "react-hook-form";

// @sito/dashboard-app
import { ActionType, FormDialogPropsType } from "@sito/dashboard-app";

// lib
import { DashboardDto } from "lib";

export interface DashboardCardPropsType extends DashboardDto {
  actions: ActionType<DashboardDto>[];
  onClick: (id: number) => void;
}

export interface DashboardFormType
  extends
    Omit<DashboardDto, "deletedAt" | "createdAt" | "updatedAt" | "user">,
    FieldValues {
  userId: number;
}

export type DashboardFormPropsType = FormDialogPropsType<DashboardFormType>;

export type AddDashboardDialogPropsType =
  FormDialogPropsType<DashboardFormType>;

export type EditDashboardDialogPropsType =
  FormDialogPropsType<DashboardFormType>;
