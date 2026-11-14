import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// hooks
import { GoalsQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { GoalDto } from "lib";

// utils
import { emptyGoalForm, goalDtoToForm, goalFormToUpdateDto } from "../utils";

// types
import type {
  GoalFormType,
  UpdateGoalMutationDto,
  UseGoalDialogProps,
} from "../types";

export function useEditGoalDialog(props: UseGoalDialogProps) {
  const { goals } = props;
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  const formDialog = usePutDialog<
    GoalDto,
    UpdateGoalMutationDto,
    number,
    GoalFormType
  >({
    formToDto: goalFormToUpdateDto,
    dtoToForm: goalDtoToForm,
    defaultValues: emptyGoalForm,
    getFunction: (id) => manager.Goals.getById(id),
    mutationFn: async ({ payload, file, removePhoto }) => {
      const id = await manager.Goals.update(payload);
      if (file) await manager.Goals.updatePhoto(payload.id, file);
      else if (removePhoto) await manager.Goals.deletePhoto(payload.id);
      return id;
    },
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
    title: t("_pages:goals.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        badRequest: { fallbackKey: "_accessibility:errors.500" },
      }),
    ...GoalsQueryKeys.all(),
  });

  return { ...formDialog, goals };
}
