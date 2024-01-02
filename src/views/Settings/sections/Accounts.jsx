import { useTranslation } from "react-i18next";

function Accounts() {
  const { t } = useTranslation();

  return (
    <section>
      <h3 className="text-xl">
        {t("_pages:settings.sections.accounts.title")}
      </h3>
    </section>
  );
}

export default Accounts;
