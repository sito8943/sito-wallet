import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

// form
import { FormContainerPropsType } from "../Form";

export type DialogPropsType = {
  open?: boolean;
  title: string;
  children?: ReactNode;
  handleClose: () => void;
  containerClassName?: string;
  className?: string;
  animationClass?: string;
};

export interface ConfirmationDialogPropsType extends DialogPropsType {
  handleSubmit: () => void;
  isLoading?: boolean;
}

export interface FormDialogPropsType<
  TFormType extends FieldValues,
  TError extends Error = Error
> extends DialogPropsType,
    Omit<FormContainerPropsType<TFormType, TError>, "children"> {}
