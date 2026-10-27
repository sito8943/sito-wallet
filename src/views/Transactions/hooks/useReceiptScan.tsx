import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { formatForDatetimeLocal, useNotification } from "@sito/dashboard-app";

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

/** Reads a receipt photo and hands back the transaction form values. */
export function useReceiptScan(props: UseReceiptScanPropsType) {
  const { onDraft } = props;
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
        onDraft(
          receiptDraftToForm(draft, {
            products: products.data ?? [],
            purchaseProviders: purchaseProviders.data ?? [],
            currentDate: formatForDatetimeLocal(),
          }),
        );

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
      manager,
      onDraft,
      products.data,
      purchaseProviders.data,
      showErrorNotification,
      showSuccessNotification,
      t,
    ],
  );

  return { scan, isScanning };
}
