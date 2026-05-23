import { faCoins } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { ImportDialog, useImportDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { CurrenciesQueryKeys } from "hooks";
import {
  useAddCurrency,
  useAddPrefabCurrenciesDialog,
} from "views/Currencies/hooks";

// components
import {
  AddCurrencyDialog,
  AddPrefabCurrenciesDialog,
} from "views/Currencies/components";

// lib
import type { CurrencyDto, ImportPreviewCurrencyDto } from "lib";
import { Tables } from "lib";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function CurrenciesSetup() {
  const manager = useManager();
  const addCurrency = useAddCurrency();
  const prefabCurrencies = useAddPrefabCurrenciesDialog();

  const importCurrencies = useImportDialog<
    CurrencyDto,
    ImportPreviewCurrencyDto
  >({
    entity: Tables.Currencies,
    fileProcessor: (file, options) =>
      manager.Currencies.processImport(file, options?.override),
    mutationFn: (data) => manager.Currencies.import(data),
    ...CurrenciesQueryKeys.all(),
  });

  return (
    <>
      <OnboardingSetupStep
        titleKey="_pages:onboarding.setup.currencies.title"
        descriptionKey="_pages:onboarding.setup.currencies.description"
        createIcon={faCoins}
        onCreate={() => addCurrency.openDialog()}
        onImport={() => importCurrencies.action().onClick()}
        onPrefab={() => prefabCurrencies.openDialog()}
      />
      <AddCurrencyDialog {...addCurrency} />
      <ImportDialog {...importCurrencies} />
      <AddPrefabCurrenciesDialog {...prefabCurrencies} />
    </>
  );
}
