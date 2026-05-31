import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCoins,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  useDeleteDialog,
  useRestoreDialog,
  useExportActionMutate,
  Page,
  Error,
  Empty,
  GlobalActions,
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
  AddPrefabCurrenciesDialog,
  CurrencyCard,
  EditCurrencyDialog,
} from "./components";
import { MobileSelectionBar } from "components";

// hooks
import {
  useInfiniteCurrenciesList,
  CurrenciesQueryKeys,
  useMobileNavbar,
  useMobileMultiSelection,
  useSwipeDeleteState,
} from "hooks";
import {
  useAddCurrency,
  useAddPrefabCurrenciesDialog,
  useEditCurrency,
} from "./hooks";

// types
import type {
  CurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto,
} from "lib";
import { getDeleteAction } from "../../components/Card/utils";
import {
  Tables,
  isFeatureDisabledBusinessError,
  defaultCurrenciesListFilters,
  normalizeListFilters,
} from "lib";

export function Currencies() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();

  const prefabCurrencies = useAddPrefabCurrenciesDialog();

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
  const currencySwipeDelete = useSwipeDeleteState(deleteCurrency.handleClose);

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
    onInteraction: currencySwipeDelete.resetSwipe,
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
            className="currencies-grid full-grid"
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
                  className: "currencies-empty-icon",
                }}
                action={[
                  {
                    icon: <FontAwesomeIcon icon={faAdd} />,
                    id: GlobalActions.Add,
                    disabled: isLoading,
                    onClick: () => addCurrency.openDialog(),
                    tooltip: t("_pages:currencies.add"),
                  },
                  {
                    icon: <FontAwesomeIcon icon={faWandMagicSparkles} />,
                    id: "prefab-suggestions",
                    disabled: isLoading,
                    onClick: () => prefabCurrencies.openDialog(),
                    tooltip: t("_pages:prefabs.trySuggestions"),
                  },
                ]}
              />
            }
            renderComponent={(account) => {
              const actions = getActions(account);
              const deleteAction = getDeleteAction(actions);

              return (
                <CurrencyCard
                  actions={actions}
                  onClick={(id: number) => editCurrency.openDialog(id)}
                  selectionMode={mobileSelection.selectionMode}
                  selected={mobileSelection.isSelected(account.id)}
                  onSelect={mobileSelection.onToggleRowSelection}
                  onLongPress={mobileSelection.onLongPressRow}
                  swipeDeleteOpen={
                    !mobileSelection.selectionMode &&
                    currencySwipeDelete.swipedId === account.id
                  }
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          currencySwipeDelete.openSwipe(account.id);
                          deleteAction.onClick(account);
                        }
                      : undefined
                  }
                  {...account}
                />
              );
            }}
          />
          {/* Dialogs */}
          <AddCurrencyDialog {...addCurrency} />
          <EditCurrencyDialog {...editCurrency} />
          <ConfirmationDialog
            {...deleteCurrency}
            handleClose={currencySwipeDelete.handleDialogClose}
          />
          <ConfirmationDialog {...restoreCurrency} />
          <ImportDialog {...importCurrencies} />
          <AddPrefabCurrenciesDialog {...prefabCurrencies} />
        </>
      ) : (
        <Error error={error} />
      )}
    </Page>
  );
}
