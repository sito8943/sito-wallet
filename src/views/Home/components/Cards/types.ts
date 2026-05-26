import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormDialogPropsType } from "@sito/dashboard-app";
import type { UpdateDashboardCardConfigDto } from "lib";

export type BaseCardPropsType = {
  className?: string;
  children: ReactNode;
};

export type ConfigFormDialogPropsType<TForm extends FieldValues> = Omit<
  FormDialogPropsType<TForm>,
  "title"
>;

type Common = {
  id: number;
  userId?: number;
  title: string | null;
  config?: string | null;
  onDelete: () => void;
  className?: string;
  isBusy?: boolean;
  loadingOverlay?: boolean;
};

type RenderFiltersArgs<TForm> = {
  formConfig: TForm;
  onSubmit: (updated: TForm) => void;
};

type ChildrenArgs<TForm> = {
  formConfig: TForm;
};

export type CardConfigOverrideType = {
  baseConfig?: string | null;
  savedConfig: string;
};

export type DashboardCardProps<TForm extends FieldValues> = Common & {
  parseFormConfig: (config?: string | null) => TForm;
  formToDto: (
    data: TForm & { userId: number; id: number },
  ) => UpdateDashboardCardConfigDto;
  onConfigSaved?: (savedConfig: string) => void;
  ConfigFormDialog: (props: ConfigFormDialogPropsType<TForm>) => JSX.Element;
  renderActiveFilters?: (args: RenderFiltersArgs<TForm>) => JSX.Element | null;
  children?: (args: ChildrenArgs<TForm>) => JSX.Element | null;
};
