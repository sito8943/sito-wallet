import { MutationFunction, QueryKey } from "@tanstack/react-query";
import { ValidationError } from "lib";
import { FieldValues, DefaultValues } from "react-hook-form";

export type UseConfirmationPropsType<TInDto, TError extends Error> = {
  mutationFn: (data: TInDto[]) => Promise<TInDto>;
  onError?: (error: TError) => void;
  onSuccess?: (data: TInDto) => void | Promise<void>;
  onSuccessMessage?: string;
};

export interface UseFormPropsType<
  TDto,
  TMutationDto,
  TMutationOutputDto,
  TFormType extends FieldValues
> {
  defaultValues?: DefaultValues<TFormType>;
  getFunction?: (id: number) => Promise<TDto>;
  formToDto?: (data: TFormType) => TMutationDto;
  dtoToForm?: (data: TDto) => TFormType;
  mutationFn: MutationFunction<TMutationOutputDto, TMutationDto>;
  onError?: (errors: ValidationError) => void;
  onSuccess?: (data: TMutationOutputDto) => void;
  queryKey?: QueryKey;
  onSuccessMessage?: string;
}
