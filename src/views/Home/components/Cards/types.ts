import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type {
  FormDialogPropsType,
  IconButtonPropsType,
} from "@sito/dashboard-app";
import type { DashboardDto, UpdateDashboardCardConfigDto } from "lib";

export type BaseCardPropsType = {
  className?: string;
  children: ReactNode;
};

export type DashboardCardDragHandlePropsType = Omit<
  IconButtonPropsType,
  "icon"
> & {
  "data-tooltip-id"?: string;
  "data-tooltip-content"?: string;
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
  dragHandleProps?: DashboardCardDragHandlePropsType;
  className?: string;
  isBusy?: boolean;
  loadingOverlay?: boolean;
};

export type DashboardCardItemPropsType = DashboardDto & {
  onDelete: () => void;
  dragHandleProps?: DashboardCardDragHandlePropsType;
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
