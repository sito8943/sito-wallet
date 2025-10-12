import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { faAdd, faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// providers
import { useManager } from "providers";

// components
import { ConfirmationDialog, Empty, Error, Page, PrettyGrid } from "components";
import {
  AddCurrencyDialog,
  CurrencyCard,
  EditCurrencyDialog,
} from "./components";

// hooks
import {
  useDeleteDialog,
  useCurrenciesList,
  CurrenciesQueryKeys,
  useRestoreDialog,
  useExportActionMutate,
  GlobalActions,
} from "hooks";
import { useAddCurrency, useEditCurrency } from "./hooks";

// types
import { CurrencyDto, Tables } from "lib";

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

  // #endregion

  const getActions = useCallback(
    (record: CurrencyDto) => [
      deleteCurrency.action(record),
      restoreCurrency.action(record),
    ],
    [deleteCurrency, restoreCurrency]
  );

  const pageToolbar = useMemo(() => {
    return [exportCurrency.action()];
  }, [exportCurrency]);

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
        </>
      ) : (
        <Error message={error?.message} />
      )}
    </Page>
  );
}
