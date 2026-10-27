import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { faStore } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  ConfirmationDialog,
  Empty,
  Error as ErrorView,
  Page,
  PrettyGrid,
  useDeleteDialog,
} from "@sito/dashboard-app";

// hooks
import {
  PurchaseProvidersQueryKeys,
  usePurchaseProvidersCommon,
  useMobileNavbar,
  useSwipeDeleteState,
} from "hooks";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import type { CatalogRowDto } from "components";
import { CatalogCard, toCatalogRow } from "components";
import { getDeleteAction } from "../../components/Card/utils";
import {
  AddPurchaseProviderDialog,
  EditPurchaseProviderDialog,
} from "./components";

// hooks
import {
  useAddPurchaseProviderDialog,
  useEditPurchaseProviderDialog,
} from "./hooks";

export function PurchaseProviders() {
  const { t } = useTranslation();
  const manager = useManager();

  const { data, isLoading, error } = usePurchaseProvidersCommon();
  const items = useMemo(() => (data ?? []).map(toCatalogRow), [data]);

  const addPurchaseProvider = useAddPurchaseProviderDialog();
  const editPurchaseProvider = useEditPurchaseProviderDialog();
  const deletePurchaseProvider = useDeleteDialog({
    mutationFn: (ids) => manager.PurchaseProviders.softDelete(ids),
    ...PurchaseProvidersQueryKeys.all(),
  });
  const swipeDelete = useSwipeDeleteState(deletePurchaseProvider.handleClose);

  const getActions = useCallback(
    (record: CatalogRowDto) => [deletePurchaseProvider.action(record)],
    [deletePurchaseProvider],
  );

  useMobileNavbar(t("_pages:purchaseProviders.title"));

  const openAddRef = useRef(addPurchaseProvider.openDialog);
  useEffect(() => {
    openAddRef.current = addPurchaseProvider.openDialog;
  }, [addPurchaseProvider.openDialog]);

  useRegisterBottomNavAction(useCallback(() => openAddRef.current(), []));

  return (
    <Page
      title={t("_pages:purchaseProviders.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addPurchaseProvider.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:purchaseProviders.add"),
      }}
      queryKey={PurchaseProvidersQueryKeys.all().queryKey}
    >
      {error ? (
        <ErrorView error={error} />
      ) : (
        <>
          <PrettyGrid
            data={items}
            className="full-grid"
            emptyComponent={
              <Empty
                message={t("_pages:purchaseProviders.empty")}
                iconProps={{ icon: faStore }}
              />
            }
            renderComponent={(item) => {
              const actions = getActions(item);
              const deleteAction = getDeleteAction(actions);

              return (
                <CatalogCard
                  {...item}
                  actions={actions}
                  showPhoto
                  onClick={(id) => editPurchaseProvider.openDialog(id)}
                  editLabel={t("_pages:purchaseProviders.forms.edit")}
                  editAriaLabel={t("_pages:purchaseProviders.forms.editAria")}
                  swipeDeleteOpen={swipeDelete.swipedId === item.id}
                  onSwipeDelete={
                    deleteAction
                      ? () => {
                          swipeDelete.openSwipe(item.id);
                          deleteAction.onClick(item);
                        }
                      : undefined
                  }
                />
              );
            }}
          />
          <AddPurchaseProviderDialog {...addPurchaseProvider} />
          <EditPurchaseProviderDialog {...editPurchaseProvider} />
          <ConfirmationDialog
            {...deletePurchaseProvider}
            handleClose={swipeDelete.handleDialogClose}
          />
        </>
      )}
    </Page>
  );
}
