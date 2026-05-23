import { useTranslation } from "react-i18next";
import { Button, ImportDialog, useImportDialog } from "@sito/dashboard-app";
import {
  faCloudUpload,
  faCoins,
  faRepeat,
  faTags,
  faWallet,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// providers
import { useManager } from "providers";

// hooks
import {
  AccountsQueryKeys,
  CurrenciesQueryKeys,
  SubscriptionProvidersQueryKeys,
  TransactionsQueryKeys,
} from "hooks";
import {
  useAddAccountDialog,
  useAddPrefabAccountsDialog,
} from "views/Accounts/hooks";
import { useAddCurrency } from "views/Currencies/hooks/useAddCurrency";
import { useAddPrefabCurrenciesDialog } from "views/Currencies/hooks";
import {
  useAddSubscriptionProviderDialog,
  useAddPrefabSubscriptionProvidersDialog,
} from "views/SubscriptionProviders/hooks";
import {
  useAddTransactionCategoryDialog,
  useAddPrefabCategoriesDialog,
} from "views/TransactionCategories/hooks";

// components
import {
  AddAccountDialog,
  AddPrefabAccountsDialog,
} from "views/Accounts/components";
import {
  AddCurrencyDialog,
  AddPrefabCurrenciesDialog,
} from "views/Currencies/components";
import {
  AddSubscriptionProviderDialog,
  AddPrefabSubscriptionProvidersDialog,
} from "views/SubscriptionProviders/components";
import {
  AddTransactionCategoryDialog,
  AddPrefabCategoriesDialog,
} from "views/TransactionCategories/components";

// lib
import type {
  AccountDto,
  CurrencyDto,
  ImportPreviewAccountDto,
  ImportPreviewCurrencyDto,
  ImportPreviewSubscriptionProviderDto,
  ImportPreviewTransactionDto,
  SubscriptionProviderDto,
  TransactionDto,
} from "lib";
import { Tables } from "lib";

// types
import type { OnboardingSetupPropsType } from "./types";

// styles
import "./styles.css";

export function OnboardingSetup(props: OnboardingSetupPropsType) {
  const { stepKey } = props;
  const { t } = useTranslation();
  const manager = useManager();

  const addCurrency = useAddCurrency();
  const addAccount = useAddAccountDialog();
  const addTransactionCategory = useAddTransactionCategoryDialog();
  const addSubscriptionProvider = useAddSubscriptionProviderDialog();
  const prefabCurrencies = useAddPrefabCurrenciesDialog();
  const prefabAccounts = useAddPrefabAccountsDialog();
  const prefabCategories = useAddPrefabCategoriesDialog();
  const prefabSubscriptionProviders = useAddPrefabSubscriptionProvidersDialog();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;

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

  const importAccounts = useImportDialog<AccountDto, ImportPreviewAccountDto>({
    entity: Tables.Accounts,
    fileProcessor: (file, options) =>
      manager.Accounts.processImport(file, options?.override),
    mutationFn: (data) => manager.Accounts.import(data),
    ...AccountsQueryKeys.all(),
  });

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

  const importSubscriptionProviders = useImportDialog<
    SubscriptionProviderDto,
    ImportPreviewSubscriptionProviderDto
  >({
    entity: Tables.SubscriptionProviders,
    fileProcessor: (file, options) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionProvidersClient.processImport(file, options?.override);
    },
    mutationFn: (data) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      return subscriptionProvidersClient.import(data);
    },
    ...SubscriptionProvidersQueryKeys.all(),
  });

  if (stepKey === "currencies") {
    console.log(stepKey, prefabCurrencies.open);
    return (
      <>
        <div className="onboarding-setup">
          <p className="onboarding-setup-title">
            {t("_pages:onboarding.setup.currencies.title")}
          </p>
          <p className="onboarding-setup-description">
            {t("_pages:onboarding.setup.currencies.description")}
          </p>
          <div className="onboarding-setup-actions">
            <Button variant="outlined" onClick={() => addCurrency.openDialog()}>
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faCoins} />
                {t("_accessibility:buttons.create")}
              </span>
            </Button>
            <Button
              variant="outlined"
              onClick={() => importCurrencies.action().onClick()}
            >
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faCloudUpload} />
                {t("_accessibility:buttons.import")}
              </span>
            </Button>
            <Button
              variant="submit"
              color="primary"
              onClick={() => prefabCurrencies.openDialog()}
            >
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {t("_pages:prefabs.trySuggestions")}
              </span>
            </Button>
          </div>
        </div>
        <AddCurrencyDialog {...addCurrency} />
        <ImportDialog {...importCurrencies} />
        <AddPrefabCurrenciesDialog {...prefabCurrencies} />
      </>
    );
  }

  if (stepKey === "accounts") {
    return (
      <>
        <div className="onboarding-setup">
          <p className="onboarding-setup-title">
            {t("_pages:onboarding.setup.accounts.title")}
          </p>
          <p className="onboarding-setup-description">
            {t("_pages:onboarding.setup.accounts.description")}
          </p>
          <div className="onboarding-setup-actions">
            <Button onClick={() => addAccount.openDialog()}>
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faWallet} />
                {t("_accessibility:buttons.create")}
              </span>
            </Button>
            <Button
              variant="outlined"
              onClick={() => importAccounts.action().onClick()}
            >
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faCloudUpload} />
                {t("_accessibility:buttons.import")}
              </span>
            </Button>
            <Button
              variant="outlined"
              onClick={() => prefabAccounts.openDialog()}
            >
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {t("_pages:prefabs.trySuggestions")}
              </span>
            </Button>
          </div>
        </div>
        <AddAccountDialog {...addAccount} />
        <ImportDialog {...importAccounts} />
        <AddPrefabAccountsDialog {...prefabAccounts} />
      </>
    );
  }

  if (stepKey === "subscriptions") {
    return (
      <>
        <div className="onboarding-setup">
          <p className="onboarding-setup-title">
            {t("_pages:onboarding.setup.subscriptions.title")}
          </p>
          <p className="onboarding-setup-description">
            {t("_pages:onboarding.setup.subscriptions.description")}
          </p>
          <div className="onboarding-setup-actions">
            <Button onClick={() => addSubscriptionProvider.openDialog()}>
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faRepeat} />
                {t("_accessibility:buttons.create")}
              </span>
            </Button>
            <Button
              variant="outlined"
              onClick={() => importSubscriptionProviders.action().onClick()}
            >
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faCloudUpload} />
                {t("_accessibility:buttons.import")}
              </span>
            </Button>
            <Button
              variant="outlined"
              onClick={() => prefabSubscriptionProviders.openDialog()}
            >
              <span className="onboarding-setup-button-content">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                {t("_pages:prefabs.trySuggestions")}
              </span>
            </Button>
          </div>
        </div>
        <AddSubscriptionProviderDialog {...addSubscriptionProvider} />
        <ImportDialog {...importSubscriptionProviders} />
        <AddPrefabSubscriptionProvidersDialog
          {...prefabSubscriptionProviders}
        />
      </>
    );
  }

  return (
    <>
      <div className="onboarding-setup">
        <p className="onboarding-setup-title">
          {t("_pages:onboarding.setup.transactions.title")}
        </p>
        <p className="onboarding-setup-description">
          {t("_pages:onboarding.setup.transactions.description")}
        </p>
        <div className="onboarding-setup-actions">
          <Button onClick={() => addTransactionCategory.openDialog()}>
            <span className="onboarding-setup-button-content">
              <FontAwesomeIcon icon={faTags} />
              {t("_accessibility:buttons.create")}
            </span>
          </Button>
          <Button
            variant="outlined"
            onClick={() => importTransactions.action().onClick()}
          >
            <span className="onboarding-setup-button-content">
              <FontAwesomeIcon icon={faCloudUpload} />
              {t("_accessibility:buttons.import")}
            </span>
          </Button>
          <Button
            variant="outlined"
            onClick={() => prefabCategories.openDialog()}
          >
            <span className="onboarding-setup-button-content">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              {t("_pages:prefabs.trySuggestions")}
            </span>
          </Button>
        </div>
      </div>
      <AddTransactionCategoryDialog {...addTransactionCategory} />
      <ImportDialog {...importTransactions} />
      <AddPrefabCategoriesDialog {...prefabCategories} />
    </>
  );
}
