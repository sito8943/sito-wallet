import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys, useMutationErrorHandler } from "hooks";

// utils
import { formToAddDto, addEmptyAccount } from "../utils";

// types
import type { AccountFormType } from "../types";

// lib
import type { AccountDto, AddAccountDto } from "lib";

export function useAddAccountDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();

  const { handleSubmit, ...rest } = usePostDialog<
    AddAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto: formToAddDto,
    defaultValues: addEmptyAccount,
    mutationFn: (data) => manager.Accounts.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.add"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:account.name.unique",
      }),
    ...AccountsQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
