import { useTranslation } from "react-i18next";

// components
import { Page, TabsLayout, TabsType } from "components";

// hooks
import { useAddTransaction } from "./hooks";
import { TransactionsQueryKeys, useAccountsCommon } from "hooks";
import { useMemo } from "react";
import { TransactionTable } from "./components";

export function Transactions() {
  const { t } = useTranslation();

  const { data, isLoading } = useAccountsCommon();

  const accountTabs = useMemo(() => {
    return (data?.map((item) => ({
      id: item.id,
      label: item.name,
      content: <TransactionTable accountId={item.id} />,
    })) ?? []) as TabsType[];
  }, [data]);

  // #region toolbar actions

  const addTransaction = useAddTransaction();

  // #endregion

  return (
    <Page
      title={t("_pages:transactions.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addTransaction.onClick(),
        disabled: isLoading,
        tooltip: t("_pages:transactions.add"),
      }}
      queryKey={TransactionsQueryKeys.all().queryKey}
    >
      <TabsLayout tabs={accountTabs} />
    </Page>
  );
}
