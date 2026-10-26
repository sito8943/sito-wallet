import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { useProductsCommon } from "../../../hooks/queries/useProductsCommon";
import { usePurchaseProvidersCommon } from "../../../hooks/queries/usePurchaseProvidersCommon";

// lib
import { prepareReceiptPhoto } from "lib";

// utils
import { getReceiptScanErrorKey, receiptDraftToForm } from "../utils";

// types
import type { UseReceiptScanPropsType } from "../types";

/** Reads a receipt photo and fills the transaction form with it. */
export function useReceiptScan(props: UseReceiptScanPropsType) {
  const { setValue, getValues } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const products = useProductsCommon();
  const purchaseProviders = usePurchaseProvidersCommon();
  const [isScanning, setIsScanning] = useState(false);

  const scan = useCallback(
    async (file: File) => {
      setIsScanning(true);
      try {
        const photo = await prepareReceiptPhoto(file);
        const draft = await manager.Transactions.scanReceipt(photo);
        const values = receiptDraftToForm(draft, {
          products: products.data ?? [],
          purchaseProviders: purchaseProviders.data ?? [],
          currentDate: getValues?.("date") ?? "",
        });

        // Products go in without marking them dirty: a dirty list drives the
        // amount, and here the receipt total is the one to keep.
        if (values.products) setValue?.("products", values.products);
        if (values.purchaseProvider)
          setValue?.("purchaseProvider", values.purchaseProvider, {
            shouldDirty: true,
          });
        if (values.date) setValue?.("date", values.date, { shouldDirty: true });
        if (values.amount !== undefined)
          setValue?.("amount", values.amount, {
            shouldDirty: true,
            shouldValidate: true,
          });

        if (draft.matchesTotal === false) {
          showErrorNotification({
            message: t("_pages:transactions.receipt.mismatch"),
          });
        } else {
          showSuccessNotification({
            message: t(
              draft.products.length
                ? "_pages:transactions.receipt.success"
                : "_pages:transactions.receipt.totalOnly",
            ),
          });
        }
      } catch (error) {
        showErrorNotification({ message: t(getReceiptScanErrorKey(error)) });
      } finally {
        setIsScanning(false);
      }
    },
    [
      getValues,
      manager,
      products.data,
      purchaseProviders.data,
      setValue,
      showErrorNotification,
      showSuccessNotification,
      t,
    ],
  );

  return { scan, isScanning };
}
