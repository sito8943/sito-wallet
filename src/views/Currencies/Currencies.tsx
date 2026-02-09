import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
  Page,
  PrettyGrid,
  Empty,
  Error,
  ConfirmationDialog,
} from "@sito/dashboard-app";

// icons
import { faAdd, faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// providers
import { useManager } from "providers";

// components
import {
  AddCurrencyDialog,
  CurrencyCard,
  EditCurrencyDialog,
} from "./components";

// hooks
import { useCurrenciesList, CurrenciesQueryKeys, useImportDialog } from "hooks";
import { useAddCurrency, useEditCurrency } from "./hooks";

// types
import { CurrencyDto, ImportPreviewCurrencyDto, Tables } from "lib";
import { ImportDialog } from "../../components/Dialog/ImportDialog";

export function Currencies() {
  const { t } = useTranslation();

  const manager = useManager();

  const { data, isLoading, error } = useCurrenciesList({});

  // #region actions

  const deleteCurrency = useDeleteDialog({
    mutationFn: (data) => manager.Currencies.softDelete(data),
    ...CurrenciesQueryKeys.all(),
  });

  const restoreCurrency = useRestoreDialog({
    mutationFn: (data) => manager.Currencies.restore(data),
    ...CurrenciesQueryKeys.all(),
  });

  const addCurrency = useAddCurrency();

  const editCurrency = useEditCurrency();

  const exportCurrency = useExportActionMutate({
    entity: Tables.Currencies,
    mutationFn: () => manager.Currencies.export(),
  });

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

  // #endregion

  const getActions = useCallback(
    (record: CurrencyDto) => [
      deleteCurrency.action(record),
      restoreCurrency.action(record),
    ],
    [deleteCurrency, restoreCurrency]
  );

  const pageToolbar = useMemo(() => {
    return [exportCurrency.action(), importCurrencies.action()];
  }, [exportCurrency, importCurrencies]);

  return (
    <Page
      title={t("_pages:currencies.title")}
      isLoading={isLoading}
      actions={pageToolbar}
      addOptions={{
        onClick: () => addCurrency.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:currencies.add"),
      }}
      queryKey={CurrenciesQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <PrettyGrid
            data={data?.items}
            emptyComponent={
              <Empty
                message={t("_pages:currencies.empty")}
                iconProps={{
                  icon: faCoins,
                  className: "text-5xl max-md:text-3xl text-gray-400",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading,
                  onClick: () => addCurrency.openDialog(),
                  tooltip: t("_pages:currencies.add"),
                }}
              />
            }
            renderComponent={(account) => (
              <CurrencyCard
                actions={getActions(account)}
                onClick={(id: number) => editCurrency.openDialog(id)}
                {...account}
              />
            )}
          />
          {/* Dialogs */}
          <AddCurrencyDialog {...addCurrency} />
          <EditCurrencyDialog {...editCurrency} />
          <ConfirmationDialog {...deleteCurrency} />
          <ConfirmationDialog {...restoreCurrency} />
          <ImportDialog {...importCurrencies} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
