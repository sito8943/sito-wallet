import { useTranslation, Trans } from "react-i18next";

import {
  LegalPage,
  LegalSection,
  richTextComponents,
} from "@sito/dashboard-app";

import type { TermsSection } from "./types";

export const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = t("_pages:privacyPolicy.sections", {
    returnObjects: true,
  }) as TermsSection[];

  return (
    <LegalPage
      title={t("_pages:privacyPolicy.title")}
      intro={
        <Trans
          i18nKey="_pages:privacyPolicy.body"
          components={richTextComponents}
        />
      }
    >
      <section className="mt-6 space-y-6">
        {sections.map((section, idx) => (
          <LegalSection key={idx} title={section.title}>
            <Trans
              i18nKey={`_pages:privacyPolicy.sections.${idx}.body`}
              components={richTextComponents}
            />
          </LegalSection>
        ))}
      </section>
    </LegalPage>
  );
};
