import { useTranslation } from "react-i18next";

// providers
import { useAuth } from "providers";

export function Home() {
  const { t } = useTranslation();
  const { account, isInGuestMode } = useAuth();

  return (
    <main className="flex pt-10">
      <h1 className="self-center justify-self-center">
        {t("_pages:home.welcome", {
          user: isInGuestMode() ? t("_pages:home.guest") : account?.username,
        })}
      </h1>
    </main>
  );
}
