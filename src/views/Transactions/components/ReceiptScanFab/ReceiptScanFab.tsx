import { useTranslation } from "react-i18next";
import { faCircleNotch, faReceipt } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton, classNames } from "@sito/dashboard-app";

// constants
import { RECEIPT_SCAN_ACCEPT, RECEIPT_SCAN_INPUT_ID } from "./constants";

// types
import type { ReceiptScanFabPropsType } from "./types";

import "./styles.css";

/**
 * Mobile FAB above the bottom navigation. The file input is always rendered:
 * the desktop toolbar action opens it by id.
 */
export function ReceiptScanFab(props: ReceiptScanFabPropsType) {
  const { onScan, isScanning, disabled } = props;
  const { t } = useTranslation();
  const label = t(
    isScanning
      ? "_pages:transactions.receipt.scanning"
      : "_pages:transactions.receipt.scan",
  );

  return (
    <>
      <IconButton
        type="button"
        icon={isScanning ? faCircleNotch : faReceipt}
        variant="submit"
        color="primary"
        disabled={disabled || isScanning}
        onClick={() => document.getElementById(RECEIPT_SCAN_INPUT_ID)?.click()}
        data-tooltip-id="tooltip"
        data-tooltip-content={label}
        aria-label={label}
        className={classNames(
          "receipt-scan-fab fixed right-4 bottom-20 z-30 !h-12 !w-12 !min-w-0 !rounded-full !p-0 shadow-lg sm:hidden",
          isScanning && "scanning",
        )}
      />
      <input
        id={RECEIPT_SCAN_INPUT_ID}
        className="receipt-scan-input"
        type="file"
        accept={RECEIPT_SCAN_ACCEPT}
        capture="environment"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) onScan(file);
        }}
      />
    </>
  );
}
