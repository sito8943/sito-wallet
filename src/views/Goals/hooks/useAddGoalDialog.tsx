import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// hooks
import { GoalsQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// utils
import { emptyGoalForm, goalFormToAddDto } from "../utils";

// types
import type {
  CreateGoalMutationDto,
  GoalFormType,
  UseGoalDialogProps,
} from "../types";

export function useAddGoalDialog(props: UseGoalDialogProps) {
  const { goals } = props;
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  const formDialog = usePostDialog<CreateGoalMutationDto, number, GoalFormType>(
    {
      formToDto: goalFormToAddDto,
      defaultValues: emptyGoalForm,
      mutationFn: async ({ payload, file }) => {
        const id = await manager.Goals.insert(payload);
        if (file) await manager.Goals.updatePhoto(id, file);
        return id;
      },
      onSuccessMessage: t("_pages:common.actions.add.successMessage"),
      title: t("_pages:goals.forms.add"),
      onError: (error) =>
        handleMutationError(error, {
          badRequest: { fallbackKey: "_accessibility:errors.500" },
        }),
      ...GoalsQueryKeys.all(),
    },
  );

  return { ...formDialog, goals };
}
