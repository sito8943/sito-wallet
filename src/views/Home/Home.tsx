import { useTranslation } from "react-i18next";

// providers
import { useAuth } from "providers";
import { SearchWrapper } from "./components/SearchWrapper";

export function Home() {
  const { t } = useTranslation();
  const { account, isInGuestMode } = useAuth();

  return (
    <main className="items-center justify-start md:pt-20 max-md:pt-10 gap-10">
      <h1 className="self-center justify-self-center text-4xl max-md:text-3xl max-xs:text-2xl">
        {t("_pages:home.welcome", {
          user: isInGuestMode() ? t("_pages:home.guest") : account?.username,
        })}
      </h1>
      <div className="md:w-1/2 w-5/6">
        <SearchWrapper />
      </div>
    </main>
  );
}
