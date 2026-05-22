import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  Page,
  Error,
  Empty,
  ConfirmationDialog,
  ImportDialog,
  useImportDialog,
  PrettyGrid,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import {
  AddCurrencyDialog,
  CurrencyCard,
  EditCurrencyDialog,
} from "./components";
import {
  MobileSelectionBar,
  PrefabCurrencySuggestions,
  PrefabSuggestionsDialog,
} from "components";

// hooks
import {
  useInfiniteCurrenciesList,
  CurrenciesQueryKeys,
  useMobileNavbar,
  useMobileMultiSelection,
} from "hooks";
import { useAddCurrency, useEditCurrency } from "./hooks";

// types
import type {
  CurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto,
} from "lib";
import {
  Tables,
  isFeatureDisabledBusinessError,
  defaultCurrenciesListFilters,
  normalizeListFilters,
} from "lib";

// styles
import "./styles.css";

export function Currencies() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const queryClient = useQueryClient();

  const manager = useManager();

  const [prefabOpen, setPrefabOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteCurrenciesList({});

  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  useEffect(() => {
    if (!isFeatureDisabledBusinessError(error)) return;

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [error, showErrorNotification, t]);

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
    mutationFn: () =>
      manager.Currencies.export(
        normalizeListFilters(defaultCurrenciesListFilters) as FilterCurrencyDto,
      ),
  });

  const importCurrencies = useImportDialog<
    CurrencyDto,
    ImportPreviewCurrencyDto
  >({
    entity: Tables.Currencies,
    fileProcessor: (file, options) =>
      manager.Currencies.processImport(file, options?.override),
    mutationFn: (data) => manager.Currencies.import(data),
    /*  renderCustomPreview: (
      items: ImportPreviewCurrencyDto[] | null | undefined,
    ) => <CurrencyTable items={items} />, */
    ...CurrenciesQueryKeys.all(),
  });

  // #endregion

  const getActions = useCallback(
    (record: CurrencyDto) => [
      deleteCurrency.action(record),
      restoreCurrency.action(record),
    ],
    [deleteCurrency, restoreCurrency],
  );

  const mobileSelection = useMobileMultiSelection<CurrencyDto>({
    items,
    getActions,
  });

  const pageToolbar = useMemo(() => {
    return [exportCurrency.action(), importCurrencies.action()];
  }, [exportCurrency, importCurrencies]);

  useMobileNavbar(t("_pages:currencies.title"), pageToolbar);

  const openAddCurrencyRef = useRef(addCurrency.openDialog);
  useEffect(() => {
    openAddCurrencyRef.current = addCurrency.openDialog;
  }, [addCurrency.openDialog]);
  useRegisterBottomNavAction(
    useCallback(() => openAddCurrencyRef.current(), []),
  );

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
          <MobileSelectionBar
            className="currency-selection-bar"
            count={mobileSelection.selectedCount}
            multiActions={mobileSelection.multiActions}
            onActionClick={mobileSelection.onMultiActionClick}
            onCancel={mobileSelection.clearSelection}
          />
          <PrettyGrid
            data={items}
            className="full-grid max-sm:pb-6"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <Empty
                message={t("_pages:currencies.empty")}
                iconProps={{
                  icon: faCoins,
                  className: "text-5xl max-md:text-3xl text-text-muted",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
                  id: "prefab-suggestions",
                  disabled: isLoading,
                  onClick: () => setPrefabOpen(true),
                  tooltip: t("_pages:prefabs.trySuggestions"),
                }}
              />
            }
            renderComponent={(account) => (
              <CurrencyCard
                actions={getActions(account)}
                onClick={(id: number) => editCurrency.openDialog(id)}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(account.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
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
          <PrefabSuggestionsDialog
            open={prefabOpen}
            title={t("_pages:prefabs.dialog.currenciesTitle")}
            onClose={() => setPrefabOpen(false)}
            onComplete={() =>
              void queryClient.invalidateQueries({
                queryKey: CurrenciesQueryKeys.all().queryKey,
              })
            }
          >
            {(handleComplete) => (
              <PrefabCurrencySuggestions onComplete={handleComplete} />
            )}
          </PrefabSuggestionsDialog>
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
