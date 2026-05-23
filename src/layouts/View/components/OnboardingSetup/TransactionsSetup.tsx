import { faTags } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { ImportDialog, useImportDialog } from "@sito/dashboard-app";

// providers
import { useManager, useOnboardingDraft } from "providers";

// hooks
import { TransactionsQueryKeys } from "hooks";
import {
  useAddTransactionCategoryDialog,
  useAddPrefabCategoriesDialog,
} from "views/TransactionCategories/hooks";

// components
import {
  AddTransactionCategoryDialog,
  AddPrefabCategoriesDialog,
} from "views/TransactionCategories/components";

// lib
import type { ImportPreviewTransactionDto, TransactionDto } from "lib";
import { Tables } from "lib";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function TransactionsSetup() {
  const manager = useManager();
  const { isAnonymous } = useOnboardingDraft();
  const addTransactionCategory = useAddTransactionCategoryDialog();
  const prefabCategories = useAddPrefabCategoriesDialog();

  const importTransactions = useImportDialog<
    TransactionDto,
    ImportPreviewTransactionDto
  >({
    entity: Tables.Transactions,
    fileProcessor: (file, options) =>
      manager.Transactions.processImport(file, options?.override),
    mutationFn: (data) => manager.Transactions.import(data),
    ...TransactionsQueryKeys.all(),
  });

  return (
    <>
      <OnboardingSetupStep
        titleKey="_pages:onboarding.setup.transactions.title"
        descriptionKey="_pages:onboarding.setup.transactions.description"
        createIcon={faTags}
        onCreate={() => addTransactionCategory.openDialog()}
        onImport={
          isAnonymous ? undefined : () => importTransactions.action().onClick()
        }
        onPrefab={() => prefabCategories.openDialog()}
      />
      <AddTransactionCategoryDialog {...addTransactionCategory} />
      {!isAnonymous && <ImportDialog {...importTransactions} />}
      <AddPrefabCategoriesDialog {...prefabCategories} />
    </>
  );
}
