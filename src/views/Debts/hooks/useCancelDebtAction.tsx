import { useCallback } from "react";

// @sito/dashboard-app
import type { ActionType } from "@sito/dashboard-app";
import { useTranslation } from "@sito/dashboard-app";

// icons
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// lib
import type { DebtDto } from "lib";
import { DebtStatus } from "lib";

// types
import { DebtAction } from "../types";
import type { UseDebtActionProps } from "./types";

export function useCancelDebtAction(props: UseDebtActionProps) {
  const { t } = useTranslation();
  const { hidden = false, onClick } = props;

  const action = useCallback(
    (record: DebtDto): ActionType<DebtDto> => {
      const isClosed =
        record.status === DebtStatus.Paid ||
        record.status === DebtStatus.Cancelled;

      return {
        id: DebtAction.Cancel,
        hidden: hidden || !!record.deletedAt,
        disabled: !!record.deletedAt || isClosed,
        icon: <FontAwesomeIcon icon={faBan} />,
        tooltip: isClosed
          ? t("_pages:debts.actions.cancel.disabled")
          : t("_pages:debts.actions.cancel.text"),
        onClick: () => onClick(record),
      };
    },
    [hidden, onClick, t],
  );

  return { action };
}
