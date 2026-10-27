import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { formatForDatetimeLocal, useNotification } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { ProductsQueryKeys, PurchaseProvidersQueryKeys } from "hooks";

// lib
import type { CommonProductDto, CommonPurchaseProviderDto } from "lib";
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

  const queryClient = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);

  const scan = useCallback(
    async (file: File) => {
      setIsScanning(true);
      // Catalogs are only needed to match the receipt, so they're loaded on
      // scan (cached when already fetched) instead of on mount: the scan FAB
      // also lives on Home. Matching is best-effort, hence the `[]` fallback.
      const catalogs = Promise.all([
        queryClient
          .ensureQueryData<CommonProductDto[]>({
            ...ProductsQueryKeys.common(),
            queryFn: () => manager.Products.commonGet({}),
          })
          .catch(() => []),
        queryClient
          .ensureQueryData<CommonPurchaseProviderDto[]>({
            ...PurchaseProvidersQueryKeys.common(),
            queryFn: () => manager.PurchaseProviders.commonGet({}),
          })
          .catch(() => []),
      ]);
      try {
        const photo = await prepareReceiptPhoto(file);
        const draft = await manager.Transactions.scanReceipt(photo);
        const [products, purchaseProviders] = await catalogs;
        onDraft(
          receiptDraftToForm(draft, {
            products,
            purchaseProviders,
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
      queryClient,
      showErrorNotification,
      showSuccessNotification,
      t,
    ],
  );

  return { scan, isScanning };
}
