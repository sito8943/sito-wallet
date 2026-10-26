import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { faCubes } from "@fortawesome/free-solid-svg-icons";

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
  ProductsQueryKeys,
  useProductsCommon,
  useMobileNavbar,
  useSwipeDeleteState,
} from "hooks";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// components
import type { CatalogRowDto } from "components";
import { CatalogCard, toCatalogRow } from "components";
import { getDeleteAction } from "../../components/Card/utils";
import { AddProductDialog, EditProductDialog } from "./components";

// hooks
import { useAddProductDialog, useEditProductDialog } from "./hooks";

export function Products() {
  const { t } = useTranslation();
  const manager = useManager();

  const { data, isLoading, error } = useProductsCommon();
  const items = useMemo(() => (data ?? []).map(toCatalogRow), [data]);

  const addProduct = useAddProductDialog();
  const editProduct = useEditProductDialog();
  const deleteProduct = useDeleteDialog({
    mutationFn: (ids) => manager.Products.softDelete(ids),
    ...ProductsQueryKeys.all(),
  });
  const swipeDelete = useSwipeDeleteState(deleteProduct.handleClose);

  const getActions = useCallback(
    (record: CatalogRowDto) => [deleteProduct.action(record)],
    [deleteProduct],
  );

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
          <PrettyGrid
            data={items}
            className="full-grid"
            emptyComponent={
              <Empty
                message={t("_pages:products.empty")}
                iconProps={{ icon: faCubes }}
              />
            }
            renderComponent={(item) => {
              const actions = getActions(item);
              const deleteAction = getDeleteAction(actions);

              return (
                <CatalogCard
                  {...item}
                  actions={actions}
                  onClick={(id) => editProduct.openDialog(id)}
                  editLabel={t("_pages:products.forms.edit")}
                  editAriaLabel={t("_pages:products.forms.editAria")}
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
          <AddProductDialog {...addProduct} />
          <EditProductDialog {...editProduct} />
          <ConfirmationDialog
            {...deleteProduct}
            handleClose={swipeDelete.handleDialogClose}
          />
        </>
      )}
    </Page>
  );
}
