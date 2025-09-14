import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

// lib
import { NotificationType } from "lib";

// providers
import { useNotification } from "providers";

// types
import { UseExportActionMutatePropsType } from "./types";

// actions
import { useExportAction } from "../actions";

export const useExportActionMutate = <TInOutDto, TError extends Error>(
  props: UseExportActionMutatePropsType<TInOutDto, TError>
) => {
  const { showSuccessNotification } = useNotification();
  const { t } = useTranslation();

  const {
    entity,
    mutationFn,
    onError,
    onSuccess,
    onSuccessMessage = t("_pages:common.actions.export.successMessage"),
  } = props;

  const mutation = useMutation<TInOutDto, TError>({
    mutationFn: () => mutationFn(),
    onError: (error: TError) => {
      console.error(error);
      if (onError) onError(error);
    },
    onSuccess: async (result: TInOutDto) => {
      const json = JSON.stringify(result, null, 2);

      const blob = new Blob([json], { type: "application/json" });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${entity}.json`;
      link.click();

      URL.revokeObjectURL(url);
      if (onSuccess) onSuccess(result);
      showSuccessNotification({
        message: onSuccessMessage,
      } as NotificationType);
    },
  });

  const onClickFn = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  const { action } = useExportAction({
    onClick: onClickFn,
    isLoading: mutation.isPending,
  });

  return {
    action,
  };
};
