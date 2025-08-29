// cards
import { useDashboardsList } from "hooks";
import { AddCard, TransactionTypeResume } from "../components/Cards";

// styles
import "./styles.css";

export const Dashboard = () => {
  const { data, isLoading, error } = useDashboardsList({});

  console.log(data);

  return (
    <section id="dashboard" className="dashboard">
      <TransactionTypeResume />
      <AddCard />
    </section>
  );
};
