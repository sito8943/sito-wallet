import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// lib
import { TransactionType } from "lib";

// hooks
import { useTransactionTypeResume } from "hooks";

// components
import { Currency } from "../../Currencies";
import { BaseCard } from "../../Home/components/Cards/BaseCard";

type WeeklySpentCardProps = {
  accountId?: number | null;
  currencyName?: string;
  currencySymbol?: string;
};

const getCurrentWeekRange = () => {
  const today = new Date();
  // Week starts on Sunday (0)
  const day = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - day);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);

  return { start: toYMD(start), end: toYMD(end) };
};

export const WeeklySpentCard = (props: WeeklySpentCardProps) => {
  const { accountId, currencyName, currencySymbol } = props;
  const { t } = useTranslation();

  const range = useMemo(() => getCurrentWeekRange(), []);

  const { data, isLoading } = useTransactionTypeResume({
    type: TransactionType.Out,
    account: accountId ? [accountId] : undefined,
    date: { start: range.start, end: range.end },
  });

  const amount = data?.total ?? 0;
  const symbol = currencySymbol ?? data?.account?.currency?.symbol ?? "";
  const name = currencyName ?? data?.account?.currency?.name ?? "";

  return (
    <BaseCard className="!h-auto">
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-xl poppins">
          {t("_pages:transactions.cards.weeklySpent.title")}
        </h3>
        <p className="!text-4xl font-bold self-start poppins !text-bg-error">
          {isLoading ? "…" : amount} <Currency name={name} symbol={symbol} />
        </p>
      </div>
    </BaseCard>
  );
};
