import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { faStore } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  ConfirmationDialog,
  Empty,
  Error as ErrorView,
  Page,
  useDeleteDialog,
} from "@sito/dashboard-app";

// hooks
import {
  PurchaseProvidersQueryKeys,
  usePurchaseProvidersCommon,
  useMobileNavbar,
} from "hooks";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import { CatalogItem } from "components";
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
  const items = data ?? [];

  const addPurchaseProvider = useAddPurchaseProviderDialog();
  const editPurchaseProvider = useEditPurchaseProviderDialog();
  const deletePurchaseProvider = useDeleteDialog({
    mutationFn: (ids) => manager.PurchaseProviders.softDelete(ids),
    ...PurchaseProvidersQueryKeys.all(),
  });

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
          {items.length === 0 ? (
            <Empty
              message={t("_pages:purchaseProviders.empty")}
              iconProps={{ icon: faStore }}
            />
          ) : (
            <ul className="full-grid">
              {items.map((item) => (
                <CatalogItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  photo={item.photo}
                  onEdit={editPurchaseProvider.openDialog}
                  onDelete={(id) => deletePurchaseProvider.onClick(id)}
                />
              ))}
            </ul>
          )}
          <AddPurchaseProviderDialog {...addPurchaseProvider} />
          <EditPurchaseProviderDialog {...editPurchaseProvider} />
          <ConfirmationDialog {...deletePurchaseProvider} />
        </>
      )}
    </Page>
  );
}
