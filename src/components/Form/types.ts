import { TextInputPropsType } from "@sito/dashboard";
import { DetailedHTMLProps, ReactNode, TextareaHTMLAttributes } from "react";
import {
  Control,
  FieldValues,
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormReset,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

export interface ParagraphInputPropsType
  extends Pick<
      TextInputPropsType,
      | "label"
      | "state"
      | "containerClassName"
      | "inputClassName"
      | "labelClassName"
      | "helperText"
      | "helperTextClassName"
    >,
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    > {}

export type FormContainerPropsType<
  TFormType extends FieldValues,
  TError extends Error = Error
> = {
  children: ReactNode;
  control?: Control<TFormType>;
  getValues?: UseFormGetValues<TFormType>;
  setValue?: UseFormSetValue<TFormType>;
  reset?: UseFormReset<TFormType>;
  setError?: UseFormSetError<TFormType>;
  handleSubmit: UseFormHandleSubmit<TFormType>;
  onSubmit: SubmitHandler<TFormType>;
  parseFormError?: (error: TError) => string[];
  releaseFormError?: () => void;
  /* if the buttons are aligned to the end */
  buttonEnd?: boolean;
  isLoading?: boolean;
};

export type FormPropsType<
  TFormType extends FieldValues,
  TError extends Error = Error
> = Omit<FormContainerPropsType<TFormType, TError>, "children">;
