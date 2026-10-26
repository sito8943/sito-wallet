import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { faCubes } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import {
  ConfirmationDialog,
  Empty,
  Error as ErrorView,
  Page,
  useDeleteDialog,
} from "@sito/dashboard-app";

// hooks
import { ProductsQueryKeys, useProductsCommon, useMobileNavbar } from "hooks";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import { CatalogItem } from "components";
import { AddProductDialog, EditProductDialog } from "./components";

// hooks
import { useAddProductDialog, useEditProductDialog } from "./hooks";

export function Products() {
  const { t } = useTranslation();
  const manager = useManager();

  const { data, isLoading, error } = useProductsCommon();
  const items = data ?? [];

  const addProduct = useAddProductDialog();
  const editProduct = useEditProductDialog();
  const deleteProduct = useDeleteDialog({
    mutationFn: (ids) => manager.Products.softDelete(ids),
    ...ProductsQueryKeys.all(),
  });

  useMobileNavbar(t("_pages:products.title"));

  const openAddRef = useRef(addProduct.openDialog);
  useEffect(() => {
    openAddRef.current = addProduct.openDialog;
  }, [addProduct.openDialog]);

  useRegisterBottomNavAction(useCallback(() => openAddRef.current(), []));

  return (
    <Page
      title={t("_pages:products.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addProduct.openDialog(),
        disabled: isLoading,
        tooltip: t("_pages:products.add"),
      }}
      queryKey={ProductsQueryKeys.all().queryKey}
    >
      {error ? (
        <ErrorView error={error} />
      ) : (
        <>
          {items.length === 0 ? (
            <Empty
              message={t("_pages:products.empty")}
              iconProps={{ icon: faCubes }}
            />
          ) : (
            <ul className="full-grid">
              {items.map((item) => (
                <CatalogItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  onEdit={editProduct.openDialog}
                  onDelete={(id) => deleteProduct.onClick(id)}
                />
              ))}
            </ul>
          )}
          <AddProductDialog {...addProduct} />
          <EditProductDialog {...editProduct} />
          <ConfirmationDialog {...deleteProduct} />
        </>
      )}
    </Page>
  );
}
