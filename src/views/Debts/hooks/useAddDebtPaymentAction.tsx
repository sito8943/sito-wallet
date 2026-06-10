import { useCallback } from "react";

// @sito/dashboard-app
import type { ActionType } from "@sito/dashboard-app";
import { useTranslation } from "@sito/dashboard-app";

// icons
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// lib
import type { DebtDto } from "lib";
import { DebtStatus } from "lib";

// types
import { DebtAction } from "../types";
import type { UseDebtActionProps } from "./types";

export function useAddDebtPaymentAction(props: UseDebtActionProps) {
  const { t } = useTranslation();
  const { hidden = false, onClick } = props;

  const action = useCallback(
    (record: DebtDto): ActionType<DebtDto> => {
      const isClosed =
        record.status === DebtStatus.Paid ||
        record.status === DebtStatus.Cancelled;

      return {
        id: DebtAction.AddPayment,
        hidden: hidden || !!record.deletedAt || record.status === DebtStatus.Paid,
        disabled: !!record.deletedAt || isClosed,
        icon: <FontAwesomeIcon icon={faMoneyBillWave} />,
        tooltip: isClosed
          ? t("_pages:debts.actions.payment.disabled")
          : t("_pages:debts.actions.payment.text"),
        onClick: () => onClick(record),
      };
    },
    [hidden, onClick, t],
  );

  return { action };
}
