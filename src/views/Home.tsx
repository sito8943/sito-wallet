import { useTranslation } from "react-i18next";

// providers
import { useAuth } from "providers";

export function Home() {
  const { t } = useTranslation();
  const { account } = useAuth();

  return (
    <main className="flex">
      <h1 className="self-center justify-self-center">
        {t("_pages:home.welcome", { user: account?.username })}
      </h1>
    </main>
  );
}
