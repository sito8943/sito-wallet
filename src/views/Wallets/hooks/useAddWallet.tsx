import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { useFormDialog, WalletsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyWallet, formToDto } from "../utils";

// types
import { AddWalletDto, WalletDto } from "lib";
import { WalletFormType } from "../types";

export function useAddWallet() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    WalletDto,
    AddWalletDto,
    WalletDto,
    WalletFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyWallet,
    mutationFn: (data) => manager.Wallets.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:categories.forms.add"),
    ...WalletsQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
