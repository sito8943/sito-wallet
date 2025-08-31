// components
import { AddCard, TransactionTypeResume } from "../components/Cards";
import { AddDashboardCardDialog } from "../components";

// styles
import "./styles.css";

// hooks
import { useDashboardsList } from "hooks";
import { useAddDashboardCard } from "../hooks";
import { useEffect } from "react";

export const Dashboard = () => {
  const { data, isLoading, error } = useDashboardsList({});

  const addDashboardCard = useAddDashboardCard();

  useEffect(() => {
    if (data && addDashboardCard.setValue)
      addDashboardCard.setValue("position", data.items.length);
  }, [addDashboardCard, data]);

  return (
    <section id="dashboard" className="dashboard">
      <TransactionTypeResume />
      <AddCard
        disabled={isLoading}
        onClick={() => addDashboardCard.openDialog()}
      />
      {/* Dialogs */}
      <AddDashboardCardDialog {...addDashboardCard} />
    </section>
  );
};
