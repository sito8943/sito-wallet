import { useTranslation } from "react-i18next";

// providers
import { useAuth } from "@sito/dashboard-app";

// components
import { SearchWrapper } from "components";

// sections
import { Dashboard } from "./sections";

import "./styles.css";

export function Home() {
  const { t } = useTranslation();
  const { account } = useAuth();

  return (
    <main className="home">
      <h2 className="home-title">
        {t("_pages:home.welcome", { user: account?.username })}
      </h2>
      <div className="home-search">
        <SearchWrapper />
      </div>
      <Dashboard />
    </main>
  );
}
