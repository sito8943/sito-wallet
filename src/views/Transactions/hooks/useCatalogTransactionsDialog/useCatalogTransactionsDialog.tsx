import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

// providers
import { useFeatureFlags } from "providers";

// components
import {
  CountBadgeIcon,
  formatBadgeCount,
} from "../../../../components/CountBadgeIcon";

// types
import type { CatalogRowDto } from "components";
import type {
  CatalogTransactionsDialogStateType,
  UseCatalogTransactionsDialogPropsType,
  UseCatalogTransactionsDialogReturnType,
} from "./types";

import {
  CATALOG_TRANSACTIONS_ACTION_ID,
  CATALOG_TRANSACTIONS_LIMIT,
} from "./constants";

/**
 * "View transactions" action for a product or seller card, plus the props of
 * the dialog that lists every transaction of that entry (all accounts).
 */
export function useCatalogTransactionsDialog(
  props: UseCatalogTransactionsDialogPropsType,
): UseCatalogTransactionsDialogReturnType {
  const { filterKey, emptyMessage } = props;
  const { t } = useTranslation();
  const { isFeatureEnabled } = useFeatureFlags();
  const transactionsEnabled = isFeatureEnabled("transactionsEnabled");

  const [state, setState] = useState<CatalogTransactionsDialogStateType>({
    open: false,
    title: "",
    filters: {},
  });

  const onClose = useCallback(
    () => setState((current) => ({ ...current, open: false })),
    [],
  );

  const action = useCallback(
    (record: CatalogRowDto) => ({
      id: CATALOG_TRANSACTIONS_ACTION_ID,
      hidden: !transactionsEnabled,
      disabled: !transactionsEnabled,
      icon: <CountBadgeIcon icon={faReceipt} count={record.transactionCount} />,
      tooltip: t(
        formatBadgeCount(record.transactionCount)
          ? "_pages:transactions.catalogHistory.actionWithCount"
          : "_pages:transactions.catalogHistory.action",
        { count: record.transactionCount },
      ),
      onClick: () =>
        setState({
          open: true,
          title: t("_pages:transactions.catalogHistory.title", {
            name: record.name,
          }),
          filters: { [filterKey]: record.id },
        }),
    }),
    [filterKey, t, transactionsEnabled],
  );

  return {
    action,
    dialog: {
      ...state,
      onClose,
      emptyMessage,
      limit: CATALOG_TRANSACTIONS_LIMIT,
    },
  };
}
