import { useTranslation } from "react-i18next";

// components
import { PrettyGrid, Error } from "components";
import { TransactionCard } from "../TransactionCard";

// types
import { TransactionContainerPropsType } from "./types";

// hooks
import { useTransactionsList } from "hooks";

export const TransactionGrid = (props: TransactionContainerPropsType) => {
  const { t } = useTranslation();

  const { accountId, getActions, editAction } = props;

  const { data, isLoading, error } = useTransactionsList({
    filters: { accountId },
  });

  return error ? (
    <Error message={error?.message} />
  ) : (
    <PrettyGrid
      data={data?.items}
      emptyMessage={t("_pages:transactions.empty")}
      loading={isLoading}
      renderComponent={(transaction) => (
        <TransactionCard
          actions={getActions(transaction)}
          onClick={(id: number) => editAction.openDialog(id)}
          {...transaction}
        />
      )}
    />
  );
};
