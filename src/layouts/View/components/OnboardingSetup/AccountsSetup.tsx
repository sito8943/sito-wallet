import { faWallet } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { ImportDialog, useImportDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys } from "hooks";
import {
  useAddAccountDialog,
  useAddPrefabAccountsDialog,
} from "views/Accounts/hooks";

// components
import {
  AddAccountDialog,
  AddPrefabAccountsDialog,
} from "views/Accounts/components";

// lib
import type { AccountDto, ImportPreviewAccountDto } from "lib";
import { Tables } from "lib";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function AccountsSetup() {
  const manager = useManager();
  const addAccount = useAddAccountDialog();
  const prefabAccounts = useAddPrefabAccountsDialog();

  const importAccounts = useImportDialog<AccountDto, ImportPreviewAccountDto>({
    entity: Tables.Accounts,
    fileProcessor: (file, options) =>
      manager.Accounts.processImport(file, options?.override),
    mutationFn: (data) => manager.Accounts.import(data),
    ...AccountsQueryKeys.all(),
  });

  return (
    <>
      <OnboardingSetupStep
        titleKey="_pages:onboarding.setup.accounts.title"
        descriptionKey="_pages:onboarding.setup.accounts.description"
        createIcon={faWallet}
        onCreate={() => addAccount.openDialog()}
        onImport={() => importAccounts.action().onClick()}
        onPrefab={() => prefabAccounts.openDialog()}
      />
      <AddAccountDialog {...addAccount} />
      <ImportDialog {...importAccounts} />
      <AddPrefabAccountsDialog {...prefabAccounts} />
    </>
  );
}
