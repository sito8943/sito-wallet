import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { DialogPropsType, FormPropsType } from "@sito/dashboard-app";
import type { UpdateDashboardCardConfigDto } from "lib";

export type BaseCardPropsType = {
  className?: string;
  children: ReactNode;
};

type GenericConfigDialogProps<TForm extends FieldValues> = FormPropsType<TForm> &
  Omit<DialogPropsType, "title">;

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

export type DashboardCardProps<TForm extends FieldValues> = Common & {
  parseFormConfig: (config?: string | null) => TForm;
  formToDto: (
    data: TForm & { userId: number; id: number },
  ) => UpdateDashboardCardConfigDto;
  onConfigSaved?: () => void;
  ConfigFormDialog: (props: GenericConfigDialogProps<TForm>) => JSX.Element;
  renderActiveFilters?: (args: RenderFiltersArgs<TForm>) => JSX.Element | null;
  children?: (args: ChildrenArgs<TForm>) => JSX.Element | null;
};
