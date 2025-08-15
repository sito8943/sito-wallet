import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="w-full h-full items-center justify-center gap-10">
      <h2 className="appear text-4xl !text-bg-error">{t("_pages:notFound.title")}</h2>
      <p className="appear !text-lg text-center">{t("_pages:notFound.body")}</p>
      <Link to="/" className="appear button primary submit !px-10">{t("_pages:home.title")}</Link>
    </main>
  );
}
