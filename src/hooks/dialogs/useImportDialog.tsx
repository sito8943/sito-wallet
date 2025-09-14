import { useTranslation } from "react-i18next";

// hooks
import { useImportAction, usePostForm } from "hooks";

// types
import { UseImportDialogPropsType } from "./types";

// lib
import { ImportDto } from "lib";
import { useState } from "react";

export function useImportDialog(
  props: UseImportDialogPropsType<number, ImportDto>
) {
  const { t } = useTranslation();

  const { queryKey, mutationFn, entity } = props;

  console.log(entity);

  const [showDialog, setShowDialog] = useState(false);

  const formProps = usePostForm({
    mutationFn,
    onSuccessMessage: t("_pages:common.actions.import.successMessage"),
    queryKey,
  });

  const { action } = useImportAction({
    onClick: () => setShowDialog(true),
  });

  return {
    ...formProps,
    open: showDialog,
    title: t("_pages:common.actions.import.dialog.title", {
      entity: t(`_pages:${entity}.title`),
    }),
    handleClose: () => setShowDialog(false),
    action,
  };
}
