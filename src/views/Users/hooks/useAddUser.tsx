import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { isHttpError, useNotification, usePostDialog } from "@sito/dashboard-app";

import { UsersQueryKeys } from "hooks";
import { useManager } from "providers";

import { AddUserDto } from "lib";

import { emptyAddUserForm, userFormToCreateDto } from "../utils";
import { UserFormType } from "../types";

export function useAddUser() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const usersClient = "Users" in manager ? manager.Users : null;

  const queryKey = useMemo(() => UsersQueryKeys.all().queryKey, []);

  const { handleSubmit, ...rest } = usePostDialog<
    AddUserDto,
    number,
    UserFormType
  >({
    formToDto: userFormToCreateDto,
    defaultValues: emptyAddUserForm,
    mutationFn: async (data) => {
      if (!usersClient) throw new Error("users.featureDisabled");
      return await usersClient.insert(data);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:users.forms.add"),
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
    queryKey,
  });

  return {
    handleSubmit,
    ...rest,
  };
}
