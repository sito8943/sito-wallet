import { useTranslation, Trans } from "react-i18next";

// types
import { TermsSection } from "./types";

export const TermsAndConditions = () => {
  const { t } = useTranslation();

  const sections = t("_pages:termsAndConditions.sections", {
    returnObjects: true,
  }) as TermsSection[];

  return (
    <main className="py-10 px-5 gap-5">
      <h2 className="text-4xl max-xs:text-2xl">
        {t("_pages:termsAndConditions.title")}
      </h2>
      <Trans
        i18nKey="_pages:termsAndConditions.body"
        components={[<p />, <strong />]}
      />

      <section className="mt-6 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-base p-5 rounded-2xl">
            <h3 className="text-2xl font-bold">{section.title}</h3>
            <div className="mt-2 text-text">
              <Trans
                i18nKey={`_pages:termsAndConditions.sections.${idx}.body`}
                components={{
                  p: <p />,
                  strong: <strong />,
                  ul: <ul className="list-disc ml-4" />,
                  li: <li />,
                }}
              />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};
