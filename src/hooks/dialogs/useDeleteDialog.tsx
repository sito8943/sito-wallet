import { useTranslation } from "react-i18next";

// providers
import { useNotification } from "@sito/dashboard-app";
import { queryClient } from "@sito/dashboard-app";

// lib
import { NotificationEnumType, NotificationType, ValidationError } from "lib";

// hooks
import { useDeleteAction, useConfirmationForm } from "hooks";

// types
import { UseDeleteDialogPropsType } from "hooks";

export const useDeleteDialog = (props: UseDeleteDialogPropsType) => {
  const { queryKey, onSuccess, ...rest } = props;

  const { showStackNotifications } = useNotification();
  const { t } = useTranslation();

  const { open, onClick, close, dialogFn, isLoading } = useConfirmationForm<
    number,
    ValidationError
  >({
    onSuccessMessage: t("_pages:common.actions.delete.successMessage"),
    onError: (error: ValidationError) => {
      if (error.errors)
        showStackNotifications(
          error.errors.map(
            ([key, message]) =>
              ({
                message: t(`_pages:${key}.errors.${message}`),
                type: NotificationEnumType.error,
              }) as NotificationType
          )
        );
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey });
      if (onSuccess) onSuccess(result);
    },
    ...rest,
  });

  const { action } = useDeleteAction({ onClick });

  return {
    onClick,
    title: t("_pages:common.actions.delete.dialog.title"),
    open,
    isLoading,
    handleSubmit: () => dialogFn.mutate(),
    handleClose: close,
    action,
  };
};
