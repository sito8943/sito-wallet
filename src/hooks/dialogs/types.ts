import { MutationFunction, QueryKey } from "@tanstack/react-query";
import { DefaultValues, FieldValues } from "react-hook-form";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// types
import { BaseEntityDto, ValidationError } from "lib";
import { UseConfirmationPropsType } from "../forms";
import { FormDialogPropsType } from "components";

export interface UseDeleteDialogPropsType
  extends UseConfirmationPropsType<number, ValidationError> {
  queryKey: QueryKey;
}

export interface UseFormDialogPropsType<
  TDto,
  TMutationDto,
  TMutationOutputDto,
  TFormType extends FieldValues
> {
  defaultValues?: DefaultValues<TFormType>;
  getFunction?: (id: number) => Promise<TDto>;
  formToDto: (data: TFormType) => TMutationDto;
  dtoToForm?: (data: TDto) => TFormType;
  mutationFn: MutationFunction<TMutationOutputDto, TMutationDto>;
  onError?: (errors: ValidationError) => void;
  onSuccess?: (data: TMutationOutputDto) => void;
  queryKey: QueryKey;
  onSuccessMessage: string;
  title: string;
}

export interface TriggerFormDialogPropsType<
  TFormType extends FieldValues,
  TError extends Error = Error
> extends FormDialogPropsType<TFormType, TError> {
  openDialog: (id?: number) => void;
}

export interface UseActionDialog<
  TRow extends BaseEntityDto,
  TFormType extends FieldValues
> extends TriggerFormDialogPropsType<TFormType, ValidationError> {
  action: (record: TRow) => Action<TRow>;
}
