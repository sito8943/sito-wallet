import { useTranslation, Trans } from "react-i18next";

import {
  LegalPage,
  LegalSection,
  richTextComponents,
} from "@sito/dashboard-app";

import type { TermsSection } from "./types";

export const CookiesPolicy = () => {
  const { t } = useTranslation();

  const sections = t("_pages:cookiesPolicy.sections", {
    returnObjects: true,
  }) as TermsSection[];

  return (
    <LegalPage
      title={t("_pages:cookiesPolicy.title")}
      intro={
        <Trans
          i18nKey="_pages:cookiesPolicy.body"
          components={richTextComponents}
        />
      }
    >
      <section className="mt-6 space-y-6">
        {sections.map((section, idx) => (
          <LegalSection key={idx} title={section.title}>
            <Trans
              i18nKey={`_pages:cookiesPolicy.sections.${idx}.body`}
              components={richTextComponents}
            />
          </LegalSection>
        ))}
      </section>
    </LegalPage>
  );
};
