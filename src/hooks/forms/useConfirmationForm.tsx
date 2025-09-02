import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

// hooks
import { useDialog } from "hooks";

// providers
import { useNotification } from "providers";

// types
import { NotificationType } from "lib";
import { UseConfirmationPropsType } from "hooks";

export const useConfirmationForm = <TInDto, TError extends Error>(
  props: UseConfirmationPropsType<TInDto, TError>
) => {
  const { showSuccessNotification } = useNotification();

  const { mutationFn, onError, onSuccess, onSuccessMessage } = props;

  const [recordToProcess, setRecordToProcess] = useState<TInDto | TInDto[]>([]);

  const { open, handleClose, handleOpen } = useDialog();

  const close = () => {
    handleClose();
    setRecordToProcess([]);
  };

  const onClick = async (record: TInDto | TInDto[]) => {
    setRecordToProcess(record);
    handleOpen();
  };

  const dialogFn = useMutation<TInDto, TError>({
    mutationFn: () =>
      mutationFn(
        Array.isArray(recordToProcess) ? recordToProcess : [recordToProcess]
      ),
    onError: (error: TError) => {
      console.error(error);
      if (onError) onError(error);
      close();
    },
    onSuccess: async (result: TInDto) => {
      if (onSuccess) onSuccess(result);
      showSuccessNotification({
        message: onSuccessMessage,
      } as NotificationType);
      close();
    },
  });

  return { open, onClick, close, dialogFn, isLoading: dialogFn.isPending };
};
