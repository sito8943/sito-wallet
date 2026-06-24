import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys, useMutationErrorHandler } from "hooks";

// utils
import { dtoToForm, emptyAccount, formToUpdateDto } from "../utils";

// types
import type { AccountFormType } from "../types";

// lib
import type { UpdateAccountDto, AccountDto } from "lib";

export function useEditAccountDialog() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();

  return usePutDialog<
    AccountDto,
    UpdateAccountDto,
    AccountDto,
    AccountFormType
  >({
    formToDto: formToUpdateDto,
    dtoToForm,
    defaultValues: emptyAccount,
    getFunction: (id) => manager.Accounts.getById(id),
    mutationFn: (data) => manager.Accounts.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.edit"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:account.name.unique",
      }),
    ...AccountsQueryKeys.all(),
  });
}
