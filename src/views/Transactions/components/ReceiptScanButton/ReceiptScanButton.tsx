import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faSpinner } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// hooks
import { useReceiptScan } from "../../hooks/useReceiptScan";

// constants
import { RECEIPT_SCAN_ACCEPT, RECEIPT_SCAN_INPUT_ID } from "./constants";

// types
import type { ReceiptScanButtonPropsType } from "./types";

import "./styles.css";

export function ReceiptScanButton(props: ReceiptScanButtonPropsType) {
  const { setValue, getValues, disabled } = props;
  const { t } = useTranslation();
  const { scan, isScanning } = useReceiptScan({ setValue, getValues });

  return (
    <div className="receipt-scan">
      <Button
        type="button"
        variant="outlined"
        disabled={disabled || isScanning}
        onClick={() => document.getElementById(RECEIPT_SCAN_INPUT_ID)?.click()}
      >
        <FontAwesomeIcon
          icon={isScanning ? faSpinner : faReceipt}
          spin={isScanning}
        />{" "}
        {t(
          isScanning
            ? "_pages:transactions.receipt.scanning"
            : "_pages:transactions.receipt.scan",
        )}
      </Button>
      <span className="receipt-scan-hint">
        {t("_pages:transactions.receipt.hint")}
      </span>
      <input
        id={RECEIPT_SCAN_INPUT_ID}
        className="receipt-scan-input"
        type="file"
        accept={RECEIPT_SCAN_ACCEPT}
        capture="environment"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) void scan(file);
        }}
      />
    </div>
  );
}
