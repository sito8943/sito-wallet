import { useTranslation } from "react-i18next";

import { usePutDialog } from "@sito/dashboard-app";

import { UsersQueryKeys, useMutationErrorHandler } from "hooks";
import { useManager } from "providers";

import type { UpdateUserDto, UserDto } from "lib";

import { emptyUserForm, userDtoToForm, userFormToUpdateDto } from "../utils";
import type { UserFormType } from "../types";

export function useEditUser() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();
  const usersClient = "Users" in manager ? manager.Users : null;

  return usePutDialog<UserDto, UpdateUserDto, number, UserFormType>({
    formToDto: userFormToUpdateDto,
    dtoToForm: userDtoToForm,
    defaultValues: emptyUserForm,
    getFunction: async (id) => {
      if (!usersClient) throw new Error("users.featureDisabled");
      return await usersClient.getById(id);
    },
    mutationFn: async (data) => {
      if (!usersClient) throw new Error("users.featureDisabled");
      return await usersClient.update(data);
    },
    onSuccessMessage: t("_pages:common.actions.edit.successMessage"),
    title: t("_pages:users.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:user.email.unique",
      }),
    ...UsersQueryKeys.all(),
  });
}
