import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

// providers
import { queryClient, useNotification } from "providers";

// lib
import { NotificationEnumType, NotificationType, ValidationError } from "lib";

// types
import { UseFormPropsType } from "hooks";
import { FormPropsType } from "components";

export const usePostForm = <
  TDto,
  TMutationDto,
  TMutationOutputDto,
  TFormType extends FieldValues
>(
  props: UseFormPropsType<TDto, TMutationDto, TMutationOutputDto, TFormType>
): FormPropsType<TFormType, ValidationError> => {
  const { t } = useTranslation();
  const { showStackNotifications, showSuccessNotification } = useNotification();

  const {
    defaultValues,
    mutationFn,
    formToDto,
    onError,
    onSuccess,
    queryKey,
    onSuccessMessage,
  } = props;

  const { control, handleSubmit, reset, setError, getValues, setValue } =
    useForm<TFormType>({
      defaultValues,
    });

  const parseFormError = useCallback(
    (error: ValidationError) => {
      const valError = error?.errors;
      const messages: string[] = [];
      if (valError) {
        valError.forEach(([key, message]) => {
          const input = document.querySelector(`[name="${key}"]`);
          if (
            input instanceof HTMLInputElement ||
            input instanceof HTMLTextAreaElement ||
            input instanceof HTMLSelectElement
          ) {
            input.focus();
            input.classList.add("error");
            messages.push(t(`_entities:${queryKey}.${key}.${message}`));
          }
        });
      }
      return messages;
    },
    [t, queryKey]
  );

  const releaseFormError = useCallback(() => {
    const inputs = document.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.classList.remove("error");
    });
  }, []);

  const formFn = useMutation<TMutationOutputDto, ValidationError, TMutationDto>(
    {
      mutationFn,
      onError: (error: ValidationError) => {
        console.error(error);
        if (error.errors) {
          const messages = parseFormError(error);
          showStackNotifications(
            messages.map(
              (message) =>
                ({
                  message,
                  type: NotificationEnumType.error,
                } as NotificationType)
            )
          );
        }
        if (onError) onError(error);
      },
      onSuccess: async (result) => {
        if (queryClient) await queryClient.invalidateQueries({ queryKey });
        if (onSuccess) onSuccess(result);
        if (onSuccessMessage)
          showSuccessNotification({
            message: onSuccessMessage,
          } as NotificationType);
        close();
      },
    }
  );

  return {
    control,
    getValues,
    setValue,
    handleSubmit,
    onSubmit: (data) => formFn.mutate(formToDto(data)),
    reset,
    setError,
    parseFormError,
    releaseFormError,
    isLoading: formFn.isPending,
  };
};
