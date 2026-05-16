import { useTranslation } from "react-i18next";

import {
  isHttpError,
  useNotification,
  usePutDialog,
} from "@sito/dashboard-app";

import { UsersQueryKeys } from "hooks";
import { useManager } from "providers";

import { UpdateUserDto, UserDto } from "lib";

import { emptyUserForm, userDtoToForm, userFormToUpdateDto } from "../utils";
import { UserFormType } from "../types";

export function useEditUser() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

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
    onError: (error) => {
      if (isHttpError(error) && error.status === 409) {
        return showErrorNotification({
          message: t("_entities:user.email.unique"),
        });
      }

      return showErrorNotification({
        message: t("_accessibility:errors.500"),
      });
    },
    ...UsersQueryKeys.all(),
  });
}
